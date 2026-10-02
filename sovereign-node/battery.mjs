// HARZ SOVEREIGN NODE — SELF-TEST BATTERY (ships with the product; run before trusting it)
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execFileSync } from 'child_process';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const ENGINE = fs.readFileSync(path.join(ROOT, 'engine-v10.js'), 'utf-8');
const E = (new Function(ENGINE + '; return { sha256hex, canonical, digestOf, verifyExport, appendWithSeal, sealSignature, identityActive, activeMarker };'))();
const UI = fs.readFileSync(path.join(ROOT, 'verify.html'), 'utf-8');
const T = (n, ok) => console.log((ok ? 'PASS ' : 'FAIL ') + n);
const run = (args) => execFileSync('node', [path.join(ROOT, 'run.mjs'), ...args], { cwd: ROOT, env: { ...process.env, HARZ_SOVEREIGN_KEY_PATH: SEED } }).toString();
const runFails = (args) => { try { run(args); return false; } catch (e) { const out = (e.stdout ? e.stdout.toString() : '') + (e.stderr ? e.stderr.toString() : ''); return out.includes('REFUSED') || (e.status === 1); } };
const loadBook = async () => {
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'book.json'), 'utf-8'));
  const b = { ...raw, ui: { '/verify.html': UI }, code: { '/engine.js': ENGINE } };
  b.digest = await E.digestOf(b.state, b.ui_manifest, b.code_manifest);
  return b;
};
const freshSeed = () => crypto.randomBytes(32).toString('hex');
const pubOf = (seed) => {
  const pkcs8 = Buffer.concat([Buffer.from('302e020100300506032b657004220420', 'hex'), Buffer.from(seed, 'hex')]);
  return crypto.createPublicKey(crypto.createPrivateKey({ key: pkcs8, format: 'der', type: 'pkcs8' })).export({ type: 'spki', format: 'der' }).slice(-32).toString('hex');
};
const signSeal = (seal, seed) => { const sg = E.sealSignature(seal, seed); return { ...seal, sig: sg.sig, sig_by: sg.sig_by }; };
const tmp = path.join(ROOT, '.battery-test');
const SEED = path.join(tmp, 'seed');

fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });
fs.rmSync(path.join(ROOT, 'book.json'), { force: true });

// T1: keygen — key born on (test) soil, seed 0600, pubkey printed, self-test PASS
const kg = execFileSync('node', [path.join(ROOT, 'keygen.mjs')], { env: { ...process.env, HARZ_SOVEREIGN_KEY_PATH: SEED } }).toString();
const pubLine = kg.match(/\n([0-9a-f]{64})\n/);
const mode = fs.statSync(SEED).mode & 0o777;
T('T1 keygen: seed born 0600, pubkey printed, selftest ' + (kg.includes('PASS') ? 'PASS' : 'FAIL'),
  kg.includes('PASS') && !!pubLine && mode === 0o600);

// T2: init — book born, verifies INTACT, identity ACTIVE, writes SEALED
run(['init', '--actor=demo-ltd']);
let b = await loadBook();
let v = await E.verifyExport(b);
T('T2 init: CAPSULE VERIFIED, identity ACTIVE, WRITES SEALED', v.ok && E.identityActive(b.state.chain) && v.writes.includes('WRITES SEALED'));

// T3: append with no open session -> REFUSED
T('T3 sealed-book append REFUSED (no session)', runFails(['append', '{"x":1}']));

// T4: session open -> 3 appends -> close -> INTACT, digest rolls, sigs present
const d0 = b.digest;
run(['open', '--reason=daily-batch']);
run(['append', '{"type":"invoice","no":"INV-001","amount":"25000"}']);
run(['append', '{"type":"invoice","no":"INV-002","amount":"8000"}']);
run(['append', '{"type":"certificate","id":"CERT-77","holder":"HARZ Demo"}']);
run(['close']);
b = await loadBook();
v = await E.verifyExport(b);
const recSeals = b.state.chain.filter(s => s.kind === 'record');
T('T4 session: 3 records sealed+signed, close seals, digest rolls',
  v.ok && b.state.records.length === 3 && b.digest !== d0 && recSeals.every(s => s.sig && s.sig_by) && v.writes.includes('WRITES SEALED'));
const goodBook = JSON.parse(fs.readFileSync(path.join(ROOT, 'book.json'), 'utf-8'));

// T5: tamper a record body (digest claim kept) -> BROKEN
let t = JSON.parse(JSON.stringify(goodBook));
t.state.records[0].body = t.state.records[0].body.replace('25000', '2500000');
if (t.state.records[0].body === goodBook.state.records[0].body) throw new Error('tamper did not change the body');
let tv = await E.verifyExport({ ...t, ui: { '/verify.html': UI }, code: { '/engine.js': ENGINE }, digest: b.digest });
T('T5 record rewrite REFUSED (digest mismatch)', tv.ok === false && tv.issues.some(i => i.includes('digest')));

try {
// T6: forge a signature (flip bytes in a record seal sig) -> SIG INVALID
t = JSON.parse(JSON.stringify(goodBook));
const s6 = t.state.chain[4].sig; t.state.chain[4].sig = s6.slice(0, -1) + (s6.endsWith('0') ? '1' : '0');
tv = await E.verifyExport({ ...t, ui: { '/verify.html': UI }, code: { '/engine.js': ENGINE }, digest: await E.digestOf(t.state, t.ui_manifest, t.code_manifest) });
T('T6 forged signature REFUSED (SIG INVALID)', tv.ok === false && tv.issues.some(i => i.includes('SIG INVALID') || i.includes('SIGNER')));

// T7: lockstep rewrite with a FRESH attacker key (re-sign everything) -> UNKNOWN SIGNER
t = JSON.parse(JSON.stringify(goodBook));
const attackerSeed = freshSeed();
const firstPin = t.state.chain.findIndex(s => s.kind === 'key_pin');
t.state.chain = t.state.chain.map((s, i) => (i > firstPin && ['record', 'walkout_marker', 'return'].includes(s.kind) ? signSeal(s, attackerSeed) : s));
tv = await E.verifyExport({ ...t, ui: { '/verify.html': UI }, code: { '/engine.js': ENGINE }, digest: await E.digestOf(t.state, t.ui_manifest, t.code_manifest) });
T('T7 lockstep with fresh attacker key REFUSED (UNKNOWN SIGNER)', tv.ok === false && tv.issues.some(i => i.includes('UNKNOWN SIGNER')));

// T8: attacker appends ONE record signed with their own fresh key -> UNKNOWN SIGNER at verify
t = JSON.parse(JSON.stringify(goodBook));
{
  const rec = { id: 4, body: '{"evil":true}', created: new Date().toISOString() };
  const payload = JSON.stringify({ id: rec.id, body: rec.body, created: rec.created, actor: 'demo-ltd' });
  const tip = t.state.chain[t.state.chain.length - 1].hash;
  const seal = { id: t.state.chain.length + 1, kind: 'record', ref: String(rec.id), payload, prev_hash: tip, hash: await E.sha256hex(tip + '|record|' + rec.id + '|' + payload) };
  const sg = E.sealSignature(seal, attackerSeed);
  seal.sig = sg.sig; seal.sig_by = sg.sig_by;
  t.state.chain.push(seal); t.state.records.push(rec);
}
tv = await E.verifyExport({ ...t, ui: { '/verify.html': UI }, code: { '/engine.js': ENGINE }, digest: await E.digestOf(t.state, t.ui_manifest, t.code_manifest) });
T('T8 attacker-signed append REFUSED at verify (UNKNOWN SIGNER)', tv.ok === false && tv.issues.some(i => i.includes('UNKNOWN SIGNER')));

// T9: verify-page rewrite -> ui hash mismatch
const uiBad = UI.replace('HARZ Sovereign Node', 'FAKE Node');
t = JSON.parse(JSON.stringify(goodBook));
tv = await E.verifyExport({ ...t, ui: { '/verify.html': uiBad }, code: { '/engine.js': ENGINE }, digest: await E.digestOf(t.state, t.ui_manifest, t.code_manifest) });
T('T9 verify-page rewrite REFUSED (ui hash mismatch)', tv.ok === false && tv.issues.some(i => i.includes('ui')));

// T10: export.json + demo single-file verify page built
run(['export']);
const ex = JSON.parse(fs.readFileSync(path.join(ROOT, 'export.json'), 'utf-8'));
const demo = UI
  .replace('<script src="./engine-v10.js"></script>', '<script>' + ENGINE + '</script>')
  .replace('(async () => {', '(async () => {\n  window.__EXPORT__ = window.__EXPORT__ || ' + JSON.stringify(ex).replace(/<\/script/gi, '<\\/script') + ';');
fs.writeFileSync(path.join(ROOT, 'demo-verify.html'), demo);
const evEx = await E.verifyExport(ex);
T('T10 export verifies; demo page built inline (' + Math.round(demo.length / 1024) + ' KB)', evEx.ok && demo.includes('window.__EXPORT__'));

console.log('FINAL_DIGEST: ' + b.digest);
} catch (err) {
  console.log('BATTERY CRASH: ' + String(err && err.message || err).slice(0, 300));
  console.log(String(err && err.stack || '').split('\n').slice(0, 4).join('\n'));
}
