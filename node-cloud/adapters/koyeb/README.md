# Koyeb adapter (staged Oct 8, 2026 — deploy glue; NOTHING DEPLOYED)
Shape: container image, same as adapters/cloudrun/Dockerfile (explicitly Koyeb-ready).
Standalone deploy repo staged at github.com/rabiuhamza11/harz-hpr-koyeb (Dockerfile +
server.mjs + frozen pair + boundary, honest labels).

Owner hands (cardless — GitHub SSO, no card):
1. koyeb.com -> Sign in with GitHub.
2. Either: Create Web Service -> from GitHub repo harz-hpr-koyeb -> Builder: Dockerfile
   -> Instance: Free -> Deploy; or mint an API token (Account Settings -> API Tokens)
   and hand it to the desk — the desk lights it by API call, same hour.

Honest labels (never hidden): Koyeb free instance SLEEPS after idle (first hit wakes it,
slow cold start — a sleeping node reads as sleeping, never as lying); disk EPHEMERAL;
kv = null — READ-ONLY verify-and-receive soil at the base book. Writes and mesh
adoption refused honestly. Availability + failure-domain independence, not added
integrity — the digest is the integrity, recomputable anywhere.
