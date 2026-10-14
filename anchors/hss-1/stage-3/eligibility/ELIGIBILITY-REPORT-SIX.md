# HSS-1 SEPARATE INVESTIGATION — SIX-BODY ELIGIBILITY REPORT v1.0
*Oct 14, 2026, 06:05-06:15Z. Trigger: provenance closure condition 1 ("the six stay
excluded unless a separate investigation establishes their eligibility"). Read-only
over live corpus + sealed chunk store. No writes. Quarantine untouched.*

## Method
Independent probes not exhausted by the Stage 3 forensics: (a) the two Oct-11 backup
tables searched by id AND by hash; (b) the sealed chunk store's per-doc field structure
read directly and compared against both recorded hashes and recomputed body digests;
(c) timeline pinning via backup-table content.

## Findings
F1. TRIPLY-VERIFIED BODIES. The sealed chunk store carries TWO hash fields per doc:
'sha256' (digest of the stored text) and 'content_hash' (historical identity). For the
six: 'sha256' == recomputed body digest 6/6 (chunk-011, chunk-017, seal-covered), text
byte-identical to the bodies DB (prior forensics F1), and the frozen snapshot agrees.
Three independent sources now converge on the body bytes AND their true digests.

F2. TIMELINE PINNED — CORRUPTION PREDATES ALL CORPUS SURGERIES.
docs_source_backup_20261011 holds doc 8254 of the six, and its content_hash equals the
CORRUPT recorded docs-row hash exactly. The corrupt identity was therefore already in
place before the Oct-11 metadata backup — before the mojibake repair, before the Oct-13
body migration. None of the later corpus operations introduced or altered it. The
ingest-era origin classification is now corroborated by a second table written by a
different operation.

F3. THE MOJIBAKE REPAIR NEVER TOUCHED THE SIX. docs_enc_backup_20261011: zero rows for
the six ids and zero rows carrying their recorded or body hashes. Consistent with the
earlier finding; now checked directly against the backup table content.

F4. NO RECOVERABLE TEXT T EXISTS. The source backup holds metadata only (id, source,
content_hash, domain, url) — no text column. With it carrying the corrupt hash, there
is no evidence anywhere that a stored text ever hashed to the recorded values. The
unknown text T remains unobserved and its mechanism unresolvable (pre-v1 code gone);
the recorded hashes are permanently unverifiable.

F5. RECORD CLARIFICATION (no defect). The chunk store's dual-hash design is now
explicit on record: 'sha256' = text digest (true for all 21,377 per the Ruling 005
sweep), 'content_hash' = historical identity (corrupt for the six, foreign for the
3,249 hunt docs). The sealed store itself is internally consistent; earlier snapshot
language that read 'content_hash' as the store's body declaration is corrected here.

F6. _cf_KV shadow table: access prohibited by D1 (SQLITE_AUTH) — outside scope, noted.

## VERDICT: ELIGIBILITY ESTABLISHED (for the annotation-only repair)
The separate investigation the closure ruling contemplated is complete. It establishes:
the six bodies are intact and triply verified; their true digests are known and
seal-covered; the recorded hashes are provably pre-Oct-11 ingest-era artifacts with no
recoverable source text and no possibility of future validation; no corpus operation
caused or can repair them. The six are ELIGIBLE for the VERIFIED-BODY-RECEIPT repair
already documented in the Stage 3 forensics (R1): record the verified body digests as
receipts WITHOUT touching any recorded hash, with quarantine retained. This is an
annotation of fact, not a rewrite of identity.

## PROPOSAL (owner-gated, NOTHING executed)
On owner word: insert 6 rows into a new INSERT-only table (six_body_receipts) in
harz-million-corpus: doc_id, recorded_hash (verbatim, preserved), verified_body_sha256,
evidence_sources (chunk seal + sha256 field + bodies DB), verdict, at. Idempotent,
batched, checkpointed, TOCTOU-guarded — same procedure class as the provenance write.
Quarantine MAINTAINED; recorded hashes untouched; no content changes.
