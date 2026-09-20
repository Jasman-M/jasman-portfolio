# jasman-portfolio

Personal portfolio site for Jasman Mander — Financial Mathematics & BBA, Wilfrid Laurier University.

Built with Next.js (App Router) and three.js. Static export-friendly, no backend.

## Signature pieces

- **Hero** — a candlestick series rendered as a voxel/particle point cloud
  (`src/components/CandlestickCloud.tsx`). Bars print off the right edge and drift
  left on a mean-reverting random walk; drag to orbit. Point count and pixel ratio
  step down on mobile, and the whole thing honours `prefers-reduced-motion`.
- **Cursor layer** — a soft ambient glow that trails the pointer
  (`src/components/CursorGlow.tsx`) plus a magnetic pull on links and cards
  (`src/components/Magnetic.tsx`). Both disable themselves on coarse pointers.

## Theming

Dark is the default. Light is a complete second theme, not an afterthought.
Palette is Claude's (warm terracotta on ivory / near-black), defined as CSS custom
properties at the top of `src/app/globals.css`. `<html data-theme>` is the source of
truth; an inline boot script in `src/app/layout.tsx` applies the stored choice before
first paint so there's no flash.

## Content

All copy lives in `src/data/content.ts`. Resume wording is reproduced as written.
`**figure**` markers in bullet strings render bold via `src/components/Rich.tsx`.

Case competition dollar and percentage figures are projected/modeled outputs from
academic case competitions — the section carries a caption saying so, and that
caption should stay.

## Assets

- `public/resume/` — resume PDF
- `public/images/` — case competition photos, ARIA video poster
- `public/video/` — ARIA launch video

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```
