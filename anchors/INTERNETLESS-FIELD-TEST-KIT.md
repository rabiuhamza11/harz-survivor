# INTERNETLESS FIELD TEST KIT v1.0 — owner's hands, 10 minutes total
*Oct 12, 2026. Everything below is desk-verified in a real browser; only the airplane-mode
step needs the physical phone. No settings, no accounts, no installs needed beyond opening
the URL and choosing "Add to Home Screen" (optional).*

## What you are proving

The consultant's third tier: USABLE knowledge — stored on the device, findable by search,
readable in full, with the internet OFF. Desk tooling cannot disable the network, so this
one step is yours. Every part of the path it exercises has already passed desktop-browser
verification.

## Kit: three offline assets, one sitting

1. FULL-TEXT LIBRARY — https://harz-fulltext-core.harz.workers.dev
   Step 1: open on the Infinix with internet ON, tap "Download Full-Text Library".
   Expect: ~5-10 minutes on mobile data (161.8MB, 43 chunks); end state must read
   "COMPLETE: 21377 documents stored, all 43 chunks SHA-256 verified."
   Step 2: turn ON airplane mode. Reopen the app (from home screen or browser cache).
   Step 3: search "nigeria telecom" (or anything). Expect: results in under a second,
   header says OFFLINE, e.g. "154 results (searching 21377 stored documents — OFFLINE)".
   Step 4: tap any result. Expect: the complete article renders, footer line ends with
   "served from local storage, OFFLINE", and a SHA-256 prefix is shown.
   PASS = steps 3-4 work with airplane mode ON. FAIL = any error, blank reader, or
   "manifest unavailable".

2. OFFLINE BROWSER (785 saved pages) — https://harz-offline-browser.hamzarabiu390.workers.dev
   Same pattern: open online, follow its on-screen download/state step if shown, then
   airplane mode → browse saved pages. Expect: saved pages open, search works, online-only
   features honestly say so. (Its offline state is the 785-page export from Oct 8.)

3. KNOWLEDGE CORE (5,100 docs) — https://harz-kcore.harz.workers.dev
   Same pattern: download, airplane mode, search, read. This one passed its birth battery
   on Oct 10; the phone test re-proves it on mobile hardware.

## Optional but sovereign: the export proof

With internet ON, in the full-text library tap "Export library as JSON" — you get one
portable file with all 21,377 documents. Copy it anywhere: that file IS the library,
no HARZ infrastructure needed to read it back later.

## What to send back

One line per asset: PASS or what you saw instead. If anything fails, the exact words on
screen — that is the failure signature the desk needs; do not retry more than once before
reporting. On PASS of all three, the Internetless field validation claim is yours to make
public, measured at this test scale, and the last staged item in the offline lane closes.


## AMENDMENT 1 (Oct 16, 2026) — v1.1: asset 3 URL correction
Correction (Wave 1 Team D reproduction finding, repo evidence): the knowledge core
serves at https://harz-knowledge-core.harz.workers.dev — the URL printed above as
"harz-kcore.harz.workers.dev" returns 404 (stale subdomain, never the asset itself).
Use the harz-knowledge-core URL for asset 3. All other steps unchanged. Original text
preserved above unchanged; this amendment supersedes only the asset-3 URL.
