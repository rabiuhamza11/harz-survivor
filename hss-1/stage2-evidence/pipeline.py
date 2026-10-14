#!/usr/bin/env python3
# HSS-1 STAGE 2, GATE A — resumable 100k body-verification pipeline (Ruling 003)
# Laws: read-only corpus; receipts are the source of truth (resume skips existing
# batch receipts => no double-count, no lost work by construction); no byte
# modification of sources; newly attempted docs get explicit terminal/pending states.
import os, sys, json, hashlib, time
import urllib.request

TOK = os.environ['CLOUDFLARE_API_TOKEN_2']; ACCT = '5ab9477c8379d6dcb1a8b5183484aeae'
BODIES = 'a75c7faf-c04d-4f0f-88cf-88ab991e5fda'
RECEIPTS = '/tmp/hss-stage2/verify-100k/receipts'
os.makedirs(RECEIPTS, exist_ok=True)

def q(sql, params=None):
    body = json.dumps({'sql': sql, 'params': params}).encode()
    req = urllib.request.Request(
        f'https://api.cloudflare.com/client/v4/accounts/{ACCT}/d1/database/{BODIES}/query',
        data=body, headers={'Authorization': 'Bearer ' + TOK, 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=300) as r:
        res = json.load(r)['result'][0]
    if not res.get('success'): raise RuntimeError(json.dumps(res.get('errors'))[:200])
    return res['results']

BATCH = 500
crash_after = int(sys.argv[1]) if len(sys.argv) > 1 else 0  # 0 = run to completion; N = SIGKILL-style exit after N batches
b = 0
while True:
    rp = f'{RECEIPTS}/batch-{b:04d}.json'
    if os.path.exists(rp): b += 1; continue  # resume: receipts are truth
    off = b * BATCH
    rows = q(f'SELECT rowid, content_hash, text FROM bodies ORDER BY rowid LIMIT {BATCH} OFFSET {off}')
    if not rows:
        open(f'{RECEIPTS}/DONE.json', 'w').write(json.dumps({'terminal_batch': b, 'at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}))
        break
    verified, failed = [], []
    for r in rows:
        h = hashlib.sha256(r['text'].encode('utf-8')).hexdigest() if r['text'] is not None else None
        (verified if h == r['content_hash'] else failed).append(
            {'rowid': r['rowid'], 'hash': r['content_hash'],
             **({'recomputed': h, 'len': len(r['text']),
                 'high_bytes': any(ord(c) > 127 for c in (r['text'] or '')[:2000]),
                 'null_body': r['text'] is None} if h != r['content_hash'] else {})})
    # atomic receipt write: temp then rename
    tmp = rp + '.tmp'
    json.dump({'batch': b, 'offset': off, 'attempted': len(rows),
               'verified': len(verified), 'failed': len(failed),
               'failed_rows': failed, 'at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}, open(tmp, 'w'))
    os.rename(tmp, rp)
    b += 1
    if crash_after and b >= crash_after:
        print(f'INTENTIONAL CRASH after {b} batches (batch receipt {b-1} committed, next batch NOT attempted)'); sys.exit(77)
print('PIPELINE COMPLETE at batch', b)
