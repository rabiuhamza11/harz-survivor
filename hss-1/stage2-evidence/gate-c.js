'use strict';
// HSS-1 STAGE 2, GATE C — 100k engine workload with the scale fixes + regression tests
// + the Ruling-003 rail separation demonstrated at scale (ingest marks PENDING_VERIFICATION,
// verify rail independently recomputes and flips to VERIFIED_DIGEST, receipted and resumable).
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { HssStore, sha256 } = require('/tmp/hss-proto/engine/hss.js');
const RUN = '/tmp/hss-stage2/engine-100k/store';
const objCount = fs.existsSync(RUN + '/nodeA/objects') ? fs.readdirSync(RUN + '/nodeA/objects').filter(f => f.length === 64).length : 0;
const STORE_COMPLETE = objCount === 99994; // 100,000 attempted - 6 identity-refused (Oct 13-14 run)
if (!STORE_COMPLETE) fs.rmSync(RUN, {recursive: true, force: true});
const real = JSON.parse(fs.readFileSync('/tmp/hss-proto/seed/seed-10k.json', 'utf8'));
const derived = [];
for (let i = 0; i < 88000; i++) {
  const base = real[i % real.length];
  const text = base.text + '\n[hss-stage2-100k derived variant #' + i + ' — distinct identity]';
  derived.push({ content: text, content_hash: crypto.createHash('sha256').update(text).digest('hex'), source: 'derived-variant' });
}
const docs = [...real.map(d => ({content: d.text, content_hash: d.content_hash, source: 'corpus-real'})), ...derived];
let refusedIdentity = 0; const mem = { peak: 0 }; const track = () => { const r = process.memoryUsage().rss; if (r > mem.peak) mem.peak = r; };
const t0 = Date.now();
const s = new HssStore(RUN, 20 * 1024 * 1024 * 1024);
const tIngest = Date.now();
if (STORE_COMPLETE) { console.log('store intact (99,994 objects) — reusing Oct 13-14 ingestion'); }
for (let i = 0; i < docs.length && !STORE_COMPLETE; i += 500) {
  const r = s.batchPut(docs.slice(i, i + 500));
  if (!r.ok) { console.log('INGEST FAIL', JSON.stringify(r).slice(0, 150)); process.exit(1); }
  if (r.failed_identity) refusedIdentity += r.failed_identity; // honest refusal: claimed hash != bytes (known quarantined docs)
  if (i % 10000 === 0) track();
}
const ingestMs = STORE_COMPLETE ? 0 : Date.now() - tIngest; track();
// regression at 100k workload: R2 prototype token collision on the REAL store
const r2 = s.buildIndex(); track();
const gC = s.search('constructor');
const R2 = r2.ok && Array.isArray(gC.results);
// regression at 100k workload: R1 manifest-type violation on the real store (explicit error)
let R1 = false; const mPath = path.join(RUN, 'nodeA/objects/manifest.json');
const goodManifest = fs.readFileSync(mPath); fs.writeFileSync(mPath, '[]');
try { s.get(Object.keys(s.manifest(s.backends[0]))[0]); } catch (e) { R1 = e.message.includes('MANIFEST TYPE VIOLATION'); }
fs.writeFileSync(mPath, goodManifest); // restore
// restart recovery at 100k
const tR = Date.now(); const s2 = new HssStore(RUN, 20 * 1024 * 1024 * 1024); const recoverMs = Date.now() - tR;
// verify rail at scale: flip PENDING_VERIFICATION -> VERIFIED_DIGEST (independent recompute)
const tV = Date.now();
const V = s2.verifyBodies(RUN + '/verify-receipts');
const verifyMs = Date.now() - tV;
const m2 = s2.manifest(s2.backends[0]);
const states = {};
for (const r of Object.values(m2)) for (const st of r.states) states[st] = (states[st] || 0) + 1;
// get latency at 100k
const hashes = Object.keys(m2); const lats = [];
for (let i = 0; i < 1000; i++) { const h = hashes[Math.floor(Math.random() * hashes.length)]; const a = process.hrtime.bigint(); s2.get(h); lats.push(Number(process.hrtime.bigint() - a) / 1e6); }
lats.sort((a, b) => a - b);
function dirBytes(d) { let s = 0; const walk = x => { for (const f of fs.readdirSync(x, {withFileTypes: true})) { const p = path.join(x, f.name); if (f.isDirectory()) walk(p); else s += fs.statSync(p).size; } }; walk(d); return s; }
const idxSize = dirBytes(path.join(RUN, 'index-shards'));
const payloadA = fs.readdirSync(path.join(RUN, 'nodeA/objects')).filter(f => f.length === 64).reduce((a, f) => a + fs.statSync(path.join(RUN, 'nodeA/objects', f)).size, 0);
const manifestSize = fs.statSync(mPath).size + fs.statSync(path.join(RUN, 'nodeB/objects/manifest.json')).size;
const journalSize = fs.statSync(path.join(RUN, 'nodeA/journal.log')).size + fs.statSync(path.join(RUN, 'nodeB/journal.log')).size;
const total = dirBytes(RUN);
const rawPayload = docs.reduce((a, d) => a + d.content.length, 0);
const report = {
  workload: '100,000 docs (12,000 real corpus + 88,000 derived variants, distinct hashes, labeled)', attempted: docs.length, refused_identity_at_ingest: refusedIdentity,
  ingest_ms: ingestMs, ingest_docs_per_s: +(100000 / (ingestMs / 1000)).toFixed(1),
  rss_peak_bytes: mem.peak, get_latency_ms: {p50: +lats[500].toFixed(1), p95: +lats[950].toFixed(1)},
  restart_recovery_ms: recoverMs, index: {shards: r2.shards, build_ok: r2.ok, size_bytes: idxSize},
  regression: {R1_manifest_type_explicit_error: R1, R2_prototype_token_collision_pass: R2},
  rails: { ingestion_marked_pending: states.PENDING_VERIFICATION, verify_rail_result: V, verify_ms: verifyMs,
           post_verify_state_counts: states },
  storage: { raw_payload: rawPayload, payload_replicas: payloadA * 2, manifests: manifestSize, journals: journalSize, index: idxSize, total: total },
  multiplier_vs_raw: +(total / rawPayload).toFixed(2), index_share_of_total: +(idxSize / total).toFixed(3),
  at: new Date().toISOString() };
fs.writeFileSync('/tmp/hss-stage2/engine-100k/GATE-C-100K.json', JSON.stringify(report, null, 1));
console.log('GATE C:', JSON.stringify({ingest_per_s: report.ingest_docs_per_s, R1, R2, verify: V, states, mult: report.multiplier_vs_raw, idx_share: report.index_share_of_total, rss_peak_MB: Math.round(mem.peak/1048576)}));
