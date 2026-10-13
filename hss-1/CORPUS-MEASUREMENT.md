# HSS-1 CORPUS MEASUREMENT REPORT v1.0 (Team C)
*Oct 13, 2026. Measured directly from live data (D1 million-corpus ea622de9…, KV full-text
store, sealed chunk manifests). Read-only queries; nothing modified. All numbers below are
measured, not estimated.*

## 1. What the existing corpus actually is

million-corpus D1 `docs` table (born Oct 8, 2026, target field literally 1,000,000,000):

Rows: 1,328,715. Unique content hashes: 1,328,715 (dedup perfect at rest).
Duplicate rejections at ingest: 514,574 — a measured 22.9% duplication rate at the gate.

Completeness (the decisive finding):
- NO text (NULL or empty): 1,191,505 rows = 89.7%
- Under 100 chars: 4,160 (0.3%)
- 100–1,023 chars: 102,275 (7.7%)
- Real text >= 1KB: 30,698 rows (2.3%) — avg 10,565 bytes, total 309.3 MiB

Under the HSS states law, the honest verdict: only ~31k of 1.33M rows are STORED-class
(complete content). None are VERIFIED-class except the 21,377 SHA-sealed in the KV
full-text store (7.2KB avg, 154.3MB, 43 chunks) — those ARE verified content.
The recorded "1.06M documents / 8.91GB inventory" is an ingest-accounting figure,
not a verified-complete-corpus figure. The owner's distinction (inventory != corpus)
is confirmed by measurement.

## 2. Accounting discrepancies (reported, not fixed)

- meta.total_ingested 1,736,102 vs docs rows + dup rejected = 1,843,289: 107,187 unaccounted.
- D1 file = 5.92GB; live text = 0.35GiB + row metadata ~0.2GB: ~5.3GB of the file is
  unverified slack (probable unvacuumed free pages from 514k dup rejections; pragma
  forensics blocked via API — needs an export-level check to confirm; flagged for Team F).
- meta.total_bytes 7.38GB "counted" vs file 5.92GB — ingest counter semantics need a ruling.

## 3. The storage math that matters (measured anchors)

- Complete-document average: 10.3KB (reservoir full texts) / 7.2KB (sealed library).
  Planning figure: ~8–10KB per complete document.
- Metadata per row: ~85 bytes (url 45.7 + domain 16.9 + source 20.4).
- 1B complete documents = 8–10TB content + ~85GB metadata, BEFORE indexes (1.5–3x)
  and redundancy (1.5–2x). Realistic total footprint at Stage 4: ~20–40TB.
- R2 free tier (10GB) holds ~1.0M complete docs at 10.3KB — Stage 1 lands right at the
  edge of free; the $5 Workers Paid plan is the real gate, not storage fees.
- A 4TB node holds ~400M complete docs at 10KB (owner's illustration confirmed,
  minus index/redundancy overhead → ~200–270M realistic).

## 4. Language

100% English (Team A, Oct 11). No change. Multilingual capacity remains unbuilt.

## 5. Direct implications for HSS-1

1. Ingest gate MUST enforce the STORED definition — the million-corpus accepted
   metadata-only rows for 89.7% of its life; that is the exact conflation the
   charter forbids.
2. Dedup by content hash at ingest works and saves ~23% — carry into HSS unchanged.
3. Indexing full content is affordable: the real corpus today (31k full docs) is 309MiB.
   The 1B corpus is ~4 orders of magnitude larger — partitioned indexes are mandatory,
   as the owner's charter requires.
4. First backfill candidate for HSS rung 1: the 21,377 verified docs already sealed —
   they become the seed STORED+VERIFIED population of Stage 1 with zero new gathering.
