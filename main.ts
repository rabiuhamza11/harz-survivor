// HPR-1 SURVIVOR — thin substrate adapter (P11 Phase 1, 2026-09-12).
// The wrapper's glue was EXTRACTED into hpr-runtime-core.js (substrate-agnostic, unsealed,
// disclosed). This adapter only binds Deno: Deno.serve + Deno KV adapter + the embedded
// capsule. Every digest, verdict, seal and write decision is executed by the capsule's
// sealed engine bytes. The same core also runs under Node in the witness sandbox — the
// runtime, not the wrapper, is the reusable primitive.
import { createRuntime } from "./hpr-runtime-core.js";

import { CAPSULE } from "./capsule-v8.js";
const CAPSULE_SRC = CAPSULE;

const WALKED_FROM = "cloudflare-workers (harz, account 3) \u2014 P10 v0.7 mirror build, capsule v8 (13 records, 27 seals, engine f69339b6 multi-mirror anchor gate) \u2014 served since P11 Phase 1 through the extracted HPR runtime (hpr-1.0.0), behavior parity proven at digest 077bc802";

let kvRaw: any = null;
try { kvRaw = await Deno.openKv(); } catch (_e) { kvRaw = null; } // no KV attached: serve capsule read-only, refuse writes honestly

const kv = kvRaw ? {
  get: async (k: string): Promise<any> => ((await kvRaw.get([k])).value ?? null),
  set: async (k: string, v: any): Promise<void> => { await kvRaw.set([k], v); },
} : null;

const rt = createRuntime(CAPSULE_SRC, kv, { walkedFrom: WALKED_FROM });

Deno.serve(async (req) => {
  const u = new URL(req.url);
  const body = req.method === "POST" ? await req.text() : "";
  const r = await rt.handle(req.method, u.pathname, body);
  return new Response(r.body, { status: r.status, headers: r.headers });
});
