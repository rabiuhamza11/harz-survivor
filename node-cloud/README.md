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

## Owner hands per platform (accounts + scoped tokens; desk deploys)
1. VERCEL (first target): sign up vercel.com (GitHub login), create a token at
   vercel.com/account/tokens, send the token to the desk. Desk: `npx vercel --prod`.
2. NETLIFY: app.netlify.com account, token at user/applications (personal access tokens).
3. CLOUD RUN: Google Cloud account (card needed for verification even on free tier — honest
   limit), service account key or gcloud session. Free tier: 2M req/mo.
4. ORACLE ALWAYS FREE (strongest — persistent, a real VM): oracle.com/cloud/free account
   (card verification, no charge on Always Free shape), Ubuntu VM; desk ships install script.
5. KOYEB: koyeb.com (GitHub SSO), free web service instance from the Dockerfile.
6. RENDER: render.com account, free web service (sleeps, disclosed).

## Honesty notes
- More soils do NOT strengthen book integrity (the digest does that, recomputable anywhere);
  they add failure-domain independence and availability — the P8 proof, generalized.
- KR3-class limits unchanged; the public git ledger remains the standing mitigation.
- Nothing here touches the R8 window; cloud nodes sit at base and follow the book by repull.
