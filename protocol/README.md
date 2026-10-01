# HARZ Protocol Engine — the canonical consolidation

Owner ruling, Oct 1, 2026: "Consolidate the engine, complete root identity."

This directory is the protocol home: ONE canonical sealed verification engine,
carried by every HARZ product. Each product keeps its own chain and data; the
engine — hashing, canonical sealing, chain verification, the discipline, the
boundary culture — comes from one pinned source.

## The canonical engine

engine-v09.js is the sealed HPR Engine v0.9, byte-identical to the capsule v14
code pin, the most adversarially-proven artifact in the ecosystem (P1-P14:
death tests, byte-parity across Cloudflare/Deno/owner soil, Ed25519 identity
layer, mesh receive gate, 23 kill rounds on the Nation pattern).

sha256: 691fc5d846a2ba6689c64dc9ccf068e1a3bf2cbab153053404f33d29c052dbab

Nothing in this directory changes any live system. Migrations happen per
product, on the owner's word, following MIGRATION.md.
