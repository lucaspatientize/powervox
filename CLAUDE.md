# Powervox - Claude Code Project Notes

## Project Overview
Powervox (powervox.com.br) - Brazilian automotive speaker brand. Migrated from WordPress/Bricks Builder to EmDash CMS on Cloudflare Workers with a custom Astro.js frontend using Svelte 5 server islands for interactivity.

## Tech Stack
- **CMS**: EmDash (`emdash` + `@emdash-cms/cloudflare`)
- **Framework**: Astro 6 (SSR, `output: "server"`)
- **UI Islands**: Svelte 5 (runes: `$props`, `$state`, `$derived`, `$effect`)
- **Admin UI**: React (EmDash admin is a React SPA)
- **Hosting**: Cloudflare Workers
- **Database**: Cloudflare D1 (`powervox-db`)
- **Media Storage**: Cloudflare R2 (`powervox-media`)
- **Sessions**: Cloudflare KV (`powervox-session`)
- **Adapter**: `@astrojs/cloudflare`

## Critical: EmDash + Astro Integration on Cloudflare

### Required packages (all three are essential)
```
emdash                  # Core CMS
@emdash-cms/cloudflare  # D1/R2 adapters (d1(), r2())
@astrojs/react          # REQUIRED for EmDash admin (React SPA)
@astrojs/svelte         # For our custom frontend components
```

### astro.config.mjs must include:
```js
import { d1, r2 } from "@emdash-cms/cloudflare";
import react from "@astrojs/react";
import svelte from "@astrojs/svelte";

emdash({
  database: d1({ binding: "DB" }),
  storage: r2({ binding: "MEDIA" }),
})
// Both react() and svelte() in integrations array
```

### Lessons learned the hard way:
1. **Missing `@emdash-cms/cloudflare`**: Without it, `emdash()` has no database/storage config and the admin API returns errors. The `d1()` and `r2()` adapters come from this package, NOT from `emdash/db`.
2. **Missing `@astrojs/react`**: EmDash admin (`/_emdash/admin/`) is a React SPA using `client:only="react"`. Without the React integration, Astro falls back to Svelte renderer for hydration, which silently fails (page loads but stays on "Loading EmDash..." spinner forever).
3. **`trailingSlash: "always"` breaks EmDash**: EmDash's auth middleware redirects to `/_emdash/admin/login` (no trailing slash). With `trailingSlash: "always"`, that URL 404s. Use `trailingSlash: "ignore"` instead.
4. **Catch-all `[...slug].astro` does NOT block EmDash routes**: Astro's route specificity correctly prioritizes `/_emdash/admin/[...path]` (injected) over `[...slug]` (catch-all). The injected route pattern is more specific and wins.

## Cloudflare Bindings (wrangler.jsonc)
- `DB` = D1 database `powervox-db` (id: `8d0b9f27-1ccd-4a4f-a986-5ae399e71075`)
- `MEDIA` = R2 bucket `powervox-media`
- `SESSION` = KV namespace (id: `e20a5612fad548b08f7dfc0a1eaf96fc`)
- `IMAGES` = Cloudflare Images (auto-added by `@astrojs/cloudflare`)
- Account ID: `0e2b4b12004b037accd19771e488007d`

## Deploy
GitHub `lucaspatientize/powervox` is the source of truth; Cloudflare Workers Builds deploys it.
- Push/merge to `main` → `npm run build` + `npm run deploy` → production.
- Any other branch → `npm run build` + `npx wrangler versions upload` (uploaded, not deployed).
- Do NOT `wrangler deploy` from a laptop: it bypasses GitHub and the two drift apart (the live site ran
  un-versioned laptop builds until 2026-10-06).
- Preview URLs are disabled (`preview_urls: false`): previews bind the production D1 and EmDash migrates
  on first request, so a preview of an upgrade branch would migrate the live database.
- EmDash upgrades run D1 migrations on the first request after deploy. Export first:
  `npx wrangler d1 export powervox-db --remote --output backups/<name>.sql` (`backups/` is gitignored)
  and note the bookmark from `npx wrangler d1 time-travel info powervox-db`.
- Node: `.node-version` pins Workers Builds; EmDash 1.1.0 needs Node >= 22.16.

Live at: https://powervox.com.br (also https://powervox.mountainpeakmarketing.workers.dev)

## EmDash Content Structure
- **Collections**: posts, pages, midbass, subwoofer
- **Taxonomy**: polegadas (speaker sizes: 8", 10", 12", 15", 18", 21")
- **Email**: official `cloudflareEmail()` plugin (`@emdash-cms/cloudflare/plugins`) over the `EMAIL` send_email binding,
  sender `noreply@cms.powervox.com.br`. Email links use the stored `emdash:site_url` (https://powervox.com.br).
- **Users**: invites link to `/_emdash/admin/invite/accept` (passkey registration, EmDash >= 1.x). Magic links only
  reach existing users. Passkeys are bound to the domain they were created on.
- **Sitemap**: `/sitemap.xml` and `/robots.txt` are overridden in `src/pages/` (project routes beat EmDash's injected ones);
  EmDash's built-in sitemap only knows collection URL patterns like `/midbass/{slug}`.

## EmDash API Patterns
- Media URLs: `/_emdash/api/media/file/{storageKey}`
- Content list: `getEmDashCollection("midbass")` / `getEmDashCollection("subwoofer")`
- Content entry: `getEmDashEntry("pages", slug)`
- Taxonomy terms: `POST /_emdash/api/content/{collection}/{id}/terms/{taxonomy}` with `{ "termIds": [...] }`

## Design System
- **Font**: Readex Pro (Google Fonts)
- **Colors**: `#AB3335` (primary red), `#F1D68F` (gold/secondary), `#25D366` (WhatsApp green), `#000` (background)
- **Layout**: Black-dominant design, full-bleed sections, sticky header
