# Team B — Serve-Time Wiring Spec v1.0 (PROPOSAL — nothing deployed)
Date: 2026-10-12 · Boundary: search workers are the corpus seat's services; this spec goes to the owner
for relay to that seat, or for his explicit boundary-crossing word to the desk.

## Goal
Search results gain "READ FULL" for any doc whose content_hash is covered by the new full-text store:
sft-v1.0, 21,377 docs / 43 SHA-sealed chunks / 154MB, in KV namespace harz-search-fulltext (acct3).

## Architecture — follows the ecosystem's OWN existing precedent
The acct3 search worker already runs a cross-account full-text tier: /fx/doc/<id> fetches full text from
a trusted ecosystem source (harz-fx-ingest, acct1) and returns it with the honest label
"LIVE · TRUSTED ECOSYSTEM SOURCE — RETRIEVED FULL TEXT, NOT VERIFIED FOR RELEVANCE".
The store wiring copies this proven pattern — no new architecture:

1. READER: one tiny worker on acct3 (where the store lives): GET /doc/<content_hash>
   → looks up the chunk for that hash, fetches the chunk from KV, VERIFIES the chunk's SHA-256
   against manifest.json, returns the doc only if the seal matches. Refuses on any mismatch
   (the manifest law: a chunk whose SHA does not match is NEVER presented as complete).
   Public and secret-free: integrity comes from the seals, not from access control.
2. INDEX KEY (prerequisite, desk-executable): the store currently has no hash→chunk index.
   Build one 'doc-index.json' KV key (hash → chunk name, ~1.5MB) generated from the sealed chunks
   and recorded in the manifest. Additive only; the store itself is untouched.
3. SEARCH UIs (both accounts): on results whose content_hash is in the reader's coverage index,
   render "READ FULL" → fetch from the reader (cross-account fetch, exactly the /fx precedent),
   honest label as in the FX tier. Search indexes and their contracts remain frozen and untouched.
4. COVERAGE HONESTY: 21,377 of 53,987 live-index docs (39.6%) covered today. The coverage grows as
   the waves re-gather the 32,610 misses; re-lift is repeatable from the recovery manifest.
   The UI shows coverage truthfully, never implying all results are fully readable.

## Why cross-account fetch and not a KV binding
KV namespaces cannot bind across accounts (hunt index: acct1; store: acct3). The reader endpoint
sidesteps that entirely — same reason the FX tier exists.

## Acceptance battery (before any report: browser-tested, per standing law)
1. Browser: search a covered term → READ FULL → full text opens, content consistent with the snippet.
2. Tamper test: corrupt one chunk → reader REFUSES (seal mismatch), UI degrades honestly (no full text).
3. Coverage test: a non-covered result shows no READ FULL (never a dead link).
4. UI changes pass the build checklist: PWA, light theme, ecosystem, mobile (Infinix), browser.
5. Reader serves within normal latency at test scale (measured, not extrapolated).

## Explicitly out of scope
Offline portability of the full texts (export into knowledge-core/onefile lanes) is a SEPARATE motion —
this spec wires online reading only.
