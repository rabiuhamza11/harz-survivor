# MESH CONVERGENCE TEST v1 — "The Book Walks" (PRE-REGISTERED, FROZEN)

Frozen: 2026-09-13, 13:20 WAT, by Magani, on Rabiu's declared frontier (Sep 13, 13:13 WAT).
Status: PRE-REGISTERED. NO BUILD until Rabiu's explicit GO. Nothing in this document may change after GO without a ledgered amendment.

## Research Question (frozen)

Can the sealed book move from one phone to another phone over a zero-network
optical rail, converge byte-identical, and refuse forks — with no cloud
anywhere in the conversation?

This is the junction of two proven programs:
- HPR portable runtime (sealed engine, capsules, fork refusal — proven v1–v4)
- Mesh optical rail (DPB chunked bundles, hash verify, dedup, tamper reject,
  ACK round-trip — QR engine verified 15/15, sandbox sim T1–T4 passed)

## Design Decisions (frozen BEFORE any build)

1. STATE WALKS, ENGINE IS PINNED. Only the BOOK (records + seals chain export)
   moves between phones. Each phone runs its own HPR core. Before ingest, the
   receiver verifies the sender's engine hash matches its own pinned engine
   (current pin: f69339b6…). The engine never travels over the rail.

2. RAIL: QR optical, screen → camera, reusing the mesh-test PWA engine.
   BLE/APK is named as the v2 full-strength rail — OUT of v1 scope.
   The book export (~31KB capsule; records+seals subset smaller) moves as
   DPB-style chunked bundles: per-chunk sha256, whole-bundle hash, dedup,
   ACK round-trip — same discipline the mesh sim proved.

3. SIGNED STATE: the sender signs the bundle with a device key (Ed25519
   non-extractable pattern, IOC precedent). Unsigned or badly-signed bundles
   are refused before any ingest.

4. INGEST GATE (the new engineering): a sealed "receive" surface in the
   runtime: verify bundle hash → verify signature → recompute the chain from
   received records → compare computed digest against claimed digest →
   accept and seal an ingest record ONLY on byte-identical match. This
   surface is hpr-1.1.0 — a versioned, sealed, pre-registered engine change
   deployed by the normal marker-capsule discipline. The v0.7 engine behavior
   is never modified mid-test; the upgrade happens before P1.

5. FORK DISCIPLINE EXTENDED TO MESH: if the receiver's own book has diverged
   (records the bundle does not contain), the gate displays FORK DETECTED,
   refuses silent merge, and flags for owner ruling — the exact v4 precedent.
   No automatic reconciliation. Ever.

6. ZERO NETWORK: an instrumented counter must read 0 network calls for the
   entire exchange. Airplane mode ON both phones during the field test, on
   film.

## Test Sequence (frozen)

P1 — SANDBOX SIM: both seats in the sandbox, camera channel simulated
     (mesh-test precedent). Proves the protocol code before any phone moves.
P2 — BUILD FREEZE: receive-gate audited (3-level), gate-passed, pushed,
     browser-verified. Engine hash re-pinned in a new marker capsule.
P3 — FIELD TEST: two real phones, airplane mode ON, QR exchange,
     convergence panel PASS, filmed end to end.
P4 — DIVERGENCE DRILL: receiver writes a record FIRST (creating divergence),
     exchange must show FORK DETECTED — no merge, both books unchanged.
P5 — REPORT + LEDGER: closeout, honest labels, pushed to the public anchor.

## Acceptance Thresholds (frozen — all must pass)

T1 CLEAN TRANSFER: both phones compute the identical digest from the
   transferred book; records and seals counts byte-identical.
T2 TAMPER REJECTED: any tampered chunk → hash mismatch caught, zero partial
   ingest.
T3 REPLAY DEDUPED: duplicate/replayed bundle deduped, no double-seal.
T4 FORK DETECTED: divergent receiver → FORK DETECTED displayed, no merge,
   both books unchanged.
T5 ZERO NETWORK: instrumented counter 0 for the whole exchange; airplane
   mode visible on film, both phones.
T6 SIGNATURE ENFORCED: unsigned/missigned bundle refused; signed accepted.

## Honest Labels (frozen)

- This is a ONE-HOP EXCHANGE, not a mesh network. No discovery, no routing,
  no multi-phone relay, no store-and-forward between offline peers. Those are
  named v2 candidates, built only if v1 passes.
- Phone B HARDWARE DEPENDENCY: a second Android device with Chrome + camera
  is required for P3. Not yet confirmed to exist.
- QR light rail only. BLE unproven.
- Single-window Android availability unchanged (battery kills remain).
- Engine does not walk; it is pinned and hash-verified at both ends.
- This does NOT prove an always-on Internet replacement. It proves the
  conversation can happen with no cloud in it, one hop, once, on film.

## Precedents Binding This Test

- v0.6/v4 witness-seat precedent: sealed engine bytes may execute rails the
  substrate blocks, with owner GO on record.
- v4 fork ruling: forks are archived, never silently reconciled.
- ECP-1 reconciliation rules: partition, quarantine, conserved sums.
- Yaya's research rules: no rushing, pre-registered thresholds, audit-first,
  check for duplicates, honest boundaries on every claim.
