# TEAM D — Nigeria-Africa Source Plan v1.0
*Proposal only. Zero ingestion, zero queue writes, zero deployments. Oct 12, 2026.*
*Execution is gated on: (a) wave resume (fetcher fix passing review — waves paused since Oct 9), (b) owner word on acquisition scope.*

## Audit findings (measured, Oct 12)

1. **Language**: all 107 nightly sources are English-language. The hunt index is ~26% en.wikipedia.
   Nigerian languages (Hausa, Igbo, Yoruba, Fulfulde, Pidgin) have ZERO representation.
2. **Africa press**: already covered — allafrica, nation.africa, venturesafrica, SA (ewn, mg, citizen,
   dailymaverick, timeslive), Kenya (monitor, theeastafrican, standardmedia), Ghana (ghanaweb,
   myjoyonline), UG (monitor), ZW (herald), RW (newtimes), Morocco, africanarguments.
3. **Nigeria gov**: covered — cbn, firs, ncc, nimc, ncdc, nigerianstat, jamb, nuc + queued fmoh,
   placng, nerdc, nbte, iita. Missing majors: NASS (bills/acts!), CAC, NEITI, NIMET, NDIC, PenCom,
   NAICOM, NPC, NNPC.
4. **Nigeria press**: covered broadly. Missing: thecable.ng, vanguardngr.com, guardian.ng, channels.tv.
5. **Pan-African institutions**: MISSING entirely — AU, AfDB, UNECA, ECOWAS, Africa CDC, Afreximbank.

## Prioritized acquisition tiers (queue-ready when waves resume)

**T1 — Nigerian-language tier (THE gap, ~70k docs est.)**
ha.wikipedia.org, ig.wikipedia.org, yo.wikipedia.org, ff.wikipedia.org (Fulfulde),
bbc.com/hausa, bbc.com/igbo, bbc.com/yoruba, bbc.com/pidgin, voahausa.com, dw.com/ha,
radiokoochee.fm? (verify before queue). All Latin-script — compatible with the frozen tokenizer
in principle; Yoruba diacritics behavior UNTESTED — pilot 500 docs and verify term extraction
before scale (honest gate).

**T2 — Pan-African institutional (~15k docs est.)**
au.int, afdb.org, uneca.org, ecowas.int, africacdc.org, afreximbank.com

**T3 — Nigeria gov majors (~30k docs est.)**
nass.gov.ng (bills + acts — highest civic value), cac.gov.ng, neiti.gov.ng, nimet.gov.ng,
ndic.gov.ng, pencom.gov.ng, naicom.gov.ng, npc.gov.ng, nnpcgroup.com

**T4 — Nigeria press gaps (~10k docs est.)**
thecable.ng, vanguardngr.com, guardian.ng, channels.tv

## Storage honesty (Team E constraint)

D1 at 89% of the 10GB ceiling; real headroom ~190k docs. Full T1-T4 estimate ~125k docs
(conservative) — fits headroom ONCE, but competes with the 32,610-doc regather (already queued).
Recommendation: pilot order T1-language first (the unique gap), 10k-doc pilot, verify tokenizer +
dedup on real language content, then owner ruling on scale vs R2-backing before the full tier.

## Duplication audit

No tier overlaps: 0 of the proposed domains exist in gather-sources (107) or the 306-domain
regather queue. Language Wikipedias are distinct hosts from en.wikipedia hunts.
