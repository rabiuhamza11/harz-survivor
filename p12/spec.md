# P12 — IDENTITY + NODE C STABILIZATION (spec, owner GO Sep 13 2026)
Build phase only — the live book is NOT touched until the owner's deploy word.

## A. Ed25519 IDENTITY SEALS (the "who sealed" gap — the one hashes cannot close)
Today's seals are hashes: tamper-evident, NO authorship. P12 adds Ed25519 signatures:
- Engine v0.8 embeds tweetnacl (public-domain, self-contained, 18KB) — the SAME signed
  bytes verify identically on Cloudflare, Deno, Node/Termux, and any sandbox. Zero
  WebCrypto platform variance, zero flags.
- Key model: key_pin seals pin an actor's PUBLIC key into the chain. After the first
  key_pin, every record / walkout_marker / return seal MUST carry a valid Ed25519
  signature by a pinned key. Unsigned -> refused. Unknown signer -> refused. Forged
  signature -> refused. Stripped signature -> refused.
- THE CLOSURE: a lockstep attacker who rewrites the entire chain WITH a fresh valid
  keypair is still caught — their pubkey is not pinned. That is the forgery class
  hash seals could never detect.
- KEY CUSTODY (boundary, never hidden): private keys (64-hex seeds) NEVER live in
  sealed bytes, never typed through chat; substrate glue holds them per seat
  (secret vaults); the engine receives a key as a parameter at signing time only.
  Compromise of a private key = the identity layer's remaining failure mode —
  disclosed, not solved.
- BACKWARD COMPATIBILITY (byte-exact): legacy unsigned seals keep their exact digest
  lines; the sig column appends ONLY when a signature exists — the current 17-record
  book verifies under v0.8 at digest 8fbaa547 UNCHANGED. First key_pin is bootstrapped
  during a witnessed, anchored window (same trust basis as the marker: public anchor).
- Key rotation: signed by the actor's current pinned key + anchored in the public ledger.

## B. NODE C STABILIZATION (tunnel dependency = operational weak point)
1. LOCATOR: a tiny worker on account 3 ("harz-node-c-locator", $0, existing account):
   Node C POSTs {tunnel_url, digest, records, seals, ts, sig} every 5 minutes; anyone
   can GET /locate to find the phone's current URL + a freshness check. Witness and
   desk stop depending on hand-copied tunnel URLs. NEW WORKER — deploy on owner word.
2. PHONE BRING-UP v3: phone-start.sh with auto-reconnect + announce loop; battery
   workaround documented (termux-wake-lock + Android battery-optimization whitelist
   instructions); battery kills remain the disclosed operational enemy.
3. Once identity is live, locator announcements are SIGNED by Node C's pinned key.

## C. RIDING ALONG
The cosmetic canWrite refusal label reads '(v0.8)' in the new engine text (the '(v0.6)'
mislabel dies in this build). CONTRACT field: walkout-contract v0.8.

## PRE-REGISTRATION (frozen before any window; witness session before live run)
Battery (sandbox, all from sealed engine bytes): (1) legacy book verifies at 8fbaa547
unchanged; (2) key_pin bootstrap; (3) unsigned write refused while identity active;
(4) signed write accepted, digest covers sig column; (5) forged sig refused; (6) fresh
attacker keypair refused (UNKNOWN SIGNER); (7) stripped sig refused; (8) full lockstep
rewrite with attacker keypair refused; (9) all v0.7 anchor probes byte-exact (anchored
accept, mismatch, forks, all-mirrors-dead fail-closed); (10) Python replay agreement.
Live exercise: next death test window (v5), witness pre-registered, owner word first.

## HONEST LIMITS (standing + new)
Key custody is a new trust assumption. Physical independence still not proven (Node C
is a phone on mobile data via a borrowed relay — locator reduces, does not remove, the
relay dependency). Single-writer, one-window stands. Toy scale. Sealed = unchanged, not
correct. The runtime glue stays unsealed; the verdict stays derived from sealed bytes.
