'use strict';
// 50k rung only (2k/10k receipts already captured this morning). Same measurements.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { HssStore } = require('./hss.js');
const RUN = '/tmp/hss-proto/scale/r50000';
fs.rmSync(RUN, {recursive: true, force: true});
const real = JSON.parse(fs.readFileSync('/tmp/hss-proto/seed/seed-10k.json', 'utf8'));
const derived = [];
for (let i = 0; i < 38000; i++) {
  const base = real[i % real.length];
  const text = base.text + '\n[hss-scale-ladder derived variant #' + i + ' — content modified from corpus doc, distinct identity]';
  derived.push({ content: text, content_hash: crypto.createHash('sha256').update(text).digest('hex'), source: 'derived-variant (scale ladder)' });
}
const docs = [...real, ...derived].map(d => ({ content: d.text || d.content, content_hash: d.content_hash, source: d.source }));
const t0 = Date.now();
const s = new HssStore(RUN, 20 * 1024 * 1024 * 1024);
const tI = Date.now();
for (let i = 0; i < docs.length; i += 500) {
  const r = s.batchPut(docs.slice(i, i + 500));
  if (!r.ok) { console.log('FAIL', JSON.stringify(r).slice(0, 200)); process.exit(1); }
}
const ingestSec = (Date.now() - tI) / 1000;
const rawPayload = docs.reduce((a, d) => a + d.content.length, 0);
const tR = Date.now(); const s2 = new HssStore(RUN, 20 * 1024 * 1024 * 1024); const recoverMs = Date.now() - tR;
const t = Date.now(); const idx = s2.buildIndex(); const indexBuildMs = Date.now() - t;
const hashes = Object.keys(s2.manifest(s2.backends[0]));
const lats = [];
for (let i = 0; i < 1000; i++) { const h = hashes[Math.floor(Math.random() * hashes.length)]; const a = process.hrtime.bigint(); const g = s2.get(h); lats.push(Number(process.hrtime.bigint() - a) / 1e6); if (!g.ok) { console.log('GET FAIL'); process.exit(1); } }
lats.sort((a, b) => a - b);
const sA = Date.now(); const sr = s2.search('nigeria'); const searchLat = Date.now() - sA;
function dirBytes(d) { let s = 0; const walk = x => { for (const f of fs.readdirSync(x, {withFileTypes: true})) { const p = path.join(x, f.name); if (f.isDirectory()) walk(p); else s += fs.statSync(p).size; } }; walk(d); return s; }
const b = {};
for (const n of ['nodeA', 'nodeB']) {
  b[n + ':payload'] = fs.readdirSync(path.join(RUN, n, 'objects')).filter(f => f.length === 64).reduce((a, f) => a + fs.statSync(path.join(RUN, n, 'objects', f)).size, 0);
  b[n + ':manifest'] = fs.statSync(path.join(RUN, n, 'objects', 'manifest.json')).size;
  b[n + ':journal'] = fs.statSync(path.join(RUN, n, 'journal.log')).size;
}
b['index-shards'] = dirBytes(path.join(RUN, 'index-shards'));
b.TOTAL = Object.values(b).reduce((a, x) => a + x, 0);
const rung = { rung: '50k (12k real + 38k derived-variant)', docs: 50000, raw_payload_bytes: rawPayload,
  ingestion_docs_per_s: +(50000 / ingestSec).toFixed(1), ingestion_MBps: +(rawPayload / 1e6 / ingestSec).toFixed(2),
  get_latency_ms: { p50: +lats[500].toFixed(2), p95: +lats[950].toFixed(2), samples: 1000 },
  restart_recovery_ms: recoverMs, index_build_ms: indexBuildMs, index_shards: idx.shards,
  search_latency_ms: searchLat, search_shards_scanned: sr.shards_scanned,
  storage_breakdown_bytes: b, total_bytes: b.TOTAL,
  measured_multiplier_vs_raw: +(b.TOTAL / rawPayload).toFixed(2),
  rss_peak_bytes: process.memoryUsage().rss, at: new Date().toISOString() };
console.log('50k:', JSON.stringify({ingest: rung.ingestion_docs_per_s, get_p50: rung.get_latency_ms.p50, get_p95: rung.get_latency_ms.p95, recovery: recoverMs, indexBuildMs, shards: idx.shards, searchLat, multiplier: rung.measured_multiplier_vs_raw, total_MB: Math.round(b.TOTAL/1e6)}));
fs.writeFileSync('/tmp/hss-proto/scale/RUNG-50K.json', JSON.stringify(rung, null, 1));
