// Build capsule v15: the one book adopts engine v1.0.0 (Rung 2 MERGE) via a sealed code_pin.
import { readFileSync, writeFileSync } from 'fs';
const { CAPSULE } = await import('./capsule-v14-canonical.js');
const engineV10 = readFileSync('./protocol/engine-v10.js', 'utf-8');
const E = (new Function(engineV10 + '; return { CONTRACT, verifyExport, digestOf, sha256hex, verifyChain };'))();
const toHex = (b) => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");

const code = { ...CAPSULE.code, '/engine.js': engineV10 };
const code_manifest = { ...CAPSULE.code_manifest, '/engine.js': toHex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(engineV10))) };
const chain = CAPSULE.state.chain;
const tip = chain[chain.length - 1].hash;
const payload = JSON.stringify(code_manifest);
const sealHash = toHex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(tip + '|code_pin|code|' + payload)));
const pinSeal = { id: chain.length + 1, kind: 'code_pin', ref: 'code', payload, prev_hash: tip, hash: sealHash };
const state = { records: CAPSULE.state.records, chain: chain.concat([pinSeal]) };
const digest = await E.digestOf(state, CAPSULE.ui_manifest, code_manifest);
const v15 = {
  manifest: { ...CAPSULE.manifest, version: 'v15-merge-rung2', note: 'Rung 2 MERGE (HarzNet law, Oct 1 2026, owner "Do all and leave 3 later"): engine v1.0.0 adds deterministic state reconciliation. Book history unchanged — 18 records, 44 seals (seal 44 = code_pin adoption of engine v1.0.0). One book, one history.' },
  state, ui_manifest: CAPSULE.ui_manifest, ui: CAPSULE.ui, code_manifest, code, digest
};
const v = await E.verifyExport(v15);
console.log('capsule v15:', v.ok ? 'INTACT' : 'BROKEN — ' + v.verdict);
console.log('digest:', digest.slice(0, 32), '| records:', state.records.length, '| seals:', state.chain.length);
console.log('engine pin:', code_manifest['/engine.js'].slice(0, 16));
if (!v.ok) process.exit(1);
// legacy engine (v0.9 bytes) must also verify the new capsule — safe transition for B/C
const E09 = (new Function(CAPSULE.code['/engine.js'] + '; return { verifyExport };'))();
const v09 = await E09.verifyExport(v15);
console.log('v0.9 engine verifies v15 too:', v09.ok);
writeFileSync('./capsule-v15-merge.js', 'export const CAPSULE = ' + JSON.stringify(v15, null, 1) + ';\n');
