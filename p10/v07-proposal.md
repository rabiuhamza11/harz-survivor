# P10 v0.7 PROPOSAL — ANCHOR REDUNDANCY (drafted Sep 12, 2026; PROPOSAL ONLY — nothing deploys without owner GO)

## The bug v3 found live
The v0.6 return gate fetches ONE anchor URL (raw.githubusercontent.com/.../ledger.md) from
inside the sealed bytes. Cloudflare Worker egress cannot reach raw.githubusercontent.com
(8 live refusals, all fail-closed, all honest). As sealed, the anchor-gated return can never
complete on the source substrate. Fail-closed worked exactly as pre-registered — the refusal
IS a successful gate — but the window it protects can never close via v0.6.

## The fix (v0.7)
Replace ANCHOR_URL with a sealed list ANCHOR_URLS (three independent mirrors of the same
git-tracked ledger):
  1. https://raw.githubusercontent.com/rabiuhamza11/harz-survivor/main/anchors/ledger.md
  2. https://cdn.jsdelivr.net/gh/rabiuhamza11/harz-survivor@main/anchors/ledger.md
  3. https://raw.githack.com/rabiuhamza11/harz-survivor/main/anchors/ledger.md
ingestReturn tries each in order; the FIRST mirror that serves readable content is checked
for the anchored base; the return seal's anchor proof RECORDS WHICH mirror served it
(auditable). All unreachable -> fail-closed, unchanged. Base absent everywhere readable ->
ANCHOR MISMATCH naming the digest, unchanged. All v0.5 divergence checks unchanged.

## Disclosed limits (new boundary language, dated amendment with the deploy)
- Mirrors are CACHES of the git repo (jsdelivr/githack cache up to 12h; purge API exists for
  jsdelivr). The desk must purge after each anchor; the gate verifies by digest presence.
  Cache lag can delay a mirror, never forge it.
- Any-of weakens the trust slightly vs single-host (three hosts to trust instead of one);
  recorded-mirror-in-seal keeps it auditable. The alternative (all-of) inherits the CF egress
  fragility and is rejected.
- Egress blocking is substrate-specific and can change without notice; the anchor proof
  seal records the working mirror so drift is visible.

## Battery (all rerun on the new build before any deploy)
The v0.6 10-point battery + new: mirror-2 accept (raw unreachable from test env), single
mirror stale -> falls through to next, all down -> fail-closed, forged base -> MISMATCH,
anchor proof records mirror correctly.

## Continuation of the OPEN v3 window (witness pre-registration required before anything runs)
Mid-window engine upgrade is a disclosed, witnessed continuation: v0.6 refusal logged
verbatim; v0.7 deployed source-first; the new marker-time base digest (state + v0.7 code
manifest) computed and re-anchored; witness pre-registers the new base BEFORE the return
re-executes; return ingests the survivor overlay -> one book, window closed.
NOT done as a silent fix — every step re-witnessed.

## Cost / duplication audit
Desk hours at test scale; zero money. No multi-anchor mechanism exists anywhere in the
ecosystem (checked: Nation anchor single-URL, portable app anchor single-URL). The Nation
could adopt the same pattern later as its own proposal — NOT touched here.

## Owner options
A) Record v3 as complete-with-finding (fail-closed refusal = the pre-registered honest
   result); book stays split, window stays open until a future fix. Honest but operationally
   parked.
B) GO on v0.7 -> battery -> witnessed continuation -> return executes -> one book, window
   closed. RECOMMENDED.
C) Keep retrying v0.6 in place (block may clear on its own; no ETA). Desk can poll on a
   schedule; no code changes.
