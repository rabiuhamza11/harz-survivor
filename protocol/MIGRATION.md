# Migration plan — one engine, four adoptions

Standing rules: propose before any deployment; audit before any change;
NEVER HIDE THE BOUNDARY; browser-test before reporting; no migration without
the owner's explicit word per product.

Phase 0 (done Oct 1, 2026): canonical engine staged in protocol/, hash-pinned
691fc5d846a2ba66…, anchored in the ledger. Book unchanged (18/43 at 49b7cf42).
Phase 1 — Nation Anchor (smallest, single chain, no customers): swap chain
verify for canonical engine primitives; battery: anchors verify byte-exact,
export/health unchanged; boundary amendment dated; deploy on owner word.

Phase 2 — Trust Fabric (live orgs, API keys — highest care): engine-verify
adoption with a staging window; proof packets (/api/proof/{org}/{record}) must
verify byte-exact before and after; boundary amendment; owner word required.

Phase 3 — Witness Mesh (multi-party, has Base44 witness): engine adoption in
mesh chain; tip continuity across the migration must hold (no divergence
introduced); Amendment to the mesh boundary; owner word.

Phase 4 — ROOT (stateless signed book): optional canonicalize/digest
unification in the next zone build; no chain migration needed; owner word.

Cost at each phase: $0 (same accounts, code swaps). Risk control: byte-exact
verification batteries before and after each migration; per-product rollback
= redeploy prior build.
