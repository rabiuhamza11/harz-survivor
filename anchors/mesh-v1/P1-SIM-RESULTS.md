# P1 SANDBOX SIM — RESULTS (2026-09-13, ~13:45 WAT)

Sim: mesh-v1/p1-sim/p1-sim.mjs (in conversation workspace; protocol code proven here,
sealed into hpr-1.1.0 at P2). Both seats simulated, optical channel simulated with
REAL failure injection (shuffle, 4% scan failure, duplicates, tamper). Seeded RNG —
reproducible run after run. Reproducible command: `node mesh-v1/p1-sim/p1-sim.mjs`.

Book under test: capsule v10-returned — 17 records, 33 seals, digest 8fbaa547,
engine pin f69339b6 (both seats hold the same capsule; engine never travels).

## THRESHOLD RESULTS — 6/6 PASS

T1 CLEAN TRANSFER — PASS. 62 frames, shuffled, 7 scan failures across passes
   (recovered by the retry loop, per the real mesh-test finding), dup frames
   deduped. Ed25519 signature VALID, payload hash MATCH, engine pin MATCH
   f69339b6, fork check clean, UI manifest identical to local sealed capsule.
   SEALED ENGINE verifyExport (executed from capsule bytes, new Function —
   same discipline as the core): CAPSULE INTACT. Digest byte-identical
   8fbaa547264d07f0 — records 17, seals 33. CONVERGED.

T2 TAMPER REJECTED — PASS, both flavors. (a) unscannable frame: no bundle
   ever assembled, zero partial ingest. (b) valid frames, altered payload:
   caught, REFUSED, zero partial ingest.

T3 REPLAY DEDUPED — PASS. Whole bundle delivered twice: second pass DEDUPED
   by bundle id, no double-seal, ingested count stays 1.

T4 FORK DETECTED — PASS. Receiver held a local overlay record (id 18 — a
   write from a past death window, pending its own return). Received book
   (17 records) does not contain it: FORK DETECTED, NO SILENT MERGE, both
   books unchanged, owner ruling required. The v4 crown-jewel discipline
   extended to the mesh rail.

T5 ZERO NETWORK — PASS. Instrumented fetch tripwire: 0 network calls for the
   entire sim. (Field test T5 will be airplane mode on film.)

T6 SIGNATURE ENFORCED — PASS. Unsigned bundle refused; forged signature
   refused; valid Ed25519 signature accepted.

## HONEST LABELS

- Camera channel SIMULATED (channel logic only). The QR encode/decode rail is
  proven separately (mesh-test program, 15/15 vs independent decoder). The
  physical screen→camera exchange is P3, on two real phones, on film.
- The receive gate here is PROTOCOL CODE executing the sealed engine's
  verifyExport; it is not yet the sealed hpr-1.1.0 surface (that is P2).
- Divergence drill injected at the store level (disclosed unsealed glue) —
  honest simulation of an overlay record written in a past death window.
- One-hop exchange. No discovery, no routing, no BLE. Pre-reg labels unchanged.
