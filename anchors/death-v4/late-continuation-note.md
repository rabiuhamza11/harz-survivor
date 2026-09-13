# NODE C LATE CONTINUATION — ARCHIVED (owner ruling: "Archive", Sep 13 2026 ~12:50 WAT)

## What this is
The complete export of Node C (Infinix phone) captured 2026-09-13 ~11:44Z via the
live tunnel, AFTER the anchor-gated return had already been executed. It contains
two sealed records the returned book does not have:

- record 18: body "Seal", created 2026-09-13T11:41:31Z (seal 33, prev a7adc96a...)
- record 19: body "Seal", created 2026-09-13T11:42:12Z (seal 34, prev 902ffe44...)

Both were accepted by the sealed engine while the phone was STILL on the
marker capsule (walkout open) — the owner tapped the "Sealed write" button twice
on the local UI while the tunnel was down (12:41-12:42 WAT). They are legitimate
sealed writes made after the death-window export (taken 11:31Z) had already been
ingested by the return.

## Why they cannot be merged
Both records chain from seal 32 (hash a7adc96a...) — the same tip the return
seal (#33 in the returned book, hash 78d3ca3e...) chains from. The book forks at
that tip: the return continuation vs. the late-write continuation. The sealed
return gate mathematically refuses a second return over an already-returned
chain ("no active walkout marker") and treats post-marker seals as a fork. This
is the gate working exactly as designed — the fork is REAL and was caught.

## What the phone displayed
"BROKEN — chain break at 33", digest ebeed8c66acd7569..., records 19, chain 35,
overlay {records: 2, seals: 2, stale_ingested: 8}. The node reported its true
state and refused to compose a lie.

## Owner ruling
Rabiu ruled "Archive" (option 1: archive and clean). The full state is preserved
in node-c-late-continuation-archive.json (this directory, byte-exact export).
The phone's overlay file (node-c-overlay.json) is then cleared with owner
approval, and Node C rejoins Nodes A and B at the returned digest
8fbaa547264d07f0ff07c2862d4c448312ea1be696f7eb5172eaaefa1d4a6009.

Nothing was deleted from history — the late writes live here, in the public
anchor, permanently. The book moves on without them because they post-date the
closed walkout window and were button-test clicks with no content.
