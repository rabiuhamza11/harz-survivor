# Adapters — mapping each product onto the canonical engine

The audit (Oct 1, 2026) found five separate hash-chain implementations sharing
one idea. The consolidation does NOT merge products; it makes ONE engine the
source of the verification primitive each product executes.

1. HPR (survivor runtime) — already the canonical engine v0.9. Source. No change.

2. HARZ Trust Fabric v0.1.0 (harz-trust-fabric) — same pattern as the Nation
   (records sealed into a hash chain, external anchor on a second account).
   Adapter: swap its internal chain-verify code for the canonical engine's
   verify/seal primitives; its D1 schema, org/API-key model, and proof-packet
   routes unchanged. Its public digests will NOT change (canonical hashing is
   identical); only the verifying code path consolidates.

3. HARZ Witness Mesh v0.2.0 (harz-witness-mesh) — chain-tip attestations.
   Adapter: the mesh chain append/verify becomes engine calls; attestation
   format and divergences logic unchanged. Base44 third-domain witness poll
   unaffected.

4. HARZ Nation Anchor v1.0.0 (harz-nation-anchor) — external witness chain.
   Adapter: same class as Trust Fabric. Smallest system, easiest first migration.

5. HARZ ROOT v3.1 (harz-root + root-b + mirrors + receiver) — identity
   completed Oct 1, 2026 (zone height 2, ROOT-CANONICAL, boundary v3.1).
   Adapter: ROOT is a signed-book protocol, not a chain — it takes the
   canonicalization + Ed25519 verify discipline (already byte-equivalent);
   its authority key lives in the desk vault per the boundary. Optional:
   adopt the engine's canonicalize verbatim in the next zone build.

Order proposed in MIGRATION.md: Nation Anchor (smallest) -> Trust Fabric ->
Witness Mesh -> ROOT. Each migration = one owner word, one deploy, one battery.
