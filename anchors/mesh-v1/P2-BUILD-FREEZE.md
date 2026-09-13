# P2 — BUILD FREEZE RESULTS (2026-09-13, ~14:15 WAT)

## What was built (pre-registered surface, owner GO on record)

1. ENGINE hpr-1.1.0 — the sealed engine v1.0.0 bytes UNTOUCHED (append-only diff):
   one new surface `receiveBundle` + its `canonical` helper. Pure, deterministic:
   all inputs explicit, no clock, no randomness. Verdicts: REFUSED (sig / payload
   hash / engine pin / UI manifest / verifyExport / digest claim — always
   zero_ingest), FORK DETECTED (local chain not a strict canonical prefix of the
   received chain AND local records not contained byte-identical — no silent
   merge, both books unchanged, owner ruling required), CONVERGED (equal books,
   nothing written), ADOPTED (local chain strict prefix — received book ingested
   and the event SEALED as a mesh_ingest seal; digest rolls forward at the
   receiving seat; one book, one history).
   FULL PIN: 10d6bd5abeb02a1529de6c67a682154f94f46fee6601468eb8f47908f77d5136
   (the intermediate build labels f791cd14 / 223f1d0b are build history, superseded
   by the final fork-check hardening — the live pin is the one above, verified
   byte-identical local vs live Node B).

2. CAPSULE v11-RECEIVE — the death test v4 returned book (17 records, 33 seals)
   UNCHANGED plus code_pin seal #34 pinning the hpr-1.1.0 engine.
   Digest: ac49a7e0407be9fbf1140d00f3042e2978ad6270506733ff5e635c0677d31ca4
   Self-verified by engine v1.1.0 verifyExport AND by engine v1.0.0 (the re-pin
   window cannot break parity: every node computes the new digest consistently).

3. CORE — unsealed glue (disclosed): backward-compatible loader + route
   POST /api/mesh/receive (parses, calls the SEALED gate, persists ADOPTED
   deltas into the overlay store — the same store stranger writes use; a
   pre-gate node refuses gracefully with a re-pin instruction).

## P2 BATTERY — 7/7 PASS through the REAL sealed surface

T1a CONVERGED (equal books, digest ac49a7e0 byte-identical, nothing written)
T1b ADOPTED (behind receiver ingests the walked book; ingest sealed; receiver
    verify ok at 18 records / 36 seals — the book walked IN for the first time
    through the sealed gate)
T2 tampered payload REFUSED, zero partial ingest
T3 replayed bundle — no state change, no double-seal
T4 divergent receiver -> FORK DETECTED, no silent merge, both books unchanged
T5 zero network calls (instrumented tripwire)
T6 unsigned refused, forged refused, valid accepted
T7 (bonus, beyond pre-reg) stale-stack node (v1.0.0) cannot receive: refused
    with re-pin instruction, zero ingest

## LIVE STATE (browser-verified before reporting)

- Node B (Deno, git-linked deploy): LIVE at digest ac49a7e0407be9fb — 17
  records, 34 seals, ui SEALED, code SEALED, writes SEALED; full book rendered
  in real browser; refusal probes live (403 unsigned / 400 bad json).
- Registry (capsule 2, same core): INTACT 7 records / 9 seals, digest
  935ae8cb — backward compatibility confirmed live.
- Node C (phone): repo re-pinned; moves on `git pull` + restart (owner action).
- Node A (Cloudflare): re-pin PENDING — its wrapper is the pre-core v0.7.0
  build with D1 discipline; per the audit-first standing order it gets its own
  deep audit before redeploy (two parallel engine tracks also exist now: the
  desk's P12 identity layer anchored 12:39Z — anchor-only commits, no conflict,
  but the tracks must be reconciled into one canonical engine lineage).

## HONEST LABELS (unchanged plus these)

- The receive gate ran in sandbox + Node B only; no physical phone-to-phone
  exchange has happened yet (that is P3, two real phones, airplane mode, film).
- Adoption (T1b) leaves the receiver AHEAD of the sender — convergence to a
  single book across a real pair is eventual, by pull-back, not automatic.
- Engine v1.1.0 supersedes v1.0.0 pins; nodes running v1.0.0 compute the new
  capsule's digest but cannot receive books until re-pinned.
