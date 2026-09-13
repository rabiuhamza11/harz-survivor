#!/data/data/com.termux/files/usr/bin/bash
# PHONE NODE C UPDATE — death test v4: pull the marker capsule, restart runtime only.
# The public tunnel (other Termux tab) stays connected — same link.
set -u
cd "$(dirname "$0")/.."
echo "=== PHONE NODE C UPDATE (marker capsule) ==="
echo "[1/3] pulling from the public repo..."
git pull --ff-only 2>&1 | tail -2
echo "[2/3] restarting the runtime (tunnel untouched)..."
pkill -f hpr-node-adapter; sleep 1
nohup node hpr-node-adapter.mjs > node-c.log 2>&1 &
sleep 4
echo "[3/3] verifying..."
RESP=$(curl -s --max-time 10 "http://localhost:8930/api/verify")
echo "$RESP" | head -c 420
echo ""
if echo "$RESP" | grep -q '"digest":"e4c4a4a31b531cb3c8889a36105e2737ed6e96d2a9af1f08b47960960e25c1a0"'; then
  echo "UPDATE OK — marker capsule live, WALKOUT ACTIVE on your phone."
else
  echo "CHECK: the digest above should start e4c4a4a3 — if it shows 077bc802, just run this script again."
fi
