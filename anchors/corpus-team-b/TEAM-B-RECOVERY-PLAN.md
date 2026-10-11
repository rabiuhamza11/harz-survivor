# Team B — Full-Text Recovery Plan v1.0 (PROPOSAL — nothing executed)
Date: 2026-10-12 · Desk seat · Owner rulings on record: scale C (Oct 11), HOLD at sovereign 9.5GB cap (Oct 12)

## The object (measured by Team A)
55,291 unique snippet-only records across the search indexes; zero full text in the search layer.
Recovery scope: the two LIVE indexes — hunt (acct1/v0.2, 42,622) + curated (acct3/v0.4, 11,365) = 53,987.
The stale v011 pair (1,409 docs) is EXCLUDED from recovery — dead weight awaiting the owner's archival ruling.

## The recovery source is LOCAL (verified in live worker code)
harz-million-corpus holds FULL inline text for 1,623,831 docs (schema: content_hash, norm_hash,
prefix_hash, url, title, domain, source, language, fetched_at, size, TEXT — confirmed in the INSERT
statement). content_hash carries a UNIQUE constraint (INSERT OR IGNORE dedup depends on it), so point
lookups are index-backed and cheap. Recovery means: match search-index records against this reservoir
by content_hash, lift the full text — no re-download needed for matched docs.

## Procedure (all of it gated — nothing runs on the stressed DB until its active work settles)
1. READINESS GATE: the million-corpus is mid encryption-backup (CPU-limit resets on light probes).
   Phase 1 does not start until that work settles — coordinated via the owner to the corpus seat.
2. PILOT: 500 content_hash point lookups (indexed, ~O(log n) each) against the reservoir.
   Measured: wall-clock, rows read, match rate. GO/NO-GO on the pilot's match rate and CPU behavior.
3. FULL MATCH: 53,987 lookups in 500-doc batches, checkpoint after each (resumable, provable via batch_log).
   Outputs per doc: MATCHED (hash + url) / MISSED.
4. MISSED DOCS: recover via the program's accepted acquisition path — queue source domains through the
   gather-queue → the waves re-gather full pages. No uncontrolled bulk refetch.
5. BACKUP-FIRST, NO REPLACEMENT: the snippet indexes stay untouched. Recovered text lands in a NEW
   full-text store (SHA-sealed chunks, knowledge-core pattern), joined to the index by content_hash at
   serve time. Nothing overwrites anything.
6. VERIFY: per-batch manifest (content_hash recomputed on lift), then a live battery — search a recovered
   doc in the real browser, open its full text, confirm offline readability. Report only after the
   browser pass, per standing law.
7. MANIFEST DELIVERABLE: recovery manifest classifying every doc: recovered-locally / re-gathered /
   unrecoverable (with reason). Honest counts, no rounding up.

## Boundaries
Frozen Internetless foundations untouched. Stale snapshots untouched (owner ruling pending).
The stressed DB is not touched before its active work settles. Nothing is replaced without verification.
