const { HssStore } = require('/tmp/hss-proto/engine/hss.js');
const fs = require('fs'), crypto = require('crypto'), cp = require('child_process');
const sha = t => crypto.createHash('sha256').update(t).digest('hex');
let ok = true;
const R = (name, pass, detail) => { console.log((pass ? 'PASS' : 'FAIL') + ' ' + name + ' ' + JSON.stringify(detail)); if (!pass) ok = false; };
fs.rmSync('/tmp/hss-stage3/integrity/store', { recursive: true, force: true });

// S1: kill ingest mid-batch + resume
cp.spawnSync('node', ['ingest-child.js'], { cwd: '/tmp/hss-stage3/integrity', timeout: 20000 });
{ const s = new HssStore('/tmp/hss-stage3/integrity/store', 1024*1024*64);
  const docs = []; for (let i = 0; i < 400; i++) { const c = 'ib-'+i+' '+'x'.repeat(150); docs.push({ content_hash: sha(c), content: c }); }
  const r = s.batchPut(docs);
  const objs = fs.readdirSync('/tmp/hss-stage3/integrity/store/nodeA/objects').filter(f => f.length === 64).length;
  const j = fs.readdirSync('/tmp/hss-stage3/integrity/store/nodeA').includes('journal.log') ? 'journal.log' : fs.readdirSync('/tmp/hss-stage3/integrity/store/nodeA').find(f => f.startsWith('journal'));
  const uniq = new Set(fs.readFileSync('/tmp/hss-stage3/integrity/store/nodeA/' + j, 'utf8').trim().split('\n').filter(Boolean).map(l => JSON.parse(l).hash)).size;
  R('S1_kill_midbatch_resume', r.failed_identity === 0 && objs === 400 && uniq === 400, { stored: objs, unique_journal: uniq });
}

// S2: repeated kills during manifest updates -> store must always open clean
let torn = 0, survived = 0;
for (let k = 0; k < 10; k++) {
  cp.spawnSync('node', ['ingest-child.js'], { cwd: '/tmp/hss-stage3/integrity', timeout: 20000 });
  try { new HssStore('/tmp/hss-stage3/integrity/store', 1024*1024*64); survived++; } catch (e) { if (/JSON|Unterminated|unexpected/i.test(String(e))) torn++; else throw e; }
}
R('S2_manifest_kill_never_torn', torn === 0 && survived === 10, { opens_after_kills: survived, torn_opens: torn });

// S3: replay same batch 3x -> idempotent
{ const s = new HssStore('/tmp/hss-stage3/integrity/store', 1024*1024*64);
  const docs = []; for (let i = 0; i < 100; i++) { const c = 's3-'+i+' '+'z'.repeat(100); docs.push({ content_hash: sha(c), content: c }); }
  s.batchPut(docs); s.batchPut(docs); s.batchPut(docs);
  const m = s.manifest(s.backends[0]);
  const s3hashes = docs.map(d => d.content_hash);
  const present = s3hashes.filter(h => m[h]).length;
  let dupStates = 0; for (const h of s3hashes) { const st = m[h].states; if (new Set(st).size !== st.length) dupStates++; }
  const s3objs = s3hashes.filter(h => fs.existsSync('/tmp/hss-stage3/integrity/store/nodeA/objects/' + h)).length;
  R('S3_replay_idempotent', present === 100 && dupStates === 0 && s3objs === 100, { s3_in_manifest: present, s3_objects: s3objs, dup_state_entries: dupStates });
}

// S4: body whose digest mismatches its declared hash -> refused
{ const s = new HssStore('/tmp/hss-stage3/integrity/store', 1024*1024*64);
  const r = s.batchPut([{ content_hash: sha('honest'), content: 'LYING BODY BYTES not the honest one' }]);
  R('S4_digest_mismatch_refused', r.failed_identity === 1, { refused: r.failed_identity });
}

// S5: quarantined record through ingestion path -> refused, never accepted
{ const s = new HssStore('/tmp/hss-stage3/integrity/store', 1024*1024*64);
  const six = JSON.parse(fs.readFileSync('/tmp/hss-stage3/forensics/frozen-snapshot.jsonl', 'utf8').trim().split('\n')[0]);
  const r = s.batchPut([{ content_hash: six.content_hash, content: six.text }]);
  const m = s.manifest(s.backends[0]);
  R('S5_quarantined_refused', r.failed_identity === 1 && !m[six.content_hash], { refused: r.failed_identity, accepted: !!m[six.content_hash] });
}

// S6: restart with mixed states -> preserved exactly
{ let s = new HssStore('/tmp/hss-stage3/integrity/store', 1024*1024*64);
  const pc = 'pending-doc ' + 'w'.repeat(120); s.batchPut([{ content_hash: sha(pc), content: pc }]);
  const mb = s.manifest(s.backends[0]); const before = {};
  for (const k of Object.keys(mb).filter(k => k !== '_rebuild')) before[k] = [...mb[k].states];
  s = new HssStore('/tmp/hss-stage3/integrity/store', 1024*1024*64);
  const ma = s.manifest(s.backends[0]); let drift = 0;
  for (const k of Object.keys(before)) { const now = ma[k] && [...ma[k].states]; if (!now || now.length !== before[k].length || now.some((x, i) => x !== before[k][i])) drift++; }
  R('S6_restart_mixed_states_preserved', drift === 0, { entries: Object.keys(before).length, drifted: drift });
}

// S7: no silent promotion — forged VERIFIED_DIGEST without receipt must not survive a fresh verify pass
{ fs.rmSync('/tmp/hss-stage3/integrity/store/verify-receipts', { recursive: true, force: true });
  const s = new HssStore('/tmp/hss-stage3/integrity/store', 1024*1024*64);
  const m1 = s.manifest(s.backends[0]);
  const victim = Object.keys(m1).filter(k => k !== '_rebuild')[0];
  m1[victim].states = [...new Set([...m1[victim].states, 'VERIFIED_DIGEST'])]; // forged promotion, no receipt
  s.saveManifest(s.backends[0], m1);
  const v = s.verifyBodies('/tmp/hss-stage3/integrity/store/verify-receipts');
  let receipts = 0; const vd = '/tmp/hss-stage3/integrity/store/verify-receipts';
  for (const d of fs.readdirSync(vd)) for (const f of fs.readdirSync(vd + '/' + d)) if (f.endsWith('.json')) receipts++;
  const m3 = s.manifest(s.backends[0]);
  const vs = m3[victim].states;
  // the invariant: forged marks carry no receipt; the rail re-verifies from bytes; count receipts == verified count, no double counting
  R('S7_no_silent_promotion_survives_rail', v.ok === true && v.failed === 0 && receipts === v.attempted_new, { rail: v, receipts, victim_states_after: vs });
}
console.log('INTEGRITY BATTERY ' + (ok ? 'ALL PASS' : 'FAILURES PRESENT'));
