# HSS-1 STAGE 1 SCALE LADDER REPORT v1.0 (Team B, Ruling 002 §4/§5)
*Oct 13, 2026. Sandbox-only. NOT extrapolated. Multiplier measured per rung, by component.*

## 1. Ladder (12,000 real corpus docs + 38,000 derived variants, distinct hashes, labeled)

Rung | Docs | Ingest docs/s | Get p50/p95 ms | Restart recovery | Index build | Multiplier vs raw
2k real | 2,000 | 1,611 | 4.6 / 6.6 | 44 ms | <2 s | 5.93
10k real | 10,000 | 1,147 | 24.8 / 27.4 | 246 ms | ~5 s | 5.73
50k mixed | 50,000 | 383 | 158 / 190 | 1,700 ms | 19.9 s (5 shards) | 5.87

## 2. The multiplier, decomposed (50k rung, measured bytes)
Raw payload 230.4 MB. Total store 1,353.3 MB = 5.87x.
Payload replicas 476.8 MB (2 x 238.4) — 2.07x
Index shards 801.8 MB — 3.48x (the DOMINANT cost at this scale)
Manifests 54.6 MB (2 x 27.3) — 0.24x
Journals 20.0 MB (2 x 10.0) — 0.09x
Convergence: the multiplier holds ~5.7-5.9 across 2k-50k, but its COMPOSITION
shifts — at 2k the index is small; at 50k the inverted index is ~60% of total
storage. The 6.3x planning figure is now a MEASURED RANGE with a decomposition,
per the ruling. Compression, dedup across the real corpus, and a real index
service (not JSON shards) are the three levers that will move it at Stage 2.

## 3. Defects the ladder itself caught (in addition to the battery's four)
5. Token named 'constructor' (or any Object.prototype key) corrupted buildIndex —
   fixed with Object.create(null) + Array.isArray guard. Now permanent test R2.
6. At 50k docs the monolithic JSON index exceeded V8's max string length —
   index is now SHARDED (10k docs/shard); search scans shards linearly (6.8 s at
   50k — honest limitation; a real index service is a later rung).
7. Single-put ingestion is O(n) per put (capacity walk) => O(n^2) per rung —
   batchPut added (dedup once, verify-before-ack, full-cost capacity gate): 1,600+ docs/s
   at 2k vs 37/s single-put.

## 4. Scaling costs now visible (measured, not assumed)
Ingest throughput falls 1,611 -> 1,147 -> 383 docs/s (manifest rewrite per batch grows).
Get latency rises 4.6 -> 24.8 -> 158 ms p50 (get() parses the full manifest per call).
Restart recovery 44 -> 246 -> 1,700 ms (journal replay + manifest parse).
All three are PROTOTYPE data-structure costs, not protocol laws: a manifest cache and
a sharded/b-tree manifest are the known fixes, to be measured at the 100k+ rung.
Team F re-ran the full battery on the revised build: 16/16 PASS (14 acceptance
tests + 2 permanent regression tests R1/R2), receipts preserved in dated run dirs.
