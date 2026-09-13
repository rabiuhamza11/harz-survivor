# P13 KEY CEREMONY — PRE-REGISTERED PROTOCOL (frozen before execution, Sep 13, 2026)

Owner's word: "Let do it" (Sep 13, ~15:20 WAT). Ceremony OPEN.

## Purpose
Pin the three seat pubkeys into the chain as key_pin seals, activating the v0.9 identity layer:
from the first seal after the pin point, every record / walkout_marker / return seal must carry
sig + sig_by from a pinned seat. Seals start proving WHO sealed them, not just that they are unchanged.

## Roles (same separation that made the reconciliation clean)
- DESK — ceremony executor. Appends the three key_pin seals on Node A, signs subsequent seals with the desk seed. Declares desk pubkey in the ledger BEFORE sealing.
- MAGANI (witness/verifier seat) — declares witness pubkey (done, see ledger), independently verifies every threshold below AFTER the ceremony build. Does not touch Node A.
- OWNER (Rabiu) — generates the owner keypair ON THE INFINIX via node-c-bringup/owner-keygen.js; pastes ONLY the pubkey to Magani; seed never leaves the phone.

## Key custody (absolute)
- All keys are RFC 8032 Ed25519 signing seeds for this protocol ledger. NOT crypto wallets. No funds, no chain, no tokens. The Sep 2 wallet-key ban is about value-bearing keys; these attest authorship only.
- desk seed: desk's substrate secret store, never in repo or source.
- witness seed: Magani platform secret store (.agents/.env), never printed, never in source. PUBLISHED: witness pubkey below.
- owner seed: born and held at $HOME/.harz-owner-key on the Infinix (chmod 600, outside the repo), never sent to any agent, never committed.
- Only pubkeys are public. The pinset is declared in the ledger BEFORE any key_pin seal is appended.

## Declared pubkeys (witness publishes as they arrive; desk seals exactly these)
- witness: 1f4794a432b2a8eac603dce3210c681645c24517015acab427fd8fad690582a6 (Magani seat, declared Sep 13)
- owner: e884828a0bbbfb00cefd5f528cf4f28f04d779734947a5b325e0e566bbe83401 (Rabiu, born on the Infinix via owner-keygen.js, seed at ~/.harz-owner-key on the phone, self-test PASS, declared Sep 13)
- desk: DECLARED — 0de083bc1e25df792ee500c719d2b6e97f5861cd8e4f7311aa3676f07d24bb82 (executed by Magani seat in trust per owner "Go", Sep 13; desk seat rotates via new key_pin on wake — by design)

## Sequence
1. All three pubkeys declared in the ledger (witness + owner first, desk last before sealing).
2. Desk appends exactly three key_pin seals: {actor:"desk"}, {actor:"witness"}, {actor:"owner"} with the declared pubkeys. From firstPinIndex onward the engine enforces signatures on SIGNED_KINDS.
3. Desk performs the first post-pin signed sealed write (record kind, signed by desk) proving enforcement is live.
4. All nodes re-pin: A (ceremony build), B (push), C (owner pull + restart on the phone).
5. Magani runs the pre-registered verification battery below and rules.

## Acceptance thresholds (frozen now, before any build)
- T1 PINSET: chain carries exactly 3 key_pin seals; actors = desk, witness, owner; pubkeys byte-equal the ledger-declared values.
- T2 ENFORCEMENT: verifyChain ok:true on all three substrates at the post-ceremony digest; every post-pin SIGNED_KINDS seal has sig + sig_by in pinset; sig verifies against canonicalSeal.
- T3 REFUSAL: unsigned post-pin record seal → "IDENTITY ACTIVE — missing signature"; forged sig → "SIG INVALID"; non-pinned signer → "UNKNOWN SIGNER". Zero partial effects on refusal.
- T4 VALID: the desk's post-pin signed write is accepted on Node A, digest rolls forward, signature independently re-verified by the witness seat.
- T5 PARITY: all three substrates (Cloudflare, Deno, Infinix) at the same new digest; engine hash unchanged (691fc5d8) unless the ceremony build requires an engine change, in which case the new pin follows the re-pin discipline and the change is diffed publicly first.
- T6 MESH INTACT: P2 receive battery re-runs PASS on the post-ceremony book (receive gate works under identity; mesh_ingest seals unaffected).
- BROWSER: all three nodes browser-rendered with the new digest before any report to the owner.

## Violations
Any seal signed by an undeclared key, any seed in a repo file, any ceremony step out of order → ceremony HALTED, logged to the ledger, owner ruling required.
