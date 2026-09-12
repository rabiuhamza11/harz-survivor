#!/usr/bin/env bash
# NODE C BRING-UP BATTERY — death test v4 preconditions
# Run ON the Node C host after bring-up. All checks against live Node A and B.
set -u
A="https://harz-portable-app.harz.workers.dev/api/verify"
B="https://harz-survivor.harzcobusiness.deno.net/api/verify"
C="http://localhost:${HPR_PORT:-8930}/api/verify"
CR="http://localhost:${HPR_PORT:-8930}/registry/api/verify"
echo "1. three-way parity"
DA=$(curl -s --max-time 15 "$A" | python3 -c "import json,sys; print(json.load(sys.stdin).get('digest','ERR')[:16])")
DB=$(curl -s --max-time 15 "$B" | python3 -c "import json,sys; print(json.load(sys.stdin).get('digest','ERR')[:16])")
DC=$(curl -s --max-time 15 "$C" | python3 -c "import json,sys; print(json.load(sys.stdin).get('digest','ERR')[:16])")
echo "  Node A: $DA | Node B: $DB | Node C: $DC"
if [ "$DA" = "$DB" ] && [ "$DB" = "$DC" ]; then echo "  PARITY: TRUE"; else echo "  PARITY: FALSE — FIX BEFORE WINDOW"; exit 1; fi
echo "2. registry verifies on Node C"
curl -s --max-time 15 "$CR" | python3 -c "
import json,sys; d=json.load(sys.stdin)
ok = d.get('ui_ok') and d.get('code_ok') and d.get('digest_match')
print('  registry:', d.get('digest','?')[:16], '| ui SEALED:', d.get('ui_ok'), '| code SEALED:', d.get('code_ok'))
sys.exit(0 if ok else 1)" || exit 1
echo "3. writes refuse (403, no marker)"
CA=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d '{"body":"battery probe"}' "http://localhost:${HPR_PORT:-8930}/api/record")
CR2=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d '{"body":"battery probe"}' "http://localhost:${HPR_PORT:-8930}/registry/api/record")
echo "  book: HTTP $CA | registry: HTTP $CR2"
if [ "$CA" = "403" ] && [ "$CR2" = "403" ]; then echo "  REFUSAL: TRUE"; else echo "  REFUSAL FAILED"; exit 1; fi
echo "4. export parity vs Node B (byte-identical state)"
curl -s --max-time 20 "$B" -o /dev/null
curl -s --max-time 20 "https://harz-survivor.harzcobusiness.deno.net/api/export" -o /tmp/b-exp.json
curl -s --max-time 10 "http://localhost:${HPR_PORT:-8930}/api/export" -o /tmp/c-exp.json
python3 -c "
import json
b=json.load(open('/tmp/b-exp.json')); c=json.load(open('/tmp/c-exp.json'))
same = b['state']==c['state'] and b['digest']==c['digest']
print('  export parity:', same)
exit(0 if same else 1)" || exit 1
echo "5. restart persistence"
systemctl restart hpr-node-c 2>/dev/null || sudo systemctl restart hpr-node-c
sleep 2
DC2=$(curl -s --max-time 15 "$C" | python3 -c "import json,sys; print(json.load(sys.stdin).get('digest','ERR')[:16])")
if [ "$DC" = "$DC2" ]; then echo "  restart: SAME DIGEST $DC2"; else echo "  RESTART MISMATCH"; exit 1; fi
echo ""
echo "BATTERY: ALL PASS — Node C is READY. Record S1 baseline and await the owner's window call."
