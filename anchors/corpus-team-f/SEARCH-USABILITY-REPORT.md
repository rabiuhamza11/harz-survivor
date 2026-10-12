# TEAM F — Search & Offline Usability Report v1.0
*Measured Oct 12, 2026. Read-only measurements; frozen contracts untouched.*

## The three capabilities, measured (consultant's distinction)

STORED: 21,377 full texts in the SHA-sealed store (sft-v1.0, 43 chunks, 154.3MB raw / 161.8MB encoded)
+ offline browser onefile 785 pages + knowledge-core 5,100 docs (both unchanged, sealed).
SEARCHABLE: 53,987 docs across two live indexes (curated 11,365 / hunt 42,622; frozen contracts).
USABLE: READ FULL leads search results to complete locally-stored text — measured per node below.

## Findings

F1 — COVERAGE BY NODE (first precise split): curated node 10,674/11,365 = 93.9% full-text
coverage; hunt node 10,703/42,622 = 25.1%. The regather (32,610 queued) targets mostly
hunt-index docs — hunt coverage will rise as waves resume.

F2 — MAJOR: HUNT SEARCH LATENCY 6.0-21.5s per query (4-query battery, median ~19s) vs
curated 127-290ms. /stats is fast on both (562ms/288ms) so the slowness is the search join
path at hunt scale (624,630 terms). The engine is a frozen contract — NOT changed. Proposal
staged for the corpus seat + owner: query-plan/index-strategy review for the hunt node.
Real-world impact: usable but painful on 3G; the curated node carries the fast path.

F3 — NO ORPHANS: 300/300 sampled store docs resolve in live indexes (store is index-derived
by construction; verified empirically). The reverse gap (index docs without full text) is
the known 32,610 regather set, frozen behind the wave pause (Oct 9 execute order).

F4 — TOP-5 RESULT FULL-TEXT RATE (search→complete text): curated 2-5/5 per query;
hunt 1-2/5. Consistent with F1 coverage. Honest label kept: full texts are seal-verified
for INTEGRITY, marked NOT VERIFIED FOR RELEVANCE.

F5 — OFFLINE READING MACHINERY verified present and live: fulltext-core PWA
(SW cache, IndexedDB, per-chunk SHA-256 verify before device storage, JSON export),
knowledge-core (proven), onefile browser state. TRUE internet-disabled read/search test
cannot be simulated in the desk's browser tooling — STAGED as the Infinix physical test
(same pending item as prior builds; all prior Infinix-substrate verifications passed).

F6 — INDEX GROWTH: zero this window by design (frozen contracts; regather frozen).
Search behavior preserved — ranking, SELECTs, federation untouched through all Team B work.

## Recommendations (staged, none executed)

1. Corpus seat + owner word: hunt-node latency review (F2).
2. Infinix physical test: offline read/search on fulltext-core (download once, airplane mode).
3. After wave resume: re-measure coverage + latency monthly; coverage target honest at
   regather completion (not a fixed number).
