# WAVE 1 TEAM E — OWNER REVIEW RULING: CONDITIONAL ACCEPTANCE RECORDED
*Oct 14, 2026. Evidence anchors preserved: report repo df9bf2d, measured against 0ea50b7
(two DISTINCT anchors, never conflated).*

ACCEPTED AS REPORTED: E1 exact shard counts (43 chunks; 21,377 docs; 142,353,201 bytes;
0 empty; 377-500 docs/chunk — range consistent with stated total). E2 fresh live-seal
measurement (43/43 seals match manifest; all 43 byte-identical to prior reconciliation
receipts; 21,377/21,377 digests; 0 mismatch) — establishes BYTE STABILITY of the sealed
population across the measured interval; does NOT establish that every upstream identity
classification is correct.

E3 ACCEPTED WITH THE INSPECTION LIMIT PRESERVED: annotation tables 6/6, three distinct
conclusions intact, six absent from hunt_provenance. Bodies not inspected or modified.
THIS GATE MUST NOT BE DESCRIBED AS body re-verification OR a new historical-identity
determination. Quarantine remains in force.

E4: ACCEPT THE OBSERVED COUNTS, RETAIN THE SAMPLING LIMIT: corpus 1,341,437 unchanged in
window (+12,722 over Oct 13 baseline); provenance exact 3,249; acct1 42,622 unchanged;
300/300 sample found under both identities. The sample supports absence of an OBSERVED
population swap in the sampled records; it does NOT prove no swap or misclassification
anywhere in the full population. The 18,122/3,249 split remains DEPENDENT ON the prior
full reconciliation — seal continuity to prior receipts is artifact continuity, NOT
independent reproduction of every classification decision.

LIVE WRITER — ESCALATED TO TEAM F: acct3 hunt index rose to 32,036 (+8,108 since morning
preflight) while corpus stayed flat in the window. RECORDED AS: observed concurrent
change, writer identity and purpose UNRESOLVED. Do NOT infer malicious activity,
corruption, or an actual population swap from this observation alone. Do NOT disable the
writer, modify protected state, or interrupt production without separate authorization.
TEAM F MUST: determine whether the change is authorized; identify the responsible write
path; establish the affected time window; reconcile the changing index against the
applicable provenance and corpus invariants.

DECLARED DEVIATIONS (retain in audit trail): (1) first E4 run failed at D1's 100-variable
limit; in-memory results discarded; published measurements from fresh checkpointed second
run. (2) correspondence check = record presence, NOT independent per-document
reclassification of the 18,122/3,249 split.

EXECUTION BOUNDARIES: maintain quarantine; no sharding, merging, or protected-state
changes; no automatic promotion of downstream acceptance; keep all deviations and
unresolved observations visible. NEXT: await remaining reports before the consolidated
Team F ruling; the ledger must distinguish verified measurements, inherited reconciliation
conclusions, sampled evidence, declared deviations, and unresolved live-system behavior.
