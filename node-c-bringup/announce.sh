#!/data/data/com.termux/files/usr/bin/bash
# HARZ Node C announce helper (locator v0.2, Sep 14 2026) — full claims: url+digest+records+seals.
# Usage: bash node-c-bringup/announce.sh https://xxxx.lhr.life
# Pulls the claims from the LIVE local node (localhost:8930) so the announcement is never hand-typed.
# The locator POINTS, it never vouches — verify-on-read is the defense (see /boundary).
LOCATOR="https://harz-node-c-locator.harz.workers.dev/api/announce"
URL="${1:?usage: announce.sh <tunnel-url>}"
V=$(curl -s --max-time 10 "http://localhost:8930/api/verify")
DG=$(printf '%s' "$V" | grep -oE '"digest":"[a-f0-9]{64}' | head -1 | cut -d'"' -f4)
RC=$(printf '%s' "$V" | grep -oE '"records":[0-9]+' | head -1 | cut -d: -f2)
SL=$(printf '%s' "$V" | grep -oE '"chain_length":[0-9]+' | head -1 | cut -d: -f2)
if [ ${#DG} -ne 64 ]; then echo "LOCAL VERIFY NOT READY — runtime may be down. Not announcing."; exit 1; fi
curl -s -X POST "$LOCATOR" -H "content-type: application/json" \
  -d "{\"url\":\"$URL\",\"digest\":\"$DG\",\"records\":${RC:-0},\"seals\":${SL:-0}}"
echo ""
curl -s "$LOCATOR/../api/locate" ; echo ""