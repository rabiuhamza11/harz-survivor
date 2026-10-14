# HSS-1 STAGE 2, GATE C — 100K ENGINE WORKLOAD, REGRESSIONS, RAIL SEPARATION v1.0 (Ruling 003)
*Oct 13-14, 2026. Sandbox-only. Production acceptance withheld. Not extrapolated to 10M.*

## 1. Workload and acceptance reconciliation
Attempted: 100,000 documents (12,000 real corpus + 88,000 derived variants —
distinct hashes, labeled, same policy as the 50k rung).
Refused at ingest for identity: 6 — the same six quarantined documents. The
engine's identity gate rejected them exactly as the ruling demands: a body
whose claimed hash does not match its bytes is NEVER accepted, and the refusal
is a recorded terminal state, not a crash.
Stored: 99,994. Coherent final verify pass (fresh receipts, single rail run):
attempted 99,994 = verified 99,994 = receipts 99,994 = objects 99,994,
failures 0, runtime 34.7 s. Post-verify state counts exact and duplicate-free:
STORED 99,994 / SEARCHABLE 99,994 / VERIFIED_DIGEST 99,994.

## 2. Required regressions at the ACTUAL 100k workload (not fixtures)
R1 — manifest type violation produces an explicit error (Ruling 002 §2): PASS
(seeded '[]' on the real 100k manifest; engine refused with MANIFEST TYPE
VIOLATION; restored; no silent success).
R2 — a token named 'constructor' does not corrupt the inverted index: PASS
(searched the real 100k-shard index; array result, no prototype leak).
Rail separation law (Ruling 003 final clause): every ingested doc enters as
STORED + PENDING_VERIFICATION; only the independent verify rail flips to
VERIFIED_DIGEST/FAILED_DIGEST, receipted and resumable. Demonstrated at 100k.

## 3. Measurements (the ruling's required list)
Runtime: verification rail 34.7 s for 99,994 bodies (batched flush; the first
per-object flush implementation was O(n^2) and was replaced mid-gate).
Memory: RSS peak 2.77 GB for the 100k store + 10-shard index in one process.
Get latency: p50 404 ms / p95 511 ms (known prototype cost: get() parses the
full ~53 MB manifest per call — same O(n) read cost measured at 50k, worse here
as predicted; manifest cache is the known Stage 3 fix).
Restart recovery: 3,066 ms (journal replay + manifest parse at 100k).
Index: 10 shards, 1,509 MB. Storage total: 2,569 MB (payload replicas 902,
manifests 107, journals 38, index 1,509) vs raw payload 435 MB.
Multiplier: 5.90 (converged: 5.93 / 5.73 / 5.87 / 5.90 across 2k-100k).

## 4. The index share question the ruling asked (50k -> 100k)
At 50k the inverted index was 59.3% of total storage. At 100k it is 58.7%.
The share is STABLE, i.e. the JSON-shard index scales linearly with documents
(~1.5 GB per 100k docs in this implementation). Per the ruling, NO 10M
projection is made from this: a linear JSON-shard index would be ~150 GB at
10M and is the wrong tool at that scale; a real index service (postings
compression, term dictionaries) is a Stage 3+ question requiring new rulings.

## 5. Defects the 100k run itself caught (both fixed; battery re-run 16/16)
8. Manifest writes were non-atomic: a process killed mid-save left a torn
   manifest that bricked the store open. Fixed: tmp+rename atomic writes, plus
   an explicit journal-based rebuild path (objects rescan + digest verify,
   conservatively re-marking everything PENDING_VERIFICATION — verification
   states are never trusted from a rebuilt manifest, only from rail receipts).
9. State pushes were not idempotent: recovery across process generations
   accumulated duplicate state entries (observed: 6 duplicate VERIFIED_DIGEST
   marks). Fixed: set-semantics state updates everywhere.
After both fixes: full acceptance battery re-run, 16/16 PASS (receipts in the
dated run directory), including T2/T2b/T3 real crash-adoption tests.

## 6. Evidence integrity note
Three process generations were killed mid-run during this gate (sandbox
disconnects and two intentional kills). The interrupted generations left
receipt/state residue that the first reconciliation EXPOSED (not hidden):
99,665 receipts vs 99,994 objects, duplicate state marks. Resolution was a
single coherent full re-pass on a fresh receipt set — receipts == objects ==
manifest counts, exact. All generation evidence preserved, including the
poisoned-receipt purge record for the Gate B sweep error.
