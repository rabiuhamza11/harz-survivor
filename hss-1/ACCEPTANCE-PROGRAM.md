# HSS-1 ACCEPTANCE PROGRAM v1.0 (Team F)
*Oct 13, 2026. Adapted verbatim from the owner's 12-test table (charter §5). No HSS
implementation is accepted without passing the applicable battery. Receipts = test logs,
hashes, recovery records, independent re-verification results — retained in the repo.

Each test: procedure at toy/pilot scale, required result, gate stage.*

T1 WRITE INTEGRITY — write N docs, read back every byte, recompute every digest.
PASS: 100% byte-identical, digests match, ack states = STORED truthfully.
Gate: toy + every stage.

T2 RESTART RECOVERY — kill the store between writes (process restart; power-loss
simulation at pilot = kill mid-ingest), restart, reconcile.
PASS: no acknowledged write lost; no partial write reported as stored; torn tail
identified and repaired or explicitly refused. Gate: toy + every stage.

T3 INTERRUPTED INGESTION — abort ingest batches at random points (25/50/75%), resume.
PASS: no silent loss, no duplication (identity dedup holds), resume continues from
verified prefix. Gate: toy + Stage 1/2.

T4 DEDUPLICATION — ingest X docs containing known identical content (measured real
rate: 22.9%).
PASS: single payload per hash; counters reconcile with ingest log. Gate: toy + Stage 1.

T5 NODE FAILURE — with content replicated across >= 2 failure domains, remove one node's
copy, request content.
PASS: served from surviving replica; missing-replica alarm raised; re-replication restores
target count. Gate: pilot (Stage 2) onward.

T6 CORRUPTION DETECTION — flip bytes in stored content (and in an index), request it.
PASS: digest mismatch detected, content refused, VERIFIED state revoked honestly, alarm.
Gate: toy + every stage.

T7 INDEX RECONSTRUCTION — destroy the search index completely, rebuild from
authoritative content only.
PASS: search results identical to pre-destruction receipt; corpus untouched. Gate: Stage 2.

T8 EXPANSION — add a new storage node/backend mid-operation.
PASS: identities unchanged, placement updates, no downtime of reads; new node accepts
writes per policy. Gate: Stage 3.

T9 NETWORK PARTITION — take a node offline, continue writes elsewhere, reconnect.
PASS: offline node resyncs safely (no forked truth, no silent overwrite); divergence
reported, reconciliation verified. Gate: Stage 3.

T10 PROVIDER INDEPENDENCE — full export from backend A, restore on backend B
(the promotion gate, run as a test).
PASS: document identity unchanged, digests bit-identical, search serves from new
backend. Receipts retained per rung promotion. Gate: every backend change, mandated.

T11 CAPACITY ACCOUNTING — report usable, overhead, remaining.
PASS: reported figures reconcile with measured reality to within 1%; refusals when
full (the corpus's own honest-507 refusal is the precedent). Includes the audit
item from Team C: explain file-vs-live slack before Stage 2. Gate: Stage 1 onward.

T12 SCALE TESTING — at 1M / 10M / 100M / 1B: ingestion rate, storage cost, search
latency (p50/p95), recovery time.
PASS: declared only when the target stage's numbers are measured and receipts retained.
A milestone is NEVER declared from extrapolation. Gate: each milestone stage.

## Independence rule
Team F re-runs each battery on live deployed bytes independently of the builder's
claims, browser-verifying any user-facing surface before any report leaves the desk
(ecosystem standing rule).
