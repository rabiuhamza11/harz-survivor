// P13 KEY CEREMONY — OWNER KEY GEN (runs ON THE PHONE, Node built-in crypto, zero deps)
// Generates the OWNER's Ed25519 book-signing keypair for the sealed ledger.
// This is an RFC 8032 signing key for the P13 protocol experiment — NOT a crypto wallet,
// no funds, no blockchain. The SEED stays on this phone at ~/.harz-owner-key and
// must NEVER be sent to anyone, including AI agents. Only the PUBLIC KEY below is safe to share.
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

const keyPath = path.join(os.homedir(), '.harz-owner-key');
if (fs.existsSync(keyPath)) {
  console.log('Owner key ALREADY EXISTS at ' + keyPath + ' — not regenerating.');
  console.log('If you lost the seed file, delete it manually and rerun this script.');
  process.exit(0);
}
const seed = crypto.randomBytes(32);
const pkcs8 = Buffer.concat([Buffer.from('302e020100300506032b657004220420','hex'), seed]);
const priv = crypto.createPrivateKey({ key: pkcs8, format: 'der', type: 'pkcs8' });
const pubHex = crypto.createPublicKey(priv).export({ type: 'spki', format: 'der' }).slice(-32).toString('hex');

fs.writeFileSync(keyPath, seed.toString('hex'), { mode: 0o600 });
fs.chmodSync(keyPath, 0o600);

console.log('=== OWNER KEY BORN ON YOUR SOIL ===');
console.log('SEED SAVED (never leaves this phone): ' + keyPath);
console.log('');
console.log('>>> COPY THIS LINE AND SEND IT TO MAGANI (public key — safe):');
console.log(pubHex);
console.log('');
const msg = Buffer.from('harz-owner-key-selftest');
const sig = crypto.sign(null, msg, priv);
console.log('SELF-TEST sign+verify: ' + (crypto.verify(null, msg, crypto.createPublicKey(priv), sig) ? 'PASS' : 'FAIL'));
