// RUNG 2 MERGE BATTERY — pre-registered R1-R7 (R8 live field test deferred by owner)
import { readFileSync } from 'fs';
import crypto from 'crypto';
const code = readFileSync('./engine-v10.js', 'utf-8');
const E = (new Function(code + '; return { CONTRACT, mergeBooks, verifyExport, digestOf, verifyChain, sha256hex, canonical, receiveBundle };'))();
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');

// --- harness: book builder with identity-signed records ---
const SEED = Buffer.from(crypto.createHash('sha256').update('battery-seat-v1').digest('hex'), 'hex'); // 32-byte seed
const kp = crypto.createPrivateKey({ key: Buffer.concat([Buffer.from('302e020100300506032b657004220420', 'hex'), SEED]), format: 'der', type: 'pkcs8' });
const PUB = crypto.createPublicKey(kp).export({ type: 'spki', format: 'der' }).subarray(-32).toString('hex');
const cSeal = (r) => r.prev_hash + '|' + r.kind + '|' + r.ref + '|' + r.payload;
const sigOf = (r) => crypto.sign(null, Buffer.from(cSeal(r)), kp).toString('hex');

const ui = { '/index.html': '<h1>merge-battery-book</h1>' };
const engineSrc = code;
const codeAssets = { '/engine.js': engineSrc };
const uiManifest = {}, codeManifest = {};
for (const k of Object.keys(ui).sort()) uiManifest[k] = sha(ui[k]);
for (const k of Object.keys(codeAssets).sort()) codeManifest[k] = sha(codeAssets[k]);

async function mkBook(baseRecords, extra) {
  // base chain: ui_manifest pin, code_pin, key_pin — then base record seals, then tail seals
  const chain = [];
  const push = async (kind, ref, payload, sign) => {
    const prev = chain.length ? chain[chain.length - 1].hash : 'GENESIS';
    const h = await E.sha256hex(prev + '|' + kind + '|' + ref + '|' + payload);
    const s = { id: chain.length + 1, kind, ref, payload, prev_hash: prev, hash: h };
    if (sign) { s.sig = sigOf(s); s.sig_by = PUB; }
    chain.push(s);
    return s;
  };
  await push('ui_manifest', 'ui', JSON.stringify(uiManifest));
  await push('code_pin', 'code', JSON.stringify(codeManifest));
  await push('key_pin', 'identity', JSON.stringify({ actor: 'battery-seat', pubkey: PUB }));
  const records = [];
  for (const [id, body, created] of baseRecords) {
    const payload = JSON.stringify({ id, body, created, actor: 'battery-seat' });
    await push('record', String(id), payload, true);
    records.push({ id, body, created });
  }
  const state = { records, chain };
  const digest = await E.digestOf(state, uiManifest, codeManifest);
  const book = { manifest: { version: 'battery' }, state, ui_manifest: uiManifest, ui, code_manifest: codeManifest, code: codeAssets, digest };
  if (extra) for (const [id, body, created] of extra) {
    const payload = JSON.stringify({ id, body, created, actor: 'battery-seat' });
    await push('record', String(id), payload, true);
    book.state.records.push({ id, body, created });
    book.digest = await E.digestOf(book.state, uiManifest, codeManifest);
  }
  const v = await E.verifyExport(book);
  if (!v.ok) throw new Error('harness book does not verify: ' + v.verdict);
  return book;
}

const T = (n, s) => { console.log((s ? 'PASS' : 'FAIL') + ' ' + n); if (!s) process.exitCode = 1; };

// base book shared by both sides (3 records), then diverged tails
const BASE = [[1, 'sovereign ledger opened', '2026-10-01T10:00:00Z'], [2, 'anchor pinned', '2026-10-01T10:30:00Z'], [3, 'identity sealed', '2026-10-01T11:00:00Z']];
const X = await mkBook(BASE, [[4, 'X-wire-1 from Lagos node', '2026-10-01T18:00:00Z'], [5, 'X-wire-2', '2026-10-01T18:01:00Z']]);
const Y = await mkBook(BASE, [[4, 'Y-wire-1 from Kano node', '2026-10-01T18:05:00Z'], [5, 'Y-wire-2', '2026-10-01T18:06:00Z']]);

// R1 clean disjoint merge + symmetry
const m1 = await E.mergeBooks({ exportA: X, exportB: Y, uiManifest: uiManifest, codeManifest: codeManifest });
T('R1a clean merge VERIFIED', m1.ok && m1.verdict.startsWith('VERIFIED'));
const m1r = await E.mergeBooks({ exportA: Y, exportB: X, uiManifest: uiManifest, codeManifest: codeManifest });
T('R1b order symmetry byte-identical', m1.ok && m1r.ok && m1.digest === m1r.digest && E.canonical(m1.state) === E.canonical(m1r.state));
const zExport = { manifest: { version: 'merged' }, state: m1.state, ui_manifest: uiManifest, ui, code_manifest: codeManifest, code: codeAssets, digest: m1.digest };
const zv = await E.verifyExport(zExport);
T('R1c merged book self-verifies INTACT', zv.ok && zv.digest === m1.digest);
T('R1d all five diverged records present', m1.state.records.length === 7);
const again = await E.mergeBooks({ exportA: X, exportB: Y, uiManifest: uiManifest, codeManifest: codeManifest });
T('R7a pure recompute identical (replay-safe)', again.digest === m1.digest && E.canonical(again.state) === E.canonical(m1.state));

// R2 contradiction: same slot (id+created), different body — fail-closed
const X2 = await mkBook(BASE, [[4, 'the account holds N2,000', '2026-10-01T18:00:00Z']]);
const Y2 = await mkBook(BASE, [[4, 'the account holds N9,000', '2026-10-01T18:00:00Z']]);
const m2 = await E.mergeBooks({ exportA: X2, exportB: Y2, uiManifest: uiManifest, codeManifest: codeManifest });
T('R2a CONTRADICTED, no silent smoothing', !m2.ok && m2.verdict.startsWith('CONTRADICTED') && m2.zero_merge === true);

// R3 dedup: identical record on both sides kept once
const X3 = await mkBook(BASE, [[4, 'relayed-notarized-write', '2026-10-01T18:00:00Z']]);
const Y3 = await mkBook(BASE, [[4, 'relayed-notarized-write', '2026-10-01T18:00:00Z'], [5, 'Y-only-extra', '2026-10-01T18:02:00Z']]);
const m3 = await E.mergeBooks({ exportA: X3, exportB: Y3, uiManifest: uiManifest, codeManifest: codeManifest });
const dupCount = m3.ok ? m3.state.records.filter(r => r.body === 'relayed-notarized-write').length : 0;
T('R3a identical records merged exactly once', m3.ok && m3.state.records.length === 5 && dupCount === 1);

// R4 exactly-once: merged book re-merged with either side is a recorded no-op
const m4a = await E.mergeBooks({ exportA: zExport, exportB: Y, uiManifest: uiManifest, codeManifest: codeManifest });
const m4b = await E.mergeBooks({ exportA: Y, exportB: zExport, uiManifest: uiManifest, codeManifest: codeManifest });
T('R4a exactly-once both orders', m4a.ok && m4b.ok && m4a.replay === true && m4b.replay === true && m4a.zero_merge === true && m4b.zero_merge === true);
T('R4b replay returns the merged book unchanged', m4a.digest === m1.digest);

// R5 base rewrite = fork detected at merge time (mid-chain rewrite of a shared record)
const EVIL = 'the base was never written this way';
const rwRec = [1, EVIL, '2026-10-01T10:00:00Z'];
const X5 = await mkBook([rwRec, [2, 'anchor pinned', '2026-10-01T10:30:00Z'], [3, 'identity sealed', '2026-10-01T11:00:00Z']], [[4, 'x5-tail', '2026-10-01T19:00:00Z']]);
const m5 = await E.mergeBooks({ exportA: X, exportB: X5, uiManifest: uiManifest, codeManifest: codeManifest });
T('R5 rewritten base refused (CONTRADICTED/UNRESOLVED, zero merge)', !m5.ok && m5.zero_merge === true && (m5.verdict.startsWith('CONTRADICTED') || m5.verdict.startsWith('UNRESOLVED')));

// R6 lockstep limit documented: two identical fully-forged books merge VERIFIED (unsolved hash-chain limit)
const F1 = await mkBook([[1, 'forged history', '2026-10-01T10:00:00Z']], [[2, 'lockstep tail', '2026-10-01T20:00:00Z']]);
const F2 = JSON.parse(E.canonical(F1));
const m6 = await E.mergeBooks({ exportA: F1, exportB: F2, uiManifest: uiManifest, codeManifest: codeManifest });
T('R6 lockstep divergence is VERIFIED-noop (limit disclosed, not hidden)', m6.ok === true);

// R7b python replay of merged digest happens in the shell step after this

// regression: v0.9 identity/verify behaviors byte-preserved
const tampered = JSON.parse(E.canonical(zExport)); tampered.state.records[3].body = 'quietly edited';
const tv = await E.verifyExport(tampered);
T('REG-a record tamper -> BROKEN', !tv.ok);
const badReceive = await E.receiveBundle({ bundle: {}, localState: X.state, localUiManifest: uiManifest, localCodeManifest: codeManifest });
T('REG-b receive malformed refused zero-ingest', !badReceive.ok && badReceive.zero_ingest === true);

console.log('--- merged digest (R7b python cross-check): ' + m1.digest);
console.log('--- merge_id: ' + m1.merge_id);
