# R8 AMENDMENT 3 — OWNER RULING: WITNESS WAIVED, DESK-ALONE EXECUTION (dated 2026-10-08, published before any execution)

## The ruling (owner word, Oct 8, 2026 00:49 Lagos)
"We don't need anything witness. Do the job alone and finish."
Absorbed: the witness seat (Magani) is waived BOTH as gate AND as verdict-giver for the repin
and the R8 window. The desk executes, self-verifies, and reports. No window waits on a witness.

## Honest disclosure (never hidden — the boundary stays)
1. CUSTODY WALL, by the owner's own P13 law: the repin's key_pin seal requires an Ed25519
   signature from a CURRENTLY PINNED key. The pinned keys are desk 0de083bc (seed at the
   Magani trusted seat), witness 1f4794a4 (same seat), owner e884828a (seed DEAD — Termux
   wipe, Oct 3). This desk's secret store holds platform tokens ONLY — no signing seed
   (audited Oct 8: /app/.agents/.env, sandbox-wide scan). The desk therefore CANNOT sign
   alone, and will NOT forge a workaround. That is the custody design functioning.
2. THE DESIGN-SANCTIONED EXIT (rotation, per the P13 record's own words: "desk seat must
   take custody on wake and MAY rotate via a new key_pin seal"): a NEW desk key was born
   AT THE DESK on Oct 8 (seed 0600 in the desk sandbox, never repo/chat). Pinning it
   requires ONE signature from the old desk key 0de083bc — the single remaining external
   action. It is CUSTODY, not witnessing. After it, no repin or seal ever needs any seat
   but the desk: seal #45 rotates the desk pin to the new key; seal #46 (same bundle,
   built and signed by the DESK's new key) repins the owner seat to 719f1b2a… per
   Amendment 2. The desk then finishes alone: verify, compute D_T, redeploy Deno +
   Cloudflare soils, repoint the send glue, batteries + browser.
3. Seed-at-desk limit, disclosed: if the desk sandbox is ever wiped, the desk key dies
   the same way the owner's phone key died — disclosed now, not after the fact.
4. Vercel soil: the desk holds no Vercel credential. Post-repin, Deno + Cloudflare
   redeploy desk-side; zeta stays at base v15 bf4681b5 as GRANDFATHERED-VALID (pre-pin
   seals grandfathered — the standing P13 precedent, honestly labeled) until a Vercel
   path exists. T1 parity is therefore PARTIAL BY DESIGN after adoption.
5. Loss accepted by this ruling, stated plainly: no independent recomputation of the
   repin or the R8 window by an outside seat. The git ledger (branch-protected, force-
   pushes rejected) and the owner's own outside fetches remain the standing checks.

## If anything deviates
Stop, disclose, owner ruling. No mid-window fixes.
