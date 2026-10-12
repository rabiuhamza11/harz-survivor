# CORPUS DEAD-WEIGHT ARCHIVAL — Proposal for owner ruling
*Desk audit Oct 12, 2026. NOTHING deleted. Audit-before-delete law held.*

## Items for the ruling (corpus scope, all measured)

1. harz_search_v011 (acct1 D1, 10.2MB, 1,409 docs) — stale Oct-6 snapshot, superseded by
   v02 (42,622 docs). Options: archive-export then delete, or delete outright.
2. harz_search (acct1 D1, 12.6MB) — the FTS5 mirror, dead weight per Team A (v02 terms
   engine superseded it). Same options.
3. records-archive — program files, not knowledge (Team A finding). Options: move to a
   program-assets location or leave; it is not corpus and never was.
4. wiki KV (acct1) — empty namespace. Harmless; leave or reclaim.
5. onefile label mismatch (inner label v0.3 vs meta v0.6) — cosmetic; a one-line onefile
   build note to the wave seat, no data change.

## Investigated and EXCLUDED from corpus cleanup (important)

The six harz-mine* databases on acct3 (~2.9GB total) were probed for this ruling and
identified as LIVE HARZ-Chain crypto data (chain_blocks, chain_wallets; the original
harz-mine carries 24 production tables incl. paystack_payments, stake_positions,
escrow_holds, bridge_transfers). They are the crypto lane, not corpus — no corpus action.
Noted for the crypto stack lane instead: mine-2/3/5/6/7 look like partial chain snapshots
(only 3 tables each; mine-4 absent) — owner may want the crypto seat to confirm which
snapshots are still needed. This near-miss is on record: the audit-before-delete rule
prevented proposing live chain data as dead weight.

## Storage honesty

Items 1-2 free only 22.8MB — this ruling is hygiene, not capacity relief. The real
capacity question remains the million-corpus D1 hold (owner ruling stands) and
the catalog-vs-R2 decision (Team C).
