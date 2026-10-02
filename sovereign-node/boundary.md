# HARZ Sovereign Node — Honest Boundary (v1.0.0, Oct 2, 2026)

## What this product guarantees
1. Every record, write-window open and close is sealed into a SHA-256 hash chain AND signed
   with the Ed25519 key pinned in your book. Rewriting any record, seal, or signature in the
   book file makes verification fail loudly (BROKEN — digest mismatch / SIG INVALID / UNKNOWN SIGNER).
2. Writes only happen inside signed windows (open → append → close). Between windows the book
   is sealed — appends are refused, not just discouraged.
3. The engine is one canonical text, hash-pinned in your book. The verify page runs THAT text
   in any browser — a stranger verifies your export with zero install and zero trust in you.
4. The package ships its own battery (battery.mjs). Run it before trusting the tool; run it
   whenever you want proof the tool still refuses what it must refuse.

## What it cannot do (the KR3 limit)
Whoever physically holds the machine AND all of: book.json, your seed file, and the engine —
can rewrite the entire book from genesis, re-sign everything with your key, and the result
self-verifies. Every hash chain has this limit; we disclose it. The defense is external:
publish your digest (print it, email it, pin it anywhere) — anyone holding the old digest
catches the rewrite. Loss of the seed = no more writes, but verification survives forever.
Seed theft = writes in your name (keep the seed file 0600 and alone on the device).
Third-party records written into your book keep their original signatures — you cannot forge
another actor's signature without their key.

## Trust assumptions
- Your device is yours: the seed is born on it (keygen) and never leaves it.
- This package does not and will never phone home. It works fully offline.
- The engine is auditable: it is one plain JavaScript file, readable by any engineer.

## Recovery
Book file corrupted: restore book.json from any backup; verify confirms byte-exact state.
Device lost: seed is lost — the book becomes read-only forever (still verifiable anywhere).
