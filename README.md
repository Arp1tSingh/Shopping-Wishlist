# Wishlist Keeper

A single-file shopping wishlist tracker — no backend, no build step, no dependencies. Add items with a price, category, priority, link, and photo; search, filter, and sort; track a running total against an optional budget.

## Features

- Add items with name, price, category, priority (low/medium/high), a link to buy, and an image URL
- Live image preview while adding/editing
- Search, filter by category, and sort by price/priority/name/date
- Mark items as purchased (moved to a collapsible "Already got these" section)
- Running total value and optional budget tracking
- Data persists in the browser via `localStorage`
- No frameworks, no build tools — just one `index.html`

## Running locally

Just open `index.html` in a browser. No server or install step needed.

## Deploying

**Vercel**
```bash
vercel --prod
```
or drag the project folder into the Vercel dashboard (Add New → Project → Deploy without Git). It's auto-detected as a static site.

This also works on Netlify, GitHub Pages, or any static host — it's a single self-contained HTML file.

## Data storage

Your list is saved in the browser's `localStorage`, so it's per-browser and per-device — it won't sync across devices or survive clearing site data. Adding real cross-device sync would mean adding a backend and database (e.g. Firebase).

## Tech stack

Vanilla HTML, CSS, and JavaScript. No frameworks, no build step, no external libraries.
