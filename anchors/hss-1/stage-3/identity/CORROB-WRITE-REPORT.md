# HSS-1 CORROBORATION RECEIPTS — EXECUTION REPORT (Ruling 014)
*Oct 14, 2026, 06:26Z. Third authorized production write. Strictly additive; production
acceptance limited to the corroboration receipts themselves.*

## Execution
TOCTOU (06:26:10Z): docs 1,341,437; provenance 3,249; six_body_receipts 6; corroboration
table absent; six docs rows match the six_body_receipts recorded hashes verbatim. CLEAN.
WRITE (06:26:18Z): new INSERT-only table identity_corroboration_receipts; 6 rows inserted
idempotently (fresh table, 0 skipped, 0 conflicts). Each row carries the THREE DISTINCT
conclusions per condition 1: body_integrity=VERIFIED, current_source_identity=CORROBORATED
(with class: STRONG for 8254; PRESENT_DAY for 2006/2011/2018; PRESENT_DAY_PARTIAL_RAW for
2025/2030), historical_identity=UNPROVEN, quarantine=MAINTAINED.

## Post-write independent verification — ALL PASS (06:26:25Z)
C1 three-distinct-conclusions: 6/6, never collapsed.
C2 evidence preserved: recorded hashes verbatim vs live docs AND six_body_receipts (6/6);
verified body digests join six_body_receipts (6/6) and re-hash live production bodies (6/6).
C3 quarantine: MAINTAINED on 6/6; six absent from hunt_provenance (0 rows).
C4 population unchanged: docs 1,341,437; provenance 3,249; six_body_receipts 6;
docs rows untouched.
C5 reproducible: each receipt embeds retrieval (URL, status, timestamp, response sha256,
bytes), comparison method (extraction type, 6-word shingle, normalization rule, metrics,
divergence thirds, chrome/content classification), and the corrected conclusion basis.
WORDING: all 6 receipts carry the owner-corrected conclusion — "No evidence of
misidentification was found in the PRESENT-DAY source comparison" — and classify historical
identity as unproven on the available evidence, without claiming future evidence is
impossible.

## Reproducibility artifacts (evidence/)
Full source responses source-<id>.html (6) with sha256 digests; deterministic live
extracts live-extract-<id>.txt whose sha256 values match the comparison receipts exactly
(31a61d91/243ebe95/1ec54cd2/58ca9eaf/ae6494da/3661dc9e...); RETRIEVAL-RECEIPTS.json;
COMPARISON-RAW/REFINED, DIVERGENCE-DIAGNOSTIC, CHROME-VS-CONTENT; CORROB-TOCTOU.json;
CORROB-POSTWRITE-VERIFICATION.json; SOURCE-RESPONSE-DIGESTS.json. An independent reviewer
can re-run extraction on the preserved responses, re-derive identical extract digests,
and re-compute the containment metrics.

## Deviations
None in procedure. Note: full raw source responses (~9.5MB) are committed to the evidence
folder to satisfy condition 5 (reproducibility) — the only practical way to preserve the
Oct-14-present-day responses, since the live pages change daily.
