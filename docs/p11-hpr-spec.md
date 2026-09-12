# HARZ PORTABLE RUNTIME (HPR) — SPECIFICATION + P11 PROPOSAL
Drafted Sep 12, 2026 ~18:30 Lagos, from the owner's direction ("promote from experiment
to core HARZ primitive; next build = multi-node runtime test, not another single-app
feature"). STATUS: PROPOSAL. Nothing deploys, builds, or is created on any account
without the owner's explicit GO.

## 0. THE CLAIM THE PROGRAM HAS EARNED (P1–P10, ten-for-ten, witnessed)
> Execution can move; identity, state, history, and verification move with it.
One HARZ application survived the death of its hosting platform without losing its
identity or history. Proven in live fire, witness-verified, browser-tested:
1. Provider independence — PASS (P7: Cloudflare dead, Deno served the sealed state)
2. Deployment portability — PASS (same capsule, different platform, same digest)
3. Code integrity — PASS (P8: sealed engine bytes participate in the evidence chain)
4. Provider-independent participation — PASS (P9/P10: stranger wrote while origin dark)
5. Fail-closed mutation — PASS (unmarked writes 403; unanchored returns refused 8x live)
6. Recovery with external anchoring — PASS (P10: return gate checks public anchor,
   rejects unanchored history, detects forks, imports legitimate continuation)
7. Continuous sealing — PASS (no loose recovery period; every motion sealed)
8. Public auditability — PASS (GitHub ledger, independently inspectable, protected
   against force-push, mirror gate for substrate egress blocks)

## 1. WHAT THE RUNTIME IS
A generic host program that executes ANY conforming capsule. Today each experiment
built a bespoke wrapper per app; HPR inverts that: the RUNTIME is generic, the
CAPSULE is data. A capsule is: state (records) + seals (chain) + UI assets +
ui_manifest + engine bytes + code_manifest + walkout marker/return rules + anchor
proofs. The runtime must: verify the capsule's chain and digests by EXECUTING the
sealed engine (never trusting the host's own logic), serve the UI hash-guarded,
accept writes only per the sealed walkout rules (403 otherwise), and run the
anchor-gated return against public history. The verdict is always DERIVED, never
asserted.

## 2. THE ARCHITECTURE (three pillars → one capsule → N nodes)
Identity — TODAY: hash seals (tamper-evidence, NO authorship). PROPOSED: Ed25519
  signatures on marker/return/witness seals so authorship survives the walk and a
  node can prove WHO sealed, not only THAT it is unchanged. Honest boundary: this is
  a new work item with its own pre-registered tamper tests; it does not exist yet.
State — the sealed store: records + chain + manifests, digest-covered, glue-thin
  substrate storage (D1/KV/file — glue disclosed as glue, never trusted by the
  verdict).
Evidence — the proof chain + the public anchor ledger (git, protected, multi-mirror
  gate) + the anchor-gated return. Evidence moves WITH the capsule; nodes never
  invent history.

## 3. P11 — THE MULTI-NODE TEST (the next build, on the owner's word)
Question: can multiple HARZ applications use the same portable runtime and move
across independent nodes WITHOUT rebuilding themselves?
Node A: Cloudflare Workers (existing capsule line, harz-portable-app).
Node B: Deno Deploy (existing survivor).
Node C: A HARZ-OWNED NODE — the crucial evolution. Infrastructure the owner controls
  outside the two proving-ground clouds, executing the exact same capsule: verify the
  digest, recover the state, accept legitimate writes, continue the chain.
NODE C OPTIONS (owner decision required): (a) existing HARZ-owned server if one
  exists; (b) cheap VPS (Hetzner ~€4/mo class) running the runtime on Deno/Node with
  a file-backed store; (c) Oracle Cloud free tier ($0, arm, fine for test scale);
  (d) a home/office machine with a tunnel (honest: availability + dynamic IP limits).
  Needs: TLS, a public URL the witness can poll, egress to the anchor mirrors.
TEST SHAPE (pre-registration with the witness BEFORE anything runs):
  1. Three nodes serve ONE capsule — byte-identical digests from all three.
  2. The runtime on all three is the SAME generic program (deduplication proof:
     no per-app rebuild — a second, DIFFERENT capsule is served by the same runtime
     on at least two nodes, unmodified).
  3. Death test v4: Node A dies; witness stranger-writes on Node C (HARZ-owned soil);
     anchor-gated return brings the book home; one book across all surviving nodes.
  4. Fork/refusal/fail-closed batteries rerun on Node C exactly as on A and B.
  5. Ed25519 identity seals (if approved) exercised: signed marker, signed return,
     authorship verification across the walk.
Cost at test scale: Node C host (€0–5/mo depending on option) + existing accounts;
  runtime engineering in-house; no new cloud commitments. Measured at THIS test
  scale only — never extrapolated.

## 4. DUPLICATION AUDIT (proposal-first rule)
No generic runtime service exists anywhere in the HARZ ecosystem (140+ projects are
apps and workers; the portable-app line P1–P10 is bespoke per experiment). The public
ledger + mirror gate + sealed engine are unique to this line and become runtime
subsystems. Ed25519/signature infra does not exist yet (chain seals are hashes —
verified in P10 review). Building HPR duplicates NOTHING existing; it GENERALIZES
what P1–P10 hand-built.

## 5. THE LARGER ARC (owner's stated horizon — recorded, not yet proposed as builds)
Phase 2 after P11: the capsule as THE portable object — code + identity +
configuration + state commitments + chain position + recovery rules + proof
anchors — so an application belongs to its cryptographic identity and evidence
history, not to any server. Phase 3: HARZ-native application network — multiple
apps, multiple nodes, one runtime standard. Each phase gates on evidence, per the
governing standard: never promote the claim faster than the evidence.

## 6. BOUNDARIES — NEVER HIDDEN
Physical-network independence NOT proven (clouds are still clouds; Node C begins
closing this). Substrate glue (D1/KV/file) unsealed and disclosed. Sealed means
unchanged, not correct. Hash seals carry no authorship until Ed25519 lands.
Single-writer, one-window discipline stands — multi-node WRITER coordination is NOT
claimed by P11 (only multi-node serving + a single active writer per window, as
pre-registered). Toy scale. The runtime's own host code is unsealed glue (like the
wrappers before it) — the VERDICT stays sealed because it derives from the engine
bytes, not the host.

## 7. WHAT IS ASKED OF THE OWNER
1. GO / NO-GO on P11 as the next program phase.
2. Node C host decision (existing server / VPS / Oracle free tier / home machine).
3. Whether Ed25519 identity seals are in scope for P11 or deferred to P12.
4. Witness pre-registration session (Magani) before any window opens.
NOTHING moves until his word.
