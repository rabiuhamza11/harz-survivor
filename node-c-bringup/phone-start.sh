#!/data/data/com.termux/files/usr/bin/bash
# PHONE NODE C — ONE-SHOT STARTER (Termux, Infinix)
# Does everything: starts runtime in background, verifies it, keeps phone
# awake, then opens the public tunnel in the foreground and prints the URL.
set -u
cd "$(dirname "$0")/.."
echo "=== PHONE NODE C STARTER ==="
echo "[1/4] stopping any old runtime..."
pkill -f hpr-node-adapter 2>/dev/null; sleep 1
echo "[2/4] starting runtime in background..."
nohup node hpr-node-adapter.mjs > node-c.log 2>&1 &
sleep 3
D=$(curl -s --max-time 10 "http://localhost:8930/api/verify" | python -c "import json,sys; d=json.load(sys.stdin); print('digest', d.get('digest','ERR')[:16], '|', d.get('records','?'), 'records')" 2>/dev/null)
echo "    $D"
if [ "${D#*digest}" = "$D" ]; then echo "    RUNTIME FAILED — showing log:"; cat node-c.log; exit 1; fi
echo "[3/4] keeping phone awake (stay plugged into charger)..."
termux-wake-lock 2>/dev/null && echo "    wake lock: ON" || echo "    wake lock: unavailable (continue anyway)"
echo "[4/4] opening public tunnel — leave this session OPEN..."
echo "    Your public link appears below. Screenshot it and send to the witness."
echo ""
exec ssh -o StrictHostKeyChecking=accept-new -o ServerAliveInterval=60 -R 80:localhost:8930 nokey@localhost.run
