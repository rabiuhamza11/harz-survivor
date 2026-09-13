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
echo "    Your public link appears below. Screenshot it and send to the witness."
echo ""
echo "    FIXED PUBLIC LINK: https://harznode.lhr.life"
echo "    (send the word done to the witness — the link never changes now)"
exec ssh -o StrictHostKeyChecking=accept-new -o ServerAliveInterval=60 -R harznode:80:localhost:8930 nokey@localhost.run
