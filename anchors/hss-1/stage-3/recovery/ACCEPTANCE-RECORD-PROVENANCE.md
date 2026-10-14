# HSS-1 PROVENANCE REPAIR — OWNER ACCEPTANCE RECORD (Ruling 009)
*Oct 14, 2026. Owner acceptance received on the reported evidence (owner has not
independently inspected the production database or commit; acceptance is of the
recorded evidence package).*

ACCEPTED: commit 9c8b55c and its execution receipts are the accepted
provenance-repair record of the HSS-1 program. Chain established, content untouched:

hunt hash -> verified body digest -> corpus row -> content body

Both reported deviations accepted by owner ruling:
1. D1 100-parameter limit: 10-row physical inserts within 500-row logical batches — accepted.
2. Chunk-store verification: pre-write full sweep + post-write 43/43 manifest-seal
   compare + 3 spot re-fetches — accepted WITH SCOPE DISCLOSED; the post-write check
   must not be described as a second full re-download.

STANDING CONDITIONS (owner ruling, in force until amended):
- The six quarantined items REMAIN EXCLUDED unless a separate investigation
  establishes their eligibility.
- DO NOT rebuild the corpus merely to reproduce this repair.
- Subsequent ingestion and corpus-expansion work is SEPARATE from this completed
  provenance operation.
- The original pre-write evidence is RETAINED so future audits can distinguish
  the state before repair from the state after repair.

Evidence index (all at anchors/hss-1/stage-3/recovery/):
- WRITE-START-STATE.json (TOCTOU + start state, bound to manifest cead2356...c23764)
- write-checkpoint.json, WRITE-EXECUTION-RECEIPT.json (7 bounded batches)
- POST-WRITE-VERIFICATION.json (all 7 checks PASS)
- PRODUCTION-WRITE-REPORT.md, PROPOSED-WRITE-MANIFEST.json
- Pre-write evidence retained: RECOVERY-MANIFEST-3249.json, SWEEP43-AGGREGATE.json,
  STAGING-TEST-RECEIPT.json, IDENTITY-RESOLUTION.json, PREWRITE-BATTERY.json,
  ARTIFACT-BINDING.json, PRODUCTION-PRECONDITIONS.json, COLLISION-TIMING.json,
  BODIES-PRESENCE.json, RECEIPTS-SIX-BODIES.json, chunk-receipts/ (43).

FINAL STATUS: PROVENANCE REPAIR ACCEPTED. CONTENT PRESERVED. HISTORICAL HASHES UNCHANGED.
