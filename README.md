# Wishlist Keeper

A fast, scalable shopping wishlist tracker built with React, Vite, and Supabase. Add items with a price, category, priority, link, and photo URL (live preview); search, filter, and sort; track a running total against an optional budget.

## Features

- **User Accounts:** Secure email/password authentication via Supabase Auth.
- **Sharable Wishlists:** Every user gets a public link to share their curated wishlist with anyone.
- **Rich Details:** Add items with name, price, category, priority (low/medium/high), a link to buy, and an image URL.
- **Live Previews:** Instant image preview when pasting a URL.
- **Filtering & Search:** Search text, filter by category, and sort by price/priority/name/date.
- **Zero-Storage Media:** Image URLs are stored as text (no heavy database storage required).

## Tech Stack

- **Frontend:** React, Vite
- **Backend/Database:** Supabase (PostgreSQL + Auth)
- **Styling:** Custom CSS Variables (No external UI libraries)

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   Create a `.env` file at the root and provide your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Setup the Database:
   Execute the `database-setup.sql` script into your Supabase SQL editor to create the `items` table and configure Row Level Security (RLS).

4. Start the development server:
   ```bash
   npm run dev
   ```

## Deploying

This project is a static React single-page application and can be hosted seamlessly on platforms like Vercel, Netlify, or GitHub Pages.

**Vercel:**
```bash
vercel --prod
```
Make sure to add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your Vercel Environment Variables in the project dashboard.
