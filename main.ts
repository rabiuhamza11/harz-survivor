// HARZ SURVIVOR — P7 Cloud Exit (walkout-contract v0.4, cross-cloud).
// The sealed app that outlived its cloud: state + hash history + sealed interface,
// served OUTSIDE Cloudflare entirely. Generated from the source export
// 2026-09-11 — zero hand-transcription: the capsule below is the verbatim export.
// READ-ONLY escape capsule: new seals are written on the source substrate; the
// capsule serves and verifies. (Honest v0.4 limit — runtime code does not walk.)

const CAPSULE_SRC = {"state":{"records":[{"id":1,"body":"The interface is part of the app.","created":"2026-09-10T20:11:47.389Z"},{"id":2,"body":"State without a face is half an app.","created":"2026-09-10T20:11:47.624Z"},{"id":3,"body":"When the source dies, the UI walks too.","created":"2026-09-10T20:11:47.817Z"}],"chain":[{"id":1,"kind":"record","ref":"1","payload":"{\"id\":1,\"body\":\"The interface is part of the app.\",\"created\":\"2026-09-10T20:11:47.389Z\"}","prev_hash":"GENESIS","hash":"a2a5a0a7797e250231dbce864901b1ff3b482584fbb457ff1f93682529d7a7aa"},{"id":2,"kind":"record","ref":"2","payload":"{\"id\":2,\"body\":\"State without a face is half an app.\",\"created\":\"2026-09-10T20:11:47.624Z\"}","prev_hash":"a2a5a0a7797e250231dbce864901b1ff3b482584fbb457ff1f93682529d7a7aa","hash":"493e9cab60371241cd1a6accca50775ba09f23730a9386c5d2a434b6cb026f5d"},{"id":3,"kind":"record","ref":"3","payload":"{\"id\":3,\"body\":\"When the source dies, the UI walks too.\",\"created\":\"2026-09-10T20:11:47.817Z\"}","prev_hash":"493e9cab60371241cd1a6accca50775ba09f23730a9386c5d2a434b6cb026f5d","hash":"556bdbbbf5a746ff65ce27bb9c2123ade226e3b51c3e91e418fb1b0cf41e0469"},{"id":4,"kind":"ui_manifest","ref":"ui","payload":"{\"/\":\"ad6a2202c4f3e53c0ee1e0d8295c4c94f0c99a11e8b6b06efd12407aff003a26\",\"/app.css\":\"3ab1b0c604b9f0f3f713470ee2be647ff1f263fbb33d663c97c9f5a2b1945e4d\",\"/app.js\":\"c9c545250689080fecc78cce806fc2c7451f3a8f1c6b96a664ef661cb75cbbe3\",\"/icon.svg\":\"e44942aa60534e02c4adf9aa61978f4e6f9c882258ad40b2837421a275d07c7e\",\"/manifest.json\":\"7f2073454491c1f64758e50ea8d15728055b5de1a1d89c144d5bb724fbe61acf\",\"/sw.js\":\"5be88993b28d80c4aa8b1a1a13682a9ae10294229891e4d6448d7ab6b6c85466\"}","prev_hash":"556bdbbbf5a746ff65ce27bb9c2123ade226e3b51c3e91e418fb1b0cf41e0469","hash":"ef7f63efbc6be8f4ff61e5e803cc136c5ee7ef5439e3f75a085d400e77c7fedb"}]},"ui_manifest":{"/":"ad6a2202c4f3e53c0ee1e0d8295c4c94f0c99a11e8b6b06efd12407aff003a26","/app.css":"3ab1b0c604b9f0f3f713470ee2be647ff1f263fbb33d663c97c9f5a2b1945e4d","/app.js":"c9c545250689080fecc78cce806fc2c7451f3a8f1c6b96a664ef661cb75cbbe3","/icon.svg":"e44942aa60534e02c4adf9aa61978f4e6f9c882258ad40b2837421a275d07c7e","/manifest.json":"7f2073454491c1f64758e50ea8d15728055b5de1a1d89c144d5bb724fbe61acf","/sw.js":"5be88993b28d80c4aa8b1a1a13682a9ae10294229891e4d6448d7ab6b6c85466"},"ui":{"/":"<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>HARZ Portable App</title><meta name=\"theme-color\" content=\"#0a7d3c\"><link rel=\"icon\" href=\"/icon.svg\"><link rel=\"manifest\" href=\"/manifest.json\"><link rel=\"stylesheet\" href=\"/app.css\"></head><body><header><div><b>HARZ Portable App</b><div class=\"v\">P6: the whole app walks &mdash; state and interface &middot; v0.3.0 &middot; 2026-09-10</div></div></header><div class=\"wrap\">\n<div class=\"card\"><h2>State</h2><div id=\"st\">loading&hellip;</div></div>\n<div class=\"card\"><h2>Add a record (sealed instantly)</h2><input id=\"body\" placeholder=\"Type anything&hellip;\"><button class=\"btn\" onclick=\"add()\">Seal</button></div>\n<div class=\"card\"><h2>Sealed records</h2><div id=\"recs\">loading&hellip;</div></div>\n<div class=\"card\"><h2>Portable</h2><p class=\"mut\">The interface you are looking at is part of the export: every UI asset is hashed into a manifest, the manifest is pinned into the chain, and the digest covers state AND interface. A compliant substrate reconstitutes both and must serve a bit-identical digest. When the source dies, the app &mdash; not just its records &mdash; lives where it landed.</p></div>\n<footer>HARZ Portable App v0.3.0 &middot; experiment, not a product &middot; HARZ Digital Services</footer></div>\n<script src=\"/app.js\" defer></script></body></html>","/app.css":"*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,system-ui,sans-serif;background:#f0f2f5;color:#1a1a1a}header{background:#0a7d3c;color:#fff;padding:14px 16px;position:sticky;top:0}header b{font-size:17px}header .v{font-size:11px;opacity:.85}.wrap{max-width:760px;margin:0 auto;padding:16px}.card{background:#fff;border-radius:12px;padding:14px 16px;margin:12px 0;box-shadow:0 1px 4px rgba(0,0,0,.08)}h2{font-size:14px;color:#0a7d3c;margin-bottom:8px}input{width:100%;border:1px solid #ccc;border-radius:8px;padding:10px;font-size:14px;margin-bottom:8px}.btn{padding:10px 16px;border-radius:8px;border:0;background:#0a7d3c;color:#fff;font-size:14px;font-weight:600;cursor:pointer}.ok{color:#0a7d3c;font-weight:600}.mut{color:#666;font-size:12px;line-height:1.5}.rec{padding:6px 0;border-bottom:1px solid #eee;font-size:13px}footer{text-align:center;color:#777;font-size:11px;padding:16px 12px 32px}","/app.js":"const V=s=>s.replace(/&/g,\"&amp;\").replace(/</g,\"&lt;\").replace(/>/g,\"&gt;\");\nasync function add(){const b=document.getElementById(\"body\").value.trim();if(!b)return;await fetch(\"/api/record\",{method:\"POST\",headers:{\"content-type\":\"application/json\"},body:JSON.stringify({body:b})});document.getElementById(\"body\").value=\"\";load()}\nasync function load(){const v=await(await fetch(\"/api/verify\")).json();document.getElementById(\"st\").innerHTML='<span class=\"ok\">'+V(v.verdict)+'</span><br><span class=\"mut\">records: '+v.records+\" &middot; seals: \"+v.chain_length+\" &middot; digest: \"+String(v.digest).slice(0,24)+\"&hellip; &middot; ui: \"+String(v.ui_ok?\"SEALED\":\"?\")+\"</span>\";const r=await(await fetch(\"/api/records\")).json();document.getElementById(\"recs\").innerHTML=(r.records||[]).map(x=>'<div class=\"rec\"><b>'+x.id+\"</b> &middot; \"+V(x.body)+'<br><span class=\"mut\">'+V(x.created)+\"</span></div>\").join(\"\")||'<span class=\"mut\">none</span>'}\nif(\"serviceWorker\" in navigator)navigator.serviceWorker.register(\"/sw.js\");\nload();","/icon.svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" rx=\"20\" fill=\"#0a7d3c\"/><path d=\"M30 60h40M50 20v40\" stroke=\"#fff\" stroke-width=\"8\" fill=\"none\" stroke-linecap=\"round\"/><circle cx=\"50\" cy=\"72\" r=\"9\" fill=\"#fff\"/></svg>","/manifest.json":"{\"name\":\"HARZ Portable App\",\"short_name\":\"Portable\",\"start_url\":\"/\",\"display\":\"standalone\",\"background_color\":\"#f0f2f5\",\"theme_color\":\"#0a7d3c\",\"icons\":[{\"src\":\"/icon.svg\",\"sizes\":\"any\",\"type\":\"image/svg+xml\"}]}","/sw.js":"self.addEventListener(\"install\",e=>self.skipWaiting());self.addEventListener(\"activate\",e=>self.clients.claim());self.addEventListener(\"fetch\",e=>{});"},"digest":"6c6eb3539489ba676f230d7d5b0d02b614cfc23415dd0cd196c4c8b5237cc965"};
const C = CAPSULE_SRC; // embedded verbatim as an object literal — no parse, no transcription
const WALKED_FROM = "cloudflare-workers (harz, account 3) — exited 2026-09-11";

async function sha256hex(s) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function uiLines(m) { return Object.keys(m).sort().map((p) => p + "|" + m[p]).join("\n"); }
async function digestOf(state, m) {
  const recs = state.records.map((x) => `${x.id}|${x.body}|${x.created}`).join("\n");
  const ch = state.chain.map((x) => `${x.id}|${x.kind}|${x.ref}|${x.payload}|${x.prev_hash}|${x.hash}`).join("\n");
  return sha256hex("RECORDS\n" + recs + "\nCHAIN\n" + ch + "\nUI\n" + uiLines(m));
}
async function verifyAll() {
  const { state, ui_manifest, ui, digest } = C;
  const issues = [];
  let expected = "GENESIS";
  for (const s of state.chain) {
    if (s.prev_hash !== expected) issues.push("chain break at " + s.id);
    const h = await sha256hex(s.prev_hash + "|" + s.kind + "|" + s.ref + "|" + s.payload);
    if (h !== s.hash) issues.push("hash mismatch at " + s.id);
    expected = s.hash;
  }
  const sealed = new Map();
  for (const s of state.chain) if (s.kind === "record") sealed.set(String(s.ref), s.payload);
  for (const rec of state.records) {
    const p = sealed.get(String(rec.id));
    if (!p) { issues.push("record " + rec.id + " has no seal"); continue; }
    const po = JSON.parse(p);
    if (po.body !== rec.body || po.created !== rec.created) issues.push("record " + rec.id + " does not match its seal");
  }
  const pinned = [...state.chain].reverse().find((s) => s.kind === "ui_manifest");
  if (!pinned || pinned.payload !== JSON.stringify(ui_manifest)) issues.push("ui_manifest not pinned in chain");
  const myDigest = await digestOf(state, ui_manifest);
  return { issues, myDigest, digestMatches: myDigest === digest };
}
const MIME = { "/": "text/html; charset=utf-8", "/app.css": "text/css; charset=utf-8", "/app.js": "application/javascript; charset=utf-8", "/icon.svg": "image/svg+xml", "/manifest.json": "application/manifest+json", "/sw.js": "application/javascript; charset=utf-8" };

Deno.serve(async (req) => {
  const u = new URL(req.url);
  const p = u.pathname;
  const CORS = { "access-control-allow-origin": "*", "cache-control": "no-store" };
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  try {
    // sealed UI assets with runtime hash guard
    if (C.ui[p] !== undefined) {
      const h = await sha256hex(C.ui[p]);
      if (h !== C.ui_manifest[p]) return new Response("TAMPER GUARD: served UI asset does not match its sealed hash", { status: 500 });
      return new Response(C.ui[p], { headers: { ...CORS, "content-type": MIME[p] || "text/plain" } });
    }
    if (p === "/api/export") {
      const v = await verifyAll();
      return Response.json({ ok: v.issues.length === 0, manifest: { name: "HARZ Portable App", version: "0.4.0", contract: "walkout-contract v0.4 (cross-cloud)", origin: { substrate: "deno-deploy (outside Cloudflare)", walked_from: WALKED_FROM } }, state: C.state, ui_manifest: C.ui_manifest, ui: C.ui, digest: C.digest, verify: { ok: v.issues.length === 0 && v.digestMatches, issues: v.issues } }, { headers: CORS });
    }
    if (p === "/api/verify") {
      const v = await verifyAll();
      return Response.json({ verdict: (v.issues.length === 0 && v.digestMatches) ? "SURVIVOR CAPSULE INTACT — chain, seals, ui, digest all verify outside Cloudflare" : "CAPSULE COMPROMISED — " + v.issues.join("; "), records: C.state.records.length, chain_length: C.state.chain.length, digest: v.myDigest, expected_digest: C.digest, digest_match: v.digestMatches, ui_ok: !v.issues.some((i) => i.startsWith("ui") || i.includes("ui_manifest")), issues: v.issues }, { headers: CORS });
    }
    if (p === "/api/records") return Response.json({ records: C.state.records, walked_from: WALKED_FROM }, { headers: CORS });
    if (p === "/api/record" && req.method === "POST") return Response.json({ ok: false, honest_limit: "READ-ONLY ESCAPE CAPSULE — the survivor serves the sealed state and interface; new seals are written on the source substrate (walkout-contract v0.4: runtime writes do not walk)" }, { status: 501, headers: CORS });
    if (p === "/boundary") {
      const b = `HARZ SURVIVOR BOUNDARY (P7 Cloud Exit)\n\n1. What this is: the sealed HARZ Portable App (state + hash history + sealed UI) served from Deno Deploy — OUTSIDE Cloudflare entirely. It is the proof that the app outlives its cloud provider.\n2. What it guarantees: the capsule is served with a runtime hash guard (every UI asset re-hashed against the sealed manifest before serving), the full export is public and recomputable, and the digest is bit-identical to the source at freeze time (6c6eb353).\n3. What it does NOT do: accept writes. This is a read-only escape capsule — new seals are written on the source substrate. Runtime code does not walk (P6 limit); state, history, and interface do.\n4. Trust assumptions: SHA-256 collision resistance; the capsule was frozen verbatim from the source export on 2026-09-11; Deno Deploy serves it without modification (verifiable by recomputing the digest from /api/export).\n5. Honest limits: one alternative cloud is not all clouds; the capsule is a point-in-time snapshot, not a live replica; test scale is toy.\n6. Verification procedure: fetch /api/export, recompute the canonical digest (RECORDS/CHAIN/UI pipes), confirm it equals 6c6eb353; cross-check with any independent verifier (Python, Base44).\n\nWalked from: ${WALKED_FROM}\nGenerated: 2026-09-11 — HARZ Digital Services cloud-substrate research program, P7.`;
      return new Response(b, { headers: { ...CORS, "content-type": "text/plain; charset=utf-8" } });
    }
    return new Response("Not found. Capsule endpoints: / (app), /api/export, /api/verify, /api/records, /boundary", { status: 404, headers: CORS });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500, headers: CORS });
  }
});
