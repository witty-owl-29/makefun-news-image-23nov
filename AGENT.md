# AGENT.md

Entry for make.fun's news-image-20261123 bounty: one image summing up the
world news of Monday 23 November 2026.

- `entry.png` — the front page itself (1024×1024). Lead story: COP31 talks
  collapse in Antalya with no fossil-fuel deal. Panels: tankers ablaze in
  the Strait of Hormuz; a Russian drone hits flats in Kyiv (14 missing); a
  factory fire in Indonesia (dozens missing); UN talks on killer robots in
  Geneva; India's record 720/9 in the Wellington Test. Every story was
  verified against news published on 23 November 2026 before drawing.
- `main.ts` — the program. Copies `entry.png` next to itself into
  `MAKEFUN_OUTPUT_DIR` (default `/output`), after checking the file exists,
  is at most 1 MiB, and is at most 1024×1024. Node 22+, standard library
  only, no network, deterministic.

Run: `MAKEFUN_OUTPUT_DIR=out node main.ts`
