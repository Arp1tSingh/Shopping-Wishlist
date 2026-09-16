# Wishlist Keeper

A single-file shopping wishlist app — no backend, no build step. Everything
(HTML, CSS, JS) lives in `index.html`.

## Deploy to Vercel

**Option A — Vercel CLI**
1. Install the CLI if needed: `npm i -g vercel`
2. From inside this folder, run: `vercel --prod`
3. Follow the prompts (create/link a project) — you'll get a live URL.

**Option B — Vercel dashboard**
1. Go to vercel.com → **Add New... → Project**
2. Choose **Deploy without Git**, then drag this folder onto the upload area
3. Vercel auto-detects it as a static site — no build settings to configure.

Either way, once deployed, `index.html` is served at your project's root URL.

## How data is stored

The app saves your list in the browser's `localStorage`, so it's saved
per-browser, per-device. It won't follow you to a different browser or
phone, and clearing site data for the domain will erase it.

If you later want your list to sync across devices, that needs a small
backend + database (Firebase is the quickest route to add).
