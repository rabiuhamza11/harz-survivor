'use strict';
// Child used by T2/T3: writes N docs with journal discipline, killable mid-loop.
const { HssStore } = require('./hss.js');
const [ , , root, n, docsFile] = process.argv;
const s = new HssStore(root, 500 * 1024 * 1024);
const N = parseInt(n);
let docs;
if (docsFile && docsFile.endsWith('.json')) docs = JSON.parse(require('fs').readFileSync(docsFile, 'utf8'));
else {
  const seed = JSON.parse(require('fs').readFileSync('/tmp/hss-proto/seed/seed-2000.json', 'utf8'));
  docs = seed.slice(0, N).map(d => ({content: d.text, content_hash: d.content_hash}));
}
for (const d of docs) { s.put(d); }
