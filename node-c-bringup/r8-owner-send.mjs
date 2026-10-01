// R8 DIVERGENCE SENDER — runs ON THE OWNER'S PHONE (Node 18+, zero deps beyond built-ins).
// The owner's Ed25519 book key at ~/.harz-owner-key (born on this phone, P13 custody) signs
// BOTH the divergence record seal and the bundle that carries it. The seed NEVER leaves this
// device. The desk builds nothing here — this script fetches the target's live export itself,
// asserts it is the pre-registered base (bf4681b5...), extends it with the pre-registered
// record, self-verifies with the SEALED engine from the local repo checkout, and posts to the
// target's sealed receive gate.
//
// Usage: node r8-owner-send.mjs <target-url> "<pre-registered record body>"
//   e.g. node r8-owner-send.mjs https://harz-survivor.harzcobusiness.deno.net "R8 divergence write from the Deno soil — one book, one history"
//        node r8-owner-send.mjs http://localhost:8788 "Harz — one book, three soils, R8"
import { readFileSync } from 'fs';
import crypto from 'crypto';
import os from 'os';
import path from 'path';

const EXPECTED_BASE_DIGEST = 'bf4681b518b7f524e2ec5080d3a29899434af825e2ec5080d3a29899'; // set at window open by the desk — full digest pasted from the engine, never typed by hand
const target = process.argv[2], body = process.argv[3];
if (!target || !body) { console.error('usage: node r8-owner-send.mjs <target-url> "<record body>"'); process.exit(1); }
const seedHex = readFileSync(path.join(os.homedir(), '.harz-owner-key'), 'utf-8').trim();
const kp = crypto.createPrivateKey({ key: Buffer.concat([Buffer.from('302e020100300506032b657004220420', 'hex'), Buffer.from(seedHex, 'hex')]), format: 'der', type: 'pkcs8' });
const spki = crypto.createPublicKey(kp).export({ type: 'spki', format: 'der' });
const pubHex = spki.subarray(-32).toString('hex');
const engine = readFileSync(new URL('../protocol/engine-v10.js', import.meta.url), 'utf-8');
const E = (new Function(engine + '; return { receiveBundle, verifyExport, digestOf, sha256hex, canonical };'))();
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');

const res = await fetch(target.replace(/\/$/, '') + '/api/export');
const book = await res.json();
if (!book.state || !book.digest) { console.error('REFUSED — target did not return a book export'); process.exit(1); }
if (book.digest.startsWith(EXPECTED_BASE_DIGEST.slice(0, 32)) === false) { console.error('REFUSED — target is NOT at the pre-registered base digest; refusing to diverge from an unknown book. Digest: ' + book.digest.slice(0, 32)); process.exit(1); }
console.log('target at base digest:', book.digest.slice(0, 16), '| records', book.state.records.length, '| seals', book.state.chain.length);

const state = JSON.parse(JSON.stringify(book.state));
const id = state.records.length + 1;
const created = new Date().toISOString();
const rec = { id, body, created };
const tip = state.chain[state.chain.length - 1].hash;
const payload = JSON.stringify({ id, body, created, actor: 'owner' });
const seal = { id: state.chain.length + 1, kind: 'record', ref: String(id), payload, prev_hash: tip, hash: await E.sha256hex(tip + '|record|' + id + '|' + payload) };
seal.sig = crypto.sign(null, Buffer.from(seal.prev_hash + '|' + seal.kind + '|' + seal.ref + '|' + seal.payload), kp).toString('hex');
seal.sig_by = pubHex;
state.chain.push(seal); state.records.push(rec);
const newBook = { ...book, state, digest: await E.digestOf(state, book.ui_manifest, book.code_manifest) };
const v = await E.verifyExport(newBook);
if (!v.ok) { console.error('REFUSED — the divergence book does not verify: ' + v.verdict); process.exit(1); }
console.log('divergence book verifies:', v.verdict.slice(0, 40), '| new digest:', newBook.digest.slice(0, 16));

const b = { payload: newBook, claimedDigest: newBook.digest, enginePin: book.code_manifest['/engine.js'], id: 'r8-' + sha(newBook.digest).slice(0, 16), from: 'owner-phone', ts: created };
b.payloadHash = await E.sha256hex(E.canonical(b.payload));
const bundle = { ...b, pub: spki.toString('base64'), sig: crypto.sign(null, Buffer.from(E.canonical(b)), kp).toString('base64') };
const post = await fetch(target.replace(/\/$/, '') + '/api/mesh/receive', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(bundle) });
const r = await post.json();
console.log('receive gate verdict:', r.verdict, '| action:', r.action || 'none', '| digest:', (r.digest || '').slice(0, 16));
process.exit(r.ok ? 0 : 1);
