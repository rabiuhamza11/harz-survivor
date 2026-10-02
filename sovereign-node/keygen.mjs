// HARZ SOVEREIGN NODE — CUSTOMER KEY CEREMONY (zero deps, Node built-in crypto)
// Your Ed25519 book-signing keypair. RFC 8032 signing key — NOT a wallet, no funds.
// The SEED stays on YOUR device and must NEVER be sent to anyone, including HARZ.
import crypto from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';

const keyPath = process.env.HARZ_SOVEREIGN_KEY_PATH || path.join(os.homedir(), '.harz-sovereign-key');
if (fs.existsSync(keyPath)) {
  console.log('Key ALREADY EXISTS at ' + keyPath + ' — not regenerating.');
  console.log('If you lost the seed file, delete it manually and rerun.');
  process.exit(0);
}
const seed = crypto.randomBytes(32);
const pkcs8 = Buffer.concat([Buffer.from('302e020100300506032b657004220420', 'hex'), seed]);
const priv = crypto.createPrivateKey({ key: pkcs8, format: 'der', type: 'pkcs8' });
const pubHex = crypto.createPublicKey(priv).export({ type: 'spki', format: 'der' }).slice(-32).toString('hex');
fs.writeFileSync(keyPath, seed.toString('hex'), { mode: 0o600 });
fs.chmodSync(keyPath, 0o600);
console.log('=== YOUR KEY BORN ON YOUR SOIL ===');
console.log('SEED SAVED (never leaves this device): ' + keyPath);
console.log('PUBLIC KEY (safe to share — this is what your book pins):');
console.log(pubHex);
const msg = Buffer.from('harz-sovereign-key-selftest');
const sig = crypto.sign(null, msg, priv);
console.log('SELF-TEST sign+verify: ' + (crypto.verify(null, msg, crypto.createPublicKey(priv), sig) ? 'PASS' : 'FAIL'));
