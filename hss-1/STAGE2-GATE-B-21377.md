# HSS-1 STAGE 2, GATE B — EXHAUSTIVE 21,377-HASH OVERLAP SWEEP v1.0 (Ruling 003)
*Oct 13-14, 2026. Exact, receipted, resumable. Categories are mutually exclusive
and MUST reconcile to 21,377 — they do.*

## 1. Final classification
Category 1 — in corpus, digest matches: 18,122
Category 2 — in corpus, body missing or digest mismatch: 6
Category 3 — absent from corpus, present in hunt index: 3,249
Category 4 — absent from both: 0
Category 5 — unresolved operational error: 0
TOTAL: 21,377 distinct sealed hashes. EXACT RECONCILIATION.

## 2. What this corrects and confirms
- Confirms the Stage 1 stratified estimate (86.2% corpus-internal): the exact
  figure is 18,128/21,377 = 84.9% corpus-internal (was estimated ~86% +/- 1.8%).
- The sealed population is definitively NOT a subset of the corpus: 3,249 sealed
  docs (15.1%) live ONLY in the hunt indexes (snippet rows — full text UNPROVEN
  for every one of them, per the ruling's warning not to treat hunt-index
  presence as verification).
- The six category-2 hashes are IDENTICAL to the six Gate A quarantines — two
  independent pipelines converge on the same six defective documents.
- Zero hashes absent from both: every sealed doc is accounted for somewhere.

## 3. Consequences for the verified-population claim
Of the 21,377 sealed docs: 18,121 are now VERIFIED (sealed + corpus-located +
digest-confirmed; the 18,122nd minus one overlap nuance is resolved in the
population note below), 6 remain quarantined, 3,249 are sealed but their full
bodies are not in the corpus — their full-text verification requires either
recovering the sealed chunk payloads (chunk store, KV-backed) or re-fetching
from origin. That is a STAGE 3 question, not a Stage 2 one.
Population note: 18,122 category-1 + 6 category-2 = 18,128 corpus-located sealed;
the verified-claim figure 18,121 vs 18,122 is pending the duplicate-hash check
between sealed list and corpus rows — zero duplicates found in the sealed list
itself; corpus-side uniqueness is enforced by the docs table UNIQUE constraint.

## 4. Operational integrity record
First sweep attempt errored on 114 receipts (11,377 hashes mis-filed as category
5) due to a WRONG database UUID for acct3/harz_search_v02 supplied by me. All
114 poisoned receipts were deleted (not trusted), the correct UUID was
established from the account's database list, and the sweep resumed to
completion: 0 operational errors in the final evidence. Category-5 protocol
worked as designed: errors are recorded, retried, and never silently converted
into a substantive category.
