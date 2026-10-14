# WAVE 1 TEAM E — CORPUS INTEGRITY RECON REPORT
*Oct 14, 2026, 06:50-06:58Z. Read-only. Repo state at measurement: 0ea50b7.
Operating contract honored: no claim without an executed check; failures and unknowns declared.*

## E1 — Exact desk-shard counts (executed, live KV fetch of manifest + all 43 chunks)
43 chunks; 21,377 documents; 142,353,201 bytes of body text; 0 empty bodies;
docs per chunk range 377-500 (500-doc chunks with a 377-doc tail). Per-chunk table
preserved in TEAM-E-RECON.json.

## E2 — Fresh live-seal measurement vs prior reconciliation (executed)
All 43 chunks fetched LIVE and re-hashed: 43/43 seals match the manifest; 43/43 are
byte-identical to the prior reconciliation receipts (this morning's Ruling 005 sweep);
21,377/21,377 per-doc digests re-verified with 0 mismatches. THE SEALED POPULATION IS
BYTE-STABLE across the reconciliation window.

## E3 — Quarantine: recorded, not inspected (executed as mandated)
Production annotation tables read; the six quarantined bodies were NOT inspected.
six_body_receipts: 6/6 verdict BODY_INTEGRITY_VERIFIED / HISTORICAL_IDENTITY_INTEGRITY_
UNPROVEN, quarantine MAINTAINED. identity_corroboration_receipts: 6/6 carry the three
distinct conclusions (VERIFIED / CORROBORATED / UNPROVEN), quarantine MAINTAINED.
The six remain absent from hunt_provenance. Nothing else touched.

## E4 — Population-swap question, measured from scratch (executed)
Fresh counts: corpus docs 1,341,437 (byte-equal to this morning's 06:12Z count, and
still +12,722 over the Oct 13 baseline); hunt_provenance exactly 3,249; hunt acct1
42,622 (unchanged since Oct 12); hunt acct3 32,036 — UP +8,108 from 23,928 at this
morning's preflight: THE LIVE CONCURRENT WRITER REMAINS ACTIVE on the acct3 hunt
index, though the corpus docs table was flat across this window.
Correspondence sample: 300 uniform-random sealed docs (of the 21,377 fresh-rehashed
population) queried against the live corpus by BOTH identities — 300/300 found,
0 not-found. No evidence of population swap.

VERDICT: no swap evidence at any layer — sealed store byte-stable, seals identical
to prior reconciliation, correspondence sample 300/300, corpus count stable since
morning, provenance exact at 3,249.

## Deviations, failures, unknowns (declared)
1. First execution attempt crashed at E4 (D1 100-variable limit — 200-key batch);
   its in-memory E1-E3 results were lost and re-measured fresh. All published numbers
   come from the second, checkpointed run. No claim rests on the lost run.
2. E4 correspondence is identity-presence, not per-doc re-classification of the
   18,122/3,249 split; the split classification relies on the prior full
   reconciliation (verified fresh as identical at the seal level).
3. The six quarantined bodies' internals were not re-measured — per mandate, only
   their recorded annotation state was read.
4. Live writer on acct3 hunt index still unexplained in direction (writer identity/
   purpose outside Team E scope — flag for Team F's blocker ledger).

## Method receipts
TEAM-E-RECON.json (full per-chunk table, all queries, counts, timestamps);
sample-pool.json (21,377 fresh digests, 300-doc sample seed 21377).
