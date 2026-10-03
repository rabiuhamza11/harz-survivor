// HPR cloud node — expansion boundary (standing rule: never hide the boundary). Dated: 2026-10-03.
export const BOUNDARY_TEXT = `
HPR CLOUD NODE — FREE-CLOUD EXPANSION BOUNDARY (dated Oct 3, 2026, owner "I approve")

WHAT THIS IS
A portable read-and-receive node for the HPR book, capsule v15 (18 records / 44 seals
at digest bf4681b5...). Same sealed engine bytes as Nodes A/B/C (pin 434c41d2). The
runtime executes the SEALED ENGINE from the capsule; the verdict is derived, never typed.

WHAT IT SERVES
/api/verify, /api/export, /api/records, /api/merge (compute-only), /api/mesh/receive,
the sealed UI at /, the registry at /registry/, and this boundary at /boundary + /api/boundary.

HONEST LIMITS BY SOIL CLASS (disclosed, never softened)
1. EPHEMERAL soils (Vercel/Netlify functions, Cloud Run, Koyeb, Render free):
   no persistent disk. A book adopted through the receive gate lives only until the
   instance recycles/sleeps; after restart the node returns to the capsule base
   (bf4681b5). Received history on such soils is session-scoped by platform design.
2. PERSISTENT soils (Oracle Always Free VM, any host with a mounted disk):
   overlay state survives restarts; the node is a full member of the mesh.
3. SLEEPING soils (Render free, Glitch-class): the URL may respond slowly or 502
   while the platform idles. Availability differs per soil; integrity never does.
4. The same KR3-class limits as the whole program stand: a lockstep rewrite of a
   diverged pair still merges VERIFIED; the public git ledger is the standing mitigation.
5. Expansion soils do NOT strengthen book integrity (that comes from the digest,
   recomputable anywhere) — they add failure-domain independence and availability.
6. Writes: the book is WRITES SEALED at base. Divergence writes are governed by the
   R8 witness card, not by this expansion.

WHAT IT DOES NOT DO
No auto-scaling claims, no custody of keys, no account sharing. Each soil runs under
the owner's account with a scoped, revocable token. This document updates only by
dated amendments.
`;

export const BOUNDARY_JSON = JSON.stringify({ ok: true, doc: "hpr-cloud-node-boundary", dated: "2026-10-03", boundary: BOUNDARY_TEXT });
