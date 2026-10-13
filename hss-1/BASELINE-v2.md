# HSS-1 CORRECTED BASELINE v2.0 (FROZEN)
*Team A deliverable under Ruling 002, Oct 13, 2026. Supersedes the Oct 13 morning
"89.7% metadata-only" finding — which is RETAINED in the historical record (CORPUS-
MEASUREMENT.md v1.0) and explicitly marked SUPERSEDED, not deleted.*

## 1. The population relationship (ruling §1 — CONFIRMED, assumption corrected)
The 21,377 sealed/verified docs are NOT a subset of the 1,328,715-doc corpus.
Measured (Team C, Oct 13): stratified sample of 1,509 sealed hashes against the
bodies DB: 86.2% present (95% CI ~±1.8%); every sampled missing hash was found in
the HUNT SEARCH INDEX (20/20) and none in the corpus docs table (0/20).
Corrected structure:
- Sealed population = ~18,400 corpus-internal docs + ~3,000 corpus-external
  (hunt-index) docs (estimates from the sample; exact sweep = 21,377 hashes x
  IN-batches, staged as a pipeline rung).
- Corpus docs NOT yet HSS-verified: ~1,328,715 - 18,400 = ~1,310,300 (approximate
  until the exact sweep). The ruling's 1,307,338 figure is an UNDERcount by ~2,950
  because it assumed full subset overlap.
- Therefore: the verified seed and the corpus overlap ~86%, they are not nested.

## 2. Authoritative identity / body / verification relationships
Identity: content_hash = sha256(complete body), assigned at ingest, stored in BOTH
the corpus docs table (docs.content_hash, UNIQUE) and bodies DB (bodies.content_hash).
Body: the complete text lives in harz-corpus-bodies-db.bodies.text; docs.text is
intentionally empty post-migration (d1_text_bytes = 0).
Verification: NONE of the 1,328,715 corpus docs carries independent verification
evidence. The only VERIFIED population is the 21,377 sealed docs (KV store,
chunk SHA-256 vs manifest, seal chain). First independent digest pass over a
12,000-doc sample: 11,994 verified, 6 QUARANTINED (recorded hash != recomputed
digest; all six carry non-ASCII bytes; root cause open — see VERIFICATION-PIPELINE.md).
The central law stands: body completeness is not verification.

## 3. Supersession record
SUPERSEDED (Oct 13, 07:56 report + Ruling 001 baseline row 2): "89.7% metadata-only
stubs". Caught mid-migration. The corrected fact: 100% of corpus docs have complete
bodies in the bodies DB (avg 5,757.6 B, 7,650,231,226 B total, body_migrated = 1,328,715).
What SURVIVES from the superseded finding: zero of them are VERIFIED.

## 4. Accounting design law (Ruling 002 §2 — added as Amendment 1 to ARCHITECTURE-SPEC)
A missing counter or malformed store must produce an EXPLICIT ERROR or an observable
reconciliation failure — never a silent success. Enforced in the prototype: manifest()
throws MANIFEST TYPE VIOLATION on any non-object manifest; the corpus seat's silent
UPDATE no-op (proven by the absent replaced_v2 key) is the production anti-pattern.
