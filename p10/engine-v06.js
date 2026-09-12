const CONTRACT = 'walkout-contract v0.6 — state + UI + code + writes + EXTERNAL ANCHOR walk';

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
  const ANCHOR_URL = 'https://raw.githubusercontent.com/rabiuhamza11/harz-survivor/main/anchors/ledger.md';
  if (!survivorExport || !survivorExport.state) return fail('BROKEN — malformed survivor export');
  const sChain = survivorExport.state.chain || [];
  const marker = activeMarker(sChain);
  if (!marker) return fail('BROKEN — no active walkout marker in survivor export');
  const srcChain = sourceState.chain || [];
  let mi = -1;
  for (let i = 0; i < srcChain.length; i++) if (srcChain[i].hash === marker.hash) { mi = i; break; }
  if (mi === -1) return fail('BROKEN — marker mismatch: not my walkout');
  if (mi !== srcChain.length - 1) return fail('FORK DETECTED — source has post-marker seals');
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
  let ledger = null;
  try {
    const res = await fetch(ANCHOR_URL, { cache: 'no-store' });
    if (!res.ok) return fail('BROKEN — ANCHOR UNREACHABLE — return refused fail-closed (ledger HTTP ' + res.status + ')');
    ledger = await res.text();
  } catch (e) {
    return fail('BROKEN — ANCHOR UNREACHABLE — return refused fail-closed');
  }
  const baseDigest = await digestOf(sourceState, uiManifest, codeManifest);
  if (!ledger.includes(baseDigest)) return fail('BROKEN — ANCHOR MISMATCH — pre-marker base ' + baseDigest.slice(0, 16) + '… not found in anchored history');
  const anchorProof = { url: ANCHOR_URL, anchored_base: baseDigest };
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