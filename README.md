# seedmind — a knowledge organism that dreams and breeds

**▶ Live: https://sjgant80-hub.github.io/seedmind/**

Not a note app. A **personal knowledge organism** in one file that **holds your life's information**,
**dreams overnight forming its own connections**, and **seeds a living copy** to someone else that grows
*their* version. Nobody has shipped a knowledge tool that reproduces. This one is alive, and it breeds.

It's the Seal (§27 of the framework) made concrete from the anatomy organs:

| loop | what happens | organ it comes from |
|---|---|---|
| **HOLD** | content-addressed memories, embedded + chorded | fall-remember + the-cam |
| **CONNECT** | memories link by ear — *kin / complementary / clash* | the-kg (holds) + the-throat (hears) |
| **DREAM** (Gary's cycle) | idle consolidation: link what was missed, then **bridge** (A~B~C ⟹ A~C) — connections it forms *for itself* | the wisp / missig |
| **BREED** | `seed()` exports the genome; opening it forks a **child** with its own identity, your memories as its seed, growing a new self | the-throat (reproduce) + the-wallet (lineage = fork = identity, §19) |

## Reproduction, as one file

Hit **🌱 seed a copy** and it exports a **self-contained HTML** with the kernel inlined and the genome
embedded. Send it to someone; when they open it, it's a **living seedmind** already carrying your memories
(the grey dots). As they add their own, it becomes **theirs** — a distinct organism on the same bloodline
(same root, one generation deeper). The bloodline persists as it breeds down the generations.

## Proven — `node test.mjs`, zero tokens, 24/24

- **HOLD** — a memory is content-addressed (twice = once); empty memory not held; deterministic.
- **CONNECT** — intake auto-links kin memories; `recognize` returns kin/complementary/clash/distant.
- **DREAM** — the organism **forms connections it was never given** (3 → 7 on a 10-memory life), reports
  its **bridges**, and **converges** on a second cycle; deterministic (same life → same connections).
- **BREED** — `seed → plant` forks a child: own identity, same bloodline root, inherits all parent
  memories, grows its own; reproduction is **content-exact**; a grandchild keeps the root.
- Round-trips through one JSON blob; 500-garbage fuzz with 0 throws.

## Files

`seedmind.mjs` (the organism kernel — embed/chord/recognize + HOLD/CONNECT/DREAM/BREED) · `test.mjs`
(the 24/24 gate) · `index.html` (the living PWA — a force-directed graph of your mind, dream-on-idle,
self-contained-HTML seeding) · `sw.js` + `manifest.webmanifest` (offline). Sovereign, zero-dep, no server —
your life stays on your device.

```bash
node test.mjs                 # the proof
python -m http.server 8080    # then open http://localhost:8080
```
