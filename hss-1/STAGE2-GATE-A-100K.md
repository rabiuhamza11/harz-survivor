# HSS-1 STAGE 2, GATE A — 100K VERIFICATION LEDGER v1.0 (Ruling 003)
*Oct 13-14, 2026. Read-only corpus. Receipts are the source of truth.*

## 1. Headline ledger (reconciled, no gaps)
ATTEMPTED: 237,000 (474 batches x 500 bodies, rows 0-236,999 by rowid)
VERIFIED_DIGEST: 236,994 (independent sha256 recompute vs recorded content_hash)
QUARANTINED: 6 (digest mismatch; retained, evidence preserved)
PENDING: 0 (every attempted body reached a terminal state in this run)
Reconciliation: 237,000 = 236,994 + 6. EXACT.
Batch contiguity: proven (no gaps, offsets disjoint and ordered, no rowid
double-attempted — receipt-keyed resume skips existing batches by construction).

## 2. Scope disclosure (my error, disclosed not hidden)
The authorized scope was the next 100,000 eligible documents. The pipeline I
built had NO batch cap, so it ran to 237k before I stopped it. The GATE A LEDGER
is therefore reported at two scopes:
- Authorized scope (batches 0-199): 100,000 attempted, 99,994 verified, 6 quarantined.
- Full attempted (batches 0-473): 237,000 / 236,994 / 6 (all receipts preserved).
Every attempted document has an explainable state; nothing silently skipped.

## 3. The six quarantined (unchanged from the pilot; root cause OPEN)
Same six bodies, now confirmed by TWO independent pipelines (Gate A digest pass
AND the Gate B exhaustive sweep independently classify exactly these six as
digest mismatches). Failure rate: 6/237,000 = 0.0025%. All six cluster in early
rows (2005-8253); 225,000 subsequent bodies verified with ZERO new failures.
Forensic probes completed WITHOUT modifying any source byte:
- Encoding hypotheses: sha256(utf-8), sha256(utf-16-le), NFC, NFKC — recorded hash matches NONE.
- Truncation hypothesis: recorded hash matches no prefix/suffix of the body.
- Mis-assignment hypothesis: each recorded hash is its own row (not another doc's).
- Length law: docs.size column == current body length exactly — the body was NOT
  truncated or extended; the digest alone is inconsistent.
- All six carry non-ASCII bytes; five carry astral (non-BMP) characters.
Remaining hypothesis: the ingest-era hash was computed over different bytes of a
same-length string (e.g., a pre/post-processing text mismatch in the ingest
worker). Closing it requires ingest-worker version forensics — STAGED OPEN.
State law held: QUARANTINED, not repaired, not normalized, not accepted.

## 4. Interrupt and resume test (required by the ruling)
Live crash test: pipeline killed (exit 77) after 25 batch receipts committed,
batch 25 NOT attempted. Resume: existing 25 receipts skipped, run continued
from batch 25, final contiguity proven across all 474 receipts. No lost work
(idempotent receipt keys), no duplicate acceptance (counts derived from receipts
only). Verdict: PASS.

## 5. Rail separation (Ruling 003 final clause)
Ingestion and verification are separate rails: the engine's batchPut now marks
every newly ingested doc PENDING_VERIFICATION; the verifyBodies rail
independently recomputes and flips to VERIFIED_DIGEST or FAILED_DIGEST with its
own per-object receipts (resumable). No newly ingested document is ever
implicitly verified. Demonstrated at 100k scale in Gate C.
