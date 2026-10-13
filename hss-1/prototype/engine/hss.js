'use strict';
// HSS-1 PROTOTYPE — HARZ Sovereign Storage, sandbox-only (Team B, Ruling 001).
// Implements the frozen architecture spec: content-addressed identity, dedup-before-commit,
// verify-before-ack, WAL journal + torn-tail recovery, STORED/SEARCHABLE/VERIFIED states,
// two failure-domain replicas, export/import, honest capacity accounting + 507-style refusal.
const fs = require('fs'), path = require('path'), crypto = require('crypto');

const sha256 = b => crypto.createHash('sha256').update(b).digest('hex');

class HssStore {
  constructor(root, quotaBytes, opts = {}) {
    this.root = root; this.quota = quotaBytes; this.degradedMode = !!(opts && opts.degradedMode);
    this.backends = [path.join(root, 'nodeA'), path.join(root, 'nodeB')]; // 2 failure domains
    this.backends = this.backends.filter(b => !this.degradedMode || fs.existsSync(b));
    for (const b of this.backends) for (const d of ['objects/manifest.json','journal.log','seals.json']) {
      const p = path.join(b, d); fs.mkdirSync(path.dirname(p), {recursive:true});
      if (!fs.existsSync(p)) fs.writeFileSync(p, d.endsWith('.log') ? '' : (d.endsWith('manifest.json') ? '{}' : '[]'));
    }
    this.recover();
  }
  // --- crash recovery: journal replay, torn-tail repair ---
  recover() {
    const events = {tornTailDropped: 0, tmpOrphansRemoved: 0, adoptedUnacked: 0, ackedConfirmed: 0};
    for (const b of this.backends) {
      const jl = path.join(b, 'journal.log');
      const raw = fs.existsSync(jl) ? fs.readFileSync(jl, 'utf8') : '';
      const lines = raw.split('\n').filter(Boolean);
      const parsed = [];
      for (const l of lines) { try { parsed.push(JSON.parse(l)); } catch { events.tornTailDropped++; } }
      const committed = new Set(parsed.filter(e => e.op === 'commit').map(e => e.hash));
      const acked = new Set(parsed.filter(e => e.op === 'ack').map(e => e.hash));
      // remove orphan tmp files (begin without commit)
      const od = this.objDir(b);
      for (const f of fs.readdirSync(od)) if (f.endsWith('.tmp')) { fs.unlinkSync(path.join(od, f)); events.tmpOrphansRemoved++; }
      // adopt durably-committed objects that never reached the manifest (killed before manifest write)
      const m = this.manifest(b);
      for (const f of fs.readdirSync(od)) {
        if (f.length !== 64 || f.includes('.')) continue;
        if (m[f]) continue;
        if (!committed.has(f)) { fs.unlinkSync(path.join(od, f)); events.tmpOrphansRemoved++; continue; } // not committed: discard
        const bytes = fs.readFileSync(path.join(od, f));
        if (sha256(bytes) !== f) { fs.unlinkSync(path.join(od, f)); events.corruptDiscarded = (events.corruptDiscarded || 0) + 1; continue; }
        m[f] = { doc_id: f, content_hash: f, states: ['STORED'], size: bytes.length, kind: 'complete',
                 storage_locations: this.backends.map(x => path.basename(x)),
                 recovery_adopted_unacked: !acked.has(f), collected_at: null,
                 note: 'adopted by journal recovery: bytes verified, ack state from journal' };
        if (acked.has(f)) events.ackedConfirmed++; else events.adoptedUnacked++;
      }
      this.saveManifest(b, m);
    }
    this.events = events;
    return events;
  }
    manifest(b) { return JSON.parse(fs.readFileSync(path.join(b, 'objects/manifest.json'), 'utf8')); }
  saveManifest(b, m) { fs.writeFileSync(path.join(b, 'objects/manifest.json'), JSON.stringify(m, null, 1)); }
  objDir(b) { const d = path.join(b, 'objects'); fs.mkdirSync(d, {recursive:true}); return d; }

  // --- put: dedup BEFORE payload commit; ack only after read-back verify ---
  put(doc, opts = {}) {
    const content = doc.content;
    if (content === undefined || content === null) return this.putMetadata(doc); // ruling 8: safe metadata-only
    const bytes = Buffer.from(content, 'utf8');
    const hash = doc.content_hash || sha256(bytes);
    if (doc.content_hash && doc.content_hash !== sha256(bytes)) {
      return { ok: false, error: 'content_hash mismatch: identity must equal sha256(content)', hash };
    }
    const mA = this.manifest(this.backends[0]);
    if (mA[hash] && mA[hash].states.includes('STORED')) {
      mA[hash].dup_hits = (mA[hash].dup_hits || 0) + 1;
      this.saveManifest(this.backends[0], mA);
      return { ok: true, dup: true, hash, dup_hits: mA[hash].dup_hits };
    }
    // capacity gate (honest 507-style refusal BEFORE any write) — counts the FULL write cost:
    // payload per live replica + journal + manifest overhead, so accounting can never overshoot quota
    const liveCount = this.backends.filter(b => fs.existsSync(path.join(b, 'journal.log'))).length;
    const projectedCost = bytes.length * Math.max(1, liveCount) + 2048; // per-record overhead estimate (journal + manifest)
    const cap = this.capacity();
    if (cap.used + projectedCost > this.quota) return { ok: false, error: 'capacity cap reached', code: 507, used: cap.used, quota: this.quota, offered: bytes.length, projected_cost: projectedCost };
    const record = {
      doc_id: hash, content_hash: hash,
      source: doc.source || 'seed', provenance: doc.provenance || null,
      collected_at: doc.collected_at || new Date().toISOString(),
      language: doc.language || 'en', content_type: doc.content_type || 'text',
      license_policy: doc.license_policy || 'unspecified',
      states: [], storage_locations: [], size: bytes.length, kind: 'complete'
    };
    const liveBackends = [], degraded = [];
    for (const b of this.backends) {
      try {
        const j = () => fs.appendFileSync(path.join(b, 'journal.log'), JSON.stringify({op:'begin', hash, t:'tmp'}) + '\n');
        j();
        const tmp = path.join(this.objDir(b), hash + '.tmp');
        fs.writeFileSync(tmp, bytes);
        fs.renameSync(tmp, path.join(this.objDir(b), hash));
        fs.appendFileSync(path.join(b, 'journal.log'), JSON.stringify({op:'commit', hash, t:'final'}) + '\n');
        liveBackends.push(b);
      } catch (e) { degraded.push(path.basename(b)); }
    }
    if (liveBackends.length === 0) return { ok: false, error: 'no storage backend available (all offline)', code: 503, hash };
    const effectiveBackends = liveBackends;
    if (opts.crashAfterCommit) process.exit(77);
    // verify-before-ack: read back from every LIVE backend and recompute
    for (const b of effectiveBackends) {
      const read = fs.readFileSync(path.join(this.objDir(b), hash));
      if (sha256(read) !== hash) return { ok: false, error: 'read-back verification failed', hash, backend: b };
    }
    record.states.push('STORED'); record.storage_locations = effectiveBackends.map(b => path.basename(b)); if (degraded.length) record.degraded_backends = degraded;
    for (const b of effectiveBackends) {
      const m = this.manifest(b); m[hash] = record; this.saveManifest(b, m);
      fs.appendFileSync(path.join(b, 'journal.log'), JSON.stringify({op:'ack', hash}) + '\n');
    }
    return { ok: true, hash, size: bytes.length, degraded_backends: degraded };
  }
  // metadata-only records are NEVER STORED (ruling: metadata existence is not storage)
  putMetadata(doc) {
    const hash = doc.content_hash || null;
    const m = this.manifest(this.backends[0]);
    const id = 'meta:' + (hash || crypto.randomUUID());
    m[id] = { doc_id: id, content_hash: hash, kind: 'metadata_only', states: ['INDEX_ONLY'],
      note: 'metadata-only record: content absent, never STORED per HSS law', ...doc.fields };
    this.saveManifest(this.backends[0], m);
    return { ok: true, metadata_only: true, id, states: ['INDEX_ONLY'] };
  }
  get(hash, backendIdx = null) {
    const b = backendIdx !== null ? [this.backends[backendIdx]] : this.backends;
    for (const be of b) {
      const p = path.join(this.objDir(be), hash);
      if (fs.existsSync(p)) {
        const bytes = fs.readFileSync(p);
        const m = this.manifest(be)[hash];
        const actual = sha256(bytes);
        if (actual !== hash) return { ok: false, error: 'CORRUPTION DETECTED: digest mismatch', expected: hash, actual, backend: be };
        return { ok: true, hash, bytes, states: m ? m.states : [], verified_digest: actual };
      }
    }
    return { ok: false, error: 'not found in available replicas', hash };
  }
  // --- VERIFIED state: independent digest recompute + seal chain (witness pattern) ---
  verify(hash) {
    const results = [];
    for (const be of this.backends) {
      const p = path.join(this.objDir(be), hash);
      if (!fs.existsSync(p)) { results.push({backend: path.basename(be), result: 'MISSING'}); continue; }
      const ok = sha256(fs.readFileSync(p)) === hash;
      results.push({backend: path.basename(be), result: ok ? 'VERIFIED' : 'CORRUPT'});
    }
    const allOk = results.every(r => r.result === 'VERIFIED');
    for (const be of this.backends) {
      const m = this.manifest(be);
      if (!m[hash]) continue;
      m[hash].states = allOk ? [...new Set([...m[hash].states, 'VERIFIED'])] : m[hash].states.filter(s => s !== 'VERIFIED');
      if (!allOk) m[hash].states = m[hash].states; // corruption handled by get() refusal
      this.saveManifest(be, m);
    }
    if (allOk) {
      for (const be of this.backends) {
        const sp = path.join(be, 'seals.json');
        const seals = JSON.parse(fs.readFileSync(sp, 'utf8'));
        const prev = seals.length ? seals[seals.length - 1].seal : '';
        const seal = sha256(prev + '|' + hash + '|' + 'VERIFIED');
        seals.push({n: seals.length + 1, seal, prev, doc: hash, at: new Date().toISOString()});
        fs.writeFileSync(sp, JSON.stringify(seals, null, 1));
      }
    }
    return { ok: allOk, hash, results };
  }
  // --- SEARCHABLE: rebuildable index derived from authoritative content ---
  buildIndex() {
    const m = this.manifest(this.backends[0]);
    const idx = {};
    for (const [hash, rec] of Object.entries(m)) {
      if (!rec.states.includes('STORED')) continue;
      let text = null;
      for (const be of this.backends) { const p = path.join(this.objDir(be), hash); if (fs.existsSync(p)) { text = fs.readFileSync(p, 'utf8'); break; } }
      if (text === null) { (idx.__alarms = idx.__alarms || []).push({missing_object: hash, note: 'record STORED but object missing in all backends'}); continue; }
      const toks = [...new Set(text.toLowerCase().match(/[a-z0-9\u00c0-\u024f]{2,}/g) || [])].slice(0, 400);
      for (const t of toks) (idx[t] = idx[t] || []).push(hash);
    }
    fs.writeFileSync(path.join(this.root, 'search-index.json'), JSON.stringify(idx));
    for (const be of this.backends) {
      const mm = this.manifest(be);
      for (const [h, r] of Object.entries(mm)) if (r.states.includes('STORED')) r.states.push('SEARCHABLE');
      this.saveManifest(be, mm);
    }
    return { ok: true, terms: Object.keys(idx).filter(t => t !== '__alarms').length, missing_object_alarms: (idx.__alarms || []).length };
  }
  search(term) {
    const idx = JSON.parse(fs.readFileSync(path.join(this.root, 'search-index.json'), 'utf8'));
    return { ok: true, term, results: (idx[term.toLowerCase()] || []).slice(0, 50) };
  }
  // --- T10: export / import, provider-independent ---
  exportTo(file) {
    const m = this.manifest(this.backends[0]);
    const docs = Object.entries(m).filter(([, r]) => r.states.includes('STORED'));
    const header = { law: 'HSS-1 export v1', exported: new Date().toISOString(), count: docs.length };
    const parts = [JSON.stringify(header) + '\n'];
    let digestIn = 0;
    for (const [hash, rec] of docs) {
      const bytes = fs.readFileSync(path.join(this.objDir(this.backends[0]), hash));
      digestIn += bytes.length;
      parts.push(JSON.stringify({hash, meta: {...rec, states: ['STORED']}}) + '\n');
      parts.push(JSON.stringify({b64: bytes.toString('base64')}) + '\n');
    }
    const buf = Buffer.from(parts.join(''));
    fs.writeFileSync(file, buf);
    const content_digest = sha256(fs.readFileSync(file));
    fs.writeFileSync(file + '.digest', JSON.stringify({docs: docs.length, payload_bytes: digestIn, content_digest}));
    return { ok: true, file, docs: docs.length, payload_bytes: digestIn, content_digest };
  }
    static importFrom(file, newStore) {
    const lines = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean);
    const header = JSON.parse(lines[0]);
    let i = 1, count = 0;
    while (i + 1 < lines.length + 1 && i < lines.length) {
      const meta = JSON.parse(lines[i]); const payload = JSON.parse(lines[i + 1]);
      const bytes = Buffer.from(payload.b64, 'base64');
      if (sha256(bytes) !== meta.hash) throw new Error('import digest mismatch at ' + meta.hash);
      newStore.put({content: bytes.toString('utf8'), content_hash: meta.hash, ...meta.meta});
      count++; i += 2;
    }
    return { ok: true, imported: count, header };
  }
  // --- T11: honest accounting, measured from actual bytes ---
  capacity() {
    let used = 0, breakdown = {}, offline = [];
    for (const b of this.backends) {
      const before = used;
      try {
        const walk = d => { for (const f of fs.readdirSync(d, {withFileTypes: true})) { const p = path.join(d, f.name); if (f.isDirectory()) walk(p); else used += fs.statSync(p).size; } };
        walk(b); breakdown[path.basename(b)] = used - before;
      } catch { offline.push(path.basename(b)); breakdown[path.basename(b)] = 'OFFLINE'; }
    }
    const idxP = path.join(this.root, 'search-index.json');
    const idx = fs.existsSync(idxP) ? fs.statSync(idxP).size : 0;
    used += idx; breakdown['search-index'] = idx;
    return { used, quota: this.quota, remaining: this.quota - used, breakdown, offline_backends: offline, overhead_note: 'indexes+replicas included; replicas double payload bytes by policy (2 failure domains)' };
  }
  stats() {
    const m = this.manifest(this.backends[0]);
    const by = s => Object.values(m).filter(r => (r.states || []).includes(s)).length;
    return { records: Object.keys(m).length, STORED: by('STORED'), SEARCHABLE: by('SEARCHABLE'), VERIFIED: by('VERIFIED'), metadata_only: Object.values(m).filter(r => r.kind === 'metadata_only').length };
  }
}
module.exports = { HssStore, sha256 };
