#!/usr/bin/env python3
"""Reproduces the Ruling 013 comparison metrics offline.

Inputs: frozen-snapshot bodies (six, verbatim from the forensic freeze) and the
preserved live extracts. Outputs fwd_containment, divergence-by-thirds, and
chrome/content missing-shingle counts. Shingle n=6; normalization: lowercase,
non-alphanumeric->space, whitespace collapse.
Usage: python3 compare.py <frozen-snapshot.jsonl> <live-extract-<id>.txt> <doc_id>
"""
import json, re, sys

def norm(t):
    t = t.lower(); t = re.sub(r'[^a-z0-9 ]+', ' ', t)
    return re.sub(r'\s+', ' ', t).strip()

def shingles(t, n=6):
    w = norm(t).split(); return {' '.join(w[i:i+n]) for i in range(len(w)-n+1)}

snap, extract_fn, did = sys.argv[1], sys.argv[2], sys.argv[3]
body = None
for line in open(snap):
    d = json.loads(line)
    if str(d['seed_idx']) == did or str(int(d['seed_idx'])+1) == did: body = d['text']
live = open(extract_fn).read()
CHROME = re.compile(r'\b\d+h\b|\b\d+d\b|\b\d+w\b|\b\d+m ago\b|bleacher report ?\d|via getty|getty images|photo credit|follow |tweet|scroll to continue|listen to|bleacher report app|download the app|odds via|via oddschecker|lines via|courtesy of|ap photo|usa today sports')
sb, sl = shingles(body), shingles(live)
missing = list(sb - sl)
nb = norm(body)
pos = sorted(nb.find(m)/max(len(nb),1) for m in missing if nb.find(m) >= 0)
thirds = [sum(1 for p in pos if p < 1/3), sum(1 for p in pos if 1/3 <= p < 2/3), sum(1 for p in pos if p >= 2/3)]
out = {'doc_id': int(did), 'body_shingles': len(sb), 'shared': len(sb & sl),
       'fwd_containment': round(len(sb & sl)/len(sb), 4),
       'divergence_thirds_first_middle_last': thirds,
       'missing_chrome_like': sum(1 for m in missing if CHROME.search(m)),
       'missing_content_like': sum(1 for m in missing if not CHROME.search(m))}
print(json.dumps(out))
