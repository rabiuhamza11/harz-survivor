# Team A — Discrepancy Report (HARZ Offline Knowledge Expansion)
Date: 2026-10-11/12 · Auditor: desk seat · Audit-only; no ingestion, no changes.

## Verified against recorded figures
1. "11,000+ documents in one recorded index" — VERIFIED: acct3/harz_search_v02, 11,365 docs / 140,894 terms.
2. "785 documents with full readable text" — VERIFIED AND LOCATED: the offline browser's onefile (785 full pages,
   5,997,406 chars, seal 8344922-a44ceec55e61f3a4), live-rendered "SEALED — ALL CHECKS PASSED" in a real browser.
3. "5K Knowledge Core strategy accepted" — VERIFIED: kcore-v1.0, 5,100 docs, 150 excluded on failed integrity,
   14 SHA-256-sealed chunks, born 2026-10-10.
4. "~1.06M documents, ~8.9GB reservoir" — SUPERSEDED: harz-million-corpus now holds 1,623,831 ingested
   (498,518 dup-rejected), 7.25GB against a 9.5GB cap (sovereign storage ruling 2026-10-09). The recorded
   figures were an earlier snapshot.

## Discrepancies requiring decisions (none executed by the desk)
1. UNRECORDED HUNT INDEX: acct1/harz_search_v02 holds 42,622 docs (wikipedia 11k + Nigerian press),
   contract v0.2, crawled Oct 6-9 — 3.7x the size of the recorded index, absent from all prior figures.
2. STALE DUPLICATES: acct1/harz_search_v011 (1,409 docs, Sep 19) and its FTS5 mirror harz_search
   (same 1,409 rows, same index digest) are dead weight — two copies of a superseded snapshot.
   Candidates for archival on owner ruling; desk deletes nothing.
3. SNIPPET-ONLY LAYER: all four search DBs carry snippet_text only (no full-text column). 55,291 unique
   records are stored and searchable but NOT fully readable — the stored/searchable/usable distinction is
   now measured, not theoretical. Team B's recovery lane has a concrete object.
4. CROSS-DB DEDUP: only 105 duplicates exist between stale v011 and the curated index; the hunt and curated
   corpora share ZERO content_hash overlap — complementary, no dedup debt between them.
5. ASSET-CLASS MIXING: HARZ_RECORDS_ARCHIVE (319 keys) is the program's own AEE/HPR records, not knowledge
   corpus. Inventories must not count it toward knowledge totals.
6. EMPTY NAMESPACE: HARZ_WIKI_KV holds 0 keys — dead.
7. MILLION-CORPUS UNDER ACTIVE WORK: encrypted backup table created 2026-10-11; CPU-limit resets on light
   probes. Desk stood off mid-work; per-doc readability unverified until the work settles.
8. COSMETIC DRIFT: the browser onefile's inner header reads "v0.3" while its meta says v0.6.
9. LANGUAGE GAP: ~100% English coverage — zero African-language footprint (Team D's mandate).

## Constraint warnings for Teams B-F
- D1 free-tier row-read/CPU limits: budget every scan; today's CPU resets are proof.
- Storage headroom: 2.25GB left before the honest 507 refusal at the 9.5GB cap.
- No R2 anywhere: bulk content is D1-inline; Team E should weigh R2 before designing 1M+ ingestion.

## Verdict
The consultant's instinct was right: reconcile before ingesting. The real usable knowledge today is
785 full pages + 5,100 SHA-sealed docs (both browser-verified), against 55,291 snippet-only search records
and 1.62M stored-but-unverified reservoir docs. Stage 1 (Recover) has clear objects; nothing in this
report changes any byte of any system.
