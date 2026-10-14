# HSS-1 PRIORITY ONE — FORENSIC REPORT: THE SIX QUARANTINED BODIES v1.0
*Oct 14, 2026. Ruling 004 tasking. Investigation read-only over preserved evidence.*

## 1. Evidence preservation (task 1) — DONE
Frozen before investigation: FREEZE-RECEIPT.json + frozen-snapshot.jsonl
(snapshot sha256 68bdf0957c0c63cce0990eada646d427942ec13dcfbb705536e8375945270b5a,
six bodies + full metadata verbatim). Zero bytes of the six were modified at any
point. No hash rewriting, no re-ingestion, no quarantine removal.

## 2. Ingestion history reconstructed (task 2)
All six are corpus-born docs (worker era v1+, DB born 2026-10-08; fetched_at Oct
6-8). Five are bleacherreport.com via CNN referral (source 'web'), one is
en.wikipedia.org (source 'wikipedia-ccby-sa-4.0'). Docs rows carry content_hash,
norm_hash, prefix_hash, size. The corpus later passed through: mojibake repair
(docs_enc_backup_20261011, 563 rows, UTF-8-as-Latin-1 class), metadata backup
(docs_source_backup_20261011, 5,335 rows — includes only doc 8254 of the six),
and the 2026-10-13 text migration to harz-corpus-bodies-db (1,328,715 rows).

## 3. Proven facts
F1. The CURRENT bodies are intact and doubly preserved: the sealed chunk store
(harz-fulltext-core KV, sft-v1.0) holds byte-identical texts for all six
(chunk-011 and chunk-017 fetched 2026-10-14, chunk SHA-256 match against the
sealed manifest, per-doc declared sha256 == recomputed text digest, docs.size ==
body codepoint length). Two independent stores agree on the body bytes.
F2. The docs-row digests are internally consistent with an UNKNOWN text T that is
NOT the stored body: sha256(T)=content_hash, sha256(normText(T))=norm_hash,
sha256(normText(T)[:400])=prefix_hash, JS-length(T)=size. T has the same
codepoint count as the body but different bytes, diverging within the first 400
normalized characters — before any astral character in five of six.
F3. REFUTED with recorded probes: every encoding variant (utf-8/16le/be,
NFC/NFD/NFKC), truncation (prefix/suffix at every boundary), cross-assignment
(no other doc carries these hashes; no doc carries the bodies' own digests),
single-unit astral sanitizers (?/FFFD/#/*/space — 5 classes x 6 docs), Latin-1
mojibake in both directions (the confirmed Oct-11 repair class — the six are NOT
among its 563 rows), duplicate-hash collision (0/6), and era normalization
formula variance (7 formula variants).
F4. The ingest-era fetcher code is NOT recoverable at this seat: worker version 1
(2026-10-08T13:24) postdates the six's fetched_at; the Workers versions API
serves metadata only, not historical source; no pre-v1 ingest script exists in
the workspace or repos.

## 4. Root-cause classification (task 5 repro, task 6 disposition)
CLASS: INGEST-ERA HASH/BUFFER DIVERGENCE — the upstream fetch pipeline computed
all three digests and the size over one buffer while persisting a different
buffer of the same length. Exact mechanism UNRESOLVED (pre-v1 code unavailable).
DISPOSITION: unresolved, evidence preserved, quarantine MAINTAINED.

## 5. Repair proposal (documented, NOT applied — owner word required)
R1. The bodies now have independent integrity proof (chunk seal + per-doc sha).
On owner word, a VERIFIED-BODY-RECEIPT can be recorded for the six WITHOUT
touching the recorded hashes: quarantine stays, the corpus gains an honest
"body verified, recorded digest untrustworthy" annotation.
R2. The defect class is CLOSED in HSS-1: the Gate C engine REFUSED all six at
ingest (identity gate: claimed hash must equal body digest, refusal is a
recorded terminal state, 6/6 refused). The future corpus cannot re-acquire this
defect through the new ingestion rail.
