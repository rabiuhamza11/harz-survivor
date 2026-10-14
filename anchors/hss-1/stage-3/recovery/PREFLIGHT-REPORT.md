# HSS-1 PRODUCTION ACCEPTANCE PREFLIGHT REPORT v1.0 (Ruling 006)
*Oct 14, 2026. Production untouched. No write executed. Six quarantined excluded throughout.*

## HEADLINE FINDING (precondition 2): the production content write is REDUNDANT
The live corpus was checked for concurrent changes against the evidence. The check
surfaced something larger:

1. Corpus grew since the Oct 13 baseline: 1,328,715 -> 1,341,437 docs (+12,722, live
   concurrent writer, URL-ingest pattern; hunt acct3 index grew 11,365 -> 23,928
   in the same window). Chunk store UNCHANGED: all 43 seals match sweep receipts.
2. Collision precheck: ALL 3,249 verified body digests ALREADY EXIST in the corpus
   docs table. Row ids 3..1,065,585 — ALL pre-baseline. URLs identical to the hunt
   entries. They were present BEFORE any of this evidence was generated.
3. Bodies DB check: ALL 3,249 bodies exist in harz-corpus-bodies-db. Sample 300:
   production bodies re-hashed, 300/300 digests match the recovered bodies exactly.

MEANING: the 3,249 were never content-missing from production. The hunt index's
recorded hashes are foreign keys that never matched the corpus rows' true hashes —
which is why Gate B (keyed on hunt hashes) classified them "absent from corpus."
The verified content sits in production today, complete, under identities that
equal the verified body digests. A content restore would insert 3,249 duplicates;
the corpus dedup (content_hash UNIQUE) would refuse them all.

The hunt hash != body digest finding (229/229) is consistent with this: the hunt
pipeline recorded digests of something other than the page text the corpus stored.

## Condition 1 — ARTIFACT BINDING: DEMONSTRATED (ARTIFACT-BINDING.json)
Recorded sha256 digests bind: recovery manifest (file digest 125c72ab...; canonical
digest cead2356...c23764, matching ruling expectation prefix cead2356 / suffix 23764),
sweep aggregate, staging receipt, six-body receipts, integrity battery + output log,
Team F receipt, forensic report, frozen evidence snapshot, engine code (sha
492dd1a1...; working copy byte-identical to repo copy at hss-1/prototype/engine/hss.js),
repository commit 015cd8dec1fa2ddccabdece9295227fcfe14c72d.

## Condition 2 — PRODUCTION PRECONDITIONS: DEMONSTRATED, WITH MATERIAL CHANGES FOUND
Chunk store unchanged (43/43). Corpus and hunt index CHANGED since evidence generation
by a live writer (+12,722 docs / +12,563 hunt rows). Consequences: (a) any future write
must re-run the collision precheck immediately before execution (TOCTOU guard, the
procedure below includes it); (b) the 3,249-digest presence result was checked against
the CURRENT corpus, so it supersedes the original classification. Hunt acct1 unchanged
(42,622).

## Condition 3 — WRITE SAFETY: DEMONSTRATED (dry-run receipts in repo)
The only write the evidence supports is a PROVENANCE MAPPING (hunt_hash -> corpus
identity), not a content restore. Procedure specified and dry-run demonstrated:
explicit max batch size 500 (hard constant); durable atomic checkpoint after every
batch (tmp+rename, recording manifest digest cead2356... — the write is bound to the
sealed manifest); crash simulated after 3 batches, resumed from checkpoint, completed
3,249 rows in 7 batches; exactly-once (0 duplicate hunt hashes); full reconciliation
against the manifest (0 missing); rollback path tested (drop mapping table; checkpoint
receipt preserved; nothing else touched). TOCTOU recheck included as step 0 of the
procedure. The content-restore procedure (bounded, checkpointed) is specified in the
staging receipts but should NOT execute: redundant by the finding above.

## Condition 4 — POST-WRITE VERIFICATION PLAN (defined, not yet applicable)
After any authorized provenance write: (1) count == 3,249, distinct hunt hashes == 3,249;
(2) every row joins the sealed recovery manifest on body_sha256; (3) every body_sha256
joins the corpus docs table AND the bodies DB; (4) sample re-hash of production bodies
(digest must equal body_sha256); (5) no corpus docs row or body modified (write touches
only the new mapping table); (6) storage accounting delta = mapping table size only.

## RULING TABLE STATUS
1. Six bodies: quarantine maintained, excluded, untouched. Historical hashes preserved.
2. Production restoration: HOLD maintained — and per this preflight, a content write is
   unnecessary; the owner decision is reduced to whether to record the provenance mapping.
3. No historical hash rewritten. Nothing deployed. Corpus, bodies DB, chunk store untouched.
