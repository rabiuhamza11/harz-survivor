// HARZ Search Full-Text Core v1.0 — portable offline knowledge library
// Law: a chunk whose SHA-256 does not match the manifest is NEVER presented as complete.
// This is the expansion lab: the sealed reader/pack system is untouched.

const VERSION = 'sftcore-v1.0';

const MANIFEST_WEB = {
  name: 'HARZ Search Full-Text Core', short_name: 'HARZ Full-Text Core',
  start_url: '/', display: 'standalone', background_color: '#f5f7fa', theme_color: '#f0f2f5',
  icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }]
};

const ICON = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='18' fill='#f0f2f5'/><path d='M28 24 h34 a10 10 0 0 1 10 10 v34 l-10-8 -10 8 -10-8 -10 8 V34 a10 10 0 0 1 10-10z' fill='#2563eb' transform='rotate(-8 50 50)'/><circle cx='62' cy='38' r='12' fill='#16a34a'/></svg>`;

const SW = `
const CACHE='sftcore-shell-v2';
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(['/','/icon.svg','/manifest.json']);})().then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>k.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
if(e.request.method!=='GET')return;
if(u.pathname==='/manifest.json'||u.pathname==='/icon.svg'||u.pathname==='/'){e.respondWith(caches.open(CACHE).then(async c=>{let m=await c.match(e.request);if(!m){m=await fetch(e.request);if(m&&m.status===200){try{await c.put(e.request,m.clone())}catch(err){}}}return m||fetch(e.request)}))}
if(u.pathname.startsWith('/chunk/')){e.respondWith(fetch(e.request))}
});`;

const PAGE = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>HARZ Search Full-Text Core</title>
<link rel="manifest" href="/manifest.json"><link rel="icon" href="/icon.svg">
<style>
:root{--bg:#f5f7fa;--card:#ffffff;--ink:#1e293b;--muted:#64748b;--blue:#2563eb;--green:#16a34a;--red:#dc2626;--amber:#d97706}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:var(--bg);color:var(--ink);padding:12px;max-width:760px;margin:auto}
.card{background:var(--card);border:1px solid #e2e8f0;border-radius:12px;padding:14px;margin-bottom:12px}
h1{font-size:1.15rem}h2{font-size:1rem;margin-bottom:8px}
.badge{display:inline-block;padding:2px 10px;border-radius:99px;font-size:.72rem;font-weight:600}
.live{background:#dcfce7;color:#166534}.cached{background:#dbeafe;color:#1e40af}
.offline{background:#fef3c7;color:#92400e}.stale{background:#fce7f3;color:#9d174d}
button{background:var(--blue);color:#fff;border:0;border-radius:8px;padding:10px 16px;font-weight:600;cursor:pointer}
button:disabled{background:#94a3b8}
.muted{color:var(--muted);font-size:.82rem}
.row{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:.85rem}
.ok{color:var(--green)}.bad{color:var(--red)}.wait{color:var(--amber)}
input{width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:8px;font-size:1rem;background:#fff}
.result{padding:10px;border:1px solid #e2e8f0;border-radius:8px;margin:8px 0;background:#fff}
.result b{display:block;margin-bottom:4px}
#reader{white-space:pre-wrap;line-height:1.55;font-size:.95rem;max-height:70vh;overflow:auto}
#docmeta{margin:8px 0;color:var(--muted);font-size:.8rem}
</style></head><body>
<div class="card"><h1>📚 HARZ Search Full-Text Core <span id="net" class="badge live">● ONLINE · LIVE</span></h1>
<p class="muted">Portable offline knowledge library · ${VERSION} · SHA-256 verified chunks · stored on THIS device in IndexedDB · no internet needed to read or search once downloaded.</p></div>

<div class="card"><h2>1. Library manifest</h2>
<div id="man">loading manifest…</div>
<button id="dl" style="margin-top:10px">⬇ Download Full-Text Library</button>
<p class="muted" id="dlstatus" style="margin-top:8px">Not downloaded yet.</p></div>

<div class="card"><h2>2. Offline search</h2>
<input id="q" placeholder="Search the local library (works with zero internet)…">
<div id="results" style="margin-top:10px"></div></div>

<div class="card" id="readcard" style="display:none"><h2>3. Reading</h2>
<div id="docmeta"></div><div id="reader"></div>
<button id="back" style="margin-top:10px">← Back to search</button></div>

<div class="card"><h2>4. Portability — HARZ owns this library</h2>
<p class="muted">Everything stored here can be exported as a single JSON file and copied to any device or node. Reading, searching and maintaining an already-downloaded library never requires Cloudflare or any internet service.</p>
<button id="export">💾 Export library as JSON</button> <button id="wipe" style="background:#dc2626">Wipe local library</button>
<p class="muted" id="expstatus" style="margin-top:6px"></p></div>

<script>
const $=id=>document.getElementById(id);
const DB='kcore';
function badge(){const n=$('net');
if(!navigator.onLine){n.className='badge offline';n.textContent='● OFFLINE · LOCAL LIBRARY';}
else{const cached=localStorage.getItem('kcore_done')==='1';
n.className=cached?'badge cached':'badge live';
n.textContent=cached?'● ONLINE · CACHED':'● ONLINE · LIVE';}}
addEventListener('online',badge);addEventListener('offline',badge);badge();

async function sha256hex(buf){const h=await crypto.subtle.digest('SHA-256',buf);return [...new Uint8Array(h)].map(b=>b.toString(16).padStart(2,'0')).join('');}

function openDB(){return new Promise((res,rej)=>{const r=indexedDB.open(DB,1);
r.onupgradeneeded=()=>{const d=r.result;if(!d.objectStoreNames.contains('docs'))d.createObjectStore('docs',{keyPath:'i'});};
r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});}
function putAll(docs){return openDB().then(db=>new Promise((res,rej)=>{const tx=db.transaction('docs','readwrite');const s=tx.objectStore('docs');
docs.forEach(d=>{s.put(d)});tx.oncomplete=()=>res(docs.length);tx.onerror=()=>rej(tx.error);}));}
function allDocs(){return openDB().then(db=>new Promise((res,rej)=>{const tx=db.transaction('docs','readonly');const rq=tx.objectStore('docs').getAll();rq.onsuccess=()=>res(rq.result);rq.onerror=()=>rej(rq.error);}));}
function docCount(){return openDB().then(db=>new Promise((res,rej)=>{const rq=db.transaction('docs','readonly').objectStore('docs').count();rq.onsuccess=()=>res(rq.result);rq.onerror=()=>rej(rq.error);}));}

let MAN=null, DBN=0;
async function init(){
  DBN=await docCount().catch(()=>0);
  try{const r=await fetch('/manifest.json');MAN=await r.json();}catch(e){$('man').textContent='manifest unavailable — '+e.message;return;}
  const cats=Object.entries(MAN.categories||{}).map(([k,v])=>k+': '+v).join(' · ');
  $('man').innerHTML='<div class="row"><span>Documents</span><b>'+MAN.total_docs+'</b></div>'
   +'<div class="row"><span>Chunks</span><b>'+MAN.chunks.length+' ('+(MAN.chunks.reduce((a,c)=>a+c.bytes,0)/1e6).toFixed(1)+' MB encoded)</b></div>'
   +'<div class="row"><span>Excluded (failed integrity)</span><b class="bad">'+(MAN.excluded_failed_integrity||0)+'</b></div>'
   +'<div class="row" style="border:0"><span style="font-size:.8rem">'+cats+'</span></div>';
  $('dlstatus').textContent = DBN>0 ? DBN+' documents already in local storage on this device.' : 'Not downloaded yet.';
  if(DBN>0) localStorage.setItem('kcore_done','1');
  badge();
}
init();

let busy=false;
$('dl').onclick=async()=>{
  if(busy||!MAN)return; busy=true; $('dl').disabled=true;
  const bad=[], good=[]; let doneBytes=0;
  for(const ch of MAN.chunks){
    $('dlstatus').textContent='downloading '+ch.name+' …';
    let ok=false;
    for(let attempt=1;attempt<=3&&!ok;attempt++){
      try{
        const r=await fetch('/'+ch.name);
        if(!r.ok) throw new Error('HTTP '+r.status);
        const buf=await r.arrayBuffer();
        const sha=await sha256hex(buf);
        if(sha!==ch.sha256){throw new Error('SHA-256 MISMATCH — chunk rejected, refetching');}
        const docs=JSON.parse(new TextDecoder().decode(buf));
        await putAll(docs); ok=true; good.push(ch.name);
        doneBytes+=ch.bytes;
        $('dlstatus').textContent='stored '+ch.name+' ('+good.length+'/'+MAN.chunks.length+' chunks, '+(doneBytes/1e6).toFixed(1)+' MB)';
      }catch(e){bad.push(ch.name+' attempt '+attempt+': '+e.message);await new Promise(r=>setTimeout(r,800));}
    }
  }
  const n=await docCount().catch(()=>0);
  const failed=MAN.chunks.length-good.length;
  $('dlstatus').innerHTML=(failed===0
    ? '<span class="ok">COMPLETE: '+n+' documents stored, all '+MAN.chunks.length+' chunks SHA-256 verified.</span>'
    : '<span class="bad">INCOMPLETE: '+failed+' chunk(s) failed verification and were NOT stored. Retry to resume — already-stored chunks are kept.</span>')
    +(bad.length?'<br><span class="muted">'+bad.slice(0,4).join(' · ')+'</span>':'');
  if(failed===0) localStorage.setItem('kcore_done','1');
  badge(); busy=false; $('dl').disabled=false;
};

let CACHE_DOCS=null;
async function search(){
  const q=$('q').value.trim().toLowerCase();
  const out=$('results');
  if(q.length<2){out.innerHTML='<p class="muted">Type at least 2 characters.</p>';return;}
  if(!CACHE_DOCS) CACHE_DOCS=await allDocs();
  if(!CACHE_DOCS.length){out.innerHTML='<p class="muted">Library not downloaded yet — download first (section 1).</p>';return;}
  const terms=q.split(/\\s+/); const scored=[];
  for(const d of CACHE_DOCS){
    const t=(d.t||'').toLowerCase(); const x=(d.x||'').toLowerCase();
    let s=0; let all=true;
    for(const w of terms){const inT=t.includes(w), inX=x.includes(w);
      if(!inT&&!inX){all=false;break;} s+=(inT?10:0)+(inX?1:0);}
    if(all) scored.push({d,s});
  }
  scored.sort((a,b)=>b.s-a.s);
  out.innerHTML='<p class="muted">'+scored.length+' results (searching '+CACHE_DOCS.length+' stored documents'+(navigator.onLine?'':' — OFFLINE')+'):</p>'
   +scored.slice(0,25).map(r=>'<div class="result" data-i="'+r.d.i+'"><b>'+r.d.t+'</b><span class="muted">'+r.d.c+' · '+r.d.u.slice(0,60)+' · '+(r.d.x.length.toLocaleString())+' chars</span></div>').join('');
  out.querySelectorAll('.result').forEach(el=>el.onclick=()=>read(parseInt(el.dataset.i)));
}
$('q').oninput=search;
async function read(id){
  const d=CACHE_DOCS.find(x=>x.i===id); if(!d)return;
  $('results').style.display='none'; $('readcard').style.display='block';
  $('docmeta').textContent=d.c.toUpperCase()+' · '+d.u+' · '+(d.x.length.toLocaleString())+' chars · SHA-256 '+d.h.slice(0,16)+'… · '+(navigator.onLine?'served from local storage while online':'served from local storage, OFFLINE');
  $('reader').textContent=d.x;
}
$('back').onclick=()=>{$('readcard').style.display='none';$('results').style.display='block';};
$('export').onclick=async()=>{
  const docs=await allDocs();
  const blob=new Blob([JSON.stringify({exported:new Date().toISOString(),law:'HARZ search full-text library',docs})],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='harz-knowledge-core-'+Date.now()+'.json';a.click();
  $('expstatus').textContent='Exported '+docs.length+' documents as one portable JSON file.';
};
if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').then(r=>r.update()).catch(e=>console.log('sw fail',e));navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.update()));}
$('wipe').onclick=async()=>{await openDB().then(db=>db.transaction('docs','readwrite').objectStore('docs').clear());CACHE_DOCS=null;localStorage.removeItem('kcore_done');badge();init();$('expstatus').textContent='Local library wiped.';};
</script></body></html>`;

const json = (o, code = 200) => new Response(JSON.stringify(o, null, 2), { status: code, headers: { "Content-Type": "application/json; charset=utf-8" } });

export default {
  async fetch(request, env) {
   try {
    const url = new URL(request.url);
    const P = url.pathname;
    if (P === "/") return new Response(PAGE, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" } });
    if (P === "/manifest.json") {
      const m = await env.KV.get("manifest.json", "stream");
      if (m) return new Response(m, { headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-cache" } });
      const w = await env.KV.get("manifest.json");
      return w ? new Response(w, { headers: { "Content-Type": "application/json" } }) : json({ ok: false, error: "manifest missing" }, 500);
    }
    if (P === "/sw.js") return new Response(SW, { headers: { "Content-Type": "application/javascript", "Cache-Control": "no-cache" } });
    if (P === "/webmanifest" || P === "/manifest.webmanifest") return json(MANIFEST_WEB);
    if (P === "/icon.svg") return new Response(ICON, { headers: { "Content-Type": "image/svg+xml" } });
    if (P === "/health") return json({ ok: true, app: "harz-fulltext-core", version: VERSION });
    const cm = P.match(/^\/(chunk-\d{3}\.json)$/);
    if (cm) {
      const v = await env.KV.get(cm[1], "stream");
      if (v) return new Response(v, { headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
      return json({ ok: false, error: "chunk not found" }, 404);
    }
    return json({ ok: false, error: "not found" }, 404);
   } catch (err) {
    return new Response("KCORE-ERR: " + (err && err.message ? err.message : String(err)) + " / " + (err && err.stack ? err.stack.split("\n").slice(0,3).join(" | ") : ""), { status: 500 });
   }
  }
};
