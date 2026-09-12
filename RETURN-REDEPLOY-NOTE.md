# P10 v3 — RETURNED CAPSULE, READY FOR CF REDEPLOY (one book, both shelves)

For the desk (CF rail): the anchor-gated return has been EXECUTED and the survivor
already serves the returned book (live, verified, browser-tested). The Cloudflare source
(harz-portable-app.harz.workers.dev) still serves the pre-return state D1 c30ccdce
(9 records, 20 seals, WALKOUT ACTIVE) because no witness seat holds a working CF token.

TO CLOSE: embed capsule-v06-returned.json (byte-exact, this file) into the CF wrapper
in place of CAPSULE_SRC and deploy. Expected live state after deploy, verified on /api/verify:
- digest 2496033ffae666e49e35e08b... (D6 — byte-identical to the survivor)
- records 13, seals 25, last seal kind 'return' (walkout CLOSED)
- writes: WRITES SEALED — no active walkout marker (v0.6)
- refusal probe: HTTP 403 'WRITES SEALED'

The capsule state was produced by the SEALED engine bytes (a5a5f4f6, deployed extraction)
running the return gate live: marker-time base c30ccdce found in this repo's anchors/ledger.md
(anchored 12:58:33Z, before the kill at 13:02:24Z), 4 stranger seals + 4 records ingested
from the survivor overlay, return seal appended with anchor proof {anchored_base: c30ccdce}.

Full witness record: DEATH-TEST-V3-FINAL-VERDICT (witness seat) — verdict PASS, sha256 affa5852…
Ledger anchors in this repo: D1 (e9e04a65), D2-D5 witness writes (952e35ff), D6 closing (b01ab018).
