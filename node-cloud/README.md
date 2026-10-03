# HPR CLOUD NODE — free-cloud expansion (owner "I approve", Oct 3, 2026)

One portable node for the HPR book, staged for every Tier-1 free cloud.
The book: capsule v15, 18 records / 44 seals, digest bf4681b5…, sealed engine pin 434c41d2.
Local battery (desk, Oct 3): verify INTACT, export digest matches, records 18, WRITES
SEALED, unsigned write REFUSED, /boundary + /api/boundary served, UI renders.

## What runs where
- `server.mjs` — plain Node http server (zero deps). Oracle VM, Render, Koyeb, Cloud Run,
  any Node 18+ host. `HPR_PORT=8940 HPR_OVERLAY=<path> node node-cloud/server.mjs`
- `adapters/vercel/` — serverless catch-all wrapper under /api/*.
- `adapters/netlify/` — function wrapper + netlify.toml redirects.
- `adapters/cloudrun/Dockerfile` — container image (also Koyeb / Render).
- `adapters/oracle/hpr-node.service` — systemd unit, PERSISTENT class.

## Soil classes (see boundary.js, never hidden)
- EPHEMERAL (Vercel, Netlify, Cloud Run, Koyeb, Render): receive-gate adoptions are
  session-scoped; restart returns the node to the capsule base. Integrity never depends on it.
- PERSISTENT (Oracle Always Free, any mounted disk): full mesh member, overlay survives.
- SLEEPING (Render free): slow first hit while the platform wakes.

## Owner hands per platform (CORRECTED Oct 3 after the witness's live deploy findings)
LIVE: harz-hpr-zeta.vercel.app (witness-built, desk-verified byte-identical at bf4681b5).
Cardless Tier-1 set is ONLY: Vercel, Netlify, Koyeb. Card-gated even on free plans
(proven live, honest correction): Render, Cloud Run, Oracle.
1. VERCEL: LIVE — no further action.
2. NETLIFY: needs a FRESH personal access token (app.netlify.com → User settings →
   Applications → New access token). Staging vaulted at harz-git hpr-soils/v0.1/netlify.
3. KOYEB: koyeb.com (GitHub SSO), free instance from the Dockerfile.
4. RENDER: repo ready (github.com/rabiuhamza11/harz-hpr-render); lights with one API
   call once a card is on file.
5. ORACLE / CLOUD RUN: card on file required; owner decides.

## Honesty notes
- More soils do NOT strengthen book integrity (the digest does that, recomputable anywhere);
  they add failure-domain independence and availability — the P8 proof, generalized.
- KR3-class limits unchanged; the public git ledger remains the standing mitigation.
- Nothing here touches the R8 window; cloud nodes sit at base and follow the book by repull.
