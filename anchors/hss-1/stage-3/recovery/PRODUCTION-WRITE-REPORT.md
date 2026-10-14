# HSS-1 PRODUCTION PROVENANCE WRITE — EXECUTION REPORT v1.0 (Ruling 008)
*Oct 14, 2026, 05:47-05:50Z. Authorized: metadata-only, repo ad45a17, target harz-million-corpus.*

## Execution
STEP 0 TOCTOU (05:47:23Z): fresh re-resolution of all 3,249 against live corpus
(1,341,437 docs) + both hunt indexes (42,622 / 23,928). Result: 3,249 resolved,
0 missing, 0 conflicts, six quarantined confirmed outside the population. Start
state recorded and bound to recovery manifest sha cead2356...c23764.
WRITE (7 logical batches, max 500, atomic durable checkpoint after each):
3,249 inserted, 0 skipped-existing (fresh table, pre-count 0), 0 conflicts
quarantined. Idempotency + conflict-isolation logic active throughout.

## Post-write verification — ALL 7 PASS (05:49:44Z)
1. Exactly 3,249 records, 3,249 distinct hunt hashes.
2. All 3,249 join to corpus docs rows; all 3,249 bodies present in bodies DB.
3. Canonical digests unchanged: docs count 1,341,437 -> 1,341,437.
4. Independent 300-body re-hash from production bodies DB: 300/300 match, 0 mismatch.
5. No modification: hunt acct1 42,622 unchanged, hunt acct3 23,928 unchanged,
   chunk-store manifest seals all 43 unchanged, 3 spot chunk seals re-fetched and match.
6. Six quarantined bodies: 0 rows in provenance, 0 conflict rows.
7. Final state recorded; bound to sealed manifest.

## Deviations (disclosed)
- Physical insert statements carried 10 rows each (D1 100-bound-parameter limit);
  logical batch remained 500 with per-batch durable checkpoints. Behavior identical
  to the validated procedure; only statement granularity differs.
- Post-write chunk-store check: manifest seals compared for all 43 (unchanged) +
  3 chunks re-fetched; the full 43-chunk re-download was performed pre-write (sweep)
  and the manifest binds all 43 expected seals, so a full re-download was not
  repeated to conserve live API budget.

## Standing state
Content restoration REJECTED and not performed. No content, corpus doc, hunt-index
entry, or chunk-store record modified. Six quarantined bodies remain excluded and
quarantined. Historical hashes preserved. Rollback path validated (drop mapping
tables) but NOT executed. Production now carries the auditable provenance link:
hunt hash -> verified body digest -> corpus row.
