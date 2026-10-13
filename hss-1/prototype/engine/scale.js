'use strict';
// HSS-1 STAGE 1 SCALE LADDER (Team B, Ruling 002 §4/§5) — measures the storage multiplier
// by component at progressively larger datasets. Sandbox-only. Nothing deployed.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { HssStore, sha256 } = require('./hss.js');
const RUN = '/tmp/hss-proto/scale'; fs.rmSync(RUN, {recursive: true, force: true}); fs.mkdirSync(RUN, {recursive: true});
const real = JSON.parse(fs.readFileSync('/tmp/hss-proto/seed/seed-10k.json', 'utf8')); // 12,000 real corpus docs
const derived = []; // distinct-hash variants of real docs, honestly labeled
for (let i = 0; i < 38000; i++) {
  const base = real[i % real.length];
  const text = base.text + '\n[hss-scale-ladder derived variant #' + i + ' — content modified from corpus doc, distinct identity]';
  derived.push({ content: text, content_hash: crypto.createHash('sha256').update(text).digest('hex'), source: 'derived-variant (scale ladder)' });
}
function measure(getLatSample, store, dir) {
  const lats = [];
  const hashes = Object.keys(store.manifest(store.backends[0]));
  for (let i = 0; i < getLatSample; i++) { const h = hashes[Math.floor(Math.random()*hashes.length)]; const t0 = process.hrtime.bigint(); const g = store.get(h); lats.push(Number(process.hrtime.bigint()-t0)/1e6); if (!g.ok) return {error: 'get failed'}; }
  lats.sort((a,b)=>a-b);
  return { p50: +lats[Math.floor(lats.length*0.5)].toFixed(2), p95: +lats[Math.floor(lats.length*0.95)].toFixed(2), samples: lats.length };
}
function dirBytes(d) { let s = 0; const walk = x => { for (const f of fs.readdirSync(x, {withFileTypes: true})) { const p = path.join(x, f.name); if (f.isDirectory()) walk(p); else s += fs.statSync(p).size; } }; walk(d); return s; }
function breakdown(root) {
  const b = {};
  for (const n of ['nodeA', 'nodeB']) {
    b[n + ':payload'] = fs.readdirSync(path.join(root, n, 'objects')).filter(f => f.length === 64).reduce((a, f) => a + fs.statSync(path.join(root, n, 'objects', f)).size, 0);
    b[n + ':manifest'] = fs.statSync(path.join(root, n, 'objects', 'manifest.json')).size;
    b[n + ':journal'] = fs.statSync(path.join(root, n, 'journal.log')).size;
  }
  b['search-index'] = fs.existsSync(path.join(root, 'search-index.json')) ? fs.statSync(path.join(root, 'search-index.json')).size : 0;
  b.TOTAL = Object.values(b).reduce((a, x) => a + x, 0);
  return b;
}
const report = { ladder: [], law: 'sandbox-only measurements, NOT extrapolated; multiplier changes with scale/config (Ruling 002)' };
let rssMax = 0; const trackMem = () => { const r = process.memoryUsage().rss; if (r > rssMax) rssMax = r; };
for (const rung of [ {n: 2000, docs: real.slice(0, 2000), label: '2k real'},
                     {n: 10000, docs: real.slice(0, 10000), label: '10k real'},
                     {n: 50000, docs: [...real, ...derived], label: '50k (12k real + 38k derived-variant)'} ]) {
  const root = RUN + '/r' + rung.n;
  const t0 = Date.now();
  const s = new HssStore(root, 20 * 1024 * 1024 * 1024);
  const tIngestStart = Date.now();
  const B = 500;
  for (let i = 0; i < rung.docs.length; i += B) {
    const batch = rung.docs.slice(i, i + B).map(d => ({ content: d.text || d.content, content_hash: d.content_hash, source: d.source }));
    const r = s.batchPut(batch); if (!r.ok) { console.log('FAIL', rung.n, JSON.stringify(r)); process.exit(1); }
    trackMem();
  }
  const ingestSec = (Date.now() - tIngestStart)/1000;
  const rawPayload = rung.docs.reduce((a, d) => a + (d.text || d.content).length, 0);
  // restart recovery time: fresh constructor replays journal + adopts
  const tR = Date.now(); const s2 = new HssStore(root, 20 * 1024 * 1024 * 1024); const recoverMs = Date.now() - tR;
  const getLat = measure(1000, s2, root);
  const tI = Date.now(); const idx = s2.buildIndex(); const indexBuildMs = Date.now() - tI; trackMem();
  let searchLat = null;
  { const t0b = Date.now(); s2.search('nigeria'); const t1b = Date.now(); searchLat = t1b - t0b; }
  const b = breakdown(root);
  const mult = +(b.TOTAL / rawPayload).toFixed(2);
  report.ladder.push({ rung: rung.label, docs: rung.n, raw_payload_bytes: rawPayload,
    ingestion_docs_per_s: +(rung.n / ingestSec).toFixed(1), ingestion_MBps: +(rawPayload/1e6/ingestSec).toFixed(2),
    get_latency_ms: getLat, restart_recovery_ms: recoverMs, index_build_ms: indexBuildMs, index_terms: idx.terms,
    search_latency_ms: searchLat, storage_breakdown_bytes: b, total_bytes: b.TOTAL,
    measured_multiplier_vs_raw: mult, rss_peak_bytes: rssMax, at: new Date().toISOString() });
  console.log(rung.label, 'ingest', +(rung.n/ingestSec).toFixed(1) + '/s', 'get p50', getLat.p50, 'p95', getLat.p95, 'recovery', recoverMs + 'ms', 'multiplier', mult, 'peak RSS', (rssMax/1048576).toFixed(0) + 'MB');
  rssMax = 0;
}
fs.writeFileSync(RUN + '/SCALE-LADDER.json', JSON.stringify(report, null, 1));
console.log('report written');
