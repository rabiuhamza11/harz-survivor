# HARZ Sovereign Node

Your records, physically held by you, proven un-rewritten — verified anywhere.

One command-line package (zero dependencies, Node 20+) that runs a sealed portable book on
YOUR device: a Termux phone, a laptop, a server. The same proven engine that runs HARZ's
three-soil book (Cloudflare + Deno + phone, byte-identical since P14) runs here — but the
signing key is born on YOUR soil and never leaves it.

## What it gives you
1. A key born on your device (`keygen`) — the seed stays in your home directory, mode 0600
2. A book pinned to that key (`init`) — every record, every write-window, sealed and signed
3. Write sessions (`open` / `append` / `close`) — writes only happen inside signed windows
4. Proof anyone can check (`export` / `serve`) — the verify page runs the sealed engine in
   any browser; a stranger needs no install to confirm your records are unchanged
5. A self-test battery (`battery`) — the package verifies ITSELF before you trust it

## Quickstart
```
node keygen.mjs                       # key born on your soil
node run.mjs init --actor acme-ltd    # create book.json
node run.mjs open --reason "daily batch"
node run.mjs append '{"type":"invoice","no":"INV-001","amount":"25000"}'
node run.mjs close
node run.mjs verify                   # must say CAPSULE VERIFIED
node run.mjs serve                    # http://localhost:8787 — verify page
```

## The honest boundary (read before you buy)
See boundary.md — guarantees, and the limits: a full lockstep rewrite of the entire book
(records + seals + signatures) by whoever holds the machine still self-verifies; the public
digest is the external check. This is the same KR3 limit every hash chain has; we disclose
it instead of hiding it.

HARZ Digital Services. Product of the three-soil provenance program (P11-P14).
