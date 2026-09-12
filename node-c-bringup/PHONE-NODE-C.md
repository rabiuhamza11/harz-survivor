# PHONE NODE C — Infinix Hot 10i bring-up (owner's phone, death test v4)
The owner ruled: Node C = his phone. First HARZ-OWNED soil in the program.
Honest labels: phone-grade hardware, mobile-data network, single-window
availability, battery-dependent, public exposure via a free SSH relay
(borrowed exposure path — the SOIL is owned, the URL is not; disclosed).

## REQUIREMENTS (all free, no purchase)
Phone + charger + mobile data. ~45 min of the owner's hands, once.

## STEPS (do in order, ~30-45 min)
1. Install Termux — from F-Droid (f-droid.org) or the Termux GitHub releases
   page as an APK. DO NOT use the Play Store version (outdated, broken).
2. Open Termux, run:
     pkg update -y && pkg upgrade -y
     pkg install -y nodejs-lts git openssh procps
3. Clone the repo (it is public):
     git clone https://github.com/rabiuhamza11/harz-survivor.git
     cd harz-survivor
4. Start the runtime:
     node hpr-node-adapter.mjs
   Expected console line: "Node C listening on :8930" then leave it running.
   (Open a SECOND Termux session by swiping from the left edge for steps 5-7.)
5. Keep the phone awake:
     termux-wake-lock
   Plug in the charger. Android Settings > Apps > Termux > Battery >
   Unrestricted (so Android does not doze it mid-test).
6. Get the public URL (free SSH relay, one line, no signup):
     ssh -R 80:localhost:8930 nokey@localhost.run
   It prints an https URL like https://xxxx.loca.run — SEND THAT URL to the
   witness. Keep this session open for the whole test window.
   (If it disconnects, rerun the same line and send the new URL — honest
   note: the URL is ephemeral, the book does not care.)
7. Run the bring-up battery (in the second session, from the clone folder):
     bash node-c-bringup/battery-termux.sh
   ALL FIVE checks must pass (parity with Node A and B live, registry sealed,
   403 refusals, export byte-identical, restart survival).

## THEN
Send the witness: (a) the public URL, (b) the battery output.
Witness verifies the URL in a real browser, records the S1 three-node
baseline, and the frozen sequence runs on the owner's window call.

## HONEST LIMITS (will appear in the closeout report)
- If the phone reboots, the window STOPS (rule A5 — no improvisation).
- The relay URL lives on a third party's service: exposure borrowed, soil owned.
- 2GB RAM is enough (Node + capsule is tiny), but close other apps.
- Mobile data must hold for the window (~30-60 min).
