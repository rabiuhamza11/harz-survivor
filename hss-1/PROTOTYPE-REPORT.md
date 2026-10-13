# HSS-1 TEAM B PROTOTYPE REPORT v1.0 — RULING 001 GATE SUBMISSION
*Oct 13, 2026. Sandbox-only (owner's ruling): no production deployment, no account
changes, no frozen-component touches, existing 21,377 verified docs untouched
(read-only seed fetch only). Exact commit: see ledger entry for this anchor.*

## 1. What was built
A file-backed implementation of the frozen HSS-1 architecture spec (prototype/engine/):
content-addressed identity (sha256(content), refusal if a claimed hash mismatches),
dedup BEFORE payload commit, verify-before-ack read-back on every replica, WAL journal
with torn-tail recovery and honest unacked-adoption, STORED/SEARCHABLE/VERIFIED states,
two failure-domain replicas with degraded-mode writes, export/import, seal-chain
attestation, honest capacity accounting with 507-style refusal, metadata-only records
that can never be STORED.

## 2. Seed
2,000 REAL documents read-only from the corpus bodies DB (not synthetic), ingested
with their production content hashes — every put verified the hash against recomputed
sha256 of the text (T1: 2,000/2,000 match).

## 3. Acceptance results — all executed, receipts in prototype/receipts/
T1 write integrity PASS (2,000 read-backs, 0 mismatches, 38 docs/s)
T2 restart recovery PASS (SIGKILL mid-write; 310 acked = 310 STORED, 0 lost, 0 orphan tmps)
T2b torn-window adoption PASS (5 deterministic crashes between commit and manifest;
5 adopted by recovery, all digest-verified after adoption)
T3 interrupted ingestion PASS (5 killed rounds: 648 stored mid-kills, 648 deduped on
resume, 1,400 objects final, 0 lost)
T4 deduplication PASS (2,000 re-ingests = 2,000 dups, 0 new payloads, 2,000 objects)
T5 node failure PASS (object deleted from nodeA, served from nodeB, digest verified,
restored from replica)
T6 corruption detection PASS (bit flip detected, honest refusal with actual digest
shown, restore verified)
T7 index reconstruction PASS (index destroyed, 54,301 terms rebuilt from content,
results identical, corpus untouched)
T8 expansion PASS (3rd backend added mid-operation, 100 writes placed, identities unchanged)
T9 network partition PASS (nodeB offline: 100/100 served during partition, degraded
writes, 100 resynced on return, 0 forks, both nodes consistent)
T10 provider independence PASS (300-doc export, digest 3c4eb9b8…e51966e4, import to
fresh store, byte parity 300/300)
T11 capacity accounting PASS (2 MB quota: 120 accepted, 1,880 honest 507 refusals,
remaining >= 0 — the battery caught the gate undercounting replica+journal cost and
the engine was fixed before this pass)
T12 scale measurement PASS at TOY scale only: 36.3 docs/s ingest, p50 133 ms / p95
255 ms search on 2,000 docs. NOT extrapolated. Measured bytes/doc with 2-replica
overhead: ~36.8 KB (vs ~5.8 KB raw payload) — the real overhead multiple at this
scale is ~6.3x, which the owner's 20-40 TB planning estimate must absorb as a
MEASURED input at Stage 1, not an assumption.
Ruling-8 metadata-only safety PASS (metadata record never conflated with STORED).

## 4. Team F independent verification — PASS 7/7 (receipts/F-independent-verification.json)
Python re-hashed all 2,000 objects (0 mismatches), STORED-vs-disk parity (0 missing),
seal chain recomputed 100/100, export digest independently recomputed (match),
export-to-restore byte parity 300/300, capacity walk vs engine report (delta 0 bytes),
post-kill journal/manifest truth (310 = 310, 0 corrupt).

## 5. Limitations and tests NOT yet performed (Ruling 001 §5 item 7)
1. Toy scale only: 2,000 real docs. No scale claim is made.
2. Backend is a local filesystem emulating the Store contract — no KV/R2/Ceph adapters
   built yet; the promotion gate (T10 as a real backend move) is not yet exercised.
3. Witness is a local seal chain, not the live cross-failure-domain witness mesh.
4. No concurrency model (single-process); parallel writers untested.
5. No encryption at rest; license_policy recorded but unenforced.
6. Node failure/partition simulated by directory operations, not real networks.
7. T12 numbers are single-sandbox measurements, not a deployment spec.
8. The 107,187 counter gap remains explicitly unresolved (see CORPUS-RECONCILIATION.md §3).
9. Team F rerun was on the same machine, different substrate; a second-seat rerun is open.

## 6. Boundary
This prototype makes no production claim. Production acceptance remains withheld
per Ruling 001. Next gate decision belongs to the owner.
