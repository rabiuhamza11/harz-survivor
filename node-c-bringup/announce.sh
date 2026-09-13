#!/data/data/com.termux/files/usr/bin/bash
# HARZ Node C announce helper (locator v0.1, Sep 13 2026) — ADDITIVE, no adapter changes.
# Usage: bash node-c-bringup/announce.sh https://xxxx.trycloudflare.com [digest]
# Wire into phone-start.sh after the tunnel is up, or run manually after each start.
# The locator POINTS, it never vouches — verify-on-read is the defense (see /boundary).
LOCATOR="https://harz-node-c-locator.harz.workers.dev/api/announce"
URL="${1:?usage: announce.sh <tunnel-url> [digest]}"
DG="${2:-}"
curl -s -X POST "$LOCATOR" -H "content-type: application/json" \
  -d "{\"url\":\"$URL\",\"digest\":\"$DG\"}"
echo ""
curl -s "$LOCATOR/../api/locate" ; echo ""
