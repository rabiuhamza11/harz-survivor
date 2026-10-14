#!/usr/bin/env python3
"""Deterministic live-text extraction — Ruling 013/014 comparison evidence.

Regenerates live-extract-<id>.txt from the preserved raw responses source-<id>.html
with NO network access. Logic identical to the investigation run (Oct 14, 2026):
- bleacherreport docs: paragraph (<p>) text only, skipping script/style/noscript/
  template/svg/nav/header/footer/form; paragraphs whitespace-collapsed, \n-joined.
- doc 8254: the Wikipedia explaintext API extract is preserved verbatim as
  live-extract-8254.txt (API text; regenerate only by re-querying, which requires
  network — the preserved copy is the canonical captured form).

Usage: python3 extract.py source-2006.html ... -> prints extracted text to stdout.
"""
import re, sys
from html.parser import HTMLParser

class PExtract(HTMLParser):
    SKIP = {'script','style','noscript','template','svg','nav','header','footer','form'}
    def __init__(self):
        super().__init__(); self.parts=[]; self.skip=0; self.inp=0; self.buf=[]
    def handle_starttag(self, tag, attrs):
        if tag in self.SKIP: self.skip+=1
        elif tag=='p': self.inp+=1
    def handle_endtag(self, tag):
        if tag in self.SKIP and self.skip: self.skip-=1
        if tag=='p' and self.inp:
            self.inp-=1
            txt=re.sub(r'\s+',' ',''.join(self.buf)).strip()
            if txt: self.parts.append(txt)
            self.buf=[]
    def handle_data(self, data):
        if self.inp and not self.skip: self.buf.append(data)

for fn in sys.argv[1:]:
    p=PExtract(); p.feed(open(fn,encoding='utf-8',errors='replace').read())
    sys.stdout.write('\n'.join(p.parts))
