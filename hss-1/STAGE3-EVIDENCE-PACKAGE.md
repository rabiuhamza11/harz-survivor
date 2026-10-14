# HSS-1 STAGE 3 — RECONCILED EVIDENCE PACKAGE v1.0 (Ruling 005)
*Oct 14, 2026. Historical records preserved. Production unchanged. Quarantine maintained.*

## §1 Six quarantined bodies — repair receipts (AUTHORIZED, EXECUTED)
Artifacts: anchors/hss-1/stage-3/recovery/RECEIPTS-SIX-BODIES.json
Six receipts, each: verified body digest (independent recompute from preserved
evidence), byte length, source chunk + chunk-seal proof, discrepancy record vs
historical hash, verdict BODY_INTEGRITY_VERIFIED / HISTORICAL_IDENTITY_INTEGRITY_UNPROVEN.
All six: declared digests match, chunk seals match, frozen-snapshot bodies identical,
quarantine MAINTAINED, recorded hashes untouched. No historical explanation invented.

## §2 The 3,249 — full 43-chunk sweep (AUTHORIZED, EXECUTED)
Artifacts: SWEEP43-AGGREGATE.json + 43 per-chunk receipts + RECOVERY-MANIFEST-3249.json
Results: 43/43 chunk seals verified against the sealed manifest. All 21,377 chunk-store
docs re-digested: 21,377 verified, 0 mismatches, 0 empty bodies. Hunt population: 3,249
expected, 3,249 found, 0 missing, 0 extra, 0 declared mismatches, 0 identity collisions.
Deterministic recovery manifest: 3,249 rows (hunt_hash | body_sha256 | bytes | chunk | seq,
sorted), manifest sha256 cead2356429880355106981e3cb65a4220e12e5eab5c8de290b41bfaf7c23764.
Identity model check (ruling condition): HARZ uses content_hash AS document identity (docs
UNIQUE(content_hash), no separate stable id). For NEW records identity = sha256(body bytes),
consistent with the model; hunt_hash recorded as provenance field only. No existing identity changed.

## §3 Isolated staging restoration test (EXECUTED, production untouched)
Artifacts: STAGING-TEST-RECEIPT.json — 8/8 PASS:
T1 ingest 3,249/3,249, 0 refused, 0 dup. T2 identity uniqueness 3,249 unique identities.
T3 restored bytes exact: 6,498 objects (2 backends) re-read and re-hashed, 0 mismatches.
T4 provenance coverage: 3,249/3,249 hunt hashes mapped to staged records.
T5 storage accounting exact: engine 86,565,018B vs walked 86,565,014B, delta 4B (seals
bookkeeping file, disclosed). T6 restart recovery: states preserved exactly post-verify,
3,249 verified, 0 failed. T7 rollback: staging store removed, recovery manifest preserved,
nothing outside staging ever written. Production restoration remains ON HOLD per ruling.

## §4 Integrity + Team F (PROVISIONAL per ruling; evidence retained)
7/7 crash/recovery scenario battery: receipts at stage-3/integrity/run4.log + audit script.
Team F independent verification receipt: stage-3/forensics/F-independent-verification.json.
Final acceptance awaits inspection of actual receipts and coverage confirmation — owner review.

## §5 Stage 2 deliverables — acceptance gate OPEN (per ruling §4)
Team A — Architecture: spec hss-1/BASELINE-v2.md (commit 2ce6283); corrected corpus baseline
frozen (1,328,715 recorded; 21,377 sealed; overlap relationship proven 86.2% corpus-internal
in Gate B exhaustive sweep, b473f70); superseded 89.7% finding preserved, not deleted.
PASS on frozen-baseline criterion; identity relationships documented (docs-unique-on-
content_hash; verified 236,994 + 6 quarantined + 3,249 external, exact 21,377 reconciliation).
Known limit: population relationship now measured, not assumed.
Team C — Corpus verification: pipeline hss-1/VERIFICATION-PIPELINE.md (2ce6283); crash-safe
resumable receipts; LIVE interrupt/resume proven (Gate A, b473f70); states
verified/pending/failed/quarantined encoded; 236,994 verified + 6 quarantined exact. PASS on
pipeline criterion; known limit: 1,307,338-1,328,715 population remaining pending (by design).
Team F — Independent audit: F-independent-verification.json (Stage 3, 7f624c8) + battery
16/16 (b473f70) + 7/7 scenario battery (this package). PASS provisionally per ruling §3;
final acceptance on owner inspection of receipts.
EXPLICIT GATE: Stage 2 acceptance remains OPEN. Nothing here is inferred as accepted.

## §6 Production gates status (unchanged)
Corpus reconciliation: 21,377 sealed fully accounted; 236,994 corpus-verified of 1,328,715.
Durability / Recoverability: prototype-proven at tested scale only.
Capacity honesty: multiplier 5.90 measured at 100k rung, component breakdown recorded.
Portability: export byte-identical restore proven at tested scale.
PRODUCTION ACCEPTANCE: WITHHELD. All work sandboxed. Quarantine intact. Historical hashes intact.
