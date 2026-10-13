# HSS-1 ARCHITECTURE SPECIFICATION v1.0 (FROZEN CONTRACT)
*Team A deliverable, Oct 13, 2026. Owner-chartered project HARZ Sovereign Storage.
Path C confirmed (hybrid): HARZ owns protocol, identity, format; backend interchangeable.
Frozen Internetless components untouched. Amendments only dated, appended.*

## 1. Document identity

Identity = SHA-256 content hash of the complete document content (the ecosystem standard
already in production: million-corpus UNIQUE content_hash, sealed chunks, full-text store).
Consequences: identity is location-independent, backend-independent, dedup-by-construction,
and survives migration unchanged. Metadata never defines identity.

## 2. The logical record (owner's nine fields, normative)

1. doc_id — stable HARZ identity (content hash; immutable versions get new identities,
   parent pointer in provenance)
2. content_hash — detect corruption, verify exact bytes
3. content — COMPLETE document, never a snippet-only stand-in
4. source + provenance — origin, acquire path, parent version
5. collected_at — when HARZ acquired it
6. language — for multilingual search
7. content_type — html/text/pdf/structured
8. license_policy — permitted preservation and redistribution
9. verification_state — see §3

Plus storage_locations (copies/fragments) held in a placement index, NOT in the record
(the record stays backend-independent).

## 3. Three states — never conflated (owner's law)

STORED: complete content durably written AND read-back-verified.
SEARCHABLE: an index entry allows discovery — says NOTHING about content health.
VERIFIED: content passed integrity check (digest recomputed, matched, attested).
A document may be any combination. An acknowledged write must reach STORED.
"Metadata exists" is NOT STORED. (The existing million-corpus is the cautionary
example: 89.7% of its rows are metadata-only — see Team C report.)

## 4. HARZ Store — storage engine contract

Any backend must implement: put(hash, bytes) -> ack only after read-back verify;
get(hash) -> bytes; list(prefix, cursor); delete(hash); export(range) -> portable stream;
import(stream); capacity_report(). All bytes opaque to the backend. Chunking and sealing
happen ABOVE the backend, so chunk format, manifest, and seals are identical on every rung.

## 5. HARZ Vault — backend ladder (replaceable, promotion by test)

Rung 1 KV (proven, live today) — ceiling ~1GB/namespace.
Rung 2 R2 (10GB free, $0.015/GB/mo after, free ingress, zero egress) — needs Workers Paid.
Rung 3 Ceph on HARZ-owned drives — sovereignty rung, erasure coding option.
PROMOTION GATE (every rung): export from old backend, restore on new, document identity
unchanged, digests bit-identical, receipts retained. "Cloudflare may host HARZ, never
define HARZ" — as a test, not a slogan.

## 6. HARZ Index — partitionable, rebuildable

Four index tiers (metadata / full-text / integrity / knowledge) are DERIVED data:
destroyable and rebuildable from authoritative content. Authoritative content lives in
Store/Vault only. D1/FTS5 informs design; one SQLite database is NOT the 1B indexing
architecture. Shard key = hash prefix; every shard self-describing (manifest + seals).

## 7. HARZ Mesh — distribution

Multi-node retrieval, store-and-forward, resumable sync, local caching. A node leaving
must never destroy the only copy (replication policy: min 2 independent failure domains
at toy/pilot; erasure coding evaluated at Stage 3). Witness-mesh attestation of every
manifest seal from a separate failure domain — the pattern already live (76 attestations).

## 8. HARZ Governance

Namespace ownership, write/read/replicate/delete permissions, trusted sources,
provenance preservation, compromised-node isolation, key control. Boundary document
obligation (standing ecosystem rule): HSS serves /boundary + /api/boundary, dated
amendments only, provider dependencies disclosed, hash seals = tamper-evidence not
signatures.

## 9. Milestones (engineering targets — NEVER claims until scale tests pass)

Stage 1: 1M documents STORED+VERIFIED at measured quality.
Stage 2: 10M — ingestion + indexing validated.
Stage 3: 100M — partitioning + recovery validated (~1TB content, owned hardware enters).
Stage 4: 1B — first billion-document deployment (~8-10TB content, multi-node).
Stage 5: 10B+ — additional nodes.
