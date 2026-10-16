# SECOND-SEAT VERIFICATION — HAUWA'S SEAT REPORTS OF OCT 15 (filed Oct 16, 2026)
*Desk role: second-seat reproduction of the live route per her named acceptance item.
Read-only; evidence undisturbed. Probes preserved: D1-INVENTORY.json, KEEP-STORE-PROBE*.json,
READER-*.json, FX-IDX-PROBE.json (wave-1 desk workspace).*

## VERIFIED EXACT (desk-reproduced against live state)
1. Account shape: acct3 = 47 databases EXACTLY as reported.
2. fx-idx: fx_fts 1,329,429; fx_fts_data 242,656; fx_fts_docsize 1,329,429; fx_fts_idx
   76,088 — ALL FOUR EXACT; runs 393. (The 4.09GB sealed export FILE and its sha256
   08c43550 live on her seat — file itself not inspectable desk-side; DB content verifies.)
3. Keep-store deployment: harz-keep-bodies-00 EXISTS (uuid 57c384bf-73a2-4cf8-b8be-570bd856d21b,
   D1 file_size 118.2MB). Its own meta: format harz-keep-bodies-v2, created 2026-10-15T17:42:32Z,
   bundles 291, docs 29,086, compressed_bytes 82,438,170 (her 82.4MB claim EXACT),
   compression gzip-9, source "evacuation copy sha256 60af0a3d...", built_by "Team F Gate 4
   per owner Path 3 ruling Oct 15", excluded_discrepancies 5, note: v2 fixes SQL-escape
   defect (v1 stored escaped text for 12,134 quoted docs).
4. Preservation: harz-corpus-bodies-db 9.07GB, harz-million-corpus 3.85GB, harz-mine DBs
   present — originals in place, consistent with her preservation claims.
5. Account total: measured NOW 17,734,782,976 bytes (17.73GB decimal) vs her Oct 15
   17,459,892,800 — growth delta, not a discrepancy; consistent with continued live writes.

## COUNT DELTAS — EXPLAINED AND UNEXPLAINED
(a) EXPLAINED: doc_index = 29,086 docs vs her reported 29,091 deployed. The store's own
meta declares 29,086 with excluded_discrepancies=5 — the v2 rebuild (17:42Z, after her
5:50PM report) fixed the SQL-escape defect and excluded the 5 discrepancy docs. 29,091-5
= 29,086 EXACT. Hauwa's reports to the owner should reflect the v2 numbers.
(b) UNEXPLAINED (flagged to Hauwa): bundles table = 2,075 part rows vs her reported
2,070 parts (+5). Meta declares bundles=291 consistent; the +5 part delta is unaccounted.

## NOT REPRODUCED — THE LIVE READER ROUTE (key open item)
Her claim: "The corpus worker is now v0.5.1, wired to the compressed store... every
response declares its source: keep-store, legacy-bodies, or explicit error... tested
live: 30 of 30 keep-source docs hash-matching."
Desk finding: ON THE HARZ ACCOUNT (where the keep-store itself is deployed) THERE IS NO
v0.5.1 READER. harz-million-corpus = version 0.4.0, routes /api/stats, /api/export,
/api/ingest, /api/dupcheck, /health only — NO doc-serving route. harz-fulltext-reader =
the OLD sealed-store reader (404 body: "not covered by this store; 39.6% of live-index
docs" — the Stage 1 sealed population, not the keep-store). harz-fulltext-core = the
internetless library (sftcore-v1.0). harz-reader = an unrelated fetch proxy. harz-store =
commerce (4.3.0). harz-sovereign-storage = 401.
RESOLUTION NEEDED FROM HAUWA'S SEAT: the account, worker name, and route/URL of the
deployed v0.5.1 reader, so the second-seat reproduction can be completed (sample doc
requests verifying source declaration + per-request SHA-256 + hash match). Until then,
"Reader integration DONE and live" remains REPORTED, NOT INDEPENDENTLY REPRODUCED.

## Standing owner decisions (unchanged by this verification)
Retirement gate (originals retire after reader proven) = owner's one go. Infinix physical
tests (volume 1 fail-fast, airplane-mode cold restart) = owner's phone. Post-retirement
account usage = measured at that gate, not projected.
