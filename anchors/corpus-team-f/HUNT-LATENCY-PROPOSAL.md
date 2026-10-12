# HUNT NODE LATENCY REVIEW — Proposal for corpus seat + owner word
*Desk analysis Oct 12, 2026. Frozen search contract v0.2 untouched; zero changes made.*

## Root cause (code-audited, evidence in SEARCH-USABILITY-REPORT F2)

The frozen engine serves BM25 by fetching FULL postings strings per query term:
`SELECT term, df, docs FROM terms WHERE term IN (...)`, then JS-parses every
"id:tf:len" posting. On the hunt index (42,622 docs / 624,630 terms, NG-press-heavy),
common tokens ("nigeria", "public", "health") carry thousands of postings each, so a
single query parses multi-megabyte strings: measured 6.0-21.5s. The curated node
(11,365 docs) parses 10-20x smaller strings: 127-290ms.

## Strategic implication (proactive)

Latency scales with corpus size. The 32,610-doc regather (queued, frozen behind the
wave pause) will grow the hunt index materially and make the same queries slower.
The latency question is therefore not cosmetic — it compounds exactly when the
regather lands.

## Options (none executed)

A. ACCEPT + honest UI label ("this node is deep-scan; curated node is the fast path").
   Zero cost, zero contract change.
B. KV result-cache for repeated queries. Cheap; only helps repeats; contract intact.
C. Engine v0.3: SQL-side inverted index (per-(term,doc) rows, LIMIT early, rank in SQL).
   True fix (sub-second at 100k+ docs) but a NEW FROZEN CONTRACT — full re-verification,
   browser battery, boundary amendment, both nodes. Significant motion.
D. Do nothing now; re-measure after regather; move if it crosses a pain threshold.

## Desk recommendation

A+B immediately (free, honest), C staged for owner+corpus-seat ruling with a trigger:
if post-regather hunt latency exceeds ~30s median on common queries, v0.3 becomes
necessary rather than optional.
