# HSS-1 PRIORITY TWO — RECOVERY REPORT: THE 3,249 HUNT-INDEX-ONLY DOCS v1.0
*Oct 14, 2026. Ruling tasking. Read-only classification; no bulk re-ingestion started.*

## 1. Population
3,249 sealed hashes classified category 3 (absent from corpus, present in hunt
index) by the Gate B exhaustive sweep (214 receipts, exact 21,377 reconciliation).

## 2. Finding: the texts are NOT lost
ALL 3,249 hashes are present in the sealed recovery sequence (recovered-local,
21,377 docs) lifted into the sealed chunk store on Oct 12 (lift.py, Team B phase
2). Spread: 27 of 43 chunks (chunk-000 through chunk-042), positions recorded
per-hash in CLASSIFICATION-3249.json.

## 3. Sample verification (first, middle, last chunks)
chunk-000 (500 docs), chunk-021 (500 docs), chunk-042 (377 docs): all 3 chunk
SHA-256 match the sealed manifest. 229 of the 3,249 sampled within them: 229/229
per-doc declared sha256 == recomputed text digest, 0 mismatches.
Sample = 7.05% of the population, zero failures.

## 4. Classification (ruling categories)
All 3,249: category B — RECOVERABLE. A trustworthy sealed source exists for every
record (chunk-sealed store + per-doc declared digest; sample-verified). Zero C
(partially recoverable), zero D (unrecoverable) observed in the sample.

## 5. MEASURED FINDING — identity provenance (decisive for restoration)
In the 229-doc sample, ZERO recorded content_hashes equal sha256(text) of the
recovered body (229/229 mismatch). The recorded hashes are hunt-index
provenance and do NOT describe the recovered bytes. Restoring these docs under
their recorded hashes would recreate the six-body defect class at 3,249 scale.
The chunk store's per-doc sha256 field (digest of the actual text) IS verified
(229/229) and is the only trustworthy identity for restoration.

## 6. Restoration spec (proposal — owner word required before execution)
R1. Full 43-chunk sweep: fetch all chunks, verify all 43 chunk seals + all
21,377 per-doc digests (the 3,249 within them).
R2. Ingest through the HSS-1 engine rail with content_hash = sha256(body bytes)
as the HSS identity (engine law), retaining the hunt content_hash as provenance
metadata — never as the identity. PENDING_VERIFICATION → verify receipts →
VERIFIED_DIGEST. The engine's identity gate refuses hash/body mismatch, which
structurally closes the six-body defect class for the restored population.
R3. The six quarantined docs ride the same rail only via the forensic report's
R1 path (owner-gated separately).
