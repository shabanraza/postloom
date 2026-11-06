# CLAUDE.md

Guidance for Claude Code (claude.ai/code) working in this repository.

## Product and goal

**Postloom** (postloom.studio, package name `x_studio`) is a set of **free, browser-based tools for social media visuals**. No sign-up, no watermark.

| Tool | Route | What it does |
| --- | --- | --- |
| Tweet Card Generator | `/tweet-card-generator` | Full editor: tweet/thread/poll/quote cards for X, Threads, LinkedIn; PNG and animated GIF export |
| Carousel Maker | `/carousel-maker` | Paste a thread or text → 1080×1350 slides; PNG slides (Instagram) or one PDF (LinkedIn) |

**Goal:** grow free traffic, then monetize as a micro-SaaS.
- Growth comes from search and **AI assistants** (ChatGPT is already the #2 traffic source). Each tool gets its own focused, indexable page.
- Planned next: a Pro tier ($9/mo or $49 lifetime, payments via Lemon Squeezy or Stripe, not built), a tweet-to-testimonial tool, later a tweet-image API.
- Success metric: GA4 key event `export_complete` (a user downloaded something).

## Commands

Always use `bun` (never npm or pnpm).

```bash
bun install
bun run dev        # dev server on :4000 (see "Local dev" below)
bun run build      # production build (also regenerates src/routeTree.gen.ts)
bun run preview    # serve the production build
bun run test       # vitest
bun run lint       # eslint
bun run check      # prettier --write + eslint --fix
bun run deploy     # build + wrangler deploy (Cloudflare Workers)
bunx shadcn@latest add <component>
```

### Local dev

`vite.config.ts` includes `vite-plugin-db` (Neon). With no `VITE_DATABASE_URL`, `dev` and `test` try to **create a new Neon cloud database**. The app does not use a database, so start with a placeholder instead:

```bash
VITE_DATABASE_URL="postgres://local-dev-placeholder" bun run dev
```

The same applies to `bun run test`; alternatively run vitest with a minimal config that skips the Vite plugins.

## Architecture

TanStack Start (React 19, SSR) with file-based routing, deployed to **Cloudflare Workers**. Tailwind CSS v4, shadcn/ui (new-york), lucide-react icons, framer-motion, zustand.

```
src/
  routes/
    __root.tsx                 # <head>: SEO meta, GA4, consent default, theme script, JSON-LD
    index.tsx                  # homepage (MarketingLayout)
    -home/                     # homepage sections: LiveDemo, ExampleMarquee, ToolsBento, Reveal
    carousel-maker/            # tool page (ToolPage); -lib/carousel.ts = slide splitter + PDF writer
    tweet-card-generator/      # full-screen editor
      -components/             # editor UI (TopBar, panels, cards, mobile layout)
      -state/                  # zustand store (tweet-studio-store.ts)
      -export/                 # PNG/GIF export (modern-screenshot, gifenc)
      -utils/fetch-tweet.ts    # server function: imports a tweet via X syndication
  components/
    layout/                    # Container, SiteHeader, SiteFooter, MarketingLayout, ToolPage
    ui/                        # shadcn components (do not restyle ad hoc)
    ThemeToggle.tsx, PostloomLogo.tsx, PrivacyNotice.tsx
  lib/
    tools.ts                   # registry of public tools (drives nav, footer, homepage)
    analytics.ts               # GA4 helpers: trackEvent, trackCtaClick, GA4_MEASUREMENT_ID
  styles.css                   # theme tokens (light + dark), utilities
public/
  sitemap.xml, llms.txt, robots.txt
```

- Folders and files starting with `-` inside `routes/` are ignored by the router (colocated code).
- `src/routeTree.gen.ts` is generated: never edit it. A new route may need a second `bun run build` before the bundle includes it.
- Everything runs client-side except `fetchTweetServer`. There is no auth, API layer or database in use.

## Adding a new tool

1. Create `src/routes/<tool-slug>/index.tsx` using `ToolPage` + `ToolWorkspace` from `@/components/layout/ToolPage` (hero, settings | preview, How it works, FAQ with FAQPage JSON-LD).
2. Give the route its own `head()` with `pageHead({ path, title, description })` from `@/lib/seo` (unique title, description, OG/Twitter tags and canonical).
3. Register it in `src/lib/tools.ts`, and add its URL to `public/sitemap.xml` and `public/llms.txt` (`src/lib/tools.test.ts` fails if they drift).
4. Track `export_start`, `export_complete`, `export_error` via `trackEvent` with a `format` param (e.g. `carousel_pdf`).
5. Keep heavy work in the browser; put pure logic in `-lib/` with unit tests.
6. Put the tool UI in `-components/` as a configurable component (copy, FAQs, defaults as props) so landing pages can reuse it.

## Adding a landing page

Landing pages target one search phrase (e.g. `/linkedin-carousel-maker`) and run an existing tool with their own h1, intro, steps, FAQs and defaults. Create `src/routes/<slug>/index.tsx` with `pageHead`, register it in `LANDING_PAGES` in `src/lib/tools.ts` (footer "Popular" column), and add it to `sitemap.xml` and `llms.txt`. Copy must be unique per page and honest about what the tool does.

## Design rules (follow for every UI change)

Modern, clean and product-first: neutral surfaces, one brand accent, real product visuals. Avoid generic "AI-generated" styling.

**Never use**
- Purple, violet, indigo or fuchsia in the app UI, blue/sky backgrounds, and no blue-to-purple (or any multi-color) gradients
- Gradient text (`bg-clip-text text-transparent`)
- Glowing blobs, neon or colored glow shadows (`shadow-brand/..`), heavy glassmorphism
- Decorative sparkle/magic icons (`Sparkles`, `Wand2`) and emoji in UI copy or headings
- Hardcoded colors in components (`slate-900`, `bg-white`, `bg-[#...]`, `text-white`)

**Always**
- Theme tokens only: `bg-background`, `bg-card`, `bg-muted`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, and `bg-brand` / `text-brand` for accents. Light and dark must both work.
- Palette (defined in `src/styles.css`): warm stone neutrals (paper `#faf9f6`, ink `#1c1b18`; dark `#12110f` / `#ecebe6`) with one deep sage accent (`#4a6b57` light, `#9dbfa6` dark). Premium and calm: no blue or saturated backgrounds, no new hues without updating the tokens.
- Solid, flat surfaces with subtle borders; neutral shadows `shadow-sm` to `shadow-lg` only.
- shadcn components (`Button`, `ToggleGroup`, `Card`, `Sheet`, `Accordion`, `Collapsible`, `ScrollArea`) instead of raw `<button>` or custom look-alikes.
- Marketing and tool pages use `MarketingLayout` / `ToolPage`, the `Container` width (`max-w-6xl px-4 sm:px-6`); the editor is a full-screen app shell.
- Scale: corners `rounded-md` (controls) / `rounded-lg`–`rounded-xl` (cards); control heights 32/36 px; headings h1 `text-4xl`+, h2 `text-2xl`–`text-3xl`.
- Motion is subtle (fade/lift under 0.5 s), never hides above-the-fold content on load, and is off for `prefers-reduced-motion`.

Card designs users export (tweet card backgrounds, carousel slide themes) are content, not app UI: user-selectable presets may use any colors, but defaults and marketing examples follow these rules.

## SEO, AI search and analytics

- Every public page: unique `<title>`, description, OG/Twitter tags, and its own `canonical`. Never put a site-wide canonical in `__root.tsx`.
- Structured data must be honest: no invented ratings or reviews.
- `public/llms.txt` describes the tools for AI assistants; keep it current.
- GA4 (`G-7T3RYZQR2M`, overridable by `VITE_GA4_MEASUREMENT_ID`) loads in `__root.tsx`. Consent default is read from `localStorage['analytics-consent']`, so a decline persists.
- Theme: an inline script in `__root.tsx` applies `dark` before first paint from `localStorage['theme']`, else system preference.

## Environment variables

Via `@t3-oss/env-core` in `src/env.ts` (`import { env } from '@/env'`). `VITE_` prefix = exposed to the browser.
- `VITE_GA4_MEASUREMENT_ID`: optional GA4 override
- `VITE_CF_BEACON_TOKEN`: optional Cloudflare Web Analytics
- `VITE_DATABASE_URL`: only to satisfy the Neon dev plugin (see Local dev)

## Known leftovers from the earlier product

The repo started as a social media scheduler. These remain and can be removed in a cleanup:
- `vite-plugin-db` / `neon-vite-plugin.ts`, `db/init.sql`, `@neondatabase/*` packages, the `@neondatabase/neon-js/ui/tailwind` import in `styles.css`
- The `*/5 * * * *` cron trigger in `wrangler.jsonc` (no handler exists)
- Unused dependencies such as `@tanstack/ai*`, `@tanstack/react-db`
- Duplicate editor tabs (`-components/tabs/` vs `-components/SettingsPanel/`) and hardcoded colors in the editor (being migrated to tokens)

## Workflow

- Branch per change; open a PR to `main`. Commit messages: conventional (`feat:`, `fix:`).
- Before a PR: `bun run build` passes, tests pass, and UI changes are checked in a browser in light and dark mode and at phone width (375 px).
