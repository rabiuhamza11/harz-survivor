# R8 AMENDMENT 2 — OWNER KEY REPIN (dated 2026-10-03, drafted by the desk, published BEFORE any execution; nothing below runs without owner word + witness seat confirmation)

## What happened (disclosed, honest)
On Oct 3, 2026 the owner reinstalled Termux on the Node C phone (Infinix). The fresh
install wiped ~/.harz-owner-key, which held the P13 owner seed. By P13 custody law the
seed never left that device and was never shared with any seat — therefore it is
unrecoverable by anyone, including the desk and the witness. The pinned owner key
e884828a… is dead: it cannot sign again, and no one can forge it. This is the custody
design functioning, not a breach.

## The new key
Born Oct 3, 2026 on the same owner soil (node-c-bringup/owner-keygen.js, same custody
law: seed never leaves the phone, never shared, including with the desk):

  719f1b2a8b7636346cf01ea8ade35a26805f5607b30df3d78f7ace85875ccf80

The public key is safe to publish by design (P13). The old key e884828a… stays pinned
in the chain as permanent history — never removed, simply silent (its seed is dead).

## Pre-registered repin procedure (the ONLY path; no workarounds)
1. This amendment is published in the public repo BEFORE any execution (pre-registration
   discipline, same as the window card).
2. The key_pin seal is EXECUTED AT THE WITNESS SEAT (Magani), signed by the desk key
   0de083bc… which executes there in trust per the P13 protocol ("desk rotates via new
   key_pin on wake, by design" — the same rotation law now applied to the owner seat).
   Payload: actor "owner", pubkey 719f1b2a…, amendment reference "r8-amendment-2".
3. The sealed receive gate adopts the repin book on each soil. Records stay 18; the
   chain gains key_pin seal #45. New base digest D_T is COMPUTED, never hand-typed,
   and recorded here by edit after the fact with the computed value.
4. r8-owner-send.mjs EXPECTED_BASE_DIGEST is repointed bf4681b5 → D_T by the desk,
   line-anchored and grep-verified before push (P12 lesson), BEFORE any send.
5. All three soils must verify INTACT at D_T (T1 equality) before R8 Phase 1 resumes.
   The window sequence (B first, C second), record bodies, and all other terms of the
   r8-witness-card.md and its Addendum 1 stand UNCHANGED — only the base digest and
   the active owner key move.

## Witness checks added (verdict requires)
- key_pin #45 signature verifies against the pinned desk pubkey 0de083bc….
- The pinned payload contains exactly 719f1b2a… as actor "owner".
- T1 equality on all three soils at D_T.
- The old key remains in-chain, unremoved.

## If anything deviates
Stop, disclose, owner ruling. No mid-window fixes, per the card's law.
