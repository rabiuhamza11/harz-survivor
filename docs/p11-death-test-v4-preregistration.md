# P11 DEATH TEST v4 — WITNESS PRE-REGISTRATION (FROZEN)
Frozen 2026-09-12, 19:20 WAT by Magani (witness). This sequence is registered
BEFORE any window opens. It does not run until the owner rules on the Node C
host and gives the explicit GO. Nothing here deploys, kills, or writes anything.

## QUESTION
Can the book die on Node A, take a stranger's write on HARZ-owned soil (Node C),
and come home through the anchor-gated return — one book, one history, three nodes?

## PRECONDITIONS (all must hold before the window opens)
P1. Three nodes serve ONE capsule byte-identical: Node A (Cloudflare),
    Node B (Deno), Node C (owner-ruled host). Frozen digests recorded pre-window.
P2. The runtime on all three is the same unmodified core (hpr-1.0.0, engine f69339b6).
P3. Both other capsules (book + registry) verify on all serving nodes.
P4. Public anchor ledger reachable and current from Node C (egress verified).

## FROZEN SEQUENCE (numbered, in order, no steps added mid-test)
S1. Baseline: three-node digest parity recorded (API + browser on each public URL).
S2. Node A dies (route-disable, same as P7/P10). Death verified 404/1042.
S3. Walkout marker opens on Node C (sealed engine seals it; marker digest recorded).
S4. Stranger (witness) writes on Node C via the public URL — browser-verified
    render of the new record WHILE the origin is dead.
S5. Tamper attempts on Node C (overwrite, XSS payload) — engine must reject and
    retain as labeled evidence, exactly as P9/P10 behavior.
S6. Witness anchors the Node C history to the public ledger (commit + push).
S7. Node A revives to its pre-death state (digest = S1 baseline).
S8. Anchor-gated return on Node A: unanchored history REFUSED, fork detected
    and rejected, legitimate continuation ingested byte-exact.
S9. Walkout closes; writes re-seal at 403 on all nodes.
S10. Node B rebuilt to the final digest; three-node parity re-verified.
S11. Full refusal/fork/fail-closed battery re-run on Node C (as on A and B).
S12. Closeout report ONLY after browser tests on every user-facing surface.

## ACCEPTANCE (frozen thresholds — no renegotiation mid-test)
A1. Every digest at every step equals the value computed BEFORE the step ran.
A2. Zero unanchored history accepted. Zero forks accepted. Zero deletions.
A3. Stranger's write visible in a real browser during the origin's death.
A4. Final digest identical on all three nodes, browser-verified on each.
A5. Any deviation from this sequence = the test STOPS and the deviation is
    reported honestly. No silent improvisation, ever.

## HONEST BOUNDARIES
B1. If Node C is rented, the soil label is rented — no sovereignty claim.
B2. Single-writer, one-window discipline stands (multi-node writer coordination
   is NOT claimed by this test).
B3. Ed25519 identity seals are OUT of this test's scope unless the owner rules
   them in beforehand (they would add signed-authorship checks at S3/S4/S8).
B4. Toy scale. Results measured at this scale only.

## OPEN (owner decisions — none of this moves without his word)
O1. Node C host: existing server / VPS (~€4/mo) / Oracle Cloud free tier ($0) /
    home machine with tunnel. Each carries its own honest availability limits.
O2. Ed25519 seals in P11 scope, or deferred to P12.
O3. The GO itself.
