# R8 LIVE MERGE FIELD TEST — WITNESS CARD (pre-registered Oct 1, 2026, before any window)

Owner word: "Magani will witness it" (Oct 1, 2026, 18:29 Lagos), following the desk's Option-A proposal (two live books, both accepting real writes, then merge + adopt). Witness: MAGANI. Nothing below starts until the witness holds this card and confirms his seat ready; the desk never opens a window without the witness watching.

## Roles (unchanged law)
- Desk (Elio): builds, batteries, executes the window, writes glue, reports honestly.
- Witness (Magani): outside the desk; polls, recomputes, seals his own verdict. Cannot be asked to fix anything mid-test.
- Owner: his word opens the window; his hand may write Node C's divergence record.

## The book at T0
Base: capsule v15 — 18 records / 44 seals at bf4681b5… on all soils. If any soil differs at T0, the window does not open.

## Phase 0 — T-minus (no book changes; every item battery-tested before the window)
1. PRE-REGISTRATION FINDING (honest): the runtime write rail (core /api/record) does not pass a signing key, so on the identity-active book it refuses with "IDENTITY ACTIVE — sealed write requires a signing key". The P11 hand-write predates the P12 signature law. FIX: glue-only upgrade — the write rail reads the node's vaulted seed and passes signingKeyHex into the sealed appendWithSeal call. The sealed engine bytes are UNTOUCHED (pin 434c41d2 stays); the seed passes from the node's local vault by glue (P12 custody rule: seeds never in sealed bytes, repo, or chat).
2. Key custody for this test: B's write is signed by the DESK key (seed vaulted at the desk, passed by glue into B's runtime environment). C's write is signed by the OWNER key (seed lives at ~/.harz-owner-key on HIS phone, never shared with anyone including the desk). Both pubkeys are pinned in the book.
3. Dated boundary amendment (2026-10-01) published BEFORE the window on Node A: adoption procedure (merged book written into D1 by desk glue — the return-gate insert precedent — then verify-sealed; glue unsealed and disclosed), write-rail key custody, merge_receipt seals unsigned by design (the two sides' signatures carry authorship; the receipt is provenance evidence, like mesh_ingest).
4. Batteries pre-registered: (a) unsigned write attempt REFUSED; (b) signed write accepted, verifies, sig checks against pinned pubkey; (c) wrong-key write REFUSED (UNKNOWN SIGNER); (d) marker seal refused without sig. All green before the window, on both writing soils.

## Phase 1 — divergence (both books LIVE, no kill, no route-disable)
1. Node B: desk seals a walkout marker on B's overlay (signed by desk key), then ONE real sealed write through the public rail, body pre-registered: "R8 divergence write from the Deno soil — one book, one history". Signed by desk key.
2. Node C: owner's hand (or owner-approved trigger) — walkout marker, then ONE real sealed write through the phone rail, body pre-registered: "Harz — one book, three soils, R8". Signed by owner key, on the owner's soil.
3. Node A: UNCHANGED. A is the source by architecture — its write path refuses by design. The two live writing books are B and C; A is the merge and adoption seat. All three books stay serving throughout.
4. Result: B and C each 19 records / 46 seals, digests D_B and D_C, both diverged from bf4681b5.

## Phase 2 — merge (computed at A's rail; deterministic, so any seat agrees)
1. A's rail: merge(A-local, B-export) → VERIFIED. M1 = one book with B's write + merge receipt preserving B's tail verbatim.
2. A's rail: merge(M1, C-export) → VERIFIED. M2 = one book with both writes + two receipts.
3. LIVE DETERMINISM CHECK (replaces pre-computed digests, honestly: created timestamps are window-real, so digests cannot be sealed ahead): desk AND witness independently recompute M1 and M2 digests from the live tails with the sealed engine. Byte-agreement is REQUIRED before adoption. The witness additionally runs merge(B, C) in his own sandbox in both call orders — identical book required both ways.

## Phase 3 — adoption (the first in program history)
1. Pre-adoption D1 snapshot exported and committed as evidence (honest label, revert path).
2. Desk writes M2 into A's D1 (records + seals + signatures, return-gate insert pattern). Verify INTACT at D_M2. Browser test. Witness polls through it.
3. Refusal probes post-adoption: tampered remote through the rail REFUSED; re-merge of an already-merged pair returns the recorded no-op (exactly-once at book level).

## Phase 4 — parity (the P14 pattern)
Capsule v16 = M2 frozen from A's export; pushed; B rebuilds (stale overlay disclosed as ingested, never deleted); C lands by owner pull. Three soils, one book, at D_M2. Ledger anchored.

## Witness checks (verdict PASS requires all)
1. T0 equality on all three soils at bf4681b5.
2. Both divergence writes signed by pinned keys, sigs verified; unsigned/wrong-key refusals byte-exact.
3. Both merges VERIFIED; receipts preserve both sides' tails verbatim.
4. Desk/witness M1 and M2 digest agreement byte-exact; witness's own both-orders merge identical.
5. Adoption verified INTACT at D_M2; book renders full history in browser.
6. Refusal probes and exactly-once replay behave as pre-registered.
7. Three-soil parity at D_M2 after Phase 4.
8. No book state changed on A before Phase 3, and nothing outside this card changed anywhere.

## Limits (restated, unchanged, never softened)
Adoption, marker, overlay and write-rail glue are unsealed (disclosed; verify-sealed after). Marker provenance is trusted-from-the-kill-route, not unforgeable. A lockstep rewrite of BOTH divergent sides still merges VERIFIED — the unsolved hash-chain limit; the public git ledger is the standing mitigation. Single-writer per book maintained. Test scale, not a product.

## Revert path
Pre-adoption D1 snapshot + git capsule v15 restore, on owner word, honestly labeled.

## Cost
$0 measured at this test scale.

## ADDENDUM 1 — Phase-0 check findings (Oct 1, 2026, desk, sealed before the window)
1. HONEST GAP (pre-registered finding, extended): the HPR core has NO walkout/prepare route and passes no signing key, so the runtime write path cannot carry a first-party signed write on ANY node today (identity-active refusal); Node A refuses by source design. The write-rail signing upgrade remains an open engineering obligation, deferred on owner word — never hidden.
2. CONSEQUENCE: Phase 1 divergence moves go through the SEALED RECEIVE GATES (proven rails, signature-checked, engine-pinned). No engine or core changes anywhere for this window — pin 434c41d2 unchanged on all soils. B and C each adopt one bundle whose record seal AND transport sig are made by the OWNER key born on the owner's phone (P13 custody: seed never leaves that device; the desk holds no book seed and needs none — desk key 0de083bc executes at the witness seat in trust per the P13 protocol, desk rotates via new key_pin on wake, by design).
3. SEQUENTIAL MERGE COMPOSITION: merge(A,B) then merge(M1,C) yields M2 with ONE merge_receipt in-chain; the first receipt and both sides' tail seals are preserved VERBATIM inside receipt payloads (evidence, not re-chained). One canonical chain, no base duplication. The window sequence (B first, C second) is fixed by this card; each merge is order-symmetric per pair (proven in the merge battery).
4. TRANSPORT LAYER (disclosed design, asserted in battery): the receive gate accepts any VALID Ed25519 bundle signature — bundle keys are authorship-OPEN by design; the CONTENT seals (record sigs by pinned keys) are what prove authorship. Battery R8-4 asserts the behavior; R8-5 proves the content layer refuses non-pinned authors.
5. BATTERY r8-battery.mjs 12/12 PASS: pinned signers (0de083bc/1f4794a4/e884828a), signed bundle ADOPTED via sealed gate, unsigned REFUSED zero-ingest, tampered payload REFUSED, fresh transport key accepted BY DESIGN, non-pinned record author REFUSED, fork REFUSED, both soils diverge, both merges VERIFIED with both pre-registered writes present, exactly-once replay no-op, tampered base through merge REFUSED.
6. DESK HARNESS BUG, found and fixed honestly: the battery's tamper probe once mutated a shared object reference, poisoning books derived after it (merge correctly refused the poisoned book with UNRESOLVED no-common-ancestor — the engine caught it); the harness now deep-copies bundle payloads. The engine refused the tampered bundle correctly both before and after the fix.
7. WINDOW still opens ONLY on: owner word + witness seat ready + all three soils verified at bf4681b5.
