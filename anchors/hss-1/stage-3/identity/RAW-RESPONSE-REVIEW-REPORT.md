# HSS-1 RULING 015 OUTSTANDING REVIEW — RAW SOURCE RESPONSES (v1.0)
*Oct 14, 2026, ~06:40Z. Performed on a CLEAN CHECKOUT (fresh clone at 2299a54) with no
reliance on desk state. No production write (none authorized, none needed).*

## Six checks — results

1. PROVENANCE — PASS. Each of the six source-<id>.html files is tied to its recorded
   URL, Oct 14 06:21:03-08Z retrieval timestamp, HTTP 200 status, byte count, and
   SHA-256 in RETRIEVAL-RECEIPTS.json and SOURCE-RESPONSE-DIGESTS.json; both records agree.

2. INTEGRITY — PASS. On the clean checkout, the committed bytes hash to exactly the
   recorded SHA-256 values, 6/6.

3. REPRODUCIBILITY — PASS. Offline, with no network: the committed extract.py
   regenerates all five Bleacher extracts byte-identically from the preserved responses
   (digests equal the comparison receipts); the committed compare.py reproduces all six
   published metric sets (fwd_containment, shingle counts, divergence thirds,
   chrome/content classification) from the frozen-snapshot bodies + preserved extracts.
   Doc 8254's extract is the preserved canonical Wikipedia API capture; its regeneration
   requires network by nature — the preserved copy plus response is the reproducibility
   basis (disclosed, not a gap).

4. SCOPE — PASS WITH DISCLOSURE. Pattern scan of all six responses found only
   third-party PUBLIC page content inherent to byte-exact capture: Bleacher Report's
   public anonymous GraphQL viewer JWT (embedded in every BR page served to anonymous
   visitors), community@bleacherreport.com (public contact address), and MediaWiki's
   empty anonymous csrfToken placeholder ("+\"). No credentials, no session tokens, no
   personal information of any individual, no material of ours anywhere — the
   investigation authenticated to nothing. Scrubbing these would violate the integrity
   requirement; they are public, non-secret, and inert.

5. RETENTION — PASS. Basis: Ruling 013 condition 5 (reproducible receipts), Ruling 014
   condition 5 (reproducible comparison), Ruling 010 closure condition 4 (evidence
   retained for independent audit). anchors/hss-1 is the program's evidence vault; 9.5MB
   total; remote push verified.

6. HISTORICAL DISTINCTION — PASS. The evidence README states explicitly that the files
   establish what was captured during THIS investigation (Oct 14, 2026) and do NOT
   establish what the sources served on October 6-8, 2026; every receipt carries the
   Oct-14 timestamps. (My first exact-string check missed the sentence because of a line
   wrap — a test artifact, disclosed; whitespace-normalized match confirms.)

## Verdict
All six checks pass (one with disclosure, which is inherent to byte-exact capture, not
a defect). The raw-response addition qualifies as EVIDENCE PRESERVATION, not a procedural
deviation. Per Ruling 015, the corroboration-receipt stage can CLOSE.

Final evidence classification unchanged: body integrity VERIFIED; current-source
identity CORROBORATED; historical identity UNPROVEN; quarantine MAINTAINED. The strongest
justified statement remains: no evidence of misidentification was found in the
present-day source comparison.
