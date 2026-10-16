# WAVE 1 LEDGER-1 INVESTIGATION — THE ACCT3 HUNT-INDEX WRITER (Team F)
*Oct 16, 2026, 04:26Z. Read-only, evidence undisturbed, no writer disabled, no protected
state touched. Per owner ruling: determine authorization, write path, time window;
reconcile against invariants. NO malice inference drawn.*

## Fresh measurements (executed Oct 16 04:26Z)
acct3 harz_search_v02 docs: 87,656 (was 32,036 on Oct 14 06:50Z: +55,620 in ~2 days;
max rowid 88,486, 830-id gap). terms: 216,100. Corpus docs: 1,342,482 (+1,045 since
Oct 14; max id contiguous). acct1 hunt index: 42,622 UNCHANGED.

## Finding 1 — this is a BACKFILL, not new acquisition
MAX(fetched_at) across all 87,656 docs = 2026-10-12T08:38:09Z. NO new network fetches
since Oct 12. fetched_at histogram: Sep 19-20 (3,488+7,726), Oct 7-11 (~8,090),
Oct 12 = 70,852 (the wave-day bulk acquisition). The count grew +55,620 while the
newest fetch stamp stayed Oct 12: rows acquired during the wave were INSERTED into
the hunt index progressively over the last two days, carrying original fetch times.

## Finding 2 — write path identified (code evidence, read-only)
The captured wave-seat fetcher (forensics/wave-fetcher-current.js, program evidence
archive): app "harz-corpus-wave", cadence "every 5 min", "wave: 3h / ~10,800 docs",
ingests doc batches of 100 via an ingest endpoint authenticated with SOVEREIGN_KEY.
Sources in the backfilled population match the Team C knowledge-acquisition lane
exactly: wiktionary-50k-ccby-sa (35,838), devdocs-dom/php/cpp (21,518), openstax
(3,700), medlineplus (2,029), cgspace (newest rows), plus web/TECHNOLOGY/REVISIT.
CLASSIFICATION: the wave ingest path backfilling the hunt INDEX with
already-acquired knowledge-corpus docs.

## Finding 3 — reconciliation against invariants (sample)
50/50 uniform sample of the backfilled population (ids > 32,037) EXISTS in corpus
docs by content_hash — the corpus remains the store of truth; the hunt index is a
snippet-only index over it. The sealed 21,377 chunk-store population is a separate,
byte-stable artifact (43/43 seals verified Oct 14) and is not touched by this
writer. acct1 index untouched. No evidence of corpus rebuild or seal interference.

## Authorization status — UNRESOLVED, one owner answer settles it
The wave was paused by the owner's Oct 12 Hold (32,610 regather frozen; wave-resume
explicitly owner-gated). The desk CANNOT determine from evidence whether the owner
resumed the acquisition/indexing with another seat in the interval. If the owner
resumed it: authorized, ledger closes. If not: a seat continued indexing outside
the pause — owner decision required (halt instruction to that seat vs accept).
The desk recommends: no action until the owner answers; the write is additive
indexing of already-owned content with sample-verified corpus correspondence.

## Deviations/limits (declared)
Correspondence is a 50-doc sample, not the full 55,620. Insert timestamps are not
recorded in the table (no created_at column) — the +55,620 window is bounded by the
desk's own count measurements (Oct 14 06:50Z vs Oct 16 04:26Z), not by row stamps.
Writer-identity attribution is code-and-pattern based, not witnessed live.
