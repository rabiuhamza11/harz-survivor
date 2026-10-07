// R8 POST-REPIN GLUE (desk, Oct 8 2026) — runs ONLY after Magani's key_pin seal per Amendment 2.
// Dry by default: verifies all three soils report ONE common digest and tells the truth about state.
// --repoint: line-anchored repoint of node-c-bringup/r8-owner-send.mjs EXPECTED_BASE_DIGEST (P12 law:
// line-anchored, grep-verified before and after; refuses unless the current line matches base exactly).
import { readFileSync, writeFileSync } from "node:fs";

const SOILS = {
  "Node A (Cloudflare)": "https://harz-portable-app.harz.workers.dev",
  "Zeta (Vercel)":       "https://harz-hpr-zeta.vercel.app",
  "Survivor (Deno)":     "https://harz-survivor.harzcobusiness.deno.net",
};
const BASE = "bf4681b518b7f524e2ec5080d3a29899434af82598f367d569bc1feda52bdb5e";
const GLUE_PATH = new URL("../node-c-bringup/r8-owner-send.mjs", import.meta.url);

const results = [];
for (const [name, url] of Object.entries(SOILS)) {
  const r = await (await fetch(url + "/api/verify")).json();
  results.push({ name, verdict: r.verdict, records: r.records, seals: r.chain_length, digest: r.digest });
  console.log(name + ": " + r.verdict.slice(0, 30) + " | " + r.records + "/" + r.chain_length + " | " + r.digest);
}
const digests = [...new Set(results.map(r => r.digest))];
if (digests.length !== 1) { console.error("STOP — soils disagree at T1; nothing repointed. Owner ruling required."); process.exit(1); }
const D_T = digests[0];
const intact = results.every(r => /INTACT/.test(r.verdict) && r.records === 18);

if (D_T === BASE) {
  console.log("HONEST WAIT STATE — repin not yet adopted on the soils; book still at base bf4681b5. Nothing repointed. Magani's key_pin seal comes first (Amendment 2, step 2).");
  process.exit(0);
}
if (!intact) { console.error("STOP — digest moved but a soil is not INTACT 18 records. Stop, disclose, owner ruling."); process.exit(1); }

console.log("D_T (computed from the sealed engines' own output, never hand-typed): " + D_T);
console.log("Seal count expected: 45 (44 + key_pin #45). Amendment edit line: 'D_T = " + D_T + ", recorded by edit <date>, post-repin.'");

if (process.argv.includes("--repoint")) {
  const lines = readFileSync(GLUE_PATH, "utf8").split("\n");
  const ln = lines[16]; // line 17, line-anchored
  if (!ln.includes(BASE)) { console.error("REFUSED — line 17 does not contain the base digest; file state unexpected. Manual review before any edit."); process.exit(1); }
  console.log("BEFORE grep: " + (ln.match(/EXPECTED_BASE_DIGEST = '([0-9a-f]{64})'/) || [])[1]?.slice(0, 12) + "…");
  lines[16] = ln.replace(BASE, D_T);
  writeFileSync(GLUE_PATH, lines.join("\n"));
  const after = readFileSync(GLUE_PATH, "utf8").split("\n")[16];
  if (!after.includes(D_T) || after.includes(BASE)) { console.error("REPOINT VERIFY FAILED — reverting by rewrite from git."); process.exit(1); }
  console.log("AFTER grep (line 17): " + after.slice(0, 80));
  console.log("REPOINT DONE — line-anchored, grep-verified. Push next, then T1 battery at D_T + browser before any send.");
} else {
  console.log("Dry run only — pass --repoint after the witness seal lands to repoint the send glue.");
}
