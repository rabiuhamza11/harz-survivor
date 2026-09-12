// HARZ Portable App v0.6.0 — P10 experiment: THE ANCHOR (anchor-gated return gate).
// Source lives on Cloudflare account 3 ('harz'). walkout-contract v0.4:
// walkout-contract v0.5: the engine now also OWNS the write path. Runtime writes are legal
// ONLY while an active walkout marker is sealed in the chain (sealed rule — refused otherwise
// on BOTH substrates). Single-writer: during an active walkout the SOURCE refuses writes by
// a disclosed unsealed glue rule (the sealed engine cannot know which book it runs on); the
// survivor accepts them. The return gate (sealed) ingests any correctly-chained overlay and
// REFUSES forks ('FORK DETECTED — source has post-marker seals'). Marker provenance limit,
// pre-registered: the marker is TRUSTED FROM THE KILL ROUTE, not unforgeable (toy scale).
// The engine exists in one canonical text — sealed as ENGINE_SRC, hashed into the code
// manifest, byte-compared at RUNTIME via Function.prototype.toString (workerd disallows
// executing strings; Deno executes the string directly).
const VERSION = '0.7.0';
const CONTRACT = 'walkout-contract v0.7 — state + UI + code + writes + MULTI-MIRROR ANCHOR walk';

async function sha256hex(s) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, '0')).join('');
}

async function linesOf(m) {
  return Object.keys(m).sort().map(p => p + '|' + m[p]).join('\n');
}

async function digestOf(state, uiManifest, codeManifest) {
  const recs = state.records.map(r => r.id + '|' + r.body + '|' + r.created).join('\n');
  const ch = state.chain.map(r => r.id + '|' + r.kind + '|' + r.ref + '|' + r.payload + '|' + r.prev_hash + '|' + r.hash).join('\n');
  return await sha256hex('RECORDS\n' + recs + '\nCHAIN\n' + ch + '\nUI\n' + await linesOf(uiManifest) + '\nCODE\n' + await linesOf(codeManifest));
}

async function verifyChain(chain) {
  let expected = 'GENESIS', issues = [];
  for (const r of chain) {
    if (r.prev_hash !== expected) issues.push('chain break at ' + r.id);
    const h = await sha256hex(r.prev_hash + '|' + r.kind + '|' + r.ref + '|' + r.payload);
    if (h !== r.hash) issues.push('hash mismatch at ' + r.id);
    expected = r.hash;
  }
  return { ok: issues.length === 0, issues };
}

async function hashAssets(files) {
  const m = {};
  for (const p of Object.keys(files).sort()) m[p] = await sha256hex(files[p]);
  return m;
}

function activeMarker(chain) {
  let marker = null;
  for (const r of chain) {
    if (r.kind === 'walkout_marker') marker = r;
    else if (r.kind === 'return') marker = null;
  }
  return marker;
}

async function canWrite(state) {
  const marker = activeMarker(state.chain || []);
  if (!marker) return { ok: false, reason: 'WRITES SEALED — no active walkout marker (v0.6)' };
  return { ok: true, mode: 'walkout', marker: marker.hash };
}

async function appendWithSeal(state, uiManifest, codeManifest, body, created, actor) {
  const cw = await canWrite(state);
  if (!cw.ok) return { ok: false, reason: cw.reason };
  if (!body || !created) return { ok: false, reason: 'body and created required' };
  const lastRec = state.records.length ? state.records[state.records.length - 1] : { id: 0 };
  const id = (Number(lastRec.id) || 0) + 1;
  const rec = { id, body: String(body).slice(0, 300), created: String(created) };
  const tip = state.chain.length ? state.chain[state.chain.length - 1].hash : 'GENESIS';
  const payload = JSON.stringify({ id, body: rec.body, created: rec.created, actor: String(actor || 'stranger') });
  const hash = await sha256hex(tip + '|record|' + id + '|' + payload);
  const seal = { id: state.chain.length + 1, kind: 'record', ref: String(id), payload, prev_hash: tip, hash };
  const newState = { records: state.records.concat([rec]), chain: state.chain.concat([seal]) };
  return { ok: true, record: rec, seal, state: newState, digest: await digestOf(newState, uiManifest, codeManifest) };
}

async function ingestReturn(sourceState, uiManifest, codeManifest, survivorExport) {
  const fail = (verdict) => ({ ok: false, verdict });
  const ANCHOR_URLS = ['https://raw.githubusercontent.com/rabiuhamza11/harz-survivor/main/anchors/ledger.md', 'https://cdn.jsdelivr.net/gh/rabiuhamza11/harz-survivor@main/anchors/ledger.md', 'https://raw.githack.com/rabiuhamza11/harz-survivor/main/anchors/ledger.md'];
  if (!survivorExport || !survivorExport.state) return fail('BROKEN — malformed survivor export');
  const sChain = survivorExport.state.chain || [];
  const marker = activeMarker(sChain);
  if (!marker) return fail('BROKEN — no active walkout marker in survivor export');
  const srcChain = sourceState.chain || [];
  let mi = -1;
  for (let i = 0; i < srcChain.length; i++) if (srcChain[i].hash === marker.hash) { mi = i; break; }
  if (mi === -1) return fail('BROKEN — marker mismatch: not my walkout');
  const postMarker = srcChain.slice(mi + 1);
  const bookSeals = postMarker.filter(s => s.kind !== 'code_pin' && s.kind !== 'ui_manifest');
  if (bookSeals.length) return fail('FORK DETECTED — source has post-marker book seals');
  const baseRecords = sourceState.records || [];
  const allRecords = survivorExport.state.records || [];
  if (allRecords.length < baseRecords.length) return fail('BROKEN — base records missing');
  for (let i = 0; i < baseRecords.length; i++) {
    const a = baseRecords[i], b = allRecords[i];
    if (String(a.id) !== String(b.id) || a.body !== b.body || a.created !== b.created)
      return fail('BROKEN — base records rewritten');
  }
  let mIdx = -1;
  for (let i = 0; i < sChain.length; i++) if (sChain[i].hash === marker.hash) { mIdx = i; break; }
  const overlay = sChain.slice(mIdx + 1);
  const overlayRecords = allRecords.slice(baseRecords.length);
  const composed = srcChain.slice(0, mi + 1).concat(overlay);
  const v = await verifyChain(composed);
  if (!v.ok) return fail('BROKEN — overlay does not chain from the marker: ' + v.issues.join('; '));
  const baseDigest = await digestOf(sourceState, uiManifest, codeManifest);
  let ledger = null, servedFrom = null, anyReachable = false;
  for (const u of ANCHOR_URLS) {
    try {
      const res = await fetch(u, { cache: 'no-store' });
      if (!res.ok) continue;
      const text = await res.text();
      anyReachable = true;
      if (text.includes(baseDigest)) { ledger = text; servedFrom = u; break; }
    } catch (e) { continue; }
  }
  if (!anyReachable) return fail('BROKEN — ANCHOR UNREACHABLE — return refused fail-closed (all mirrors)');
  if (!ledger) return fail('BROKEN — ANCHOR MISMATCH — pre-marker base ' + baseDigest.slice(0, 16) + '… not found in any reachable anchored history');
  const anchorProof = { url: servedFrom, anchored_base: baseDigest, mirrors_tried: ANCHOR_URLS.length };
  const tip = composed.length ? composed[composed.length - 1].hash : 'GENESIS';
  const payload = JSON.stringify({ ingested_seals: overlay.length, ingested_records: overlayRecords.length, marker: marker.hash, anchor: anchorProof });
  const rhash = await sha256hex(tip + '|return|walkout|' + payload);
  const returnSeal = { id: composed.length + 1, kind: 'return', ref: 'walkout', payload, prev_hash: tip, hash: rhash };
  const newState = { records: baseRecords.concat(overlayRecords), chain: composed.concat([returnSeal]) };
  return { ok: true, verdict: 'RETURN COMPLETE — one book, one history, anchor-verified', state: newState, ingested: { seals: overlay.length, records: overlayRecords.length }, digest: await digestOf(newState, uiManifest, codeManifest) };
}

async function verifyExport(x) {
  const issues = [];
  if (!x || !x.state || !x.ui_manifest || !x.ui || !x.code_manifest || !x.code || !x.digest)
    return { ok: false, issues: ['malformed export'], verdict: 'BROKEN — malformed export' };
  const chain = x.state.chain || [];
  const v = await verifyChain(chain);
  issues.push(...v.issues);
  let seenMarker = false;
  for (const r of chain) {
    if (r.kind === 'walkout_marker') seenMarker = true;
    else if (r.kind === 'return' && !seenMarker) issues.push('return seal without walkout marker at ' + r.id);
  }
  const uiH = await hashAssets(x.ui);
  for (const p of Object.keys(x.ui_manifest)) {
    if (!x.ui[p]) issues.push('missing ui asset ' + p);
    else if (uiH[p] !== x.ui_manifest[p]) issues.push('ui hash mismatch at ' + p);
  }
  const codeH = await hashAssets(x.code);
  for (const p of Object.keys(x.code_manifest)) {
    if (!x.code[p]) issues.push('missing code asset ' + p);
    else if (codeH[p] !== x.code_manifest[p]) issues.push('code hash mismatch at ' + p);
  }
  const pinnedUi = [...chain].reverse().find(s => s.kind === 'ui_manifest');
  if (!pinnedUi) issues.push('no ui_manifest pin in chain');
  else if (pinnedUi.payload !== JSON.stringify(x.ui_manifest)) issues.push('ui_manifest does not match its chain pin');
  const pinnedCode = [...chain].reverse().find(s => s.kind === 'code_pin');
  if (!pinnedCode) issues.push('no code_pin in chain');
  else if (pinnedCode.payload !== JSON.stringify(x.code_manifest)) issues.push('code_manifest does not match its chain pin');
  const d = await digestOf(x.state, x.ui_manifest, x.code_manifest);
  if (d !== x.digest) issues.push('digest mismatch');
  const ok = issues.length === 0;
  return {
    ok,
    issues,
    digest: d,
    writes: activeMarker(chain) ? 'WALKOUT ACTIVE — sealed writes open' : 'WRITES SEALED — no active walkout marker',
    verdict: ok
      ? 'CAPSULE VERIFIED — chain intact, records sealed, ui sealed, code sealed, digest matches (v0.6)'
      : 'BROKEN — ' + issues.join('; ')
  };
}

const C = { sha256hex };

// ---------- SEALED ENGINE (single canonical text) ----------
const ENGINE_SRC = "const CONTRACT = 'walkout-contract v0.7 \u2014 state + UI + code + writes + MULTI-MIRROR ANCHOR walk';\n\nasync function sha256hex(s) {\n  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));\n  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, '0')).join('');\n}\n\nasync function linesOf(m) {\n  return Object.keys(m).sort().map(p => p + '|' + m[p]).join('\\n');\n}\n\nasync function digestOf(state, uiManifest, codeManifest) {\n  const recs = state.records.map(r => r.id + '|' + r.body + '|' + r.created).join('\\n');\n  const ch = state.chain.map(r => r.id + '|' + r.kind + '|' + r.ref + '|' + r.payload + '|' + r.prev_hash + '|' + r.hash).join('\\n');\n  return await sha256hex('RECORDS\\n' + recs + '\\nCHAIN\\n' + ch + '\\nUI\\n' + await linesOf(uiManifest) + '\\nCODE\\n' + await linesOf(codeManifest));\n}\n\nasync function verifyChain(chain) {\n  let expected = 'GENESIS', issues = [];\n  for (const r of chain) {\n    if (r.prev_hash !== expected) issues.push('chain break at ' + r.id);\n    const h = await sha256hex(r.prev_hash + '|' + r.kind + '|' + r.ref + '|' + r.payload);\n    if (h !== r.hash) issues.push('hash mismatch at ' + r.id);\n    expected = r.hash;\n  }\n  return { ok: issues.length === 0, issues };\n}\n\nasync function hashAssets(files) {\n  const m = {};\n  for (const p of Object.keys(files).sort()) m[p] = await sha256hex(files[p]);\n  return m;\n}\n\nfunction activeMarker(chain) {\n  let marker = null;\n  for (const r of chain) {\n    if (r.kind === 'walkout_marker') marker = r;\n    else if (r.kind === 'return') marker = null;\n  }\n  return marker;\n}\n\nasync function canWrite(state) {\n  const marker = activeMarker(state.chain || []);\n  if (!marker) return { ok: false, reason: 'WRITES SEALED \u2014 no active walkout marker (v0.6)' };\n  return { ok: true, mode: 'walkout', marker: marker.hash };\n}\n\nasync function appendWithSeal(state, uiManifest, codeManifest, body, created, actor) {\n  const cw = await canWrite(state);\n  if (!cw.ok) return { ok: false, reason: cw.reason };\n  if (!body || !created) return { ok: false, reason: 'body and created required' };\n  const lastRec = state.records.length ? state.records[state.records.length - 1] : { id: 0 };\n  const id = (Number(lastRec.id) || 0) + 1;\n  const rec = { id, body: String(body).slice(0, 300), created: String(created) };\n  const tip = state.chain.length ? state.chain[state.chain.length - 1].hash : 'GENESIS';\n  const payload = JSON.stringify({ id, body: rec.body, created: rec.created, actor: String(actor || 'stranger') });\n  const hash = await sha256hex(tip + '|record|' + id + '|' + payload);\n  const seal = { id: state.chain.length + 1, kind: 'record', ref: String(id), payload, prev_hash: tip, hash };\n  const newState = { records: state.records.concat([rec]), chain: state.chain.concat([seal]) };\n  return { ok: true, record: rec, seal, state: newState, digest: await digestOf(newState, uiManifest, codeManifest) };\n}\n\nasync function ingestReturn(sourceState, uiManifest, codeManifest, survivorExport) {\n  const fail = (verdict) => ({ ok: false, verdict });\n  const ANCHOR_URLS = ['https://raw.githubusercontent.com/rabiuhamza11/harz-survivor/main/anchors/ledger.md', 'https://cdn.jsdelivr.net/gh/rabiuhamza11/harz-survivor@main/anchors/ledger.md', 'https://raw.githack.com/rabiuhamza11/harz-survivor/main/anchors/ledger.md'];\n  if (!survivorExport || !survivorExport.state) return fail('BROKEN \u2014 malformed survivor export');\n  const sChain = survivorExport.state.chain || [];\n  const marker = activeMarker(sChain);\n  if (!marker) return fail('BROKEN \u2014 no active walkout marker in survivor export');\n  const srcChain = sourceState.chain || [];\n  let mi = -1;\n  for (let i = 0; i < srcChain.length; i++) if (srcChain[i].hash === marker.hash) { mi = i; break; }\n  if (mi === -1) return fail('BROKEN \u2014 marker mismatch: not my walkout');\n  const postMarker = srcChain.slice(mi + 1);\n  const bookSeals = postMarker.filter(s => s.kind !== 'code_pin' && s.kind !== 'ui_manifest');\n  if (bookSeals.length) return fail('FORK DETECTED \u2014 source has post-marker book seals');\n  const baseRecords = sourceState.records || [];\n  const allRecords = survivorExport.state.records || [];\n  if (allRecords.length < baseRecords.length) return fail('BROKEN \u2014 base records missing');\n  for (let i = 0; i < baseRecords.length; i++) {\n    const a = baseRecords[i], b = allRecords[i];\n    if (String(a.id) !== String(b.id) || a.body !== b.body || a.created !== b.created)\n      return fail('BROKEN \u2014 base records rewritten');\n  }\n  let mIdx = -1;\n  for (let i = 0; i < sChain.length; i++) if (sChain[i].hash === marker.hash) { mIdx = i; break; }\n  const overlay = sChain.slice(mIdx + 1);\n  const overlayRecords = allRecords.slice(baseRecords.length);\n  const composed = srcChain.slice(0, mi + 1).concat(overlay);\n  const v = await verifyChain(composed);\n  if (!v.ok) return fail('BROKEN \u2014 overlay does not chain from the marker: ' + v.issues.join('; '));\n  const baseDigest = await digestOf(sourceState, uiManifest, codeManifest);\n  let ledger = null, servedFrom = null, anyReachable = false;\n  for (const u of ANCHOR_URLS) {\n    try {\n      const res = await fetch(u, { cache: 'no-store' });\n      if (!res.ok) continue;\n      const text = await res.text();\n      anyReachable = true;\n      if (text.includes(baseDigest)) { ledger = text; servedFrom = u; break; }\n    } catch (e) { continue; }\n  }\n  if (!anyReachable) return fail('BROKEN \u2014 ANCHOR UNREACHABLE \u2014 return refused fail-closed (all mirrors)');\n  if (!ledger) return fail('BROKEN \u2014 ANCHOR MISMATCH \u2014 pre-marker base ' + baseDigest.slice(0, 16) + '\u2026 not found in any reachable anchored history');\n  const anchorProof = { url: servedFrom, anchored_base: baseDigest, mirrors_tried: ANCHOR_URLS.length };\n  const tip = composed.length ? composed[composed.length - 1].hash : 'GENESIS';\n  const payload = JSON.stringify({ ingested_seals: overlay.length, ingested_records: overlayRecords.length, marker: marker.hash, anchor: anchorProof });\n  const rhash = await sha256hex(tip + '|return|walkout|' + payload);\n  const returnSeal = { id: composed.length + 1, kind: 'return', ref: 'walkout', payload, prev_hash: tip, hash: rhash };\n  const newState = { records: baseRecords.concat(overlayRecords), chain: composed.concat([returnSeal]) };\n  return { ok: true, verdict: 'RETURN COMPLETE \u2014 one book, one history, anchor-verified', state: newState, ingested: { seals: overlay.length, records: overlayRecords.length }, digest: await digestOf(newState, uiManifest, codeManifest) };\n}\n\nasync function verifyExport(x) {\n  const issues = [];\n  if (!x || !x.state || !x.ui_manifest || !x.ui || !x.code_manifest || !x.code || !x.digest)\n    return { ok: false, issues: ['malformed export'], verdict: 'BROKEN \u2014 malformed export' };\n  const chain = x.state.chain || [];\n  const v = await verifyChain(chain);\n  issues.push(...v.issues);\n  let seenMarker = false;\n  for (const r of chain) {\n    if (r.kind === 'walkout_marker') seenMarker = true;\n    else if (r.kind === 'return' && !seenMarker) issues.push('return seal without walkout marker at ' + r.id);\n  }\n  const uiH = await hashAssets(x.ui);\n  for (const p of Object.keys(x.ui_manifest)) {\n    if (!x.ui[p]) issues.push('missing ui asset ' + p);\n    else if (uiH[p] !== x.ui_manifest[p]) issues.push('ui hash mismatch at ' + p);\n  }\n  const codeH = await hashAssets(x.code);\n  for (const p of Object.keys(x.code_manifest)) {\n    if (!x.code[p]) issues.push('missing code asset ' + p);\n    else if (codeH[p] !== x.code_manifest[p]) issues.push('code hash mismatch at ' + p);\n  }\n  const pinnedUi = [...chain].reverse().find(s => s.kind === 'ui_manifest');\n  if (!pinnedUi) issues.push('no ui_manifest pin in chain');\n  else if (pinnedUi.payload !== JSON.stringify(x.ui_manifest)) issues.push('ui_manifest does not match its chain pin');\n  const pinnedCode = [...chain].reverse().find(s => s.kind === 'code_pin');\n  if (!pinnedCode) issues.push('no code_pin in chain');\n  else if (pinnedCode.payload !== JSON.stringify(x.code_manifest)) issues.push('code_manifest does not match its chain pin');\n  const d = await digestOf(x.state, x.ui_manifest, x.code_manifest);\n  if (d !== x.digest) issues.push('digest mismatch');\n  const ok = issues.length === 0;\n  return {\n    ok,\n    issues,\n    digest: d,\n    writes: activeMarker(chain) ? 'WALKOUT ACTIVE \u2014 sealed writes open' : 'WRITES SEALED \u2014 no active walkout marker',\n    verdict: ok\n      ? 'CAPSULE VERIFIED \u2014 chain intact, records sealed, ui sealed, code sealed, digest matches (v0.6)'\n      : 'BROKEN \u2014 ' + issues.join('; ')\n  };\n}";
function liveEngineText() {
  return ["const CONTRACT = '" + CONTRACT + "';", sha256hex.toString(), linesOf.toString(), digestOf.toString(), verifyChain.toString(), hashAssets.toString(), activeMarker.toString(), canWrite.toString(), appendWithSeal.toString(), ingestReturn.toString(), verifyExport.toString()].join('\n\n');
}
const engineSealed = () => liveEngineText() === ENGINE_SRC;

const CSS = '*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,system-ui,sans-serif;background:#f0f2f5;color:#1a1a1a}header{background:#0a7d3c;color:#fff;padding:14px 16px;position:sticky;top:0}header b{font-size:17px}header .v{font-size:11px;opacity:.85}.wrap{max-width:760px;margin:0 auto;padding:16px}.card{background:#fff;border-radius:12px;padding:14px 16px;margin:12px 0;box-shadow:0 1px 4px rgba(0,0,0,.08)}h2{font-size:14px;color:#0a7d3c;margin-bottom:8px}input{width:100%;border:1px solid #ccc;border-radius:8px;padding:10px;font-size:14px;margin-bottom:8px}.btn{padding:10px 16px;border-radius:8px;border:0;background:#0a7d3c;color:#fff;font-size:14px;font-weight:600;cursor:pointer}.ok{color:#0a7d3c;font-weight:600}.mut{color:#666;font-size:12px;line-height:1.5}.rec{padding:6px 0;border-bottom:1px solid #eee;font-size:13px}footer{text-align:center;color:#777;font-size:11px;padding:16px 12px 32px}';
const APPJS = 'const V=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");\nasync function add(){const b=document.getElementById("body").value.trim();if(!b)return;const r=await(await fetch("/api/record",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({body:b})})).json();if(!r.ok)document.getElementById("st").innerHTML=\'<span class="mut">\'+V(r.verdict||r.error)+"</span>";document.getElementById("body").value="";load()}\nasync function load(){const v=await(await fetch("/api/verify")).json();document.getElementById("st").innerHTML=\'<span class="ok">\'+V(v.verdict)+\'</span><br><span class="mut">records: \'+v.records+" &middot; seals: "+v.chain_length+" &middot; digest: "+String(v.digest).slice(0,24)+"&hellip; &middot; ui: "+String(v.ui_ok?"SEALED":"?")+" &middot; code: "+String(v.code_ok?"SEALED":"?")+" &middot; writes: "+V(v.writes||"?")+"</span>";const r=await(await fetch("/api/records")).json();document.getElementById("recs").innerHTML=(r.records||[]).map(x=>\'<div class="rec"><b>\'+x.id+"</b> &middot; "+V(x.body)+\'<br><span class="mut">\'+V(x.created)+"</span></div>").join("")||\'<span class="mut">none</span>\'}\nif("serviceWorker" in navigator)navigator.serviceWorker.register("/sw.js");\nload();';

const ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#0a7d3c"/><path d="M30 60h40M50 20v40" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="50" cy="72" r="9" fill="#fff"/></svg>';
const MANIFEST = JSON.stringify({ name: 'HARZ Portable App', short_name: 'Portable', start_url: '/', display: 'standalone', background_color: '#f0f2f5', theme_color: '#0a7d3c', icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }] });
const SW = 'self.addEventListener("install",e=>self.skipWaiting());self.addEventListener("activate",e=>self.clients.claim());self.addEventListener("fetch",e=>{});';
const PAGE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>HARZ Portable App</title><meta name="theme-color" content="#0a7d3c"><link rel="icon" href="/icon.svg"><link rel="manifest" href="/manifest.json"><link rel="stylesheet" href="/app.css"></head><body><header><div><b>HARZ Portable App</b><div class="v">P10: the anchor-gated return &middot; v0.6.0 &middot; 2026-09-12</div></div></header><div class="wrap">
<div class="card"><h2>State</h2><div id="st">loading&hellip;</div></div>
<div class="card"><h2>Sealed write (walkout-gated)</h2><p class="mut">Writes are executed by the SEALED ENGINE and are legal only while a walkout marker is active in the chain. While the source lives and no walkout is open, writes are refused &mdash; by the sealed code itself.</p><input id="body" placeholder="Type anything&hellip;"><button class="btn" onclick="add()">Seal</button></div>
<div class="card"><h2>Sealed records</h2><div id="recs">loading&hellip;</div></div>
<div class="card"><h2>The app works while dead</h2><p class="mut">P9: when the source dies mid-walkout, a stranger can still WRITE here. Every write is executed by the sealed engine, sealed into the chain, and the digest rolls forward. On revival, the sealed return gate ingests the stranger&rsquo;s seals &mdash; one book, one history. Forks are refused: &ldquo;FORK DETECTED&rdquo;.</p></div>
<div class="card"><h2>The code walks</h2><p class="mut">Since P8 the ENGINE itself is part of the export: hashed into a code manifest, pinned into the chain by a code_pin seal. The verdict is a function of the capsule, not the operator&rsquo;s typing. Fetch the sealed engine at /api/source and hash it yourself.</p></div>
<footer>HARZ Portable App v0.6.0 &middot; experiment, not a product &middot; HARZ Digital Services</footer></div>
<script src="/app.js" defer></script></body></html>`;
const ASSETS = { '/': PAGE, '/app.css': CSS, '/app.js': APPJS, '/icon.svg': ICON, '/manifest.json': MANIFEST, '/sw.js': SW };
const CT = { '/': 'text/html;charset=utf-8', '/app.css': 'text/css;charset=utf-8', '/app.js': 'application/javascript;charset=utf-8', '/icon.svg': 'image/svg+xml', '/manifest.json': 'application/json', '/sw.js': 'application/javascript;charset=utf-8' };

async function initDB(env) {
  await env.DB.batch([
    env.DB.prepare('CREATE TABLE IF NOT EXISTS records (id INTEGER PRIMARY KEY AUTOINCREMENT, body TEXT, created TEXT)'),
    env.DB.prepare('CREATE TABLE IF NOT EXISTS chain (id INTEGER PRIMARY KEY AUTOINCREMENT, kind TEXT, ref TEXT, payload TEXT, prev_hash TEXT, hash TEXT)')
  ]);
}
async function appendSeal(env, kind, ref, payloadObj) {
  const payload = JSON.stringify(payloadObj);
  let last = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    if (!last) last = await env.DB.prepare('SELECT hash FROM chain ORDER BY id DESC LIMIT 1').first();
    const prevHash = last ? last.hash : 'GENESIS';
    const hash = await C.sha256hex(prevHash + '|' + kind + '|' + ref + '|' + payload);
    try {
      await env.DB.prepare('INSERT INTO chain (kind, ref, payload, prev_hash, hash) VALUES (?,?,?,?,?)').bind(kind, ref, payload, prevHash, hash).run();
      return hash;
    } catch (e) { last = null; if (attempt === 3) throw e; }
  }
}
async function getState(env) {
  const records = (await env.DB.prepare('SELECT id, body, created FROM records ORDER BY id ASC').all()).results || [];
  const chain = (await env.DB.prepare('SELECT id, kind, ref, payload, prev_hash, hash FROM chain ORDER BY id ASC').all()).results || [];
  return { records, chain };
}

const CODE = { '/engine.js': ENGINE_SRC };
const BOUNDARY = {
  doc: 'HARZ Portable App — Security & Portability Boundary', version: VERSION, date: '2026-09-12',
  guarantees: [
    'Every state change is sealed into a SHA-256 hash chain in D1.',
    'The export describes the ENTIRE app: records, chain, every UI asset, and the ENGINE source itself.',
    'The digest covers state AND interface AND code; a compliant substrate must reproduce it bit-identically.',
    'The engine exists in one canonical text, sealed as a string and hash-pinned: on this substrate (workerd forbids executing strings) every verify re-derives the live functions source via Function.prototype.toString and byte-compares it to the sealed text — executed == sealed enforced at runtime.',
    'P9: runtime writes are executed BY the sealed engine and are legal only while an active walkout marker is sealed in the chain — refused otherwise, by sealed code, on every substrate.',
    'P9: the return gate is sealed code: it ingests only overlays that chain correctly from the walkout marker, refuses rewritten bases, refuses foreign markers, and refuses forks (source post-marker seals => FORK DETECTED).'
  ],
  amendments: [
    { date: '2026-09-12', text: 'v0.7 (death test v3 finding): the v0.6 single-mirror anchor URL (raw.githubusercontent.com) is UNREACHABLE from this substrate\'s egress \u2014 the v3 return refused fail-closed 8 times, honestly, writing nothing. v0.7 seals THREE mirrors of the same git-tracked ledger (raw.githubusercontent, jsdelivr GH mirror, raw.githack); the gate tries each in order, requires the anchored base in ANY reachable mirror, records which mirror served it in the anchor proof, and refuses fail-closed if none is reachable. Mirrors are caches of the public repo: cache lag can delay a mirror, never forge it; three hosts instead of one is a disclosed widening of trust surface, kept auditable via the recorded mirror in the return seal. The fork rule is narrowed honestly: post-marker app-lifecycle seals (code_pin/ui_manifest) are tolerated and dropped on ingest \u2014 post-marker BOOK seals (records etc.) still mean FORK DETECTED. KNOWN MID-WINDOW STATE: between an engine upgrade and the return, verify honestly reports code_manifest chain-pin mismatch until the post-return re-pin \u2014 disclosed, never softened.' }
  ],
  cannot_detect: [
    'Hash seals are tamper-EVIDENCE, not signatures — no authorship is proven.',
    'An attacker who rewrites the ENTIRE exported package (records + chain + UI + code + digest) in lockstep can produce a self-consistent forgery; no external anchor (the documented, unsolved lockstep limit of all hash-only chains).',
    'A sealed hash proves the asset is UNCHANGED, not that it is CORRECT or safe — a sealed bug is still a bug, now including the sealed WRITE path.',
    'P9 MARKER PROVENANCE: the walkout marker is sealed through the desk write path at T0. Its hash proves it unchanged, NOT who sealed it. At this scale the marker is TRUSTED FROM THE KILL ROUTE; the /walkout/prepare route is not key-gated and marker unforgeability is NOT tested (deferred owner Option B).',
    'P9 SINGLE-WRITER: writes during a walkout are proven for ONE writer on ONE survivor. Not multi-writer consensus, not failover, not a distributed database. A chain cannot distinguish which physical book it runs on: while a walkout is active the SOURCE refuses writes by an UNSEALED glue rule (disclosed); if that glue is bypassed the sealed return gate detects the fork — detection is the mechanism, prevention is operator discipline (the P4 law).',
    'The Workers glue (D1 writes, routing, marker seal path, source write-refusal during walkout) is substrate-specific and NOT sealed; on the survivor the Deno KV overlay persistence is likewise unsealed glue. The sealed part is the engine: digest, verify, write append, return ingest.',
    'The source-side executed==sealed check depends on Function.prototype.toString being faithful; a hostile runtime could lie. On Deno the sealed string is executed directly (eval allowed) so the check there is construction, not trust.',
    'A substrate must faithfully execute the sealed bytes; a hostile runtime could lie about execution.'
  ],
  trust: ['The export is only as trustworthy as whoever hands it to you. Verify against the source while it lives; after its death, the chain is the only witness.'],
  research: 'P9 experiment of the cloud-substrate research program. Prototype at test scale. Not a product.'
};
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' } });
export default {
  async fetch(request, env) {
    await initDB(env);
    const P = new URL(request.url).pathname;
    if (ASSETS[P] !== undefined && P !== '/api') return new Response(ASSETS[P], { headers: { 'content-type': CT[P] } });
    if (P === '/api/health') return json({ ok: true, service: 'HARZ Portable App', version: VERSION, contract: CONTRACT, engine: engineSealed() ? 'sealed-verified' : 'SEALED-ENGINE-MISMATCH' });
    if (P === '/api/boundary' || P === '/boundary') return json(BOUNDARY);
    if (P === '/api/record' && request.method === 'POST') {
      let b; try { b = await request.json(); } catch { return json({ ok: false, error: 'bad json' }, 400); }
      const body = String(b.body || '').trim().slice(0, 300);
      if (!body) return json({ ok: false, error: 'body required' }, 400);
      const state = await getState(env);
      const cw = await canWrite(state);
      if (!cw.ok) return json({ ok: false, verdict: cw.reason, writes: 'sealed-refused' }, 403);
      return json({ ok: false, verdict: 'WRITES REFUSED ON SOURCE — single-writer: during an active walkout writes live on the survivor (glue rule, disclosed unsealed)', writes: 'glue-refused' }, 403);
    }
    if (P === '/walkout/prepare' && request.method === 'POST') {
      const state = await getState(env);
      const cw = await canWrite(state);
      if (cw.ok) return json({ ok: false, verdict: 'walkout already open' }, 409);
      await appendSeal(env, 'walkout_marker', 'walkout', { t0: new Date().toISOString(), note: 'walkout opened by desk on owner word (P9 discipline) — marker trusted from the kill route, not unforgeable (see /boundary)' });
      return json({ ok: true, verdict: 'WALKOUT OPEN — sealed writes now legal on the book that carries this marker' });
    }
    if (P === '/walkout/return' && request.method === 'POST') {
      let b; try { b = await request.json(); } catch { return json({ ok: false, error: 'bad json' }, 400); }
      if (!b.export) return json({ ok: false, error: 'export required' }, 400);
      if (!engineSealed()) return json({ ok: false, verdict: 'BROKEN — live engine does not match sealed source' }, 500);
      const m = await hashAssets(ASSETS);
      const cm = await hashAssets(CODE);
      const state = await getState(env);
      const ret = await ingestReturn(state, m, cm, b.export);
      if (!ret.ok) return json({ ok: false, verdict: ret.verdict, fork: /FORK DETECTED/.test(ret.verdict) }, 409);
      for (const rec of ret.state.records.slice(state.records.length))
        await env.DB.prepare('INSERT INTO records (body, created) VALUES (?,?)').bind(rec.body, rec.created).run();
      for (const sl of ret.state.chain.slice(state.chain.length))
        await env.DB.prepare('INSERT INTO chain (kind, ref, payload, prev_hash, hash) VALUES (?,?,?,?,?)').bind(sl.kind, sl.ref, sl.payload, sl.prev_hash, sl.hash).run();
      const after = await getState(env);
      const digest = await digestOf(after, m, cm);
      const v = await verifyExport({ state: after, ui_manifest: m, ui: ASSETS, code_manifest: cm, code: CODE, digest });
      return json({ ok: v.ok, verdict: ret.verdict + (v.ok ? '' : ' — BUT POST-RETURN VERIFY FAILED'), records: after.records.length, chain_length: after.chain.length, digest, ingested: ret.ingested });
    }
    if (P === '/api/records') {
      const records = (await env.DB.prepare('SELECT id, body, created FROM records ORDER BY id ASC').all()).results || [];
      const cw = await canWrite(await getState(env));
      return json({ ok: true, records, writes: cw.ok ? 'WALKOUT ACTIVE — sealed writes open' : cw.reason });
    }
    if (P === '/api/source') {
      const cm = await hashAssets(CODE);
      const h = await sha256hex(ENGINE_SRC);
      if (h !== cm['/engine.js']) return json({ ok: false, error: 'engine bytes do not match code manifest' }, 500);
      return new Response(ENGINE_SRC, { headers: { 'content-type': 'application/javascript;charset=utf-8', 'access-control-allow-origin': '*' } });
    }
    if (P === '/api/verify') {
      if (!engineSealed()) return json({ ok: false, verdict: 'BROKEN — live engine does not match sealed source', engine: 'SEALED-ENGINE-MISMATCH' });
      const m = await hashAssets(ASSETS);
      const cm = await hashAssets(CODE);
      const state = await getState(env);
      const digest = await digestOf(state, m, cm);
      const v = await verifyExport({ state, ui_manifest: m, ui: ASSETS, code_manifest: cm, code: CODE, digest });
      const pinnedUi = [...state.chain].reverse().find(s => s.kind === 'ui_manifest');
      const pinnedCode = [...state.chain].reverse().find(s => s.kind === 'code_pin');
      return json({ ok: v.ok, verdict: v.ok ? 'PORTABLE STATE INTACT' : v.verdict, records: state.records.length, chain_length: state.chain.length, digest, writes: v.writes, ui_ok: pinnedUi ? pinnedUi.payload === JSON.stringify(m) : false, code_ok: pinnedCode ? pinnedCode.payload === JSON.stringify(cm) : false, contract: CONTRACT, engine: 'sealed-verified' });
    }
    if (P === '/api/export') {
      const m = await hashAssets(ASSETS);
      const cm = await hashAssets(CODE);
      const pinnedUi = await env.DB.prepare("SELECT payload FROM chain WHERE kind = 'ui_manifest' ORDER BY id DESC LIMIT 1").first();
      if (!pinnedUi || pinnedUi.payload !== JSON.stringify(m)) await appendSeal(env, 'ui_manifest', 'ui', m);
      const pinnedCode = await env.DB.prepare("SELECT payload FROM chain WHERE kind = 'code_pin' ORDER BY id DESC LIMIT 1").first();
      if (!pinnedCode || pinnedCode.payload !== JSON.stringify(cm)) await appendSeal(env, 'code_pin', 'code', cm);
      const state = await getState(env);
      const v = await verifyChain(state.chain);
      return json({
        ok: v.ok,
        manifest: { name: 'HARZ Portable App', version: VERSION, contract: CONTRACT, program: 'P10 — the anchor', origin: { substrate: 'cloudflare-workers', account_label: 'harz (account 3)', store: 'D1 portable-app' }, exported: new Date().toISOString() },
        ui_manifest: m,
        ui: ASSETS,
        code_manifest: cm,
        code: CODE,
        state,
        digest: await digestOf(state, m, cm),
        verify: { ok: v.ok, issues: v.issues }
      });
    }
    return json({ ok: false, error: 'not found' }, 404);
  }
};
