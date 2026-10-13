# HSS-1 TEAM E — REPLICATION, PARTITIONS, AND THE INDEPENDENCE BOUNDARY
*Oct 13, 2026, Ruling 002 §4: "Two copies on the same physical device do not provide
the same protection as copies on independent devices."*

## 1. What the prototype proves today (sandbox)
Partition: writes continue in degraded mode (T9: 100/100 served during partition,
resync 100/100, zero forks, no node resurrection). Node loss: replica serves,
digest-verified, restore from replica (T5). Crash recovery: journal replay + honest
unacked adoption (T2/T2b/T3).

## 2. What it CANNOT prove in a sandbox (explicit boundary)
nodeA/nodeB are directories on ONE physical device. A device-level failure
destroys both "replicas" simultaneously. The prototype's 2-replica layout is a
LOGICAL redundancy model, not an independent failure-domain model. Genuine
independence requires one of:
1. Two different storage backends on two different providers (e.g., R2 + a second
   account/region), or
2. Owned hardware in a physically separate location (the Ceph rung),
or at minimum a second account/machine — none of which is deployable without a
separate production authorization (Ruling 002 final clause).
T9's partition behavior TRANSFERS to independent nodes only at the protocol level;
the independence claim itself must be re-proven on real separate infrastructure
at the pilot stage, per the production gate.

## 3. Ruling consequence for the multiplier
The 6.3x-ish multiplier measured in the ladder counts 2 logical replicas. Two
INDEPENDENT failure domains will carry the same 2x replica cost but require the
promotion-gate test (T10) to be run as a REAL backend move before any physical
specification freezes. Multiplier runs at each scale ladder rung are in SCALE-REPORT.md.
