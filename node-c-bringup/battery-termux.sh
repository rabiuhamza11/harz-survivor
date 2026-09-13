#!/data/data/com.termux/files/usr/bin/bash
# NODE C PHONE BATTERY (Termux — no systemd, no python dependency). v2.
set -u
cd "$(dirname "$0")/.."
A="https://harz-portable-app.harz.workers.dev/api/verify"
B="https://harz-survivor.harzcobusiness.deno.net/api/verify"
C="http://localhost:${HPR_PORT:-8930}/api/verify"
CR="http://localhost:${HPR_PORT:-8930}/registry/api/verify"

digest_of() { echo "$1" | sed -n 's/.*"digest":"\([^"]*\)".*/\1/p' | cut -c1-16; }
field_of() { echo "$1" | sed -n "s/.*\"$2\":\([a-zA-Z0-9_.]*\).*/\1/p" | head -1; }

echo "1. three-way parity"
RA=$(curl -s --max-time 20 "$A"); RB=$(curl -s --max-time 20 "$B"); RC=$(curl -s --max-time 10 "$C")
DA=$(digest_of "$RA"); [ -z "$DA" ] && DA=ERR
DB=$(digest_of "$RB"); [ -z "$DB" ] && DB=ERR
DC=$(digest_of "$RC"); [ -z "$DC" ] && DC=ERR
echo "  Node A: $DA | Node B: $DB | Node C (phone): $DC"
if [ "$DA" = "$DB" ] && [ "$DB" = "$DC" ] && [ "$DA" != "ERR" ]; then echo "  PARITY: TRUE"; else echo "  PARITY: FALSE — FIX BEFORE WINDOW"; exit 1; fi

echo "2. registry verifies on phone Node C"
RREG=$(curl -s --max-time 10 "$CR")
UIOK=$(field_of "$RREG" ui_ok); CODEOK=$(field_of "$RREG" code_ok); DMATCH=$(field_of "$RREG" digest_match)
DREG=$(digest_of "$RREG")
echo "  registry: $DREG | ui SEALED: $UIOK | code SEALED: $CODEOK | digest_match: $DMATCH"
if [ "$UIOK" = "true" ] && [ "$CODEOK" = "true" ] && [ "$DMATCH" = "true" ]; then :; else echo "  REGISTRY CHECK FAILED"; exit 1; fi

echo "3. writes refuse (403, no marker)"
CA=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d '{"body":"battery probe"}' "http://localhost:${HPR_PORT:-8930}/api/record")
CR2=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d '{"body":"battery probe"}' "http://localhost:${HPR_PORT:-8930}/registry/api/record")
echo "  book: HTTP $CA | registry: HTTP $CR2"
if [ "$CA" = "403" ] && [ "$CR2" = "403" ]; then echo "  REFUSAL: TRUE"; else echo "  REFUSAL FAILED"; exit 1; fi

echo "4. digest parity vs Node B export (proxy for byte-identical state)"
RBEXP=$(curl -s --max-time 20 "https://harz-survivor.harzcobusiness.deno.net/api/export")
RCEXP=$(curl -s --max-time 10 "http://localhost:${HPR_PORT:-8930}/api/export")
DBEXP=$(digest_of "$RBEXP"); DCEXP=$(digest_of "$RCEXP")
echo "  Node B export digest: $DBEXP | Node C export digest: $DCEXP"
if [ "$DBEXP" = "$DCEXP" ] && [ -n "$DBEXP" ]; then echo "  export parity: true"; else echo "  export parity: FALSE"; exit 1; fi

echo "5. restart persistence (kill -9 + relaunch)"
pkill -9 -f hpr-node-adapter; sleep 1
nohup node hpr-node-adapter.mjs > node-c.log 2>&1 & sleep 3
RC2=$(curl -s --max-time 10 "$C"); DC2=$(digest_of "$RC2"); [ -z "$DC2" ] && DC2=ERR
if [ "$DC" = "$DC2" ] && [ "$DC" != "ERR" ]; then echo "  restart: SAME DIGEST $DC2"; else echo "  RESTART MISMATCH"; exit 1; fi

echo ""
echo "PHONE BATTERY: ALL PASS — Node C (phone) READY. Send the public URL + this output to the witness."
