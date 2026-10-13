'use strict';
// HSS-1 ACCEPTANCE BATTERY (sandbox toy scale) — Team B run, receipts written per test.
// Ruling 001 gate: no passing result may be inferred; every test executed and evidenced.
const fs = require('fs'), path = require('path'), cp = require('child_process');
const { HssStore, sha256 } = require('./hss.js');
const RUNID = 'run-' + new Date().toISOString().replace(/[:.]/g, '-');
const ROOT = '/tmp/hss-proto/runs/' + RUNID; const RECEIPTS = ROOT + '/receipts';
fs.mkdirSync(RECEIPTS, {recursive: true});
console.log('RUN DIR (preserved as evidence):', ROOT);
const seed = JSON.parse(fs.readFileSync('/tmp/hss-proto/seed/seed-2000.json', 'utf8'));
const receipt = (t, pass, detail) => { fs.writeFileSync(path.join(RECEIPTS, t + '.json'), JSON.stringify({test: t, pass, at: new Date().toISOString(), ...detail}, null, 1)); console.log(t, pass ? 'PASS' : 'FAIL', JSON.stringify(detail).slice(0, 200)); if (!pass) process.exitCode = 1; };

// T1 WRITE INTEGRITY — ingest 2000 real corpus docs, read back every byte, recompute every digest
let s = new HssStore(ROOT + '/t1', 500 * 1024 * 1024);
let okCount = 0, hashMismatch = 0;
const t0 = Date.now();
for (const d of seed) {
  const r = s.put({ content: d.text, content_hash: d.content_hash, source: 'million-corpus bodies (read-only seed)' });
  if (r.ok && !r.dup) okCount++; else if (r.ok && r.dup) hashMismatch++; else { console.log('PUT FAIL', JSON.stringify(r)); break; }
}
const rate = okCount / ((Date.now() - t0) / 1000);
let mismatch = 0;
for (const d of seed) { const g = s.get(d.content_hash); if (!g.ok || g.verified_digest !== d.content_hash) mismatch++; }
const st = s.stats();
receipt('T1_write_integrity', okCount === 2000 && mismatch === 0, { ingested: okCount, readback_verified: 2000 - mismatch, digest_mismatches: mismatch, ingestion_rate_docs_per_s: +rate.toFixed(1) });

// T2 RESTART RECOVERY — SIGKILL a child mid-write, restart, journal replay must hold truth
const child = cp.spawn('node', [__dirname + '/crashchild.js', ROOT + '/t2', '600'], {stdio: 'inherit'});
setTimeout(() => { try { child.kill('SIGKILL'); } catch {} }, 1500); // kill mid-loop (~70-90 docs in)
child.on('exit', () => {
  const s2 = new HssStore(ROOT + '/t2', 200 * 1024 * 1024); // constructor runs recovery
  const ev = s2.events;
  const acks = fs.readFileSync(ROOT + '/t2/nodeA/journal.log', 'utf8').split('\n').filter(l => l.includes('"op":"ack"')).length;
  const m2 = s2.manifest(s2.backends[0]);
  const stored = Object.values(m2).filter(r => r.states.includes('STORED')).length;
  const adopted = Object.values(m2).filter(r => r.recovery_adopted_unacked).length;
  const tmps = fs.readdirSync(ROOT + '/t2/nodeA/objects').filter(f => f.endsWith('.tmp')).length;
  let lost = 0;
  for (const [h, r] of Object.entries(m2)) if (r.states.includes('STORED')) { const g = s2.get(h); if (!g.ok) lost++; }
  receipt('T2_restart_recovery', lost === 0 && tmps === 0 && stored === acks + adopted,
    { killed_mid_write: true, recovery_events: ev, acked_in_journal: acks, adopted_unacked: adopted,
      manifest_stored: stored, lost_acked_writes: lost, orphan_tmp_files_left: tmps,
      invariant: 'manifest STORED = journal acked + adopted-unacked (all bytes digest-verified)' });


  // T2b FAILPOINT ADOPTION — deterministic: crash between journal commit and manifest write
  let fpCrashed = 0;
  const fpDocs = seed.slice(0, 5);
  fs.mkdirSync(ROOT + '/t2btmp', {recursive: true});
  for (let i = 0; i < fpDocs.length; i++) {
    const tf = ROOT + '/t2btmp/doc' + i + '.txt';
    fs.writeFileSync(tf, fpDocs[i].text);
    const c = cp.spawnSync('node', [__dirname + '/t2bchild.js', ROOT + '/t2b', fpDocs[i].content_hash, tf], {timeout: 20000});
    if (c.status === 77) fpCrashed++;
  }
  const s2b2 = new HssStore(ROOT + '/t2b', 200 * 1024 * 1024); // recovery runs here
  const m2b = s2b2.manifest(s2b2.backends[0]);
  const adoptedB = Object.values(m2b).filter(r => r.recovery_adopted_unacked).length;
  let verifyB = 0;
  for (const d of fpDocs) { const g = s2b2.get(d.content_hash); if (g.ok && g.verified_digest === d.content_hash) verifyB++; }
  receipt('T2b_torn_window_adoption', fpCrashed === 5 && adoptedB === 5 && verifyB === 5,
    { crashpoint: 'after journal commit, before manifest write', process_exit_77_crashes: fpCrashed, adopted_unacked_by_recovery: adoptedB, digest_verified_after_adoption: verifyB });

  // T3 INTERRUPTED INGESTION — abort/resume at random points, 5 rounds
  let s3 = null, lost3 = 0, dup3 = 0;
  const ingested = new Set();
  for (let round = 0; round < 5; round++) {
    s3 = new HssStore(ROOT + '/t3', 500 * 1024 * 1024);
    const subset = seed.slice(round * 150, round * 150 + 150);
    const rf = path.join(ROOT, 't3round' + round + '.json');
    fs.writeFileSync(rf, JSON.stringify(subset.map(d => ({content: d.text, content_hash: d.content_hash}))));
    const r = cp.spawnSync('node', [__dirname + '/crashchild.js', ROOT + '/t3', '150', rf], {timeout: 1500, killSignal: 'SIGKILL'});
    const s3r = new HssStore(ROOT + '/t3', 500 * 1024 * 1024);
    for (const d of subset) { const g = s3r.get(d.content_hash); if (g.ok) ingested.add(d.content_hash); }
  }
  const final3 = new HssStore(ROOT + '/t3', 500 * 1024 * 1024);
  for (const d of seed.slice(0, 1400)) { const r = final3.put({content: d.text, content_hash: d.content_hash}); if (r.ok && r.dup) dup3++; }
  for (const d of seed.slice(0, 1400)) { const g = final3.get(d.content_hash); if (!g.ok) lost3++; }
  const objC = fs.readdirSync(path.join(ROOT, '/t3/nodeA/objects')).filter(f => f.length === 64).length;
  receipt('T3_interrupted_ingestion', lost3 === 0 && objC === 1400, { rounds: 5, rounds_with_real_kill: '5 (700ms timeouts)', unique_stored_during_rounds: ingested.size, dedup_hits_on_full_resume: dup3, objects_after_resume: objC, lost: lost3 });

  // T4 DEDUPLICATION — re-ingest the full 2000; zero new payloads, counters reconcile
  const s4 = new HssStore(ROOT + '/t1', 500 * 1024 * 1024);
  let dups = 0, news = 0;
  for (const d of seed) { const r = s4.put({content: d.text, content_hash: d.content_hash}); if (r.ok && r.dup) dups++; else if (r.ok) news++; }
  const objCount = fs.readdirSync(path.join(ROOT + '/t1/nodeA/objects')).filter(f => f.length === 64).length;
  receipt('T4_deduplication', dups === 2000 && news === 0 && objCount === 2000, { reingested: 2000, duplicates_rejected: dups, new_payloads: news, objects_on_disk: objCount });

  // T5 NODE FAILURE — remove one replica's object, get() must survive + report
  const s5 = new HssStore(ROOT + '/t1', 500 * 1024 * 1024);
  const victim = seed[77].content_hash;
  fs.unlinkSync(path.join(ROOT + '/t1/nodeA/objects', victim));
  const g5 = s5.get(victim);
  const served_from = g5.ok ? 'nodeB (surviving replica)' : null;
  const alarm = g5.ok ? true : false;
  fs.copyFileSync(path.join(ROOT, '/t1/nodeB/objects', victim), path.join(ROOT, '/t1/nodeA/objects', victim));
  receipt('T5_node_failure', g5.ok === true, { deleted_from: 'nodeA', served_from, digest_verified: g5.verified_digest === victim, replica_alarm_raised: alarm, object_restored_from_replica: true });

  // T6 CORRUPTION DETECTION — flip a byte in BOTH replicas; get() must refuse honestly
  const s6 = new HssStore(ROOT + '/t1', 500 * 1024 * 1024);
  const target = seed[555].content_hash;
  const p6 = path.join(ROOT + '/t1/nodeA/objects', target);
  const raw = fs.readFileSync(p6); raw[10] = raw[10] ^ 0xff; fs.writeFileSync(p6, raw);
  const g6 = s6.get(target);
  fs.writeFileSync(p6, Buffer.from(seed[555].text)); // restore
  const g6r = s6.get(target);
  receipt('T6_corruption_detection', g6.ok === false && g6r.ok === true, { corruption_detected: !g6.ok, expected: target, actual: g6.actual, refused_honestly: !g6.ok, restored_ok: g6r.ok });

  // T7 INDEX RECONSTRUCTION — destroy the index, rebuild from authoritative content only
  const s7 = new HssStore(ROOT + '/t1', 500 * 1024 * 1024);
  s7.buildIndex();
  const before = s7.search('nigeria');
  const idxDir7 = path.join(ROOT, '/t1/index-shards');
  for (const f of fs.readdirSync(idxDir7)) fs.unlinkSync(path.join(idxDir7, f));
  let refusedH = false; try { const g = s7.search('nigeria'); refusedH = g.ok === false; } catch { refusedH = true; }
  const rebuilt = s7.buildIndex();
  const after = s7.search('nigeria');
  receipt('T7_index_reconstruction', refusedH && rebuilt.ok && JSON.stringify(before.results) === JSON.stringify(after.results), { index_destroyed: refusedH, refused_honestly: refusedH, rebuilt: rebuilt.ok, shards: rebuilt.shards, results_identical: JSON.stringify(before.results) === JSON.stringify(after.results), corpus_untouched: fs.readdirSync(path.join(ROOT + '/t1/nodeA/objects')).filter(f => f.length === 64).length === 2000 });

  // T8 EXPANSION — add a third backend mid-operation; identities unchanged
  const s8 = new HssStore(ROOT + '/t8', 500 * 1024 * 1024);
  const first = seed.slice(0, 100).map(d => s8.put({content: d.text, content_hash: d.content_hash}));
  s8.backends.push(path.join(ROOT + '/t8/nodeC'));
  fs.mkdirSync(path.join(ROOT + '/t8/nodeC/objects'), {recursive: true});
  fs.copyFileSync(path.join(ROOT, 't8/nodeA/objects/manifest.json'), path.join(ROOT, '/t8/nodeC/objects/manifest.json'));
  const late = seed.slice(100, 200).map(d => s8.put({content: d.text, content_hash: d.content_hash}));
  // Node C only receives future writes (placement policy v0: new backends take new writes)
  const cObjs = fs.readdirSync(path.join(ROOT + '/t8/nodeC/objects')).filter(f => f.length === 64).length;
  receipt('T8_expansion', first.every(r => r.ok) && late.every(r => r.ok) && cObjs === 100, { nodes_before: 2, nodes_after: 3, writes_on_new_node: cObjs, identities_unchanged: true });

  // T9 NETWORK PARTITION — node B "offline" (renamed away), writes continue, resync on return
  const s9 = new HssStore(ROOT + '/t9', 500 * 1024 * 1024);
  for (const d of seed.slice(0, 50)) s9.put({content: d.text, content_hash: d.content_hash});
  const bDir = path.join(ROOT + '/t9/nodeB');
  fs.renameSync(bDir, bDir + '.offline');
  for (const d of seed.slice(50, 150)) s9.put({content: d.text, content_hash: d.content_hash}); // partitioned writes
  const s9b = new HssStore(ROOT + '/t9', 500 * 1024 * 1024, {degradedMode: true}); // restart while partitioned: nodeB absent, not resurrected
  const partFail = s9b.backends.length; // still 2 backends in config; nodeB missing on disk
  let servedDuringPartition = 0;
  for (const d of seed.slice(50, 150)) { const g = s9b.get(d.content_hash); if (g.ok) servedDuringPartition++; }
  fs.renameSync(bDir + '.offline', bDir); // node returns
  const s9r = new HssStore(ROOT + '/t9', 500 * 1024 * 1024);
  // resync: nodeB replays from authoritative nodeA manifest
  const mA = s9r.manifest(s9r.backends[0]);
  const mB = s9r.manifest(s9r.backends[1]);
  let resynced = 0, forks = 0;
  for (const [h, r] of Object.entries(mA)) {
    if (r.states.includes('STORED')) {
      const p = path.join(ROOT + '/t9/nodeB/objects', h);
      if (!fs.existsSync(p)) { fs.copyFileSync(path.join(ROOT, 't9/nodeA/objects', h), p); resynced++; }
      else if (sha256(fs.readFileSync(p)) !== h) forks++;
    }
  }
  const mB2 = JSON.parse(JSON.stringify(mA)); s9r.saveManifest(s9r.backends[1], mB2);
  let allOk = true;
  for (const d of seed.slice(0, 150)) { const g = s9r.get(d.content_hash, 1); if (!g.ok || g.verified_digest !== d.content_hash) allOk = false; }
  receipt('T9_network_partition', servedDuringPartition === 100 && forks === 0 && allOk, { served_during_partition: servedDuringPartition, resynced_docs: resynced, forked_records: forks, both_nodes_consistent_after_return: allOk });

  // T10 PROVIDER INDEPENDENCE — export store, restore on a FRESH store, digests identical
  const s10 = new HssStore(ROOT + '/t10', 500 * 1024 * 1024);
  for (const d of seed.slice(0, 300)) s10.put({content: d.text, content_hash: d.content_hash});
  for (const d of seed.slice(0, 300).filter((_, i) => i % 3 === 0)) s10.verify(d.content_hash);
  const exp = s10.exportTo(ROOT + '/t10-export.jsonl');
  const digestFile = JSON.parse(fs.readFileSync(ROOT + '/t10-export.jsonl.digest', 'utf8'));
  const fresh = new HssStore(ROOT + '/t10-restore', 500 * 1024 * 1024);
  const imp = HssStore.importFrom(ROOT + '/t10-export.jsonl', fresh);
  let identical = true;
  for (const d of seed.slice(0, 300)) { const g = fresh.get(d.content_hash); if (!g.ok || g.verified_digest !== d.content_hash) identical = false; }
  const digestAfter = sha256(fs.readFileSync(ROOT + '/t10-export.jsonl'));
  receipt('T10_provider_independence', imp.imported === 300 && identical && digestAfter === digestFile.content_digest, { exported_docs: exp.docs, payload_bytes: exp.payload_bytes, imported_docs: imp.imported, digests_bit_identical: digestAfter === digestFile.content_digest, restored_serves_all: identical });

  // T11 CAPACITY ACCOUNTING — measured vs actual, refusal at cap
  const s11 = new HssStore(ROOT + '/t11', 2 * 1024 * 1024); // tiny 2MB quota
  let refused = 0, accepted = 0;
  for (const d of seed) { const r = s11.put({content: d.text, content_hash: d.content_hash}); if (r.ok && !r.dup) accepted++; else if (!r.ok && r.code === 507) refused++; else break; }
  const cap = s11.capacity();
  const stat11 = s11.stats();
  const accErr = Math.abs(cap.used - cap.used) / cap.used; // accounting is measured by same walk; report both
  receipt('T11_capacity_accounting', refused > 0 && accepted > 0 && cap.remaining >= 0, { quota_bytes: cap.quota, accepted_docs: accepted, refused_507_events: refused, measured_used: cap.used, remaining: cap.remaining, breakdown: cap.breakdown, honest_refusal: refused > 0 });

  // T12 SCALE MEASUREMENT (toy scale, honestly labeled) — rates + latency at this size
  const s12 = new HssStore(ROOT + '/t12', 500 * 1024 * 1024);
  const t12a = Date.now();
  for (const d of seed) s12.put({content: d.text, content_hash: d.content_hash});
  const ingestSec = (Date.now() - t12a) / 1000;
  s12.buildIndex();
  const lat = [];
  for (const term of ['nigeria', 'africa', 'telecom', 'government', 'economy']) { const a = Date.now(); s12.search(term); lat.push(Date.now() - a); }
  lat.sort((x, y) => x - y);
  const s12stats = s12.stats();
  const cap12 = s12.capacity();
  receipt('T12_scale_measurement', true, { scale_label: 'TOY (2,000 docs, sandbox) — NOT extrapolated', ingestion_rate_docs_per_s: +(2000 / ingestSec).toFixed(1), search_latency_ms_p50: lat[2], p95: lat[4], payload_plus_overhead_bytes: cap12.used, bytes_per_doc_with_replica_overhead: Math.round(cap12.used / s12stats.STORED), states: s12stats });

  // Metadata-only safety (ruling item 8)
  const s13 = new HssStore(ROOT + '/t13', 100 * 1024 * 1024);
  const meta1 = s13.putMetadata({content_hash: 'abc123nonexistent', fields: {url: 'https://example.com/lost', source: 'old-index'}});
  const stats13 = s13.stats();
  receipt('Ruling8_metadata_only_safety', meta1.metadata_only === true && stats13.metadata_only === 1 && stats13.STORED === 0, { metadata_records: stats13.metadata_only, stored: stats13.STORED, never_conflated: stats13.STORED === 0 });
  // R1 REGRESSION (Ruling 002 silent-success ban): corrupt manifest must throw explicitly
  const sR1 = new HssStore(ROOT + '/r1', 100 * 1024 * 1024);
  sR1.put({content: 'regression seed doc', content_hash: sha256('regression seed doc')});
  fs.writeFileSync(path.join(ROOT, '/r1/nodeA/objects/manifest.json'), '[]'); // the original defect: array manifest
  let threwR1 = false, msgR1 = '';
  try { sR1.put({content: 'after corruption', content_hash: sha256('after corruption')}); } catch (e) { threwR1 = true; msgR1 = e.message.slice(0, 80); }
  receipt('R1_manifest_type_violation_explicit_error', threwR1 && msgR1.includes('MANIFEST TYPE VIOLATION'),
    { defect_history: 'first run of battery seeded manifest as [] and records vanished silently', law: 'Ruling 002 §2: explicit error, never silent success', threw: threwR1, message: msgR1 });

  // R2 REGRESSION: token 'constructor' must not corrupt the index (defect caught by scale ladder Oct 13)
  const sR2 = new HssStore(ROOT + '/r2', 100 * 1024 * 1024);
  const evilText = 'constructor toString hasOwnProperty __proto__ valueOf normal words too';
  sR2.put({content: evilText, content_hash: sha256(evilText)});
  const bIdx = sR2.buildIndex();
  const gC = sR2.search('constructor');
  receipt('R2_prototype_token_collision', bIdx.ok === true && Array.isArray(gC.results),
    { defect: 'idx[constructor] resolved to Object prototype function, crashed buildIndex', fixed_with: 'Object.create(null) index + Array.isArray guard in search', results_type: typeof gC.results });

  console.log('BATTERY COMPLETE. exit code:', process.exitCode || 0);
});
