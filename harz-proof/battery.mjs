// harz-proof local battery — the worker's own formulas + the sealed engine, before deploy
import { readFileSync } from 'fs';
const src = readFileSync('./worker.js', 'utf-8');
const CAPSULE = JSON.parse(src.match(/const CAPSULE = (\{.*?\});\n/s)[1]);
const E = (new Function(readFileSync('../protocol/engine-v10.js', 'utf-8') + '; return { sha256hex, canonical, digestOf, verifyExport };'))();
const T = (name, ok) => console.log((ok ? 'PASS ' : 'FAIL ') + name);
const book = (state) => ({ manifest: CAPSULE.manifest, state, ui_manifest: CAPSULE.ui_manifest, ui: CAPSULE.ui, code_manifest: CAPSULE.code_manifest, code: CAPSULE.code, digest: null });

let state = JSON.parse(JSON.stringify(CAPSULE.state));
let b = book(state); b.digest = await E.digestOf(b.state, b.ui_manifest, b.code_manifest);
let v = await E.verifyExport(b);
T('T1 genesis book verifies (CAPSULE VERIFIED)', v.ok);

// worker's combined verify (engine + receipt-vs-seal cross-check)
const verifyBook = async (st) => {
  const bk = book(st); bk.digest = await E.digestOf(bk.state, bk.ui_manifest, bk.code_manifest);
  let vv = await E.verifyExport(bk);
  const rcIssues = [];
  for (const sl of bk.state.chain) { if (sl.kind !== 'record') continue;
    const rec = bk.state.records[Number(sl.ref) - 1];
    if (!rec || sl.payload !== JSON.stringify(rec, ['id', 'body', 'created'])) rcIssues.push(sl.ref); }
  if (rcIssues.length) vv = { ...vv, ok: false, verdict: 'BROKEN — receipt mismatch ' + rcIssues.join(',') };
  return vv;
};
const append = async (st, msgId, recipient, status) => {
  const receipt = { msg_id: msgId, sender: 'HARZ-Verify', recipient_masked: '***' + recipient.slice(-4), route: 'edge-telecom/sendchamp', carrier: 'SendChamp', status };
  const id = st.records.length + 1;
  const rec = { id, body: JSON.stringify(receipt, Object.keys(receipt)), created: '2026-10-02T10:00:0' + id + 'Z' };
  const payload = JSON.stringify(rec, ['id', 'body', 'created']);
  const prev = st.chain[st.chain.length - 1].hash;
  const hash = await E.sha256hex(prev + '|record|' + id + '|' + payload);
  st.chain.push({ id: st.chain.length + 1, kind: 'record', ref: String(id), payload, prev_hash: prev, hash });
  st.records.push(rec);
  return hash;
};
const d0 = b.digest;
const h1 = await append(state, 'msg-1', '08031234567', 'delivered');
await append(state, 'msg-2', '08039998877', 'sent');
await append(state, 'msg-3', '08061112233', 'delivered');
b = book(state); b.digest = await E.digestOf(b.state, b.ui_manifest, b.code_manifest);
v = await E.verifyExport(b);
T('T2 three receipts append, book verifies, digest rolls', v.ok && b.digest !== d0 && state.records.length === 3);
const bookDigest = b.digest;

// T3a: receipt rewritten in DB, digest claim kept (the realistic single-row rewrite)
const t3a = JSON.parse(JSON.stringify(state));
t3a.records[2].body = t3a.records[2].body.replace('delivered', 'failed');
const v3a = await E.verifyExport({ ...book(t3a), digest: bookDigest });
T('T3a receipt rewrite + kept claim -> BROKEN (digest mismatch)', v3a.ok === false && v3a.issues.some(i => i.includes('digest')));

// T3b: receipt rewritten AND digest recomputed (attacker helps themselves) -> worker cross-check catches
const t3b = JSON.parse(JSON.stringify(state));
t3b.records[2].body = t3b.records[2].body.replace('delivered', 'failed');
const v3b = await verifyBook(t3b);
T('T3b receipt rewrite + recomputed claim -> caught by receipt-vs-seal cross-check', v3b.ok === false);

// T4: seal-hash rewrite -> chain break
const t4 = JSON.parse(JSON.stringify(state));
t4.chain[3].hash = 'f' + t4.chain[3].hash.slice(1);
const v4 = await E.verifyExport({ ...book(t4), digest: await E.digestOf(t4, CAPSULE.ui_manifest, CAPSULE.code_manifest) });
T('T4 seal-hash rewrite -> BROKEN', v4.ok === false);

// T5: masking — full numbers never in the book bytes
const all = JSON.stringify(state);
T('T5 full recipient numbers never sealed', !all.includes('08031234567') && all.includes('***4567'));

// T6: verify-page rewrite -> ui hash mismatch
const capUi = { ...CAPSULE.ui, '/index.html': CAPSULE.ui['/index.html'].replace('HARZ Proof', 'FAKE Proof') };
const v6 = await E.verifyExport({ ...book(state), ui: capUi, digest: await E.digestOf(state, CAPSULE.ui_manifest, CAPSULE.code_manifest) });
T('T6 verify-page rewrite -> BROKEN', v6.ok === false);

// T7: engine swap -> code hash mismatch
const v7 = await E.verifyExport({ ...book(state), code: { '/engine.js': src.slice(0, 2000) }, digest: await E.digestOf(state, CAPSULE.ui_manifest, CAPSULE.code_manifest) });
T('T7 engine swap -> BROKEN', v7.ok === false);

// T8: receipt body IS covered by digest (id|body|created line) — swap content, digest changes
const t8 = JSON.parse(JSON.stringify(state));
t8.records[2].body = t8.records[2].body.replace('delivered', 'failed');
const d8 = await E.digestOf(t8, CAPSULE.ui_manifest, CAPSULE.code_manifest);
T('T8 receipt content changes the book digest', d8 !== bookDigest);
console.log('FINAL_BOOK_DIGEST: ' + bookDigest);
