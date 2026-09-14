#!/data/data/com.termux/files/usr/bin/bash
# PHONE NODE C — ONE-SHOT STARTER (Termux, Infinix) — v2, no python dependency
set -u
cd "$(dirname "$0")/.."
echo "=== PHONE NODE C STARTER ==="
echo "[1/4] stopping any old runtime..."
pkill -f hpr-node-adapter 2>/dev/null; sleep 1
echo "[2/4] starting runtime in background..."
nohup node hpr-node-adapter.mjs > node-c.log 2>&1 &
sleep 3
RESP=$(curl -s --max-time 10 "http://localhost:8930/api/verify")
echo "    $RESP" | head -c 300
echo ""
if echo "$RESP" | grep -q '"digest"'; then
  echo "    RUNTIME OK — digest present"
else
  echo "    RUNTIME CHECK INCONCLUSIVE — recent log:"
  tail -5 node-c.log
  echo "    (continuing anyway — if the log above says 'listening on :8930' it is fine)"
fi
echo "[3/4] keeping phone awake (stay plugged into charger)..."
termux-wake-lock 2>/dev/null && echo "    wake lock: ON" || echo "    wake lock: unavailable (continue anyway)"
echo "[4/4] opening public tunnel — leave this session OPEN..."
echo "    Your public link appears below. The locator is auto-announced — no screenshot needed."
echo "    (It changes each run, that is normal for a free anonymous tunnel.)"
echo ""
LOCATOR="https://harz-node-c-locator.harz.workers.dev/api/announce"
ANNOUNCED=""
ssh -o StrictHostKeyChecking=accept-new -o ServerAliveInterval=60 -R 80:localhost:8930 nokey@localhost.run 2>&1 | while IFS= read -r line; do
  printf '%s\n' "$line"
  if [ -z "$ANNOUNCED" ]; then
    U=$(printf '%s' "$line" | grep -oE 'https://[a-z0-9-]+\.lhr\.life' | head -1)
    if [ -n "$U" ]; then
      ANNOUNCED=1
      V=$(curl -s --max-time 10 "http://localhost:8930/api/verify")
      # first match ONLY — v0.9 verify has overlay fields ("records":0) after the real ones
      DG=$(printf '%s' "$V" | grep -oE '"digest":"[a-f0-9]{64}' | head -1 | cut -d'"' -f4)
      RC=$(printf '%s' "$V" | grep -oE '"records":[0-9]+' | head -1 | cut -d: -f2)
      SL=$(printf '%s' "$V" | grep -oE '"chain_length":[0-9]+' | head -1 | cut -d: -f2)
      if [ -n "$DG" ]; then
        echo ""
        echo "    ANNOUNCING to locator: $U (digest ${DG:0:16}..., ${RC:-?} rec, ${SL:-?} seals)"
        curl -s --max-time 15 -X POST "$LOCATOR" -H "content-type: application/json" \
          -d "{\"url\":\"$U\",\"digest\":\"$DG\",\"records\":${RC:-0},\"seals\":${SL:-0}}" && echo "" \
          || echo "    ANNOUNCE FAILED — run: bash node-c-bringup/announce.sh $U"
      else
        echo "    ANNOUNCE SKIPPED — local verify not ready. Run: bash node-c-bringup/announce.sh $U"
      fi
    fi
  fi
done
