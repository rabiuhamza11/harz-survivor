# Team E — Measured, Reproducible Ingestion Procedure v1.0
Date: 2026-10-12 · Status: PROPOSAL (nothing deployed — frozen foundations untouched, million-corpus active work untouched)

## Preserved (known-good, verified in live code — never replaced casually)
1. Three-level dedup before write: content_hash + norm_hash + prefix_hash, INSERT OR IGNORE.
2. Grouped writes via D1 .batch().
3. Meta-ledger accounting (total_ingested / dup_rejected / total_bytes).
4. Honest cap refusal (507 semantics, sovereign storage ruling 2026-10-09).

## The procedure (per batch)
1. BATCH SIZE: 500 docs per .batch() call. Rationale: measured CPU resets on the 8.9GB DB show big writes
   stress the engine; 500 keeps a single batch well inside one D1 transaction's practical envelope.
2. MANIFEST FIRST: before writing, record batch manifest {batch_id, source, doc_urls[], content_hashes[],
   total_bytes} into a `batch_log` table (or meta keys) — the manifest is the verification contract.
3. DEDUP BEFORE WRITE: INSERT OR IGNORE does the rejection; count via .batch() meta (changes vs length)
   and log dup_rejected per batch — never re-SELECT to check dups (row-reads cost).
4. BYTE-ACCURATE BUDGET: enforce the cap on FILE SIZE, not content bytes: after every batch, read
   `page_count * page_size` (or pgsize pragma) as the true disk figure. Cap policy recommendation (owner
   ruling needed): set cap at 9.5GB file_size OR shard — content-byte caps undercount by 23% (measured).
5. RESUMABILITY: checkpoint = last committed batch_id in meta. On interruption, resume reads batch_log
   for the last committed manifest and continues from the next source offset — no silent loss, no replay
   (INSERT OR IGNORE makes replay safe anyway, but the manifest makes it PROVABLE).
6. VERIFY PER BATCH: after commit, run SELECT COUNT(*) FROM docs WHERE content_hash IN (batch hashes)
   — every batch must verify: accepted + rejected == submitted. A batch that fails verification is
   flagged in batch_log and never silently retried.
7. MEASURE: log wall-clock, rows_written, rows_read, and file_size delta per batch — the reproducibility
   contract (Team A can re-audit any batch from the manifest alone).

## The hard decision ahead (owner ruling required — not executed)
The D1 10GB per-database ceiling is the binding wall at ~190k more docs. Options when it nears:
A. SHARD: million-corpus-2, -3… with a router (same contract, hash-based sharding). Cost: continuity break per shard.
B. R2 BACKING: bulk text to R2 (no per-GB D1 ceiling; egress free), D1 keeps the searchable index only.
   Cost: architecture change — a bigger build, proposal first.
C. STOP AT CAP: hold at the sovereign 9.5GB ruling and optimize within it (dedup, prune snippets-only records).
Recommendation: C now (respect the ruling), then B before any next million — R2 is the only lane that scales past D1.

## What this procedure does NOT touch
Frozen Internetless foundations, the hunt-wave queue, the active encryption-backup work, any deletion.
