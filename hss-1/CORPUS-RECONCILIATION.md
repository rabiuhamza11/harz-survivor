# HSS-1 TEAM C RECONCILIATION REPORT v1.0
*Oct 13, 2026. Read-only forensics; the file was not modified, compacted, or rewritten (Ruling 001 §3).
Every item ends in a reproducible reconciliation or remains explicitly unresolved, as ordered.*

## 1. The 7.38 GB counter — RESOLVED
`meta.total_bytes` = 7,383,224,037 = `SELECT SUM(size) FROM docs` exactly, byte for byte.
Semantics (from deployed worker source, /api/ingest path): per batch it adds
`round(incoming_bytes * inserted / docs.length)` — a proportional estimator of ingested
text bytes. The `size` column records each doc's text length at ingest.
Reproducible: the query above, and the source file archived at prototype/worker-source/.
Note: bodies DB actual = `body_bytes` 7,650,231,226 (measured SUM of bodies.text); the
counter under-counts by ~267 MB because of proportional rounding. Counter semantics now
defined; ruling on whether it stays the canonical figure belongs to the owner.

## 2. The 5.92 GB file — MECHANISM RESOLVED, page-level precision explicitly unresolved
The corpus is TWO databases. The Oct 13 body migration (meta: body_migrated = 1,328,715,
d1_text_bytes = 0, cap_policy updated today by the corpus seat) moved ALL inline text out
of docs into harz-corpus-bodies-db and blanked docs.text. SQLite never returns space
without VACUUM: the docs DB file (5.92 GB) now holds ~0.45 GB of live metadata + indexes
plus the vacated inline-text space.
Live: measured SQL sums (docs metadata ~137 MiB after migration + index overhead).
Reclaimable on VACUUM: ~5 GB, mechanism proven by body_migrated/body_bytes counters and
zero inline rows (`SELECT COUNT(*) FROM docs WHERE text<>''` = 0).
Unknown to the byte: exact page split — PRAGMA page_count/freelist_count return
SQLITE_AUTH via API (page_size = 4096 is readable). Needs export-level forensics.
NOT compacted, per Ruling 001. No action taken.

## 3. The 107,187 counter gap — EXPLICITLY UNRESOLVED, mechanisms identified
`meta.total_ingested` counts docs SUBMITTED per ingest batch (worker source: it is
incremented by `docs.length`, while `dup_rejected` gets `docs.length - inserted`).
So docs rows + dup_rejected should equal total_ingested IF every insert passed the
counted endpoints. Measured: 1,328,715 + 514,574 = 1,843,289 vs 1,736,102 — 107,187
rows exist beyond the counters. Candidate mechanisms (from timeline + source):
1. Rows inserted by paths/eras not covered by the current counters (5,335 rows predate
   meta 'born' 2026-10-08; 262,981 rows carry Oct 11-12 fetched_at, during the wave pause,
   i.e. inserted by the corpus seat's storage-era work).
2. Counter UPDATE no-ops silently when the meta key row does not yet exist (the
   'replaced_v2' key referenced in worker code is absent from meta — proof this failure
   mode occurs in production).
3. Worker version changes during the Oct 8-12 storage rework.
Closing this exactly requires worker version history + D1 Time Travel forensics.
Reproducible baseline: the queries above; row timeline by fetched_at documented.

## 4. DATED CORRECTION to the Oct 13 morning baseline (honesty law)
The 07:56 report to the owner and the ruling's baseline row 2 ("89.7% metadata-only
stubs") captured the corpus MID-MIGRATION. After the migration completed:
100% of the 1,328,715 docs have complete bodies in harz-corpus-bodies-db
(1,328,715 unique hashes, avg 5,757.6 B, 7.125 GiB). Sample-verified: 5/5 sampled
"empty" rows have bodies with LENGTH(text) == size exactly.
What STANDS from the original finding: none of these are VERIFIED under HSS law
(no independent digest verification pass ever ran over them; ingest hashes are
unverified claims). The verified population remains the 21,377 sealed docs.
The corpus is more complete than the ruling assumed, but not more verified.
