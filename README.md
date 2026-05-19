# TWILIGHT

**Terminator Web Interface for Local Inclination Geometry, Heights & Twilight**.

TWILIGHT is a desktop-first scientific web app for exploring local solar-terminator geometry and twilight threshold cross-sections at geodetic stations (currently including LOFAR PL612 Bałdy and IGS LAMA).

## Local development

```bash
npm install
npm run dev
```

Then open the URL printed by Vite (typically `http://localhost:5173/twilight/`).

## Build

```bash
npm run build
```

Build output is written to `dist/`.

## Preview production build

```bash
npm run preview
```

## Important: do not open `index.html` directly

This project uses Vite + React with module-based source loading from `/src/main.tsx` in development.
Opening `index.html` as a filesystem file (`file://.../index.html`) bypasses Vite’s dev server and can result in a blank page or failed module resolution.

Use `npm run dev` (development) or `npm run preview` (built output) instead.

## GitHub Pages

This repository is configured for deployment to GitHub Pages under:

- Repository: `adamfron/twilight`
- Base path: `/twilight/`
- Expected site URL: `https://adamfron.github.io/twilight/`
