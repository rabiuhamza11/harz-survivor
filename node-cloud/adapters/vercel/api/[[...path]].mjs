// HPR cloud node — Vercel serverless wrapper (Node runtime). Catch-all under /api/*.
// The sealed runtime executes from capsule v15 bytes; glue is unsealed and disclosed (see /boundary).
import { createRuntime } from "../../../hpr-runtime-core.js";
import { CAPSULE } from "../../../capsule-v15-merge.js";
import { BOUNDARY_TEXT, BOUNDARY_JSON } from "../../boundary.js";

const kv = { get: async () => null, set: async () => false }; // honest: serverless = ephemeral soil class, see boundary
const rt = createRuntime(CAPSULE, kv, { walkedFrom: "HPR cloud node (Vercel serverless soil — ephemeral class, disclosed)" });

export default async function handler(req) {
  const u = new URL(req.url);
  let path = u.pathname.replace(/^\/api/, "") || "/";
  if (path === "/boundary") { return new Response(BOUNDARY_TEXT, { headers: { "content-type": "text/plain; charset=utf-8" } }); }
  if (path === "/api/boundary") { return new Response(BOUNDARY_JSON, { headers: { "content-type": "application/json" } }); }
  let body = "";
  if (req.method === "POST") body = await req.text();
  const r = await rt.handle(req.method, path, body);
  return new Response(r.body, { status: r.status, headers: r.headers });
}
