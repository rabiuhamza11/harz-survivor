// HPR CLOUD NODE — portable server for free-tier cloud soils (owner "I approve", Oct 3, 2026).
// Same proven pattern as hpr-node-adapter.mjs (Node C) with a cloud label — glue is unsealed by
// design and disclosed; the sealed engine bytes and capsule v15 (18/44 at bf4681b5) are untouched.
// Runs on: Oracle Always Free VM, Render, Koyeb, Cloud Run (Node base image), any Node 18+ host.
// Usage: HPR_PORT=8940 HPR_OVERLAY=./overlay.json node node-cloud/server.mjs
import { createRuntime } from "../hpr-runtime-core.js";
import { CAPSULE } from "../capsule-v15-merge.js"; // Rung 2 merge book — 18/44 at bf4681b5, engine v1.0.0 pin 434c41d2
import { CAPSULE_REGISTRY } from "../capsule-registry.js";
import { BOUNDARY_TEXT, BOUNDARY_JSON } from "./boundary.js";
import { createServer } from "node:http";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const PORT = Number(process.env.HPR_PORT || 8940);
const OVERLAY_FILE = process.env.HPR_OVERLAY || new URL("./overlay.json", import.meta.url).pathname;
const WALKED_FROM = "HPR cloud node (portable server soil — owner-approved free-cloud expansion, Oct 3, 2026) — HPR runtime hpr-1.0.0 on Node.js " + process.version + " — honest labels: ephemeral-storage class unless a persistent disk is mounted; verify at /api/verify, boundary at /boundary";

const kv = {
  get: async (k) => { try { return existsSync(OVERLAY_FILE) ? JSON.parse(readFileSync(OVERLAY_FILE, "utf-8")) : null; } catch { return null; } },
  set: async (k, v) => { try { writeFileSync(OVERLAY_FILE, JSON.stringify(v)); return true; } catch (e) { console.error("overlay write failed (ephemeral/read-only soil):", e.message); return false; } },
};
const rtA = createRuntime(CAPSULE, kv, { walkedFrom: WALKED_FROM });
const rtR = createRuntime(CAPSULE_REGISTRY, null, { walkedFrom: "HPR Registry — capsule 2, sealed read-only" });

const server = createServer(async (req, res) => {
  const u = new URL(req.url, "http://hpr-cloud-node");
  let path = u.pathname;
  // NEVER HIDE THE BOUNDARY (standing rule): cloud nodes serve the expansion boundary at /boundary + /api/boundary.
  if (path === "/boundary") { res.writeHead(200, { "content-type": "text/plain; charset=utf-8" }); res.end(BOUNDARY_TEXT); return; }
  if (path === "/api/boundary") { res.writeHead(200, { "content-type": "application/json" }); res.end(BOUNDARY_JSON); return; }
  let rt = rtA;
  if (path === "/registry") { res.writeHead(301, { location: "/registry/" }); res.end(); return; }
  if (path.startsWith("/registry/")) { rt = rtR; path = path.slice("/registry".length); }
  let body = "";
  if (req.method === "POST") { for await (const chunk of req) body += chunk; }
  const r = await rt.handle(req.method, path, body);
  res.writeHead(r.status, r.headers);
  res.end(r.body);
});
server.listen(PORT, () => console.log("HPR CLOUD NODE listening on :" + PORT + " — capsule " + CAPSULE.manifest.version + ", " + CAPSULE.state.records.length + " records, " + CAPSULE.state.chain.length + " seals"));
