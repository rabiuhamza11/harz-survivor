# Worker Backups & Revert Path (READ FULL wiring, Oct 12 2026)
- BYTE-PERFECT ORIGINALS live in Cloudflare Workers version history:
  acct1 harz-search pre-change = version 5cd91897-7755-4188-b2c6-0afd47d55ace (v7)
  acct3 harz-search pre-change = version d725342d-e152-4e80-b910-c7bcbb51066d (v11)
  Rollback: Workers dashboard -> harz-search -> Deployments -> select version -> Rollback (or API).
- pre-readfull.js files here are FUNCTIONAL reconstructions (all patch residue stripped,
  node --check PASS); they differ from pristine by trailing-newline handling only (~51-71 bytes).
- Original bindings restored exactly on redeploy: acct1 = DB(6ec47ea7) + HARZ_SEARCH_KV(cefae586),
  compat 2024-01-01; acct3 = DB(3f84cac4) + STORE(d3a8834d, the intentional Team B addition),
  compat 2024-01-01. An earlier redeploy briefly dropped acct1's HARZ_SEARCH_KV binding (~15 min,
  code never referenced it — no functional impact); restored and verified.
- The change itself: (1) READ FULL link in result render; (2) /read/<id> route;
  (3) acct1: fetch-based readFull via harz-fulltext-reader; acct3: KV-direct readFull with
  inline seal law (chunk SHA-256 vs manifest). Ranking, SELECTs, frozen contracts untouched.
