import { readFileSync } from 'fs';
import crypto from 'crypto';
const code = readFileSync('./engine-v10.js', 'utf-8');
const E = (new Function(code + '; return { CONTRACT, mergeBooks, verifyExport, digestOf, sha256hex, canonical };'))();
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const SEED = Buffer.from(crypto.createHash('sha256').update('battery-seat-v1').digest('hex'), 'hex');
const kp = crypto.createPrivateKey({ key: Buffer.concat([Buffer.from('302e020100300506032b657004220420', 'hex'), SEED]), format: 'der', type: 'pkcs8' });
const PUB = crypto.createPublicKey(kp).export({ type: 'spki', format: 'der' }).subarray(-32).toString('hex');
const cSeal = (r) => r.prev_hash + '|' + r.kind + '|' + r.ref + '|' + r.payload;
const sigOf = (r) => crypto.sign(null, Buffer.from(cSeal(r)), kp).toString('hex');
const ui = { '/index.html': '<h1>merge-battery-book</h1>' };
const codeAssets = { '/engine.js': code };
const uiManifest = { '/index.html': sha(ui['/index.html']) }, codeManifest = { '/engine.js': sha(codeAssets['/engine.js']) };
async function mkBook(baseRecords, extra) {
  const chain = []; const records = [];
  const push = async (kind, ref, payload, sign) => {
    const prev = chain.length ? chain[chain.length - 1].hash : 'GENESIS';
    const h = await E.sha256hex(prev + '|' + kind + '|' + ref + '|' + payload);
    const s = { id: chain.length + 1, kind, ref, payload, prev_hash: prev, hash: h };
    if (sign) { s.sig = sigOf(s); s.sig_by = PUB; }
    chain.push(s);
  };
  await push('ui_manifest', 'ui', JSON.stringify(uiManifest));
  await push('code_pin', 'code', JSON.stringify(codeManifest));
  await push('key_pin', 'identity', JSON.stringify({ actor: 'battery-seat', pubkey: PUB }));
  for (const [id, body, created] of baseRecords) { await push('record', String(id), JSON.stringify({ id, body, created, actor: 'battery-seat' }), true); records.push({ id, body, created }); }
  const state = { records, chain };
  if (extra) for (const [id, body, created] of extra) { await push('record', String(id), JSON.stringify({ id, body, created, actor: 'battery-seat' }), true); state.records.push({ id, body, created }); }
  return { manifest: { version: 'b' }, state, ui_manifest: uiManifest, ui, code_manifest: codeManifest, code: codeAssets, digest: await E.digestOf(state, uiManifest, codeManifest) };
}
const BASE = [[1, 'opened', '2026-10-01T10:00:00Z'], [2, 'pinned', '2026-10-01T10:30:00Z'], [3, 'sealed', '2026-10-01T11:00:00Z']];
const X = await mkBook(BASE, [[4, 'X-wire-1', '2026-10-01T18:00:00Z'], [5, 'X-wire-2', '2026-10-01T18:01:00Z']]);
const Y = await mkBook(BASE, [[4, 'Y-wire-1', '2026-10-01T18:05:00Z'], [5, 'Y-wire-2', '2026-10-01T18:06:00Z']]);
const m1 = await E.mergeBooks({ exportA: X, exportB: Y, uiManifest: uiManifest, codeManifest: codeManifest });
const m1r = await E.mergeBooks({ exportA: Y, exportB: X, uiManifest: uiManifest, codeManifest: codeManifest });
console.log('X.tip:', X.digest.slice(0, 12), 'Y.tip:', Y.digest.slice(0, 12));
console.log('m1 tip:', m1.state.chain.slice(-1)[0].hash.slice(0, 12), '| m1r tip:', m1r.state.chain.slice(-1)[0].hash.slice(0, 12));
const r1 = m1.state.chain.slice(-1)[0], r2 = m1r.state.chain.slice(-1)[0];
console.log('receipt1 payload a_tip/b_tip:', JSON.parse(r1.payload).a_tip.slice(0,8), JSON.parse(r1.payload).b_tip.slice(0,8));
console.log('receipt2 payload a_tip/b_tip:', JSON.parse(r2.payload).a_tip.slice(0,8), JSON.parse(r2.payload).b_tip.slice(0,8));
const p1 = JSON.parse(r1.payload), p2 = JSON.parse(r2.payload);
for (const key of Object.keys(p1)) if (JSON.stringify(p1[key]) !== JSON.stringify(p2[key])) console.log('PAYLOAD DIFF at', key, ':', JSON.stringify(p1[key]).slice(0,120), ' vs ', JSON.stringify(p2[key]).slice(0,120));
// find first record difference
for (let i = 0; i < Math.max(m1.state.records.length, m1r.state.records.length); i++) {
  const a = m1.state.records[i], b = m1r.state.records[i];
  if (E.canonical(a) !== E.canonical(b)) { console.log('record diff at', i, ':', E.canonical(a), ' vs ', E.canonical(b)); break; }
}
// R3 debug
const X3 = await mkBook(BASE, [[4, 'shared-write', '2026-10-01T18:00:00Z']]);
const Y3 = await mkBook(BASE, [[4, 'shared-write', '2026-10-01T18:00:00Z'], [5, 'Y-extra', '2026-10-01T18:02:00Z']]);
const m3 = await E.mergeBooks({ exportA: X3, exportB: Y3, uiManifest: uiManifest, codeManifest: codeManifest });
console.log('R3:', m3.verdict.slice(0, 30), '| records:', m3.state && m3.state.records.length, '| ingested:', JSON.stringify(m3.ingested || null), '| zero:', m3.zero_merge);
if (m3.receipt) { const p = JSON.parse(m3.receipt.payload); console.log('R3 receipt: re_ided=' + p.re_ided + ' second_orig=' + p.second_records_original.length + ' a_tip8=' + p.a_tip.slice(0,8) + ' base_tip8=' + p.base_tip.slice(0,8)); }
console.log('R3 X3 tip:', X3.state.chain.slice(-1)[0].hash.slice(0,8), 'Y3 tip:', Y3.state.chain.slice(-1)[0].hash.slice(0,8));
