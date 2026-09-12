// HPR-1 NODE C ADAPTER (P11 Phase 2 — software mode, 2026-09-12)
// Thin substrate adapter binding the HPR runtime core to Node.js.
// Zero dependencies. Overlay store = JSON file (disclosed unsealed glue).
// HONEST LABEL: this Node C runs on RENTED sandbox compute — it proves the CODE
// executes on a third substrate family; physical sovereignty stays a hardware
// claim until it runs on HARZ-owned machines.
import { createRuntime } from "./hpr-runtime-core.js";
import { CAPSULE } from "./capsule-v8.js";
import { createServer } from "node:http";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const PORT = Number(process.env.HPR_PORT || 8930);
const OVERLAY_FILE = new URL("./hpr-node-c-overlay.json", import.meta.url);
const WALKED_FROM = "cloudflare-workers (harz, account 3) — P10 v0.7 mirror build, capsule v8 (13 records, 27 seals, engine f69339b6) — Node C: HPR runtime hpr-1.0.0 on Node.js " + process.version + " (software mode, rented compute, workbench evidence)";

// file-backed KV adapter (disclosed unsealed glue — same contract as the Deno adapter)
const loadOverlay = () => { try { return JSON.parse(readFileSync(OVERLAY_FILE, "utf8")); } catch (_e) { return null; } };
const kv = {
  get: async (k) => (k === "overlay" ? loadOverlay() : null),
  set: async (k, v) => { if (k === "overlay") writeFileSync(OVERLAY_FILE, JSON.stringify(v)); },
};

const rt = createRuntime(CAPSULE, kv, { walkedFrom: WALKED_FROM });

const server = createServer(async (req, res) => {
  const u = new URL(req.url, "http://node-c");
  let body = "";
  if (req.method === "POST") { for await (const chunk of req) body += chunk; }
  const r = await rt.handle(req.method, u.pathname, body);
  res.writeHead(r.status, r.headers);
  res.end(r.body);
});

server.listen(PORT, () => {
  console.log("HPR NODE C listening on :" + PORT + " — capsule " + CAPSULE.manifest.version + ", " + CAPSULE.state.records.length + " records, " + CAPSULE.state.chain.length + " seals");
});
