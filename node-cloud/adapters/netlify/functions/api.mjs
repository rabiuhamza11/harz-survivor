// HPR cloud node — Netlify function wrapper. netlify.toml redirects /api/* -> /.netlify/functions/api
// and /boundary -> the function with __path=boundary. Ephemeral soil class (disclosed, see boundary).
import { createRuntime } from "../../../hpr-runtime-core.js";
import { CAPSULE } from "../../../capsule-v15-merge.js";
import { BOUNDARY_TEXT, BOUNDARY_JSON } from "../../boundary.js";

const kv = { get: async () => null, set: async () => false };
const rt = createRuntime(CAPSULE, kv, { walkedFrom: "HPR cloud node (Netlify functions soil — ephemeral class, disclosed)" });

export default async (req, context) => {
  let path = new URL(req.url).pathname.replace(/^\/api/, "") || "/";
  if (path === "/boundary" || path === "/api/boundary") {
    const json = path.includes("/api/");
    return new Response(json ? BOUNDARY_JSON : BOUNDARY_TEXT, { headers: { "content-type": json ? "application/json" : "text/plain; charset=utf-8" } });
  }
  let body = "";
  if (req.method === "POST") body = await req.text();
  const r = await rt.handle(req.method, path, body);
  return new Response(r.body, { status: r.status, headers: r.headers });
};
