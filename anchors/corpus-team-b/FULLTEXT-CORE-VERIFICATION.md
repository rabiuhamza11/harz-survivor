# FULL-TEXT CORE — Full-Flow Verification (Oct 12, 2026)

## Bug found + fixed (the exercise that caught it)

Exercising the full download in a real browser exposed a REAL bug the API battery missed:
every chunk stored failed with IDB keyPath error. ROOT CAUSE: kcore's client stores docs
keyed on field 'i' (kcore chunk docs = {i,t,u,l,c,h,x}); the sft store's chunk docs =
{content_hash, url, sha256, text} — no 'i'. Manifest-compatible was never doc-schema-compatible.

FIX (client-side only, sealed store untouched): ingestion now maps each store doc at
download time: i = chunkIndex*1000+k (numeric, read() parses int), t = derived from URL
slug (titles were not lifted — honest derived labels), u = url, l = language||'en',
c = hostname, h = sha256, x = text. Chunk SHA-256 verification loop untouched.
SW cache bumped v3; browser context reset to kill a stale SW-cached page (lesson #2
for the same class: cached shells serve old code — verify the RUNNING page, not just
the deployed one).

## Full battery (browser, real click-through, post-fix)

1. Full download: COMPLETE — 21,377 documents stored, all 43 chunks SHA-256 verified.
2. Offline search "nigeria telecom": 154 results (searching 21,377 stored documents),
   instant, local-only read path.
3. Doc open: full 8,852-char article rendered from local storage, per-doc SHA-256
   displayed, labeled 'served from local storage'.
4. True airplane-mode test: still staged for Infinix physical (desk browser tooling
   cannot disable network); the read path is now entirely IndexedDB-local.

## Honest labels kept

Titles are URL-slug-derived (titles were never lifted into the store) — readable but
not editorial. If owner wants true titles, that is a store v1.1 re-seal motion, staged.
