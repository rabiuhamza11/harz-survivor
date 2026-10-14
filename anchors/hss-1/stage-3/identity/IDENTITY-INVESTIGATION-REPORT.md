# HSS-1 SIX-DOCUMENT HISTORICAL IDENTITY INVESTIGATION — REPORT v1.0 (Ruling 013)
*Oct 14, 2026, 06:20-06:35Z. Read-only. Production untouched. Quarantine unchanged for all six.*

## Method (reproducible)
All six recorded URLs retrieved live (receipts: RETRIEVAL-RECEIPTS.json; full responses
preserved as source-<id>.html with sha256). Comparison: 6-word normalized shingle
containment of each stored body in live-extracted text; live extraction per source type
(p-only paragraph extraction for bleacherreport; Wikipedia action=query explaintext API
for the article); divergence localized by body-position thirds; missing shingles
classified chrome-like (timestamps, related-lists, scoreboards, photo credits) vs
content-like. Normalization: lowercase, non-alphanumeric to space, whitespace collapse.

## Per-document evidence records

DOC 8254 — en.wikipedia.org/wiki/Representative_APR
Retrieved 06:21:08Z, HTTP 200, response sha ac3e1dfa... (52,172 B). Live article extract
3,985 chars vs body 3,918. Containment 624/629 shingles = 99.2%. Divergence: 5
shingles, ALL in the lead (citation/regulation-date formatting and lead wording).
CLASS: STRONG CORROBORATION.

DOC 2006 — bleacherreport.com/articles/25507024 (NFL Trade Block, Entering Week 5)
Retrieved 06:21:03Z, HTTP 200, response sha c51bc314... (2,056,888 B). Containment
85.3% raw. Middle-third missing: 87/2,387 (3.6%); divergence concentrated in tail
(197) = rotating related-headlines + time-ago stamps; lead (66) = title/author/date
formatting. CLASS: CORROBORATION.

DOC 2018 — bleacherreport.com/articles/25508029 (MLB Playoff Overreactions)
Retrieved 06:21:05Z, HTTP 200, response sha 62280ce5... (2,000,214 B). Containment
86.0% raw. Middle-third missing: 86/2,420 (3.6%); tail 173, lead 80 — same artifact
classes. CLASS: CORROBORATION.

DOC 2011 — bleacherreport.com/articles/25507880 (Stephen A. Smith apology)
Retrieved 06:21:04Z, HTTP 200, response sha 00e7714b... (1,880,015 B). Containment
73.6% raw. Middle-third missing: 0/599 — the entire article body matches. Divergence:
lead formatting (41) + tail chrome (117). CLASS: CORROBORATION.

DOC 2025 — bleacherreport.com/articles/25508065 (Aaron Boone clubhouse)
Retrieved 06:21:06Z, HTTP 200, response sha 862791eb... (1,905,994 B). Containment
61.4% raw — small body (2,457 chars) makes chrome proportionally large. Middle-third
missing: 4/373. Divergence: lead 45 + tail 95 (play-by-play scores, related lists,
time-ago stamps — all time-rotating chrome). CLASS: CORROBORATION (PARTIAL raw, content corroborated).

DOC 2030 — bleacherreport.com/articles/25507895 (Peyton Manning's son, CFB offers)
Retrieved 06:21:07Z, HTTP 200, response sha 92c06f03... (1,974,939 B). Containment
54.8% raw. Middle-third missing: 15/405. Divergence: lead 45 + tail 123 (rotating
headline lists, "10h"-class timestamps). CLASS: CORROBORATION (PARTIAL raw, content corroborated).

## Established facts vs corroboration vs unresolved
ESTABLISHED: all six recorded URLs are live TODAY and serve documents whose article
content contains essentially the entire article content of the stored bodies
(middle-third divergence 0.0-3.7% BR, 0.8% Wikipedia-lead). No URL is dead, redirected,
or serving an unrelated document. No evidence of misidentification exists anywhere in
the evidence chain.
CORROBORATION ONLY (per the central evidentiary rule): today's match corroborates that
each body belongs to its recorded URL's document. It cannot establish what the pages
served on Oct 6-8, 2026; the residual divergence (article updates since, extraction
chrome, lead edits) is consistent both with ordinary page evolution and with any
unknown-fetch-window variance.
UNRESOLVED: historical identity — whether the recorded hashes were ever computed over
these bodies remains unproven and, given the ingest-era divergence classification,
permanently unprovable. Nothing in this investigation changes that.

## Artifacts
RETRIEVAL-RECEIPTS.json, source-<id>.html (6), COMPARISON-RAW.json (8-gram whole-page),
COMPARISON-REFINED.json (6-gram targeted), DIVERGENCE-DIAGNOSTIC.json (position thirds),
CHROME-VS-CONTENT.json (missing-shingle classification), SIX-SUBJECTS.json (bodies,
bound to frozen-snapshot digest 68bdf095...).

## Recommendation (proposal only — no action taken)
1. QUARANTINE UNCHANGED for all six. Live-source corroboration satisfies NO release
   condition (binding control 1 of Ruling 012; the central evidentiary rule).
2. On owner word, the corroboration evidence may be recorded as a SEPARATE annotation
   (e.g., an INSERT-only identity_corroboration receipt table, same procedure class as
   six_body_receipts) — keeping "body verified", "identity corroborated", and "historical
   identity unproven" as three distinct, honest labels.
3. The corroboration strengthens the case for eventual corpus re-acquisition rails
   (fetch-time source archiving), but no such workstream is proposed for execution here.

GOVERNING PRINCIPLE APPLIED: verified what the evidence proves; promoted nothing it merely suggests.
