// HARZ SURVIVOR v2 — P8 THE CODE WALKS (walkout-contract v0.4, cross-cloud).
// The sealed app that outlived its cloud — now carrying state + interface AND the
// engine itself. Generated from the source export 2026-09-12 — zero hand-transcription:
// the capsule below is the verbatim v0.4 export. THE VERDICT IS DERIVED: this substrate
// executes the SEALED ENGINE STRING (new Function) and reports what the sealed code says.
// READ-ONLY escape capsule: new seals are written on the source substrate.

const CAPSULE_SRC = {"ok":true,"manifest":{"name":"HARZ Portable App","version":"0.4.0","contract":"walkout-contract v0.4 — state + UI + code walk","program":"P8 — the code walks","origin":{"substrate":"cloudflare-workers","account_label":"harz (account 3)","store":"D1 portable-app"},"exported":"2026-09-12T06:21:14.062Z"},"ui_manifest":{"/":"8071add5461abc737cb951752a38452a588fb83504a58c68a86650588f106426","/app.css":"3ab1b0c604b9f0f3f713470ee2be647ff1f263fbb33d663c97c9f5a2b1945e4d","/app.js":"81dab5063246aa87458fcf175961066b74f753381ebbb9dc73876fc7008c4394","/icon.svg":"e44942aa60534e02c4adf9aa61978f4e6f9c882258ad40b2837421a275d07c7e","/manifest.json":"7f2073454491c1f64758e50ea8d15728055b5de1a1d89c144d5bb724fbe61acf","/sw.js":"5be88993b28d80c4aa8b1a1a13682a9ae10294229891e4d6448d7ab6b6c85466"},"ui":{"/":"<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>HARZ Portable App</title><meta name=\"theme-color\" content=\"#0a7d3c\"><link rel=\"icon\" href=\"/icon.svg\"><link rel=\"manifest\" href=\"/manifest.json\"><link rel=\"stylesheet\" href=\"/app.css\"></head><body><header><div><b>HARZ Portable App</b><div class=\"v\">P8: the code walks &mdash; state, interface AND engine &middot; v0.4.0 &middot; 2026-09-12</div></div></header><div class=\"wrap\">\n<div class=\"card\"><h2>State</h2><div id=\"st\">loading&hellip;</div></div>\n<div class=\"card\"><h2>Add a record (sealed instantly)</h2><input id=\"body\" placeholder=\"Type anything&hellip;\"><button class=\"btn\" onclick=\"add()\">Seal</button></div>\n<div class=\"card\"><h2>Sealed records</h2><div id=\"recs\">loading&hellip;</div></div>\n<div class=\"card\"><h2>The code walks</h2><p class=\"mut\">Since P8 the ENGINE itself is part of the export: this very digest/verify logic is hashed into a code manifest, pinned into the chain by a code_pin seal, and verified against its sealed source on every substrate. The verdict is a function of the capsule, not the operator&rsquo;s typing. Fetch the sealed engine at /api/source and hash it yourself.</p></div>\n<div class=\"card\"><h2>Portable</h2><p class=\"mut\">The interface you are looking at is part of the export: every UI asset is hashed into a manifest, the manifest is pinned into the chain, and the digest covers state AND interface. A compliant substrate reconstitutes both and must serve a bit-identical digest. When the source dies, the app &mdash; not just its records &mdash; lives where it landed.</p></div>\n<footer>HARZ Portable App v0.4.0 &middot; experiment, not a product &middot; HARZ Digital Services</footer></div>\n<script src=\"/app.js\" defer></script></body></html>","/app.css":"*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,system-ui,sans-serif;background:#f0f2f5;color:#1a1a1a}header{background:#0a7d3c;color:#fff;padding:14px 16px;position:sticky;top:0}header b{font-size:17px}header .v{font-size:11px;opacity:.85}.wrap{max-width:760px;margin:0 auto;padding:16px}.card{background:#fff;border-radius:12px;padding:14px 16px;margin:12px 0;box-shadow:0 1px 4px rgba(0,0,0,.08)}h2{font-size:14px;color:#0a7d3c;margin-bottom:8px}input{width:100%;border:1px solid #ccc;border-radius:8px;padding:10px;font-size:14px;margin-bottom:8px}.btn{padding:10px 16px;border-radius:8px;border:0;background:#0a7d3c;color:#fff;font-size:14px;font-weight:600;cursor:pointer}.ok{color:#0a7d3c;font-weight:600}.mut{color:#666;font-size:12px;line-height:1.5}.rec{padding:6px 0;border-bottom:1px solid #eee;font-size:13px}footer{text-align:center;color:#777;font-size:11px;padding:16px 12px 32px}","/app.js":"const V=s=>s.replace(/&/g,\"&amp;\").replace(/</g,\"&lt;\").replace(/>/g,\"&gt;\");\nasync function add(){const b=document.getElementById(\"body\").value.trim();if(!b)return;await fetch(\"/api/record\",{method:\"POST\",headers:{\"content-type\":\"application/json\"},body:JSON.stringify({body:b})});document.getElementById(\"body\").value=\"\";load()}\nasync function load(){const v=await(await fetch(\"/api/verify\")).json();document.getElementById(\"st\").innerHTML='<span class=\"ok\">'+V(v.verdict)+'</span><br><span class=\"mut\">records: '+v.records+\" &middot; seals: \"+v.chain_length+\" &middot; digest: \"+String(v.digest).slice(0,24)+\"&hellip; &middot; ui: \"+String(v.ui_ok?\"SEALED\":\"?\")+\" &middot; code: \"+String(v.code_ok?\"SEALED\":\"?\")+\"</span>\";const r=await(await fetch(\"/api/records\")).json();document.getElementById(\"recs\").innerHTML=(r.records||[]).map(x=>'<div class=\"rec\"><b>'+x.id+\"</b> &middot; \"+V(x.body)+'<br><span class=\"mut\">'+V(x.created)+\"</span></div>\").join(\"\")||'<span class=\"mut\">none</span>'}\nif(\"serviceWorker\" in navigator)navigator.serviceWorker.register(\"/sw.js\");\nload();","/icon.svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" rx=\"20\" fill=\"#0a7d3c\"/><path d=\"M30 60h40M50 20v40\" stroke=\"#fff\" stroke-width=\"8\" fill=\"none\" stroke-linecap=\"round\"/><circle cx=\"50\" cy=\"72\" r=\"9\" fill=\"#fff\"/></svg>","/manifest.json":"{\"name\":\"HARZ Portable App\",\"short_name\":\"Portable\",\"start_url\":\"/\",\"display\":\"standalone\",\"background_color\":\"#f0f2f5\",\"theme_color\":\"#0a7d3c\",\"icons\":[{\"src\":\"/icon.svg\",\"sizes\":\"any\",\"type\":\"image/svg+xml\"}]}","/sw.js":"self.addEventListener(\"install\",e=>self.skipWaiting());self.addEventListener(\"activate\",e=>self.clients.claim());self.addEventListener(\"fetch\",e=>{});"},"code_manifest":{"/engine.js":"2c5c8457a238ddf9d6f55b691a827ff29c0f882ef0fefdc2be7b192b57bd64db"},"code":{"/engine.js":"const CONTRACT = 'walkout-contract v0.4 — state + UI + code walk';\n\nasync function sha256hex(s) {\n  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));\n  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, '0')).join('');\n}\n\nasync function linesOf(m) {\n  return Object.keys(m).sort().map(p => p + '|' + m[p]).join('\\n');\n}\n\nasync function digestOf(state, uiManifest, codeManifest) {\n  const recs = state.records.map(r => r.id + '|' + r.body + '|' + r.created).join('\\n');\n  const ch = state.chain.map(r => r.id + '|' + r.kind + '|' + r.ref + '|' + r.payload + '|' + r.prev_hash + '|' + r.hash).join('\\n');\n  return await sha256hex('RECORDS\\n' + recs + '\\nCHAIN\\n' + ch + '\\nUI\\n' + await linesOf(uiManifest) + '\\nCODE\\n' + await linesOf(codeManifest));\n}\n\nasync function verifyChain(chain) {\n  let expected = 'GENESIS', issues = [];\n  for (const r of chain) {\n    if (r.prev_hash !== expected) issues.push('chain break at ' + r.id);\n    const h = await sha256hex(r.prev_hash + '|' + r.kind + '|' + r.ref + '|' + r.payload);\n    if (h !== r.hash) issues.push('hash mismatch at ' + r.id);\n    expected = r.hash;\n  }\n  return { ok: issues.length === 0, issues };\n}\n\nasync function hashAssets(files) {\n  const m = {};\n  for (const p of Object.keys(files).sort()) m[p] = await sha256hex(files[p]);\n  return m;\n}\n\nasync function verifyExport(x) {\n  const issues = [];\n  if (!x || !x.state || !x.ui_manifest || !x.ui || !x.code_manifest || !x.code || !x.digest)\n    return { ok: false, issues: ['malformed export'], verdict: 'BROKEN — malformed export' };\n  const chain = x.state.chain || [];\n  const v = await verifyChain(chain);\n  issues.push(...v.issues);\n  const uiH = await hashAssets(x.ui);\n  for (const p of Object.keys(x.ui_manifest)) {\n    if (!x.ui[p]) issues.push('missing ui asset ' + p);\n    else if (uiH[p] !== x.ui_manifest[p]) issues.push('ui hash mismatch at ' + p);\n  }\n  const codeH = await hashAssets(x.code);\n  for (const p of Object.keys(x.code_manifest)) {\n    if (!x.code[p]) issues.push('missing code asset ' + p);\n    else if (codeH[p] !== x.code_manifest[p]) issues.push('code hash mismatch at ' + p);\n  }\n  const pinnedUi = [...chain].reverse().find(s => s.kind === 'ui_manifest');\n  if (!pinnedUi) issues.push('no ui_manifest pin in chain');\n  else if (pinnedUi.payload !== JSON.stringify(x.ui_manifest)) issues.push('ui_manifest does not match its chain pin');\n  const pinnedCode = [...chain].reverse().find(s => s.kind === 'code_pin');\n  if (!pinnedCode) issues.push('no code_pin in chain');\n  else if (pinnedCode.payload !== JSON.stringify(x.code_manifest)) issues.push('code_manifest does not match its chain pin');\n  const d = await digestOf(x.state, x.ui_manifest, x.code_manifest);\n  if (d !== x.digest) issues.push('digest mismatch');\n  const ok = issues.length === 0;\n  return {\n    ok,\n    issues,\n    digest: d,\n    verdict: ok\n      ? 'CAPSULE VERIFIED — chain intact, records sealed, ui sealed, code sealed, digest matches (v0.4)'\n      : 'BROKEN — ' + issues.join('; ')\n  };\n}"},"state":{"records":[{"id":1,"body":"The interface is part of the app.","created":"2026-09-10T20:11:47.389Z"},{"id":2,"body":"State without a face is half an app.","created":"2026-09-10T20:11:47.624Z"},{"id":3,"body":"When the source dies, the UI walks too.","created":"2026-09-10T20:11:47.817Z"},{"id":4,"body":"P8: the verdict becomes a function of the capsule, not the typing.","created":"2026-09-12T06:21:13.885Z"}],"chain":[{"id":1,"kind":"record","ref":"1","payload":"{\"id\":1,\"body\":\"The interface is part of the app.\",\"created\":\"2026-09-10T20:11:47.389Z\"}","prev_hash":"GENESIS","hash":"a2a5a0a7797e250231dbce864901b1ff3b482584fbb457ff1f93682529d7a7aa"},{"id":2,"kind":"record","ref":"2","payload":"{\"id\":2,\"body\":\"State without a face is half an app.\",\"created\":\"2026-09-10T20:11:47.624Z\"}","prev_hash":"a2a5a0a7797e250231dbce864901b1ff3b482584fbb457ff1f93682529d7a7aa","hash":"493e9cab60371241cd1a6accca50775ba09f23730a9386c5d2a434b6cb026f5d"},{"id":3,"kind":"record","ref":"3","payload":"{\"id\":3,\"body\":\"When the source dies, the UI walks too.\",\"created\":\"2026-09-10T20:11:47.817Z\"}","prev_hash":"493e9cab60371241cd1a6accca50775ba09f23730a9386c5d2a434b6cb026f5d","hash":"556bdbbbf5a746ff65ce27bb9c2123ade226e3b51c3e91e418fb1b0cf41e0469"},{"id":4,"kind":"ui_manifest","ref":"ui","payload":"{\"/\":\"ad6a2202c4f3e53c0ee1e0d8295c4c94f0c99a11e8b6b06efd12407aff003a26\",\"/app.css\":\"3ab1b0c604b9f0f3f713470ee2be647ff1f263fbb33d663c97c9f5a2b1945e4d\",\"/app.js\":\"c9c545250689080fecc78cce806fc2c7451f3a8f1c6b96a664ef661cb75cbbe3\",\"/icon.svg\":\"e44942aa60534e02c4adf9aa61978f4e6f9c882258ad40b2837421a275d07c7e\",\"/manifest.json\":\"7f2073454491c1f64758e50ea8d15728055b5de1a1d89c144d5bb724fbe61acf\",\"/sw.js\":\"5be88993b28d80c4aa8b1a1a13682a9ae10294229891e4d6448d7ab6b6c85466\"}","prev_hash":"556bdbbbf5a746ff65ce27bb9c2123ade226e3b51c3e91e418fb1b0cf41e0469","hash":"ef7f63efbc6be8f4ff61e5e803cc136c5ee7ef5439e3f75a085d400e77c7fedb"},{"id":5,"kind":"ui_manifest","ref":"ui","payload":"{\"/\":\"8071add5461abc737cb951752a38452a588fb83504a58c68a86650588f106426\",\"/app.css\":\"3ab1b0c604b9f0f3f713470ee2be647ff1f263fbb33d663c97c9f5a2b1945e4d\",\"/app.js\":\"81dab5063246aa87458fcf175961066b74f753381ebbb9dc73876fc7008c4394\",\"/icon.svg\":\"e44942aa60534e02c4adf9aa61978f4e6f9c882258ad40b2837421a275d07c7e\",\"/manifest.json\":\"7f2073454491c1f64758e50ea8d15728055b5de1a1d89c144d5bb724fbe61acf\",\"/sw.js\":\"5be88993b28d80c4aa8b1a1a13682a9ae10294229891e4d6448d7ab6b6c85466\"}","prev_hash":"ef7f63efbc6be8f4ff61e5e803cc136c5ee7ef5439e3f75a085d400e77c7fedb","hash":"6b1a558791fb93faf001ecf8c3c07f615d89fe1233f3970899fc8fc0bd1fc2f4"},{"id":6,"kind":"code_pin","ref":"code","payload":"{\"/engine.js\":\"2c5c8457a238ddf9d6f55b691a827ff29c0f882ef0fefdc2be7b192b57bd64db\"}","prev_hash":"6b1a558791fb93faf001ecf8c3c07f615d89fe1233f3970899fc8fc0bd1fc2f4","hash":"2229f78fad7cf93199857d3d0e092a12f049af283fd173576d2ee965d0dadea7"},{"id":7,"kind":"record","ref":"4","payload":"{\"id\":4,\"body\":\"P8: the verdict becomes a function of the capsule, not the typing.\",\"created\":\"2026-09-12T06:21:13.885Z\"}","prev_hash":"2229f78fad7cf93199857d3d0e092a12f049af283fd173576d2ee965d0dadea7","hash":"99818e9d55ca56e862b09d34dc5ebc9586624c653b4c7d2b8f8f20714e0c1163"}]},"digest":"2eec83dfdb4ae5fbb7ed46a76b3bb17cec55f0ea1bd97a0f4026110eca0b97a8","verify":{"ok":true,"issues":[]}};
const C = CAPSULE_SRC; // embedded verbatim as an object literal — no parse, no transcription
const WALKED_FROM = "cloudflare-workers (harz, account 3) — exited 2026-09-12, P8";

async function sha256hex(s) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// THE SEALED ENGINE — executed from the capsule's own bytes. Not a rewrite.
function loadSealedEngine() {
  const src = C.code["/engine.js"];
  return (new Function(src + '; return { CONTRACT, sha256hex, digestOf, verifyChain, hashAssets, verifyExport, linesOf };'))();
}

function capsuleForEngine() {
  return {
    state: C.state,
    ui_manifest: C.ui_manifest,
    ui: C.ui,
    code_manifest: C.code_manifest,
    code: C.code,
    digest: C.digest,
  };
}

const MIME = { "/": "text/html; charset=utf-8", "/app.css": "text/css; charset=utf-8", "/app.js": "application/javascript; charset=utf-8", "/icon.svg": "image/svg+xml", "/manifest.json": "application/manifest+json", "/sw.js": "application/javascript; charset=utf-8" };

const BOUNDARY = {
  doc: "HARZ Survivor — Security & Portability Boundary", version: "0.4.0", date: "2026-09-12",
  guarantees: [
    "This substrate serves the verbatim v0.4 capsule: 4 records, 7 seals, 6 UI assets, and the engine source itself.",
    "The verdict reported by /api/verify is DERIVED: Deno executes the sealed engine string from the capsule via new Function and reports exactly what the sealed code computes. The survivor does not vouch for itself with its own rewrite.",
    "Every served UI asset and the served engine are runtime hash-guarded against the sealed manifests, which are pinned into the chain by seals.",
    "The digest covers state AND interface AND code (walkout-contract v0.4)."
  ],
  cannot_detect: [
    "Hash seals are tamper-EVIDENCE, not signatures — no authorship is proven.",
    "A lockstep rewrite of the entire capsule remains self-consistent — the documented, unsolved limit of hash-only chains without an external anchor.",
    "A sealed hash proves the asset is UNCHANGED, not CORRECT or safe.",
    "Executing sealed bytes still requires the substrate to execute them faithfully; a hostile runtime could lie about execution (substrate trust, disclosed).",
    "The capsule is a point-in-time snapshot; the source substrate keeps accepting writes. READ-ONLY capsule: POST /api/record is honestly rejected with 501.",
    "One second cloud, not all clouds; toy scale."
  ],
  substrate_note: "On Cloudflare (workerd), executing strings is disallowed, so the source runs the engine as module code and proves executed==sealed via Function.prototype.toString byte-comparison on every verify. On Deno, eval is allowed, so the sealed string itself is executed here. Both substrates seal the SAME engine bytes — that equality is what the code_pin seal pins.",
  trust: ["The capsule is only as trustworthy as whoever hands it to you. The chain is the witness after the source dies."],
  research: "P8 experiment of the cloud-substrate research program. Prototype at test scale. Not a product."
};

Deno.serve(async (req) => {
  const u = new URL(req.url);
  const p = u.pathname;
  const CORS = { "access-control-allow-origin": "*", "cache-control": "no-store" };
  const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...CORS, "content-type": "application/json" } });
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  try {
    if (C.ui[p] !== undefined) {
      const h = await sha256hex(C.ui[p]);
      if (h !== C.ui_manifest[p]) return new Response("TAMPER GUARD: served UI asset does not match its sealed hash", { status: 500 });
      return new Response(C.ui[p], { headers: { ...CORS, "content-type": MIME[p] } });
    }
    if (p === "/api/health") return json({ ok: true, service: "HARZ Survivor", version: "0.4.0", contract: "walkout-contract v0.4 — state + UI + code walk", engine: "sealed-executed (new Function)" });
    if (p === "/boundary") return json(BOUNDARY);
    if (p === "/api/records") return json({ ok: true, records: C.state.records, walked_from: WALKED_FROM });
    if (p === "/api/record" && req.method === "POST") return json({ ok: false, error: "READ-ONLY ESCAPE CAPSULE — new seals are written on the source substrate only" }, 501);
    if (p === "/api/source") {
      const src = C.code["/engine.js"];
      const h = await sha256hex(src);
      if (h !== C.code_manifest["/engine.js"]) return new Response("TAMPER GUARD: served engine does not match its sealed hash", { status: 500 });
      return new Response(src, { headers: { ...CORS, "content-type": "application/javascript; charset=utf-8" } });
    }
    if (p === "/api/export") return json(C);
    if (p === "/api/verify") {
      const E = loadSealedEngine();
      const v = await E.verifyExport(capsuleForEngine());
      const pinnedUi = [...C.state.chain].reverse().find((s) => s.kind === "ui_manifest");
      const pinnedCode = [...C.state.chain].reverse().find((s) => s.kind === "code_pin");
      return json({
        ok: v.ok,
        verdict: v.ok ? "SURVIVOR CAPSULE INTACT — verdict derived from the sealed engine" : v.verdict,
        derived_by: "sealed engine executed from capsule bytes (new Function)",
        records: C.state.records.length,
        chain_length: C.state.chain.length,
        digest: v.digest,
        expected_digest: C.digest,
        digest_match: v.digest === C.digest,
        ui_ok: pinnedUi ? pinnedUi.payload === JSON.stringify(C.ui_manifest) : false,
        code_ok: pinnedCode ? pinnedCode.payload === JSON.stringify(C.code_manifest) : false,
        engine_hash: C.code_manifest["/engine.js"],
        issues: v.issues,
        contract: E.CONTRACT
      });
    }
    return json({ ok: false, error: "not found" }, 404);
  } catch (e) {
    return json({ ok: false, error: String(e) }, 500);
  }
});
