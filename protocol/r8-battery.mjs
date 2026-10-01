// R8 PHASE-0 CHECK BATTERY — pre-registered probes for the witnessed live merge window.
// Divergence moves go through the SEALED receive gates (signed bundles); the write path is
// honestly disclosed as unable to carry a first-party signed write today (no marker route in
// the HPR core + no seed pass; Node A refuses by source design).
import { readFileSync } from 'fs';
import crypto from 'crypto';
const code = readFileSync('./engine-v10.js', 'utf-8');
const E = (new Function(code + '; return { CONTRACT, receiveBundle, mergeBooks, verifyExport, digestOf, sha256hex, canonical };'))();
const T = (name, ok) => console.log((ok ? 'PASS ' : 'FAIL ') + name);

const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const toB64 = (b) => Buffer.from(b).toString('base64');
const mkKey = (seedName) => {
  const SEED = Buffer.from(sha(seedName), 'hex');
  const kp = crypto.createPrivateKey({ key: Buffer.concat([Buffer.from('302e020100300506032b657004220420', 'hex'), SEED]), format: 'der', type: 'pkcs8' });
  const spki = crypto.createPublicKey(kp).export({ type: 'spki', format: 'der' });
  return { kp, kpPriv: kp, pubB64: toB64(spki), pubHex: spki.subarray(-32).toString('hex'), sign: (msg) => toB64(crypto.sign(null, Buffer.from(msg), kp)) };
};

// ---- T0: the live book names its three signers (capsule v15) ----
const cap15 = JSON.parse(readFileSync('../capsule-v15-merge.js', 'utf-8').replace(/^export const CAPSULE = /, '').replace(/;\s*$/, ''));
const pins = cap15.state.chain.filter(s => s.kind === 'key_pin').map(s => JSON.parse(s.payload));
T('T0 pinned signers desk/witness/owner (0de083bc/1f4794a4/e884828a)',
  pins.length === 3 && pins.some(p => p.actor === 'desk' && p.pubkey.startsWith('0de083bc')) && pins.some(p => p.actor === 'witness' && p.pubkey.startsWith('1f4794a4')) && pins.some(p => p.actor === 'owner' && p.pubkey.startsWith('e884828a')));

// ---- synthetic battery book with pinned keys (real owner key signs at the window, on his soil) ----
const OWNER = mkKey('r8-owner-seat'), STRANGER = mkKey('r8-stranger-fresh');
const ui = { '/index.html': '<h1>r8-battery-book</h1>' }, codeAssets = { '/engine.js': code };
const uiManifest = { '/index.html': sha(ui['/index.html']) }, codeManifest = { '/engine.js': sha(codeAssets['/engine.js']) };
const cSeal = (r) => r.prev_hash + '|' + r.kind + '|' + r.ref + '|' + r.payload;
const sigOf = (kp, r) => crypto.sign(null, Buffer.from(cSeal(r)), kp.kp).toString('hex');
async function mkBook(baseRecords, extra) {
  const chain = [], records = [];
  const push = async (kind, ref, payload, sigKp) => {
    const prev = chain.length ? chain[chain.length - 1].hash : 'GENESIS';
    const h = await E.sha256hex(prev + '|' + kind + '|' + ref + '|' + payload);
    const s = { id: chain.length + 1, kind, ref, payload, prev_hash: prev, hash: h };
    if (sigKp) { s.sig = sigOf(sigKp, s); s.sig_by = sigKp.pubHex; }
    chain.push(s);
  };
  await push('ui_manifest', 'ui', JSON.stringify(uiManifest));
  await push('code_pin', 'code', JSON.stringify(codeManifest));
  await push('key_pin', 'identity', JSON.stringify({ actor: 'owner-seat', pubkey: OWNER.pubHex }));
  for (const [id, body, created] of baseRecords) { await push('record', String(id), JSON.stringify({ id, body, created, actor: 'owner-seat' }), OWNER); records.push({ id, body, created }); }
  const state = { records, chain };
  if (extra) for (const [id, body, created] of extra) { await push('record', String(id), JSON.stringify({ id, body, created, actor: 'owner-seat' }), OWNER); state.records.push({ id, body, created }); }
  return { manifest: { version: 'r8' }, state, ui_manifest: uiManifest, ui, code_manifest: codeManifest, code: codeAssets, digest: await E.digestOf(state, uiManifest, codeManifest) };
}
async function extendWithRecord(book, kp, id, body, created) {
  const state = JSON.parse(JSON.stringify(book.state));
  const tip = state.chain[state.chain.length - 1].hash;
  const payload = JSON.stringify({ id, body, created, actor: 'owner-seat' });
  const hash = await E.sha256hex(tip + '|record|' + id + '|' + payload);
  const seal = { id: state.chain.length + 1, kind: 'record', ref: String(id), payload, prev_hash: tip, hash };
  seal.sig = sigOf(kp, seal); seal.sig_by = kp.pubHex;
  state.chain.push(seal); state.records.push({ id, body, created });
  return { manifest: book.manifest, state, ui_manifest: uiManifest, ui, code_manifest: codeManifest, code: codeAssets, digest: await E.digestOf(state, uiManifest, codeManifest) };
}
async function mkBundle(payloadBook, sigKp, id, from, ts) {
  const payload = JSON.parse(JSON.stringify(payloadBook)); // deep copy — probes must never poison shared references
  const body = { payload, payloadHash: await E.sha256hex(E.canonical(payload)), claimedDigest: payload.digest, enginePin: codeManifest['/engine.js'], id, from, ts: ts || null };
  return { ...body, pub: sigKp.pubB64, sig: sigKp.sign(E.canonical(body)) };
}

const BASE = [[1, 'base-open', '2026-10-01T10:00:00Z'], [2, 'base-pinned', '2026-10-01T10:30:00Z']];
const A = await mkBook(BASE);                                  // the merge seat (stays at base)
const B0 = await mkBook(BASE), C0 = await mkBook(BASE);        // two writing soils (same base content)

// ---- R8-1: divergence via sealed receive gate: signed bundle ADOPTED, sig verified ----
const B1 = await extendWithRecord(B0, OWNER, 3, 'R8 divergence write from the Deno soil — one book, one history', '2026-10-01T18:00:00Z');
const r1 = await E.receiveBundle({ bundle: await mkBundle(B1, OWNER, 'b1', 'node-b'), localState: B0.state, localUiManifest: uiManifest, localCodeManifest: codeManifest });
T('R8-1 signed bundle ADOPTED via sealed receive gate', r1.ok && r1.action === 'adopt' && r1.state.records.length === 3 && r1.state.chain.length === B0.state.chain.length + 2);
// ---- R8-2: unsigned bundle refused, zero ingest ----
const noSig = JSON.parse(JSON.stringify(await mkBundle(B1, OWNER, 'b2', 'node-b'))); delete noSig.sig; delete noSig.pub;
const r2 = await E.receiveBundle({ bundle: noSig, localState: B0.state, localUiManifest: uiManifest, localCodeManifest: codeManifest });
T('R8-2 unsigned bundle REFUSED zero-ingest', r2.ok === false && r2.zero_ingest === true);
// ---- R8-3: tampered payload (hash mismatch) refused ----
const tampered = await mkBundle(B1, OWNER, 'b3', 'node-b');
tampered.payload.state.records[0].body = 'quietly rewritten';
const r3 = await E.receiveBundle({ bundle: tampered, localState: B0.state, localUiManifest: uiManifest, localCodeManifest: codeManifest });
T('R8-3 tampered payload REFUSED (hash mismatch)', r3.ok === false && /payload hash mismatch/.test(r3.verdict));
// ---- R8-4: fresh transport key + owner-signed record -> ADOPTED (disclosed transport-layer design) ----
const viaStranger = await extendWithRecord(B0, OWNER, 3, 'fresh-transport-key carry, content owner-signed', '2026-10-01T18:01:00Z');
const r4 = await E.receiveBundle({ bundle: await mkBundle(viaStranger, STRANGER, 'b4', 'node-b'), localState: B0.state, localUiManifest: uiManifest, localCodeManifest: codeManifest });
T('R8-4 fresh bundle key accepted BY DESIGN (content sig is the authorship)', r4.ok === true && r4.action === 'adopt');
// ---- R8-5: record signed by a NON-pinned key -> refused by sealed verifyExport ----
const forged = await extendWithRecord(B0, STRANGER, 3, 'forged authorship attempt', '2026-10-01T18:02:00Z');
const r5 = await E.receiveBundle({ bundle: await mkBundle(forged, STRANGER, 'b5', 'node-b'), localState: B0.state, localUiManifest: uiManifest, localCodeManifest: codeManifest });
T('R8-5 non-pinned record author REFUSED by sealed verifyExport', r5.ok === false);
// ---- R8-6: fork (local longer than bundle) refused ----
const r6 = await E.receiveBundle({ bundle: await mkBundle(B0, OWNER, 'b6', 'node-b'), localState: B1.state, localUiManifest: uiManifest, localCodeManifest: codeManifest });
T('R8-6 fork REFUSED — local longer than received', r6.ok === false && /FORK DETECTED/.test(r6.verdict) && r6.zero_ingest === true);

// ---- R8-7: the full window sequence — both soils diverge via receive, then merge at the seat ----
const Bd = r1.state; // B after ADOPTED (record + mesh_ingest receipt)
const C1 = await extendWithRecord(C0, OWNER, 3, 'Harz — one book, three soils, R8', '2026-10-01T18:05:00Z');
const rc = await E.receiveBundle({ bundle: await mkBundle(C1, OWNER, 'c1', 'node-c'), localState: C0.state, localUiManifest: uiManifest, localCodeManifest: codeManifest });
T('R8-7a second soil diverges via its receive gate', rc.ok && rc.action === 'adopt');
const Cd = rc.state;
const m1 = await E.mergeBooks({ exportA: A, exportB: { ...B1, state: Bd, digest: await E.digestOf(Bd, uiManifest, codeManifest) }, uiManifest: uiManifest, codeManifest: codeManifest });
T('R8-7b merge(A, B-div) VERIFIED', m1.ok && m1.state.records.length === 3);
if (!m1.ok) { console.log('DEBUG m1 verdict:', m1.verdict, '| issues:', JSON.stringify(m1.issues || null).slice(0, 200)); const v = await E.verifyExport({ ...B1, state: Bd, digest: await E.digestOf(Bd, uiManifest, codeManifest) }); console.log('DEBUG B-div self-verify:', v.ok, v.verdict.slice(0, 90), '| issues:', JSON.stringify(v.issues || null).slice(0, 150)); }
const m1Export = { manifest: A.manifest, state: m1.state, ui_manifest: uiManifest, ui, code_manifest: codeManifest, code: codeAssets, digest: m1.digest };
const m2 = await E.mergeBooks({ exportA: m1Export, exportB: { ...C1, state: Cd, digest: await E.digestOf(Cd, uiManifest, codeManifest) }, uiManifest: uiManifest, codeManifest: codeManifest });
T('R8-7c merge(M1, C-div) VERIFIED — both writes present', m2.ok && m2.state.records.length === 4 && m2.state.records.some(r => r.body.startsWith('R8 divergence write')) && m2.state.records.some(r => r.body === 'Harz — one book, three soils, R8'));
// ---- R8-8: exactly-once at book level (replay of the same pair is a recorded no-op) ----
const m2Export = { manifest: A.manifest, state: m2.state, ui_manifest: uiManifest, ui, code_manifest: codeManifest, code: codeAssets, digest: m2.digest };
const again = await E.mergeBooks({ exportA: m2Export, exportB: { ...C1, state: Cd, digest: await E.digestOf(Cd, uiManifest, codeManifest) }, uiManifest: uiManifest, codeManifest: codeManifest });
T('R8-8 re-merge after adoption = replay no-op', again.ok === true && (again.replay === true || again.zero_merge === true));
// ---- R8-9: tampered divergence through merge refused ----
const badC = JSON.parse(JSON.stringify({ ...C1, state: Cd }));
badC.state.records[0].body = 'base rewritten in transit';
const r9 = await E.mergeBooks({ exportA: A, exportB: badC, uiManifest: uiManifest, codeManifest: codeManifest });
T('R8-9 tampered base through the merge rail REFUSED', r9.ok === false);
console.log('--- window M2 digest (python cross-check): ' + m2.digest);
console.log('--- M2 chain kinds:', m2.state.chain.map(s => s.kind + ':' + s.id).join(' '));
