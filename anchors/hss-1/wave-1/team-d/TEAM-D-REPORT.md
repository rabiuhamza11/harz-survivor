# WAVE 1 TEAM D — INTERNETLESS VERIFICATION (desk reproduction, Oct 16, 2026)
*Read-only. Executed desk-side per owner "Go on" mandate, replacing the un-landed
Team D report. Failures and limits declared, nothing faked. Probe data:
team-d probe file TEAM-D-PROBE.json at the wave-1 desk workspace (/tmp/hss-wave1/team-d).*

## D1 — Corpus binding recount (EXECUTED, PASS)
Sealed KV store manifest: 43 chunks, 161,823,299 bytes. Live library's own served
manifest (https://harz-fulltext-core.harz.workers.dev/manifest.json): 43 chunks, ALL
43 seal digests IDENTICAL to the KV manifest, total_docs=21,377, unrecoverable=0,
version sft-v1.0, generated 2026-10-11T23:35:44Z. THE LIBRARY BINDS TO THE SEALED STORE.

## D2 — The kit's four boot pins (EXECUTED, PASS on evidence)
Pin 1: 161.8MB download -> measured 161,823,299 bytes across the 43 chunks. PASS.
Pin 2: 43 chunks -> 43 in both KV and served manifests, seals identical. PASS.
Pin 3: "COMPLETE: 21377 documents stored" -> served manifest total_docs=21,377. PASS.
Pin 4: "all 43 chunks SHA-256 verified" -> full 43/43 KV re-hash Oct 14 (byte-stable
per Team E); fresh worker-endpoint sample: chunk-000 (2,138,750B) and chunk-021
(3,953,120B) fetched from the public endpoint re-hash to their manifest seals exactly.
PASS (endpoint sample + prior full KV re-hash).

## D3 — Text-library preservation (PASS with declared limit)
Store identity verified (D1+D2, sample bytes match seals). The portable JSON export was
browser-verified Oct 12; a full export re-download+re-hash was NOT re-executed desk-side
(142MB cost) — preservation rests on store identity + the Oct 12 verification. DECLARED.

## D4 — Frozen testset identity (NOT REPRODUCED — declared)
No frozen-testset artifact exists in this evidence repo. The testset referenced by the
original Team D mandate presumably lives on the other seat. CANNOT VERIFY what is not
staged. Flagged: the other seat should publish it with the Stage 2 packs (LEDGER-2).

## D5 — Endpoint liveness (EXECUTED, one defect found)
fulltext-core: 200, serves the app + sealed manifest. offline-browser (acct1): 200,
7.8MB shell with embedded 785-page Oct 8 export. knowledge-core: 200 AT
https://harz-knowledge-core.harz.workers.dev — BUT the kit's printed URL
https://harz-kcore.harz.workers.dev IS 404. Kit amended v1.0 -> v1.1 (dated amendment,
original preserved) in anchors/INTERNETLESS-FIELD-TEST-KIT.md.

## D6 — True airplane-mode limitation (DECLARED, NOT FAKED)
Desk tooling cannot disable the network. Everything above proves the online path, the
binding, and the offline-mechanism inputs; the airplane-mode proof itself remains the
owner's 10-minute physical test per the amended kit.

## Verdict
Corpus binding, boot pins, and endpoint liveness VERIFIED on evidence; kit corrected;
one un-staged artifact class declared. Internetless kit is READY for the owner's
physical test using kit v1.1.
