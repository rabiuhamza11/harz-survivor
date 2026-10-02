// HARZ SOVEREIGN NODE — runtime (verify / write sessions / export / serve)
import fs from 'fs';
import path from 'path';
import http from 'http';
import crypto from 'crypto';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const ENGINE = fs.readFileSync(path.join(ROOT, 'engine-v10.js'), 'utf-8');
const E = (new Function(ENGINE + '; return { sha256hex, canonical, digestOf, verifyExport, appendWithSeal, sealSignature, identityActive, activeMarker };'))();
const BOOK = path.join(ROOT, 'book.json');
const UI = path.join(ROOT, 'verify.html');
const keyPath = () => process.env.HARZ_SOVEREIGN_KEY_PATH || path.join(process.env.HOME || '.', '.harz-sovereign-key');
const seedHex = () => fs.readFileSync(keyPath(), 'utf-8').trim();
const pubOf = (seed) => {
  const pkcs8 = Buffer.concat([Buffer.from('302e020100300506032b657004220420', 'hex'), Buffer.from(seed, 'hex')]);
  const priv = crypto.createPrivateKey({ key: pkcs8, format: 'der', type: 'pkcs8' });
  return crypto.createPublicKey(priv).export({ type: 'spki', format: 'der' }).slice(-32).toString('hex');
};
async function loadBook() {
  const raw = JSON.parse(fs.readFileSync(BOOK, 'utf-8'));
  const b = { ...raw, ui: { '/verify.html': fs.readFileSync(UI, 'utf-8') }, code: { '/engine.js': ENGINE } };
  b.digest = await E.digestOf(b.state, b.ui_manifest, b.code_manifest);
  return b;
}
function saveBook(b) {
  fs.writeFileSync(BOOK, JSON.stringify({ manifest: b.manifest, state: b.state, ui_manifest: b.ui_manifest, code_manifest: b.code_manifest }, null, 1));
}
async function pushSeal(state, kind, ref, payload, sign) {
  const tip = state.chain.length ? state.chain[state.chain.length - 1].hash : 'GENESIS';
  const seal = { id: state.chain.length + 1, kind, ref, payload, prev_hash: tip, hash: await E.sha256hex(tip + '|' + kind + '|' + ref + '|' + payload) };
  if (sign) { const sg = E.sealSignature(seal, sign); seal.sig = sg.sig; seal.sig_by = sg.sig_by; }
  state.chain.push(seal);
  return seal;
}
const args = process.argv.slice(2);
const opt = (k, d) => { const a = args.find(x => x.startsWith('--' + k + '=')); return a ? a.split('=').slice(1).join('=') : d; };
const cmd = args[0];
if (cmd === 'init') {
  const actor = opt('actor', 'customer');
  const pub = pubOf(seedHex());
  const state = { records: [], chain: [] };
  const uiManifest = { '/verify.html': await E.sha256hex(fs.readFileSync(UI, 'utf-8')) };
  const codeManifest = { '/engine.js': await E.sha256hex(ENGINE) };
  await pushSeal(state, 'ui_manifest', 'ui', JSON.stringify(uiManifest));
  await pushSeal(state, 'code_pin', 'code', JSON.stringify(codeManifest));
  await pushSeal(state, 'key_pin', 'actor', JSON.stringify({ actor, pubkey: pub }));
  saveBook({ manifest: { version: 'sovereign-node-1.0.0', app: 'sovereign-book', actor }, state, ui_manifest: uiManifest, code_manifest: codeManifest });
  console.log('BOOK BORN — actor "' + actor + '" pinned to your key. Next: node run.mjs verify');
} else if (cmd === 'open') {
  const b = await loadBook();
  if (E.activeMarker(b.state.chain)) { console.log('A write session is ALREADY open.'); process.exit(1); }
  await pushSeal(b.state, 'walkout_marker', 'window', JSON.stringify({ opened: new Date().toISOString(), reason: opt('reason', 'session') }), seedHex());
  saveBook(b);
  console.log('WRITE SESSION OPEN (signed by your key). Appends allowed until close.');
} else if (cmd === 'append') {
  const b = await loadBook();
  const r = await E.appendWithSeal(b.state, b.ui_manifest, b.code_manifest, args[1], new Date().toISOString(), b.manifest.actor, seedHex());
  if (!r.ok) { console.log('REFUSED — ' + r.reason); process.exit(1); }
  saveBook({ ...b, state: r.state });
  console.log('RECORD SEALED #' + r.record.id + ' | digest ' + r.digest.slice(0, 16) + '…');
} else if (cmd === 'close') {
  const b = await loadBook();
  await pushSeal(b.state, 'return', 'window', JSON.stringify({ closed: new Date().toISOString(), records: b.state.records.length }), seedHex());
  saveBook(b);
  console.log('WRITE SESSION CLOSED — WRITES SEALED again.');
} else if (cmd === 'verify') {
  const b = await loadBook();
  const v = await E.verifyExport(b);
  console.log(v.verdict);
  console.log('records: ' + b.state.records.length + ' | seals: ' + b.state.chain.length);
  console.log('digest: ' + b.digest);
  console.log(v.writes);
} else if (cmd === 'status') {
  const b = await loadBook();
  console.log('records: ' + b.state.records.length + ' | seals: ' + b.state.chain.length + ' | writes: ' + (E.activeMarker(b.state.chain) ? 'OPEN' : 'SEALED'));
} else if (cmd === 'export') {
  const b = await loadBook();
  fs.writeFileSync(path.join(ROOT, 'export.json'), JSON.stringify(b));
  console.log('export.json written — digest ' + b.digest);
} else if (cmd === 'serve') {
  const port = Number(opt('port', '8787'));
  http.createServer((req, res) => {
    if (req.url.startsWith('/api/export')) {
      loadBook().then(fb => { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify(fb)); });
    } else if (req.url.startsWith('/engine-v10.js')) {
      res.writeHead(200, { 'content-type': 'application/javascript' }); res.end(ENGINE);
    } else {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(fs.readFileSync(UI, 'utf-8'));
    }
  }).listen(port, () => console.log('HARZ Sovereign Node verify page: http://localhost:' + port));
} else {
  console.log('commands: init --actor=X | open --reason=X | append <body-json> | close | verify | status | export | serve --port=8787');
}
