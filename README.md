# Legends Vizilti Salon (AT Legends) — Client Demo

A standalone Next.js demo website for **AT Legends** / **Legend's Vizilti Unisex Salon** ([@at_legends_](https://www.instagram.com/at_legends_/)), Trichy & Bangalore. Built for client pitches with Sanity CMS for easy price and photo updates.

**Separate from** the Logeshwaran agency site (`web-site-builders`).

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The demo runs **without Sanity credentials** using placeholder data in `src/data/placeholder.ts`.

## GitHub Pages

Live site (after deploy): [https://logeshOfficial.github.io/legendsviziltisalon/](https://logeshOfficial.github.io/legendsviziltisalon/)

Build locally with the same base path as CI:

```bash
set NEXT_PUBLIC_BASE_PATH=/legendsviziltisalon && npm run build
```
## Pages

| Route | Description |
|-------|-------------|
| `/` | Home â€” hero, services preview, gallery, testimonials, location |
| `/services` | Full price list by category (Men's, Women's, Bridal, Spa) |
| `/gallery` | Photo grid with category filters |
| `/contact` | Address, hours, WhatsApp, enquiry form |

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Sanity CMS (optional)

## Sanity CMS Setup (for Logeshwaran)

When the client purchases the CMS package, connect Sanity so they can edit prices and photos without code changes.

### 1. Create a Sanity project

```bash
npx sanity@latest init --project-plan free
```

Or create a project at [sanity.io/manage](https://www.sanity.io/manage), then copy the **Project ID**.

### 2. Set environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

### 3. Run Sanity Studio (client admin)

GitHub Pages / Hostinger static hosting **cannot** run `/studio` inside the site. Deploy studio on Sanityâ€™s servers:

```bash
npm run sanity          # local studio while developing
npm run studio:deploy   # â†’ https://YOUR_PROJECT.sanity.studio
```

Share that URL with the salon owner to edit prices and photos.

### 4. Initial content setup

In Sanity Studio:

1. **Site Settings** (singleton) â€” Create one document with salon name, phone, WhatsApp, address, hours, hero image
2. **Services** â€” Add services with category, price (INR), duration, description; mark featured ones for the home page
3. **Gallery Images** â€” Upload photos with caption and category (interior / hair / bridal)

### Schemas

| Schema | Fields |
|--------|--------|
| `service` | name, category, price, duration, description, featured, order |
| `galleryImage` | image, caption, category, order |
| `siteSettings` | salonName, tagline, phone, whatsapp, address, hours, heroImage |

Schema files: `sanity/schemas/`

Example GROQ queries: `src/lib/queries.ts`

### 5. CORS (for production)

In [sanity.io/manage](https://www.sanity.io/manage) â†’ your project â†’ **API** â†’ **CORS origins**, add:

- `http://localhost:3000`
- Your Vercel domain (e.g. `https://lakshmi-salon.vercel.app`)

## Contact Form (optional)

Set `NEXT_PUBLIC_FORMSPREE_ID` in `.env.local` with your [Formspree](https://formspree.io) form ID. Without it, the form shows a demo success message.

## Deployment

### Now â€” GitHub Pages (free, via GitHub Actions)

On every push to `main` / `master`, [.github/workflows/deploy.yml](.github/workflows/deploy.yml) builds the static site and publishes it.

**One-time setup:**

1. Create a GitHub repo and push this project.
2. **Settings â†’ Pages â†’ Build and deployment** â†’ Source: **GitHub Actions**.
3. Wait for the workflow to finish (Actions tab).

| Repo name | Live URL |
|-----------|----------|
| `salon-demo` | `https://YOUR_USERNAME.github.io/salon-demo/` |
| `YOUR_USERNAME.github.io` | `https://YOUR_USERNAME.github.io/` (set repo variable `NEXT_PUBLIC_BASE_PATH` empty) |

Share this link with your client as the **demo** until Hostinger + domain are ready.

### Later â€” Hostinger (client domain)

The build outputs static files in `out/` â€” works on Hostinger shared hosting (no Node required).

1. Run `npm run build` with `NEXT_PUBLIC_BASE_PATH` empty.
2. Upload **contents of** `out/` into Hostinger `public_html`.
3. Point the client domain nameservers to Hostinger.

### Optional â€” Vercel

Same repo can deploy to Vercel if you prefer; GitHub Pages is enough for the demo phase.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run sanity` | Local Sanity Studio |
| `npm run studio:deploy` | Publish studio for client admin |
| `npm run lint` | ESLint |

## Project Structure

```
src/
  app/
    (main)/          # Public site pages
  components/        # UI components
  data/placeholder.ts
  lib/               # Sanity client, queries, data fetching
  types/
sanity/schemas/      # CMS schemas
```

## Client Handoff Notes

- **Phone / WhatsApp**: Update in Sanity Site Settings (or placeholder.ts before CMS is live)
- **Prices**: Client edits Service documents in Sanity Studio â€” changes appear after redeploy or on next ISR fetch
- **Photos**: Upload via Gallery Image documents in Studio
- **Branding**: Colors in `src/app/globals.css`, fonts in root layout

---

Built by Logeshwaran for salon client demos.
