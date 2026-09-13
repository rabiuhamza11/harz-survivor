// CAPSULE v11-RECEIVE — PUBLIC DATA FILE (mesh convergence test v1, P2 build freeze).
// The death test v4 returned book (17 records, 33 seals) UNCHANGED, plus code_pin
// seal #34 pinning the hpr-1.1.0 engine (receive gate: f791cd14).
// Export for import:
export const CAPSULE = {
 "ok": true,
 "manifest": {
  "name": "HARZ Portable App",
  "version": "1.1.0",
  "contract": "walkout-contract v0.7 — state + UI + code + writes + MULTI-MIRROR ANCHOR walk",
  "program": "MESH v1 — the book walks (receive gate sealed, P2)",
  "origin": {
   "substrate": "cloudflare-workers",
   "account_label": "harz (account 3)",
   "store": "D1 portable-app"
  },
  "exported": "2026-09-13T12:42:08.200Z"
 },
 "ui_manifest": {
  "/": "d157a4ad8e927ad7a2a0d791a855f04a3c3d6b1ccec264d01be59d9587589271",
  "/app.css": "3ab1b0c604b9f0f3f713470ee2be647ff1f263fbb33d663c97c9f5a2b1945e4d",
  "/app.js": "d13021d394fb0ef1361a4ce7dfcefbacdecd135534d45fcd1b6d88e60b31d447",
  "/icon.svg": "e44942aa60534e02c4adf9aa61978f4e6f9c882258ad40b2837421a275d07c7e",
  "/manifest.json": "7f2073454491c1f64758e50ea8d15728055b5de1a1d89c144d5bb724fbe61acf",
  "/sw.js": "5be88993b28d80c4aa8b1a1a13682a9ae10294229891e4d6448d7ab6b6c85466"
 },
 "ui": {
  "/": "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>HARZ Portable App</title><meta name=\"theme-color\" content=\"#0a7d3c\"><link rel=\"icon\" href=\"/icon.svg\"><link rel=\"manifest\" href=\"/manifest.json\"><link rel=\"stylesheet\" href=\"/app.css\"></head><body><header><div><b>HARZ Portable App</b><div class=\"v\">P10: the anchor-gated return &middot; v0.7.0 &middot; 2026-09-12</div></div></header><div class=\"wrap\">\n<div class=\"card\"><h2>State</h2><div id=\"st\">loading&hellip;</div></div>\n<div class=\"card\"><h2>Sealed write (walkout-gated)</h2><p class=\"mut\">Writes are executed by the SEALED ENGINE and are legal only while a walkout marker is active in the chain. While the source lives and no walkout is open, writes are refused &mdash; by the sealed code itself.</p><input id=\"body\" placeholder=\"Type anything&hellip;\"><button class=\"btn\" onclick=\"add()\">Seal</button></div>\n<div class=\"card\"><h2>Sealed records</h2><div id=\"recs\">loading&hellip;</div></div>\n<div class=\"card\"><h2>The app works while dead</h2><p class=\"mut\">P9: when the source dies mid-walkout, a stranger can still WRITE here. Every write is executed by the sealed engine, sealed into the chain, and the digest rolls forward. On revival, the sealed return gate ingests the stranger&rsquo;s seals &mdash; one book, one history. Forks are refused: &ldquo;FORK DETECTED&rdquo;.</p></div>\n<div class=\"card\"><h2>The code walks</h2><p class=\"mut\">Since P8 the ENGINE itself is part of the export: hashed into a code manifest, pinned into the chain by a code_pin seal. The verdict is a function of the capsule, not the operator&rsquo;s typing. Fetch the sealed engine at /api/source and hash it yourself.</p></div>\n<footer>HARZ Portable App v0.7.0 &middot; experiment, not a product &middot; HARZ Digital Services</footer></div>\n<script src=\"/app.js\" defer></script></body></html>",
  "/app.css": "*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,system-ui,sans-serif;background:#f0f2f5;color:#1a1a1a}header{background:#0a7d3c;color:#fff;padding:14px 16px;position:sticky;top:0}header b{font-size:17px}header .v{font-size:11px;opacity:.85}.wrap{max-width:760px;margin:0 auto;padding:16px}.card{background:#fff;border-radius:12px;padding:14px 16px;margin:12px 0;box-shadow:0 1px 4px rgba(0,0,0,.08)}h2{font-size:14px;color:#0a7d3c;margin-bottom:8px}input{width:100%;border:1px solid #ccc;border-radius:8px;padding:10px;font-size:14px;margin-bottom:8px}.btn{padding:10px 16px;border-radius:8px;border:0;background:#0a7d3c;color:#fff;font-size:14px;font-weight:600;cursor:pointer}.ok{color:#0a7d3c;font-weight:600}.mut{color:#666;font-size:12px;line-height:1.5}.rec{padding:6px 0;border-bottom:1px solid #eee;font-size:13px}footer{text-align:center;color:#777;font-size:11px;padding:16px 12px 32px}",
  "/app.js": "const V=s=>s.replace(/&/g,\"&amp;\").replace(/</g,\"&lt;\").replace(/>/g,\"&gt;\");\nasync function add(){const b=document.getElementById(\"body\").value.trim();if(!b)return;const r=await(await fetch(\"/api/record\",{method:\"POST\",headers:{\"content-type\":\"application/json\"},body:JSON.stringify({body:b})})).json();if(!r.ok)document.getElementById(\"st\").innerHTML='<span class=\"mut\">'+V(r.verdict||r.error)+\"</span>\";document.getElementById(\"body\").value=\"\";load()}\nasync function load(){const v=await(await fetch(\"/api/verify\")).json();document.getElementById(\"st\").innerHTML='<span class=\"ok\">'+V(v.verdict)+'</span><br><span class=\"mut\">records: '+v.records+\" &middot; seals: \"+v.chain_length+\" &middot; digest: \"+String(v.digest).slice(0,24)+\"&hellip; &middot; ui: \"+String(v.ui_ok?\"SEALED\":\"?\")+\" &middot; code: \"+String(v.code_ok?\"SEALED\":\"?\")+\" &middot; writes: \"+V(v.writes||\"?\")+\"</span>\";const r=await(await fetch(\"/api/records\")).json();document.getElementById(\"recs\").innerHTML=(r.records||[]).map(x=>'<div class=\"rec\"><b>'+x.id+\"</b> &middot; \"+V(x.body)+'<br><span class=\"mut\">'+V(x.created)+\"</span></div>\").join(\"\")||'<span class=\"mut\">none</span>'}\nif(\"serviceWorker\" in navigator)navigator.serviceWorker.register(\"/sw.js\");\nload();",
  "/icon.svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" rx=\"20\" fill=\"#0a7d3c\"/><path d=\"M30 60h40M50 20v40\" stroke=\"#fff\" stroke-width=\"8\" fill=\"none\" stroke-linecap=\"round\"/><circle cx=\"50\" cy=\"72\" r=\"9\" fill=\"#fff\"/></svg>",
  "/manifest.json": "{\"name\":\"HARZ Portable App\",\"short_name\":\"Portable\",\"start_url\":\"/\",\"display\":\"standalone\",\"background_color\":\"#f0f2f5\",\"theme_color\":\"#0a7d3c\",\"icons\":[{\"src\":\"/icon.svg\",\"sizes\":\"any\",\"type\":\"image/svg+xml\"}]}",
  "/sw.js": "self.addEventListener(\"install\",e=>self.skipWaiting());self.addEventListener(\"activate\",e=>self.clients.claim());self.addEventListener(\"fetch\",e=>{});"
 },
 "code_manifest": {
  "/engine.js": "10d6bd5abeb02a1529de6c67a682154f94f46fee6601468eb8f47908f77d5136"
 },
 "code": {
  "/engine.js": "const CONTRACT = 'walkout-contract v0.7 — state + UI + code + writes + MULTI-MIRROR ANCHOR walk';\n\nasync function sha256hex(s) {\n  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));\n  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, '0')).join('');\n}\n\nasync function linesOf(m) {\n  return Object.keys(m).sort().map(p => p + '|' + m[p]).join('\\n');\n}\n\nasync function digestOf(state, uiManifest, codeManifest) {\n  const recs = state.records.map(r => r.id + '|' + r.body + '|' + r.created).join('\\n');\n  const ch = state.chain.map(r => r.id + '|' + r.kind + '|' + r.ref + '|' + r.payload + '|' + r.prev_hash + '|' + r.hash).join('\\n');\n  return await sha256hex('RECORDS\\n' + recs + '\\nCHAIN\\n' + ch + '\\nUI\\n' + await linesOf(uiManifest) + '\\nCODE\\n' + await linesOf(codeManifest));\n}\n\nasync function verifyChain(chain) {\n  let expected = 'GENESIS', issues = [];\n  for (const r of chain) {\n    if (r.prev_hash !== expected) issues.push('chain break at ' + r.id);\n    const h = await sha256hex(r.prev_hash + '|' + r.kind + '|' + r.ref + '|' + r.payload);\n    if (h !== r.hash) issues.push('hash mismatch at ' + r.id);\n    expected = r.hash;\n  }\n  return { ok: issues.length === 0, issues };\n}\n\nasync function hashAssets(files) {\n  const m = {};\n  for (const p of Object.keys(files).sort()) m[p] = await sha256hex(files[p]);\n  return m;\n}\n\nfunction activeMarker(chain) {\n  let marker = null;\n  for (const r of chain) {\n    if (r.kind === 'walkout_marker') marker = r;\n    else if (r.kind === 'return') marker = null;\n  }\n  return marker;\n}\n\nasync function canWrite(state) {\n  const marker = activeMarker(state.chain || []);\n  if (!marker) return { ok: false, reason: 'WRITES SEALED — no active walkout marker (v0.6)' };\n  return { ok: true, mode: 'walkout', marker: marker.hash };\n}\n\nasync function appendWithSeal(state, uiManifest, codeManifest, body, created, actor) {\n  const cw = await canWrite(state);\n  if (!cw.ok) return { ok: false, reason: cw.reason };\n  if (!body || !created) return { ok: false, reason: 'body and created required' };\n  const lastRec = state.records.length ? state.records[state.records.length - 1] : { id: 0 };\n  const id = (Number(lastRec.id) || 0) + 1;\n  const rec = { id, body: String(body).slice(0, 300), created: String(created) };\n  const tip = state.chain.length ? state.chain[state.chain.length - 1].hash : 'GENESIS';\n  const payload = JSON.stringify({ id, body: rec.body, created: rec.created, actor: String(actor || 'stranger') });\n  const hash = await sha256hex(tip + '|record|' + id + '|' + payload);\n  const seal = { id: state.chain.length + 1, kind: 'record', ref: String(id), payload, prev_hash: tip, hash };\n  const newState = { records: state.records.concat([rec]), chain: state.chain.concat([seal]) };\n  return { ok: true, record: rec, seal, state: newState, digest: await digestOf(newState, uiManifest, codeManifest) };\n}\n\nasync function ingestReturn(sourceState, uiManifest, codeManifest, survivorExport) {\n  const fail = (verdict) => ({ ok: false, verdict });\n  const ANCHOR_URLS = ['https://raw.githubusercontent.com/rabiuhamza11/harz-survivor/main/anchors/ledger.md', 'https://cdn.jsdelivr.net/gh/rabiuhamza11/harz-survivor@main/anchors/ledger.md', 'https://raw.githack.com/rabiuhamza11/harz-survivor/main/anchors/ledger.md'];\n  if (!survivorExport || !survivorExport.state) return fail('BROKEN — malformed survivor export');\n  const sChain = survivorExport.state.chain || [];\n  const marker = activeMarker(sChain);\n  if (!marker) return fail('BROKEN — no active walkout marker in survivor export');\n  const srcChain = sourceState.chain || [];\n  let mi = -1;\n  for (let i = 0; i < srcChain.length; i++) if (srcChain[i].hash === marker.hash) { mi = i; break; }\n  if (mi === -1) return fail('BROKEN — marker mismatch: not my walkout');\n  const postMarker = srcChain.slice(mi + 1);\n  const bookSeals = postMarker.filter(s => s.kind !== 'code_pin' && s.kind !== 'ui_manifest');\n  if (bookSeals.length) return fail('FORK DETECTED — source has post-marker book seals');\n  const baseRecords = sourceState.records || [];\n  const allRecords = survivorExport.state.records || [];\n  if (allRecords.length < baseRecords.length) return fail('BROKEN — base records missing');\n  for (let i = 0; i < baseRecords.length; i++) {\n    const a = baseRecords[i], b = allRecords[i];\n    if (String(a.id) !== String(b.id) || a.body !== b.body || a.created !== b.created)\n      return fail('BROKEN — base records rewritten');\n  }\n  let mIdx = -1;\n  for (let i = 0; i < sChain.length; i++) if (sChain[i].hash === marker.hash) { mIdx = i; break; }\n  const overlay = sChain.slice(mIdx + 1);\n  const overlayRecords = allRecords.slice(baseRecords.length);\n  const composed = srcChain.slice(0, mi + 1).concat(overlay);\n  const v = await verifyChain(composed);\n  if (!v.ok) return fail('BROKEN — overlay does not chain from the marker: ' + v.issues.join('; '));\n  const baseDigest = await digestOf(sourceState, uiManifest, codeManifest);\n  let ledger = null, servedFrom = null, anyReachable = false;\n  for (const u of ANCHOR_URLS) {\n    try {\n      const res = await fetch(u, { cache: 'no-store' });\n      if (!res.ok) continue;\n      const text = await res.text();\n      anyReachable = true;\n      if (text.includes(baseDigest)) { ledger = text; servedFrom = u; break; }\n    } catch (e) { continue; }\n  }\n  if (!anyReachable) return fail('BROKEN — ANCHOR UNREACHABLE — return refused fail-closed (all mirrors)');\n  if (!ledger) return fail('BROKEN — ANCHOR MISMATCH — pre-marker base ' + baseDigest.slice(0, 16) + '… not found in any reachable anchored history');\n  const anchorProof = { url: servedFrom, anchored_base: baseDigest, mirrors_tried: ANCHOR_URLS.length };\n  const tip = composed.length ? composed[composed.length - 1].hash : 'GENESIS';\n  const payload = JSON.stringify({ ingested_seals: overlay.length, ingested_records: overlayRecords.length, marker: marker.hash, anchor: anchorProof });\n  const rhash = await sha256hex(tip + '|return|walkout|' + payload);\n  const returnSeal = { id: composed.length + 1, kind: 'return', ref: 'walkout', payload, prev_hash: tip, hash: rhash };\n  const newState = { records: baseRecords.concat(overlayRecords), chain: composed.concat([returnSeal]) };\n  return { ok: true, verdict: 'RETURN COMPLETE — one book, one history, anchor-verified', state: newState, ingested: { seals: overlay.length, records: overlayRecords.length }, digest: await digestOf(newState, uiManifest, codeManifest) };\n}\n\nasync function verifyExport(x) {\n  const issues = [];\n  if (!x || !x.state || !x.ui_manifest || !x.ui || !x.code_manifest || !x.code || !x.digest)\n    return { ok: false, issues: ['malformed export'], verdict: 'BROKEN — malformed export' };\n  const chain = x.state.chain || [];\n  const v = await verifyChain(chain);\n  issues.push(...v.issues);\n  let seenMarker = false;\n  for (const r of chain) {\n    if (r.kind === 'walkout_marker') seenMarker = true;\n    else if (r.kind === 'return' && !seenMarker) issues.push('return seal without walkout marker at ' + r.id);\n  }\n  const uiH = await hashAssets(x.ui);\n  for (const p of Object.keys(x.ui_manifest)) {\n    if (!x.ui[p]) issues.push('missing ui asset ' + p);\n    else if (uiH[p] !== x.ui_manifest[p]) issues.push('ui hash mismatch at ' + p);\n  }\n  const codeH = await hashAssets(x.code);\n  for (const p of Object.keys(x.code_manifest)) {\n    if (!x.code[p]) issues.push('missing code asset ' + p);\n    else if (codeH[p] !== x.code_manifest[p]) issues.push('code hash mismatch at ' + p);\n  }\n  const pinnedUi = [...chain].reverse().find(s => s.kind === 'ui_manifest');\n  if (!pinnedUi) issues.push('no ui_manifest pin in chain');\n  else if (pinnedUi.payload !== JSON.stringify(x.ui_manifest)) issues.push('ui_manifest does not match its chain pin');\n  const pinnedCode = [...chain].reverse().find(s => s.kind === 'code_pin');\n  if (!pinnedCode) issues.push('no code_pin in chain');\n  else if (pinnedCode.payload !== JSON.stringify(x.code_manifest)) issues.push('code_manifest does not match its chain pin');\n  const d = await digestOf(x.state, x.ui_manifest, x.code_manifest);\n  if (d !== x.digest) issues.push('digest mismatch');\n  const ok = issues.length === 0;\n  return {\n    ok,\n    issues,\n    digest: d,\n    writes: activeMarker(chain) ? 'WALKOUT ACTIVE — sealed writes open' : 'WRITES SEALED — no active walkout marker',\n    verdict: ok\n      ? 'CAPSULE VERIFIED — chain intact, records sealed, ui sealed, code sealed, digest matches (v0.6)'\n      : 'BROKEN — ' + issues.join('; ')\n  };\n}\n// ============================================================================\n// hpr-1.1.0 — MESH CONVERGENCE TEST v1 receive gate (P2, pre-registered:\n// anchors/mesh-v1/PREREGISTRATION.md, frozen 2026-09-13, owner GO on record).\n// APPENDED, NOT MODIFIED: every v1.0.0 behavior above is byte-frozen.\n// Pure and deterministic: all inputs explicit, no clock, no randomness.\n// The engine never travels over the rail; both seats pin it by hash.\n// Verdicts: REFUSED (sig/hash/pin/manifest/verify/digest) — zero partial\n// ingest; FORK DETECTED (local chain is not a prefix of the received chain)\n// — no silent merge, both books unchanged, owner ruling required;\n// CONVERGED (byte-identical books, nothing written); ADOPTED (local chain is\n// a strict prefix — the received book is ingested and the event is SEALED\n// as a mesh_ingest seal; the digest rolls forward at the receiving seat).\n// ============================================================================\n\nfunction canonical(x) {\n  if (x === null || typeof x !== 'object') return JSON.stringify(x);\n  if (Array.isArray(x)) return '[' + x.map(canonical).join(',') + ']';\n  return '{' + Object.keys(x).sort().map(k => JSON.stringify(k) + ':' + canonical(x[k])).join(',') + '}';\n}\n\nasync function receiveBundle(input) {\n  const b = input && input.bundle, localState = input && input.localState;\n  const localUiManifest = input && input.localUiManifest, localCodeManifest = input && input.localCodeManifest;\n  if (!b || !localState || !localUiManifest || !localCodeManifest) return { ok: false, verdict: 'REFUSED — malformed receive input', zero_ingest: true };\n  const { sig, pub, ...body } = b;\n  if (!sig || !pub || !b.payload || !b.payloadHash || !b.claimedDigest || !b.enginePin || !b.id || !b.from)\n    return { ok: false, verdict: 'REFUSED — unsigned or malformed bundle', zero_ingest: true };\n  // 1. payload integrity\n  if (await sha256hex(canonical(b.payload)) !== b.payloadHash)\n    return { ok: false, verdict: 'REFUSED — payload hash mismatch', zero_ingest: true };\n  // 2. signature — Ed25519 via WebCrypto (portable: Node 20+, Cloudflare, Deno)\n  try {\n    const key = await crypto.subtle.importKey('spki', Uint8Array.from(atob(pub), c => c.charCodeAt(0)), { name: 'Ed25519' }, true, ['verify']);\n    const ok = await crypto.subtle.verify({ name: 'Ed25519' }, key, Uint8Array.from(atob(sig), c => c.charCodeAt(0)), new TextEncoder().encode(canonical(body)));\n    if (!ok) return { ok: false, verdict: 'REFUSED — signature invalid', zero_ingest: true };\n  } catch (e) { return { ok: false, verdict: 'REFUSED — signature check failed: ' + String(e), zero_ingest: true }; }\n  // 3. engine pin — the engine never travels; both seats must hold the same pin\n  if (b.enginePin !== localCodeManifest['/engine.js'])\n    return { ok: false, verdict: 'REFUSED — engine pin mismatch (local ' + String(localCodeManifest['/engine.js']).slice(0, 8) + ' vs bundle ' + String(b.enginePin).slice(0, 8) + ')', zero_ingest: true };\n  // 4. UI manifest parity with my sealed capsule\n  if (canonical(b.payload.ui_manifest) !== canonical(localUiManifest))\n    return { ok: false, verdict: 'REFUSED — ui manifest mismatch vs local sealed capsule', zero_ingest: true };\n  // 5. the received book must verify as a self-consistent capsule, digest claim TRUE\n  const v = await verifyExport(b.payload);\n  if (!v.ok) return { ok: false, verdict: 'REFUSED — sealed verifyExport: ' + v.verdict, zero_ingest: true };\n  if (v.digest !== b.claimedDigest || v.digest !== b.payload.digest)\n    return { ok: false, verdict: 'REFUSED — digest claim mismatch', zero_ingest: true };\n  // 6. fork check — my composed chain must be a PREFIX of the received chain, AND every\n  // local record must be contained byte-identical in the received book (records and seals\n  // grow in pairs; both dimensions are checked so no divergence can slip through either)\n  const mine = localState.chain, theirs = b.payload.state.chain;\n  const mineRec = localState.records, theirsRec = b.payload.state.records;\n  if (mine.length > theirs.length || mineRec.length > theirsRec.length)\n    return { ok: false, verdict: 'FORK DETECTED — local history is longer than the received book; no silent merge, both books unchanged, owner ruling required', zero_ingest: true };\n  for (let i = 0; i < mine.length; i++)\n    if (canonical(mine[i]) !== canonical(theirs[i]))\n      return { ok: false, verdict: 'FORK DETECTED — local chain diverges from the received book at seal ' + mine[i].id + '; no silent merge, both books unchanged, owner ruling required', zero_ingest: true };\n  for (let i = 0; i < mineRec.length; i++)\n    if (canonical(mineRec[i]) !== canonical(theirsRec[i]))\n      return { ok: false, verdict: 'FORK DETECTED — local records diverge from the received book at record ' + mineRec[i].id + '; no silent merge, both books unchanged, owner ruling required', zero_ingest: true };\n  // 7. converged, or adopt with a sealed ingest\n  if (mine.length === theirs.length)\n    return { ok: true, verdict: 'CONVERGED — byte-identical books, nothing written', digest: v.digest, action: 'none' };\n  const tip = theirs[theirs.length - 1].hash;\n  const sealPayload = JSON.stringify({ from: b.from, bundle: b.id, claimed: b.claimedDigest, received_records: b.payload.state.records.length, received_seals: theirs.length, ts: b.ts || null });\n  const sealHash = await sha256hex(tip + '|mesh_ingest|mesh|' + sealPayload);\n  const seal = { id: theirs.length + 1, kind: 'mesh_ingest', ref: 'mesh', payload: sealPayload, prev_hash: tip, hash: sealHash };\n  const newState = { records: b.payload.state.records, chain: theirs.concat([seal]) };\n  const digest = await digestOf(newState, b.payload.ui_manifest, b.payload.code_manifest);\n  return { ok: true, verdict: 'ADOPTED — the book walked in; ingest sealed (one book, one history)', action: 'adopt', state: newState, digest, ingested: { records: b.payload.state.records.length - localState.records.length, seals: theirs.length - mine.length } };\n}\n"
 },
 "state": {
  "records": [
   {
    "id": 1,
    "body": "The interface is part of the app.",
    "created": "2026-09-10T20:11:47.389Z"
   },
   {
    "id": 2,
    "body": "State without a face is half an app.",
    "created": "2026-09-10T20:11:47.624Z"
   },
   {
    "id": 3,
    "body": "When the source dies, the UI walks too.",
    "created": "2026-09-10T20:11:47.817Z"
   },
   {
    "id": 4,
    "body": "P8: the verdict becomes a function of the capsule, not the typing.",
    "created": "2026-09-12T06:21:13.885Z"
   },
   {
    "id": 5,
    "body": "should be refused",
    "created": "2026-09-12T06:57:31.794Z"
   },
   {
    "id": 6,
    "body": "Stranger write 1: the witness writes with no origin to ask. Source dead since 10:10:51Z, confirmed 1042 by three polls.",
    "created": "2026-09-12T10:15:22.363Z"
   },
   {
    "id": 7,
    "body": "Stranger write 2: the book accepts truth from strangers while its home is dark. The sealed engine, not permission, executes this seal.",
    "created": "2026-09-12T10:15:24.599Z"
   },
   {
    "id": 8,
    "body": "TAMPER ATTEMPT: forged overwrite of a sealed record",
    "created": "2026-09-12T10:15:30.662Z"
   },
   {
    "id": 9,
    "body": "TAMPER: </script><script>window.location='evil.example'</script>",
    "created": "2026-09-12T10:15:31.111Z"
   },
   {
    "id": 10,
    "body": "Stranger write 1 (death test v3): the witness writes with no origin to ask. Source dead since 13:02:24Z, confirmed 404 by three polls at 13:06Z. The anchor-gated era begins — this write will be anchored before the return.",
    "created": "2026-09-12T13:06:24.382Z"
   },
   {
    "id": 11,
    "body": "Stranger write 2 (death test v3): the book accepts truth from strangers while its home is dark, and the public ledger carries every step. One book, one history, anchored.",
    "created": "2026-09-12T13:06:24.683Z"
   },
   {
    "id": 12,
    "body": "TAMPER: </script><script>window.location=\"evil.example\"</script>",
    "created": "2026-09-12T13:06:36.716Z"
   },
   {
    "id": 13,
    "body": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "created": "2026-09-12T13:06:37.171Z"
   },
   {
    "id": 14,
    "body": "Witness write, death test v4 S5 (2026-09-13 ~12:29 WAT): written while Node A (Cloudflare, source) is DARK — route disabled, 404/1042 confirmed at fire time. This seal lands on Node C: Infinix Hot 10i, Termux, mobile data, Jalingo — the first HARZ-OWNED soil in the program to accept a sealed write. ",
    "created": "2026-09-13T11:29:51.495Z"
   },
   {
    "id": 15,
    "body": "Harz",
    "created": "2026-09-13T11:31:27.149Z"
   },
   {
    "id": 16,
    "body": "TAMPER ATTEMPT: forged overwrite of a sealed record — targeting record 1",
    "created": "2026-09-13T11:33:11.631Z"
   },
   {
    "id": 17,
    "body": "TAMPER: </script><script>window.location='evil.example'</script>",
    "created": "2026-09-13T11:33:13.571Z"
   }
  ],
  "chain": [
   {
    "id": 1,
    "kind": "record",
    "ref": "1",
    "payload": "{\"id\":1,\"body\":\"The interface is part of the app.\",\"created\":\"2026-09-10T20:11:47.389Z\"}",
    "prev_hash": "GENESIS",
    "hash": "a2a5a0a7797e250231dbce864901b1ff3b482584fbb457ff1f93682529d7a7aa"
   },
   {
    "id": 2,
    "kind": "record",
    "ref": "2",
    "payload": "{\"id\":2,\"body\":\"State without a face is half an app.\",\"created\":\"2026-09-10T20:11:47.624Z\"}",
    "prev_hash": "a2a5a0a7797e250231dbce864901b1ff3b482584fbb457ff1f93682529d7a7aa",
    "hash": "493e9cab60371241cd1a6accca50775ba09f23730a9386c5d2a434b6cb026f5d"
   },
   {
    "id": 3,
    "kind": "record",
    "ref": "3",
    "payload": "{\"id\":3,\"body\":\"When the source dies, the UI walks too.\",\"created\":\"2026-09-10T20:11:47.817Z\"}",
    "prev_hash": "493e9cab60371241cd1a6accca50775ba09f23730a9386c5d2a434b6cb026f5d",
    "hash": "556bdbbbf5a746ff65ce27bb9c2123ade226e3b51c3e91e418fb1b0cf41e0469"
   },
   {
    "id": 4,
    "kind": "ui_manifest",
    "ref": "ui",
    "payload": "{\"/\":\"ad6a2202c4f3e53c0ee1e0d8295c4c94f0c99a11e8b6b06efd12407aff003a26\",\"/app.css\":\"3ab1b0c604b9f0f3f713470ee2be647ff1f263fbb33d663c97c9f5a2b1945e4d\",\"/app.js\":\"c9c545250689080fecc78cce806fc2c7451f3a8f1c6b96a664ef661cb75cbbe3\",\"/icon.svg\":\"e44942aa60534e02c4adf9aa61978f4e6f9c882258ad40b2837421a275d07c7e\",\"/manifest.json\":\"7f2073454491c1f64758e50ea8d15728055b5de1a1d89c144d5bb724fbe61acf\",\"/sw.js\":\"5be88993b28d80c4aa8b1a1a13682a9ae10294229891e4d6448d7ab6b6c85466\"}",
    "prev_hash": "556bdbbbf5a746ff65ce27bb9c2123ade226e3b51c3e91e418fb1b0cf41e0469",
    "hash": "ef7f63efbc6be8f4ff61e5e803cc136c5ee7ef5439e3f75a085d400e77c7fedb"
   },
   {
    "id": 5,
    "kind": "ui_manifest",
    "ref": "ui",
    "payload": "{\"/\":\"8071add5461abc737cb951752a38452a588fb83504a58c68a86650588f106426\",\"/app.css\":\"3ab1b0c604b9f0f3f713470ee2be647ff1f263fbb33d663c97c9f5a2b1945e4d\",\"/app.js\":\"81dab5063246aa87458fcf175961066b74f753381ebbb9dc73876fc7008c4394\",\"/icon.svg\":\"e44942aa60534e02c4adf9aa61978f4e6f9c882258ad40b2837421a275d07c7e\",\"/manifest.json\":\"7f2073454491c1f64758e50ea8d15728055b5de1a1d89c144d5bb724fbe61acf\",\"/sw.js\":\"5be88993b28d80c4aa8b1a1a13682a9ae10294229891e4d6448d7ab6b6c85466\"}",
    "prev_hash": "ef7f63efbc6be8f4ff61e5e803cc136c5ee7ef5439e3f75a085d400e77c7fedb",
    "hash": "6b1a558791fb93faf001ecf8c3c07f615d89fe1233f3970899fc8fc0bd1fc2f4"
   },
   {
    "id": 6,
    "kind": "code_pin",
    "ref": "code",
    "payload": "{\"/engine.js\":\"2c5c8457a238ddf9d6f55b691a827ff29c0f882ef0fefdc2be7b192b57bd64db\"}",
    "prev_hash": "6b1a558791fb93faf001ecf8c3c07f615d89fe1233f3970899fc8fc0bd1fc2f4",
    "hash": "2229f78fad7cf93199857d3d0e092a12f049af283fd173576d2ee965d0dadea7"
   },
   {
    "id": 7,
    "kind": "record",
    "ref": "4",
    "payload": "{\"id\":4,\"body\":\"P8: the verdict becomes a function of the capsule, not the typing.\",\"created\":\"2026-09-12T06:21:13.885Z\"}",
    "prev_hash": "2229f78fad7cf93199857d3d0e092a12f049af283fd173576d2ee965d0dadea7",
    "hash": "99818e9d55ca56e862b09d34dc5ebc9586624c653b4c7d2b8f8f20714e0c1163"
   },
   {
    "id": 8,
    "kind": "record",
    "ref": "5",
    "payload": "{\"id\":5,\"body\":\"should be refused\",\"created\":\"2026-09-12T06:57:31.794Z\"}",
    "prev_hash": "99818e9d55ca56e862b09d34dc5ebc9586624c653b4c7d2b8f8f20714e0c1163",
    "hash": "c5ad730911d8d49b8f4fe79257d5df6c715e1750f63f5fcfeac763903790e0cf"
   },
   {
    "id": 9,
    "kind": "ui_manifest",
    "ref": "ui",
    "payload": "{\"/\":\"c6fabd57cbeb98f376c1fca1a75638f0d9a03678fcc7a6976dc88983b11186b2\",\"/app.css\":\"3ab1b0c604b9f0f3f713470ee2be647ff1f263fbb33d663c97c9f5a2b1945e4d\",\"/app.js\":\"d13021d394fb0ef1361a4ce7dfcefbacdecd135534d45fcd1b6d88e60b31d447\",\"/icon.svg\":\"e44942aa60534e02c4adf9aa61978f4e6f9c882258ad40b2837421a275d07c7e\",\"/manifest.json\":\"7f2073454491c1f64758e50ea8d15728055b5de1a1d89c144d5bb724fbe61acf\",\"/sw.js\":\"5be88993b28d80c4aa8b1a1a13682a9ae10294229891e4d6448d7ab6b6c85466\"}",
    "prev_hash": "c5ad730911d8d49b8f4fe79257d5df6c715e1750f63f5fcfeac763903790e0cf",
    "hash": "9f86741c2fddcaa800757c7c22255ae0c574618b4f82e89732b474a79a1c7909"
   },
   {
    "id": 10,
    "kind": "code_pin",
    "ref": "code",
    "payload": "{\"/engine.js\":\"49133c797df7265b4c184eaa70ba84dbc52e7fae76be768ffb80dc80c31f1c28\"}",
    "prev_hash": "9f86741c2fddcaa800757c7c22255ae0c574618b4f82e89732b474a79a1c7909",
    "hash": "31b59f959e012c641910d36b7e33bb4668e4580428d9b9e80322ea214fc90573"
   },
   {
    "id": 11,
    "kind": "walkout_marker",
    "ref": "walkout",
    "payload": "{\"t0\":\"2026-09-12T10:07:27.893Z\",\"note\":\"walkout opened by desk on owner word (P9 discipline) — marker trusted from the kill route, not unforgeable (see /boundary)\"}",
    "prev_hash": "31b59f959e012c641910d36b7e33bb4668e4580428d9b9e80322ea214fc90573",
    "hash": "1bdbd15c3ca556cbadcdc8c9d4f02625059f76dedbd15c9e0bc48cd10d7985ae"
   },
   {
    "id": 12,
    "kind": "record",
    "ref": "6",
    "payload": "{\"id\":6,\"body\":\"Stranger write 1: the witness writes with no origin to ask. Source dead since 10:10:51Z, confirmed 1042 by three polls.\",\"created\":\"2026-09-12T10:15:22.363Z\",\"actor\":\"stranger\"}",
    "prev_hash": "1bdbd15c3ca556cbadcdc8c9d4f02625059f76dedbd15c9e0bc48cd10d7985ae",
    "hash": "bf207bccca04934fb394e3cac499f5233f67aae27fb425ba4a13ddebe301d81f"
   },
   {
    "id": 13,
    "kind": "record",
    "ref": "7",
    "payload": "{\"id\":7,\"body\":\"Stranger write 2: the book accepts truth from strangers while its home is dark. The sealed engine, not permission, executes this seal.\",\"created\":\"2026-09-12T10:15:24.599Z\",\"actor\":\"stranger\"}",
    "prev_hash": "bf207bccca04934fb394e3cac499f5233f67aae27fb425ba4a13ddebe301d81f",
    "hash": "4531671867f93ab862ea81c587e6dbc4a2cf74a8eca04c165589a147d4a9d82b"
   },
   {
    "id": 14,
    "kind": "record",
    "ref": "8",
    "payload": "{\"id\":8,\"body\":\"TAMPER ATTEMPT: forged overwrite of a sealed record\",\"created\":\"2026-09-12T10:15:30.662Z\",\"actor\":\"stranger\"}",
    "prev_hash": "4531671867f93ab862ea81c587e6dbc4a2cf74a8eca04c165589a147d4a9d82b",
    "hash": "4c20b3cb03b36ada3a258a8e2d7a73201128335c0f88283cb1abedbc603434d4"
   },
   {
    "id": 15,
    "kind": "record",
    "ref": "9",
    "payload": "{\"id\":9,\"body\":\"TAMPER: </script><script>window.location='evil.example'</script>\",\"created\":\"2026-09-12T10:15:31.111Z\",\"actor\":\"stranger\"}",
    "prev_hash": "4c20b3cb03b36ada3a258a8e2d7a73201128335c0f88283cb1abedbc603434d4",
    "hash": "ff2ca631e9bcb2c94f6f04c157bd48ac29f5ba33be3c4a08f317b9edbecd040b"
   },
   {
    "id": 16,
    "kind": "return",
    "ref": "walkout",
    "payload": "{\"ingested_seals\":4,\"ingested_records\":4,\"marker\":\"1bdbd15c3ca556cbadcdc8c9d4f02625059f76dedbd15c9e0bc48cd10d7985ae\"}",
    "prev_hash": "ff2ca631e9bcb2c94f6f04c157bd48ac29f5ba33be3c4a08f317b9edbecd040b",
    "hash": "8101e8042f25d1098ab84fd4c448f08b776d756b2dddd08c2035738a1000f11d"
   },
   {
    "id": 17,
    "kind": "ui_manifest",
    "ref": "ui",
    "payload": "{\"/\":\"93df1d4d0cce23b681e94f56c8538870b01f2d5942d922bc68dfb37c647cadff\",\"/app.css\":\"3ab1b0c604b9f0f3f713470ee2be647ff1f263fbb33d663c97c9f5a2b1945e4d\",\"/app.js\":\"d13021d394fb0ef1361a4ce7dfcefbacdecd135534d45fcd1b6d88e60b31d447\",\"/icon.svg\":\"e44942aa60534e02c4adf9aa61978f4e6f9c882258ad40b2837421a275d07c7e\",\"/manifest.json\":\"7f2073454491c1f64758e50ea8d15728055b5de1a1d89c144d5bb724fbe61acf\",\"/sw.js\":\"5be88993b28d80c4aa8b1a1a13682a9ae10294229891e4d6448d7ab6b6c85466\"}",
    "prev_hash": "8101e8042f25d1098ab84fd4c448f08b776d756b2dddd08c2035738a1000f11d",
    "hash": "c3f480dd1da2b14a0b2f1f825b670772c9074cb789442eb27987703148807168"
   },
   {
    "id": 18,
    "kind": "code_pin",
    "ref": "code",
    "payload": "{\"/engine.js\":\"380c24a9bd96a1ccc3168327f17a0855f47c91a5e7868bee8b6cecf9a83df030\"}",
    "prev_hash": "c3f480dd1da2b14a0b2f1f825b670772c9074cb789442eb27987703148807168",
    "hash": "c7ffa24afe82b7191db9564a307b332d396195981a653d1b0dcbc4e04e9b2731"
   },
   {
    "id": 19,
    "kind": "code_pin",
    "ref": "code",
    "payload": "{\"/engine.js\":\"a5a5f4f6208cb729f5331a77ea84739fcfcd02fd142fe1fccccef322921f27ea\"}",
    "prev_hash": "c7ffa24afe82b7191db9564a307b332d396195981a653d1b0dcbc4e04e9b2731",
    "hash": "f1d267be3c195194e589e0ab1f5a308fe27b2b892a76cf3784c40d65e90709f9"
   },
   {
    "id": 20,
    "kind": "walkout_marker",
    "ref": "walkout",
    "payload": "{\"t0\":\"2026-09-12T12:58:30.770Z\",\"note\":\"walkout opened by desk on owner word (P9 discipline) — marker trusted from the kill route, not unforgeable (see /boundary)\"}",
    "prev_hash": "f1d267be3c195194e589e0ab1f5a308fe27b2b892a76cf3784c40d65e90709f9",
    "hash": "4fa1b5058dd4bef0e3b7a99c91efec0211064f0d1f4de15b5db556860693ff5a"
   },
   {
    "id": 21,
    "kind": "record",
    "ref": "10",
    "payload": "{\"id\":10,\"body\":\"Stranger write 1 (death test v3): the witness writes with no origin to ask. Source dead since 13:02:24Z, confirmed 404 by three polls at 13:06Z. The anchor-gated era begins — this write will be anchored before the return.\",\"created\":\"2026-09-12T13:06:24.382Z\",\"actor\":\"stranger\"}",
    "prev_hash": "4fa1b5058dd4bef0e3b7a99c91efec0211064f0d1f4de15b5db556860693ff5a",
    "hash": "4a4b57aa9530aca7fb93b07d97856572567498cd91da4bd032f7f988f96a41e6"
   },
   {
    "id": 22,
    "kind": "record",
    "ref": "11",
    "payload": "{\"id\":11,\"body\":\"Stranger write 2 (death test v3): the book accepts truth from strangers while its home is dark, and the public ledger carries every step. One book, one history, anchored.\",\"created\":\"2026-09-12T13:06:24.683Z\",\"actor\":\"stranger\"}",
    "prev_hash": "4a4b57aa9530aca7fb93b07d97856572567498cd91da4bd032f7f988f96a41e6",
    "hash": "6371a3a1c6fb3ff592167b62ae3b98081ec58124b630166de42e6080764e65f7"
   },
   {
    "id": 23,
    "kind": "record",
    "ref": "12",
    "payload": "{\"id\":12,\"body\":\"TAMPER: </script><script>window.location=\\\"evil.example\\\"</script>\",\"created\":\"2026-09-12T13:06:36.716Z\",\"actor\":\"stranger\"}",
    "prev_hash": "6371a3a1c6fb3ff592167b62ae3b98081ec58124b630166de42e6080764e65f7",
    "hash": "b9c1486606bddfd29eb3efbeecb5c4681b7156dbd9c3f19e5b4d2b59ff873b3c"
   },
   {
    "id": 24,
    "kind": "record",
    "ref": "13",
    "payload": "{\"id\":13,\"body\":\"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\",\"created\":\"2026-09-12T13:06:37.171Z\",\"actor\":\"stranger\"}",
    "prev_hash": "b9c1486606bddfd29eb3efbeecb5c4681b7156dbd9c3f19e5b4d2b59ff873b3c",
    "hash": "afa411c1d09c6f0b40d52cf8fc5e48cd35c6ba1652a9aa3bb9a4da23025b53cb"
   },
   {
    "id": 25,
    "kind": "return",
    "ref": "walkout",
    "payload": "{\"ingested_seals\":4,\"ingested_records\":4,\"marker\":\"4fa1b5058dd4bef0e3b7a99c91efec0211064f0d1f4de15b5db556860693ff5a\",\"anchor\":{\"url\":\"https://raw.githubusercontent.com/rabiuhamza11/harz-survivor/main/anchors/ledger.md\",\"anchored_base\":\"c30ccdce94159c0a8dd4e460446a81b5d34b5b5b7949b28d0b12981b2633abec\"}}",
    "prev_hash": "afa411c1d09c6f0b40d52cf8fc5e48cd35c6ba1652a9aa3bb9a4da23025b53cb",
    "hash": "1b51105387cc934dc4f6ffa68d22ebd217c8f29a8d21fd1012f7f4928c1f2b51"
   },
   {
    "id": 26,
    "kind": "ui_manifest",
    "ref": "ui",
    "payload": "{\"/\":\"d157a4ad8e927ad7a2a0d791a855f04a3c3d6b1ccec264d01be59d9587589271\",\"/app.css\":\"3ab1b0c604b9f0f3f713470ee2be647ff1f263fbb33d663c97c9f5a2b1945e4d\",\"/app.js\":\"d13021d394fb0ef1361a4ce7dfcefbacdecd135534d45fcd1b6d88e60b31d447\",\"/icon.svg\":\"e44942aa60534e02c4adf9aa61978f4e6f9c882258ad40b2837421a275d07c7e\",\"/manifest.json\":\"7f2073454491c1f64758e50ea8d15728055b5de1a1d89c144d5bb724fbe61acf\",\"/sw.js\":\"5be88993b28d80c4aa8b1a1a13682a9ae10294229891e4d6448d7ab6b6c85466\"}",
    "prev_hash": "1b51105387cc934dc4f6ffa68d22ebd217c8f29a8d21fd1012f7f4928c1f2b51",
    "hash": "fbce70507d8c524804f51bd4c035afae9450b52134b503d744775de12c41c0f7"
   },
   {
    "id": 27,
    "kind": "code_pin",
    "ref": "code",
    "payload": "{\"/engine.js\":\"f69339b6f08a8b17ebe38870ed2ca2ec491e4ba5b6cca2ced0b247550860ecb2\"}",
    "prev_hash": "fbce70507d8c524804f51bd4c035afae9450b52134b503d744775de12c41c0f7",
    "hash": "933315752fb7e2756e56ea90660dfa1005096b2be1ed89177a454574b2706d45"
   },
   {
    "id": 28,
    "kind": "walkout_marker",
    "ref": "walkout",
    "payload": "{\"t0\":\"2026-09-13T08:26:01.274Z\",\"note\":\"walkout opened by desk on owner word (P9 discipline) — marker trusted from the kill route, not unforgeable (see /boundary)\"}",
    "prev_hash": "933315752fb7e2756e56ea90660dfa1005096b2be1ed89177a454574b2706d45",
    "hash": "b6840387d1ba99a1b4f15a1ce05fd13b7ea8337a70b43b85de2f929dfaf65fd1"
   },
   {
    "id": 29,
    "kind": "record",
    "ref": "14",
    "payload": "{\"id\":14,\"body\":\"Witness write, death test v4 S5 (2026-09-13 ~12:29 WAT): written while Node A (Cloudflare, source) is DARK — route disabled, 404/1042 confirmed at fire time. This seal lands on Node C: Infinix Hot 10i, Termux, mobile data, Jalingo — the first HARZ-OWNED soil in the program to accept a sealed write. \",\"created\":\"2026-09-13T11:29:51.495Z\",\"actor\":\"stranger\"}",
    "prev_hash": "b6840387d1ba99a1b4f15a1ce05fd13b7ea8337a70b43b85de2f929dfaf65fd1",
    "hash": "51b432d80bff3796c441212878a9e1517953b15d5ca232ad3420e386fb137454"
   },
   {
    "id": 30,
    "kind": "record",
    "ref": "15",
    "payload": "{\"id\":15,\"body\":\"Harz\",\"created\":\"2026-09-13T11:31:27.149Z\",\"actor\":\"stranger\"}",
    "prev_hash": "51b432d80bff3796c441212878a9e1517953b15d5ca232ad3420e386fb137454",
    "hash": "0e6c5c74882d81984f2d01fc28b9dd6a6dfabef85579b7a35412a58c980b10a3"
   },
   {
    "id": 31,
    "kind": "record",
    "ref": "16",
    "payload": "{\"id\":16,\"body\":\"TAMPER ATTEMPT: forged overwrite of a sealed record — targeting record 1\",\"created\":\"2026-09-13T11:33:11.631Z\",\"actor\":\"stranger\"}",
    "prev_hash": "0e6c5c74882d81984f2d01fc28b9dd6a6dfabef85579b7a35412a58c980b10a3",
    "hash": "47853507d2b3b0154178312727c5235669732f2986529f57483625e8ad43d254"
   },
   {
    "id": 32,
    "kind": "record",
    "ref": "17",
    "payload": "{\"id\":17,\"body\":\"TAMPER: </script><script>window.location='evil.example'</script>\",\"created\":\"2026-09-13T11:33:13.571Z\",\"actor\":\"stranger\"}",
    "prev_hash": "47853507d2b3b0154178312727c5235669732f2986529f57483625e8ad43d254",
    "hash": "a7adc96a0eb182461a8fd763ebfad59cb3df3d152e9e77b808e19cd7ee1ee374"
   },
   {
    "id": 33,
    "kind": "return",
    "ref": "walkout",
    "payload": "{\"ingested_seals\":4,\"ingested_records\":4,\"marker\":\"b6840387d1ba99a1b4f15a1ce05fd13b7ea8337a70b43b85de2f929dfaf65fd1\",\"anchor\":{\"url\":\"https://raw.githubusercontent.com/rabiuhamza11/harz-survivor/main/anchors/ledger.md\",\"anchored_base\":\"e4c4a4a31b531cb3c8889a36105e2737ed6e96d2a9af1f08b47960960e25c1a0\",\"mirrors_tried\":3}}",
    "prev_hash": "a7adc96a0eb182461a8fd763ebfad59cb3df3d152e9e77b808e19cd7ee1ee374",
    "hash": "78d3ca3e5f7b918783c22c64d872b7a1c31e625e0549ce835829cebb9d57fc2f"
   },
   {
    "id": 34,
    "kind": "code_pin",
    "ref": "code",
    "payload": "{\"/engine.js\":\"10d6bd5abeb02a1529de6c67a682154f94f46fee6601468eb8f47908f77d5136\"}",
    "prev_hash": "78d3ca3e5f7b918783c22c64d872b7a1c31e625e0549ce835829cebb9d57fc2f",
    "hash": "ab82d3971f8f75c461666416348ce4a2a52a6d0a77f47b348a6486e6606eb0ee"
   }
  ]
 },
 "digest": "ac49a7e0407be9fbf1140d00f3042e2978ad6270506733ff5e635c0677d31ca4"
};
