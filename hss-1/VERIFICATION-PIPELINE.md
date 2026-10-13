# HSS-1 CORPUS VERIFICATION PIPELINE v1.0 (Team C, Ruling 002 §5)
*Design + first pilot results. Resumable, state-explicit, non-destructive.*

## 1. Record states (mutually exclusive, never blanket-assigned)
VERIFIED_DIGEST: sha256(body) == recorded content_hash (independent recompute).
VERIFIED_STORED: body durably written to an HSS backend AND read-back verified (T1 law).
VERIFIED: both, plus a seal-chain entry (witness pattern) — the full HSS state.
PENDING: queued, not yet passed over.
FAILED_DIGEST: recomputed digest != recorded hash → never auto-repaired.
QUARANTINED: failed + held aside with evidence; root-cause investigation; owner
verdict required for any state change. No deletion, no overwrite.

## 2. Resumability
Cursor = last verified rowid + per-batch receipt file (batch size respects D1's
100-parameter limit; 500-row reads). Each batch: fetch bodies + hashes -> recompute
-> state assignment -> append receipt (run directory never overwritten; failed runs
preserved per Ruling 002 §5 Team F).

## 3. Pilot run (Oct 13, 12,000 real bodies, rows 0-11,999 by rowid)
11,994 VERIFIED_DIGEST. 6 QUARANTINED (0.05%): all six carry non-ASCII (high bytes);
recorded hash != sha256(round-tripped body). Working hypotheses: (a) hash computed
at ingest over a string that differs from what SQLite round-trips (unicode
normalization / lone surrogates), or (b) the body was altered post-ingest. Root
cause OPEN; the six are quarantined, not repaired. This is why the ruling forbids
"verified because bodies exist."

## 4. Scale plan
12k measured -> 100k (200 batches) -> full corpus (1.33M, ~2,660 batches) as a
staged worker-side or desk-side programme — each rung reported before the next.
Estimated at pilot rate: the 100k rung is a day-scale desk job via API; the full
corpus needs a scheduled programme (owner authorization for any account-side worker).
