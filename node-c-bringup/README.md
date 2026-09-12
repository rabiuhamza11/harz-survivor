# NODE C BRING-UP PACKAGE — death test v4 (P11)
GO received from the owner Sep 12, 2026 (~18:50 WAT). The test runs ONLY on
the owner-ruled Node C host. This package makes bring-up a ~10-minute job
once the host exists. Nothing here deploys or changes any live system.

## WHAT NODE C RUNS (unchanged, proven files — no new build)
git clone this repo, then from the repo root:
  node hpr-node-adapter.mjs        (zero npm dependencies, Node 18+)
Files: hpr-node-adapter.mjs (dual-mount adapter, proven on three substrates),
hpr-runtime-core.js (runtime hpr-1.0.0), capsule-v8.js (the book),
capsule-registry.js (capsule 2). Env: HPR_PORT (default 8930).
Node C is file-backed: overlay writes land in ./node-c-overlay.json (survives
restarts; kill -9 tested).

## HOST OPTION A — Oracle Cloud free tier ($0, arm, recommended for $0)
1. Owner signs up (oraclecloud.com — card used for identity verification only).
2. Create an Ampere A1 VM (any shape up to 4 OCPU/24GB stays free), Ubuntu 22.04.
3. Open ingress ports 80/443 AND the SSH port in the Security List.
4. On the VM: install Node 20 + Caddy (below) + run the service (below).
   Oracle needs an explicit ingress rule for port 443 — commonly forgotten.

## HOST OPTION B — VPS (Hetzner ~€4/mo class)
1. Owner creates the VPS (Ubuntu 22.04), SSH in.
2. Same steps as A from step 4. Hetzber egress to GitHub/Deno is open.

## HOST OPTION C — home/office machine, public exposure of the owner's choice
Honest limits: availability, dynamic IP, residential power — must be disclosed
in the closeout report.
1. Any Linux box with Node 20. Run the service (below).
2. The owner chooses how to expose it publicly (router port-forward, or any
   exposure service he already trusts). The requirement is only this: the
   witness must reach a public URL from the outside for S4.
3. If the exposure path is not reliable for the whole window, say so BEFORE
   the window and the test waits. No improvisation mid-test.

## SERVICE (systemd) — node-c-bringup/hpr-node-c.service
  sudo cp node-c-bringup/hpr-node-c.service /etc/systemd/system/
  edit the WorkingDirectory line to the clone path, then:
  sudo systemctl enable --now hpr-node-c

## TLS — node-c-bringup/Caddyfile
  sudo apt install caddy; sudo cp node-c-bringup/Caddyfile /etc/caddy/
  edit the domain line; sudo systemctl reload caddy
  A domain is needed for TLS (any cheap/free domain the owner owns); the
  router-forward path in Option C can serve HTTP for the test window if the
  owner accepts that honestly (S4's browser check works over HTTP too —
  label it plainly in the closeout).

## BRING-UP VERIFICATION — run BEFORE the window opens
  bash node-c-bringup/battery.sh
The battery checks, against the LIVE Node A and Node B (real requests):
  1. Node C book digest == Node A == Node B (three-way parity, printed)
  2. Registry verifies on Node C (ui SEALED, code SEALED)
  3. Writes refuse at 403 on the book AND the registry (no marker)
  4. Export parity: Node C export state byte-identical to Node B
  5. Restart persistence: restart the service, same digest
ALL five must pass before the frozen sequence (S1) is recorded.
