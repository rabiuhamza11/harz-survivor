# Evidence folder — Ruling 014 raw-response preservation (owner review checklist basis)

PROVENANCE: source-<id>.html (6 files) are the byte-exact HTTP response bodies retrieved
Oct 14, 2026 (06:21:03-08Z) from the six recorded URLs; see RETRIEVAL-RECEIPTS.json and
SOURCE-RESPONSE-DIGESTS.json for per-file URL, status, retrieval timestamp, bytes, and
SHA-256. live-extract-<id>.txt are the deterministic extracts (extract.py).

HISTORICAL DISTINCTION (binding wording): these files establish what was captured during
THIS INVESTIGATION (Oct 14, 2026). They do NOT establish what the sources served on
October 6-8, 2026. The strongest justified conclusion remains: no evidence of
misidentification was found in the present-day source comparison.

OFFLINE REPRODUCTION: python3 extract.py source-<id>.html > regenerated.txt (for
2006/2011/2018/2025/2030) reproduces live-extract-<id>.txt byte-identically; doc 8254's
extract is preserved verbatim (Wikipedia API text; regeneration would require network).
python3 compare.py frozen-snapshot.jsonl live-extract-<id>.txt <doc_id> reproduces the
published metrics from the forensic freeze + preserved extract, no network needed.
