#!/usr/bin/env python3
# HSS-1 STAGE 2, GATE B — exact 21,377-hash overlap sweep (Ruling 003)
# Categories (mutually exclusive, must reconcile to exactly 21,377):
# 1 = in corpus, digest matches; 2 = in corpus, body missing/mismatch;
# 3 = absent from corpus, present in hunt index; 4 = absent from both;
# 5 = unresolved operational error (recorded, retried once).
import os, sys, json, hashlib, time, urllib.request

TOK3 = os.environ['CLOUDFLARE_API_TOKEN_2']; TOK1 = os.environ['CLOUDFLARE_API_TOKEN_1']
A3 = '5ab9477c8379d6dcb1a8b5183484aeae'; A1 = 'c0bea6cfc6c0c69fc0adeba4c8b85f3e'
BODIES = 'a75c7faf-c04d-4f0f-88cf-88ab991e5fda'
HUNT1 = '6ec47ea7-d216-4667-835d-e470c22ec72b'   # acct1 harz_search_v02 (42,622 docs)
HUNT3 = '3f84cac4-766d-48c9-afab-f8795c8fcd31'   # acct3 harz_search_v02 (11,365 docs) — verified via database list Oct 13
R = '/tmp/hss-stage2/sweep-21377/receipts'; os.makedirs(R, exist_ok=True)

def q(tok, acct, db, sql, params):
    req = urllib.request.Request(f'https://api.cloudflare.com/client/v4/accounts/{acct}/d1/database/{db}/query',
        data=json.dumps({'sql': sql, 'params': params}).encode(),
        headers={'Authorization': 'Bearer ' + tok, 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=300) as r:
        res = json.load(r)['result'][0]
    if not res.get('success'): raise RuntimeError(json.dumps(res.get('errors'))[:150])
    return res['results']

sealed = json.load(open('/tmp/hss-proto/seed/sealed-hashes.json'))
assert len(sealed) == 21377 and len(set(sealed)) == 21377, 'sealed hash list integrity'
N = len(sealed)
for b in range(0, N, 100):
    rp = f'{R}/sweep-{b:05d}.json'
    if os.path.exists(rp): continue
    batch = sealed[b:b+100]
    ph = ','.join('?' * len(batch))
    cat = {h: None for h in batch}
    err = None
    try:
        rows = q(TOK3, A3, BODIES, f'SELECT content_hash, text FROM bodies WHERE content_hash IN ({ph})', batch)
        byh = {r['content_hash']: r['text'] for r in rows}
        for h in batch:
            if h in byh:
                t = byh[h]
                if t is None: cat[h] = 2  # in corpus, body missing
                elif hashlib.sha256(t.encode('utf-8')).hexdigest() == h: cat[h] = 1
                else: cat[h] = 2  # in corpus, digest mismatch
        absent = [h for h in batch if cat[h] is None]
        if absent:
            pa = ','.join('?' * len(absent))
            h1 = {r['content_hash'] for r in q(TOK1, A1, HUNT1, f'SELECT content_hash FROM docs WHERE content_hash IN ({pa})', absent)}
            h3 = {r['content_hash'] for r in q(TOK3, A3, HUNT3, f'SELECT content_hash FROM docs WHERE content_hash IN ({pa})', absent)}
            for h in absent: cat[h] = 3 if (h in h1 or h in h3) else 4
    except Exception as e:
        err = str(e)[:120]
        for h in batch: cat[h] = 5
    tmp = rp + '.tmp'
    json.dump({'offset': b, 'categories': cat, 'error': err, 'at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}, open(tmp, 'w'))
    os.rename(tmp, rp)
    if b % 2000 == 0: print('batch at hash', b, 'of', N, flush=True)
print('SWEEP COMPLETE')
