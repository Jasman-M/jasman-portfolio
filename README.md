# jasman-portfolio

Personal portfolio site for Jasman Mander — Financial Mathematics & BBA, Wilfrid Laurier University.

Built with Next.js (App Router). Static export-friendly, no backend.

## Signature pieces

- **Hero** — a black-and-white cut-out portrait (`public/images/hero-portrait.png`,
  shoulders widened past the original photo's crop) with the name set huge across
  it in `mix-blend-mode: difference`, so it inverts wherever it crosses the portrait.
  On phones the name stacks onto two lines.
- **Latest Work** — Gambler's Ruin gets seeded random-walk card art
  (`src/components/RandomWalks.tsx`); ARIA shows a poster with a play button and
  only mounts the video once it's clicked (`src/components/VideoCard.tsx`).
- **Recognition photos** — monochrome until hovered; clicking one opens a short
  caption naming the event it's from (`src/components/CasePhotos.tsx`).
- **Motion** — sections fade up as they scroll in (`src/components/Reveal.tsx`) and
  pill buttons have a slight magnetic pull (`src/components/Magnetic.tsx`). Both
  respect `prefers-reduced-motion`.

## Theming

One theme: ink on a light paper ground for the hero and contact band, a near-black
body in between, and a single warm accent (`--accent`). Tokens live at the top of
`src/app/globals.css`. Type is Instrument Sans with IBM Plex Mono for labels, both
self-hosted through `next/font`.

## Content

All copy lives in `src/data/content.ts`. Resume wording is reproduced as written.
`**figure**` markers in bullet strings render bold via `src/components/Rich.tsx`.

Case competition dollar and percentage figures are projected/modeled outputs from
academic case competitions — the section carries a caption saying so, and that
caption should stay.

## Assets

- `public/resume/` — resume PDF
- `public/images/` — hero portrait cut-out, About photo, case competition photos, ARIA video poster
- `public/video/` — ARIA launch video

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```
