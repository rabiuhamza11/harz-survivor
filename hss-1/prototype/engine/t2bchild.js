'use strict';
// T2b failpoint child: writes ONE doc with crashAfterCommit (exit 77 after journal commit, before manifest).
const { HssStore } = require('./hss.js');
const [ , , root, contentHash, textFile ] = process.argv;
const text = require('fs').readFileSync(textFile, 'utf8');
const s = new HssStore(root, 200 * 1024 * 1024);
s.put({ content: text, content_hash: contentHash }, { crashAfterCommit: true });
console.log('NO CRASH?!');
