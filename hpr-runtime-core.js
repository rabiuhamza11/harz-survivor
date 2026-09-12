// HPR-1 — HARZ PORTABLE RUNTIME CORE (P11 Phase 1 — extracted 2026-09-12)
// Extracted from the P9/P10 survivor wrapper into substrate-agnostic glue.
// UNSEALED and DISCLOSED by design. This core computes NOTHING cryptographic:
// every digest, verdict, seal and write decision is executed by the CAPSULE's
// sealed engine bytes (new Function). The core routes requests, composes the
// disclosed overlay, and serves. It executes ANY capsule shaped:
//   { manifest, ui_manifest, ui, code_manifest, code, state }
// Runtime contract: the capsule's sealed engine must export CONTRACT, activeMarker,
// canWrite, appendWithSeal, ingestReturn, verifyExport, digestOf, verifyChain,
// hashAssets, sha256hex.
// Substrate adapter: kv = { get(key) -> value|null, set(key, value) }, or null
// (read-only capsule; writes refused honestly).

const MIME = { "/": "text/html; charset=utf-8", "/app.css": "text/css; charset=utf-8", "/app.js": "application/javascript; charset=utf-8", "/icon.svg": "image/svg+xml", "/manifest.json": "application/json", "/sw.js": "application/javascript; charset=utf-8" };

async function sha256hex(s) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function createRuntime(capsule, kv, opts = {}) {
  const C = capsule;
  const WALKED_FROM = opts.walkedFrom ?? JSON.stringify(C.manifest && C.manifest.origin ? C.manifest.origin : {});
  const RUNTIME = { name: "HARZ Portable Runtime", version: "hpr-1.0.0", extracted: "2026-09-12", phase: "P11 Phase 1 — runtime extraction" };

  const BOUNDARY = {
    doc: "HARZ Portable Runtime — Security & Portability Boundary", version: "hpr-1.0.0", date: "2026-09-12",
    guarantees: [
      "The capsule (state + UI + sealed engine) is served verbatim; the verdict is DERIVED by executing the sealed engine string (new Function), never typed.",
      "Writes are executed BY the sealed engine and are legal only while an active walkout marker is sealed in the chain — refused otherwise by sealed code.",
      "Every write appends a record + a SHA-256 seal to the overlay; the digest rolls forward. Append-only.",
      "RUNTIME EXTRACTION (P11 Phase 1): the wrapper glue was extracted into this core. Behavior parity is proven when the book served through the core computes the byte-identical digest.",
    ],
    cannot_detect: [
      "Hash seals are tamper-EVIDENCE, not signatures — no authorship is proven.",
      "Sealed write code proves UNCHANGED, not CORRECT — a sealed bug is still a bug.",
      "The overlay persistence (KV/D1/SQLite) is UNSEALED glue (disclosed); the seals and digests are computed by the sealed engine, but the store itself is trusted.",
      "SINGLE-WRITER per capsule: one writer, one overlay. Not multi-writer consensus, not failover, not a distributed database. Concurrent writes are not proven at this scale.",
      "MARKER PROVENANCE: the walkout marker is trusted from the kill route — not unforgeable.",
      "Lockstep rewrite of the entire package still self-verifies (unsolved hash-chain limit); external anchors are the mitigation.",
    ],
    trust: ["The substrate must faithfully execute the sealed bytes. Verify the digest yourself: fetch /api/export and run the sealed engine at /api/source."],
    research: "P11 / HPR-1 experiment of the cloud-substrate research program. Prototype at test scale. Not a product.",
  };

  function loadSealedEngine() {
    return (new Function(C.code["/engine.js"] + "; return { CONTRACT, activeMarker, canWrite, appendWithSeal, ingestReturn, verifyExport, digestOf, verifyChain, hashAssets, sha256hex };"))();
  }

  async function overlay() {
    // REBUILD RULE (disclosed unsealed glue): overlay entries already ingested into the frozen
    // chain by the sealed return gate are historical residue of the death window — IGNORED in the
    // active state, REPORTED here, NEVER deleted.
    if (!kv) return { records: [], seals: [], lastDigest: null, stale: 0 };
    const raw = (await kv.get("overlay")) || { records: [], seals: [], lastDigest: null };
    const frozenSealHashes = new Set(C.state.chain.map((s) => s.hash));
    const frozenRecordIds = new Set(C.state.records.map((x) => String(x.id)));
    const seals = raw.seals.filter((s) => !frozenSealHashes.has(s.hash));
    const records = raw.records.filter((x) => !frozenRecordIds.has(String(x.id)));
    const stale = (raw.seals.length - seals.length) + (raw.records.length - records.length);
    const lastDigest = seals.length === 0 ? null : raw.lastDigest;
    return { records, seals, lastDigest, stale };
  }

  function composedState(ov) {
    return { records: C.state.records.concat(ov.records), chain: C.state.chain.concat(ov.seals) };
  }

  async function handle(method, path, body) {
    const CORS = { "access-control-allow-origin": "*", "cache-control": "no-store" };
    const json = (o, s = 200) => ({ status: s, headers: { ...CORS, "content-type": "application/json" }, body: JSON.stringify(o) });
    if (method === "OPTIONS") return { status: 204, headers: CORS, body: null };
    try {
      const ov = await overlay();
      const E = loadSealedEngine();
      const state = composedState(ov);
      const composedDigest = await E.digestOf(state, C.ui_manifest, C.code_manifest);
      if (C.ui[path] !== undefined) {
        const h = await sha256hex(C.ui[path]);
        if (h !== C.ui_manifest[path]) return { status: 500, headers: CORS, body: "TAMPER GUARD: served UI asset does not match its sealed hash" };
        return { status: 200, headers: { ...CORS, "content-type": MIME[path] }, body: C.ui[path] };
      }
      if (path === "/api/health") return json({ ok: true, service: "HARZ Portable Runtime", runtime: RUNTIME, capsule_version: (C.manifest && C.manifest.version) || "?", contract: E.CONTRACT, engine: "sealed-executed (new Function)", frozen_records: C.state.records.length, overlay: kv ? (ov.records.length + " overlay record(s) — store attached") : "STORE NOT ATTACHED — writes will be refused (503)", overlay_records: ov.records.length, stale_overlay_ingested: ov.stale, writes: (await E.canWrite(state)).ok ? "WALKOUT ACTIVE — sealed writes open" : "sealed-refused (no active walkout marker)" });
      if (path === "/boundary") return json(BOUNDARY);
      if (path === "/api/records") return json({ ok: true, records: state.records, walked_from: WALKED_FROM, overlay: kv ? (ov.records.length + " overlay record(s) — store attached") : "STORE NOT ATTACHED — writes will be refused (503)", overlay_records: ov.records.length, stale_overlay_ingested: ov.stale, writes: (await E.canWrite(state)).ok ? "WALKOUT ACTIVE — sealed writes open" : (await E.canWrite(state)).reason });
      if (path === "/api/source") {
        const src = C.code["/engine.js"];
        const h = await sha256hex(src);
        if (h !== C.code_manifest["/engine.js"]) return { status: 500, headers: CORS, body: "TAMPER GUARD: served engine does not match its sealed hash" };
        return { status: 200, headers: { ...CORS, "content-type": "application/javascript; charset=utf-8" }, body: src };
      }
      if (path === "/api/record" && method === "POST") {
        let b; try { b = JSON.parse(body || ""); } catch (_e) { return json({ ok: false, error: "bad json" }, 400); }
        const recBody = String((b && b.body) ? b.body : "").trim().slice(0, 300);
        if (!recBody) return json({ ok: false, error: "body required" }, 400);
        const cw = await E.canWrite(state);
        if (!cw.ok) return json({ ok: false, verdict: cw.reason, writes: "sealed-refused" }, 403);
        if (!kv) return json({ ok: false, verdict: "OVERLAY UNAVAILABLE — walkout marker is active but no overlay store is attached; attach a store, then rebuild.", writes: "overlay-unavailable" }, 503);
        const r = await E.appendWithSeal(state, C.ui_manifest, C.code_manifest, recBody, new Date().toISOString(), "stranger");
        if (!r.ok) return json({ ok: false, verdict: r.reason }, 403);
        const v = await E.verifyExport({ state: r.state, ui_manifest: C.ui_manifest, ui: C.ui, code_manifest: C.code_manifest, code: C.code, digest: r.digest });
        if (!v.ok) return json({ ok: false, verdict: "REFUSED — write did not verify as a capsule: " + v.verdict }, 409);
        const newOv = { records: ov.records.concat([r.record]), seals: ov.seals.concat([r.seal]), lastDigest: r.digest };
        await kv.set("overlay", newOv);
        return json({ ok: true, verdict: "SEALED WRITE — appended by the sealed engine", id: r.record.id, digest: r.digest, seals: r.state.chain.length });
      }
      if (path === "/api/export") {
        return json({
          ok: true,
          manifest: { name: (C.manifest && C.manifest.name) || "HARZ Capsule", version: (C.manifest && C.manifest.version) || "?", contract: E.CONTRACT, program: (C.manifest && C.manifest.program) || "?", origin: Object.assign({}, C.manifest && C.manifest.origin ? C.manifest.origin : {}, { runtime: RUNTIME }), exported: new Date().toISOString(), overlay: { records: ov.records.length, seals: ov.seals.length, stale_ingested: ov.stale } },
          ui_manifest: C.ui_manifest,
          ui: C.ui,
          code_manifest: C.code_manifest,
          code: C.code,
          state,
          digest: composedDigest,
        });
      }
      if (path === "/api/verify") {
        const v = await E.verifyExport({ state, ui_manifest: C.ui_manifest, ui: C.ui, code_manifest: C.code_manifest, code: C.code, digest: composedDigest });
        const cw = await E.canWrite(state);
        return json({
          ok: v.ok,
          verdict: v.ok ? "CAPSULE INTACT — verdict derived from the sealed engine" : v.verdict,
          runtime: RUNTIME,
          derived_by: "sealed engine executed from capsule bytes (new Function)",
          records: state.records.length,
          chain_length: state.chain.length,
          overlay: { records: ov.records.length, seals: ov.seals.length, stale_ingested: ov.stale },
          writes: cw.ok ? "WALKOUT ACTIVE — sealed writes open" : cw.reason,
          digest: v.digest,
          digest_match: v.digest === composedDigest && (ov.lastDigest === null || v.digest === ov.lastDigest),
          ui_ok: [...state.chain].reverse().find((s) => s.kind === "ui_manifest") ? [...state.chain].reverse().find((s) => s.kind === "ui_manifest").payload === JSON.stringify(C.ui_manifest) : false,
          code_ok: [...state.chain].reverse().find((s) => s.kind === "code_pin") ? [...state.chain].reverse().find((s) => s.kind === "code_pin").payload === JSON.stringify(C.code_manifest) : false,
          engine_hash: C.code_manifest["/engine.js"],
          issues: v.issues,
          contract: E.CONTRACT,
        });
      }
      return json({ ok: false, error: "not found" }, 404);
    } catch (e) {
      return json({ ok: false, error: String(e) }, 500);
    }
  }

  return { handle, RUNTIME, BOUNDARY, loadSealedEngine };
}
