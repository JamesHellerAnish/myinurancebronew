# Myinsurancebro — repo notes

**Read [SEO_ASTRO_PLAN.md](SEO_ASTRO_PLAN.md) first — start at §0a.** It is the live plan for the
Astro programmatic-SEO rebuild and the handover doc between sessions. Update it as work proceeds.

⚠ **§0a lists three blockers to clear before any Astro code**: unmerged logo commits on
`origin/main`, uncommitted work in the tree, and a 730 KB logo. Run `git fetch --all` at the start of
every session — work has been happening on two machines.

## Current state

**Two trees in one repo.** The Astro rebuild lives in `site/` (Phase 0, builds, not deployed) and is
documented in SEO_ASTRO_PLAN.md §0b. The legacy static site below is what is still live.

In `site/`: `src/content/` and `public/` are **generated** — rerun `npm run migrate` after touching
`js/policy-data.js`, and never hand-edit either. Plan pages must source paths from
`publishablePlans()` (`src/lib/plans.ts`), never `getCollection('plans')` — that gate is what stops
an unverified figure publishing under an IRDAI-licensed name. Build with `npm run build`, never
`npx astro build`: only the npm script runs the `prebuild` hook that copies `css/` and `assets/`
into `public/`. Titles and meta descriptions come from `fitTitle()`/`fitDescription()` in
`src/lib/seo.ts` — they carry the §9.2 length budgets, so never hand-compose either in a route.

`css/pages.css` is the Astro-only layer for the generated content pages, linked from `Base.astro`
alone. `css/style.css` and `css/components.css` stay shared with the legacy site — do not fork them
for Astro, and do not add Astro-only rules to them.

Legacy static site served from Apache/Hostinger `public_html`:

- `index.html` — the whole site, one page, 15 sections
- `css/style.css` + `css/components.css` — design system (`data-theme` light/dark)
- `js/policy-data.js` — the plan dataset (10 plans, 19 brands, 3 personas). Single source of truth.
- `js/compare.js` — comparison engine (explore / compare / deep-dive)
- `js/main.js` — nav, persona tabs, counters, booking form, modal
- `send-mail.php` · `lead-store.php` · `view-leads.php` — lead capture + Basic-auth dashboard

## Invariants

1. **Lead form contract is frozen.** `action="send-mail.php"`, fields `name`, `phone`, `email`,
   `product`, `preferred_time`. `lead-store.php` writes `../myinsurancebro-private/leads.json`;
   `view-leads.php` reads that shape.
2. **Do not touch `.htaccess` security blocks.** Every directive is wrapped in `<IfModule>` on
   purpose — an unguarded `Require`/`Header` line 500s the whole site when the module is missing.
3. **Customer PII never enters git** — `leads.json` and `*-config.php` are gitignored and denied by
   `.htaccess`.
4. **Premiums are indicative illustrations, never quotes.** Keep the disclaimer wherever a premium
   or score is shown. Myinsurancebro is an IRDAI-licensed advisor, not an underwriter.
5. `policyData.brandFor()` is the single source of insurer branding — it reconciles per-plan accent
   and monogram against the registry so insurers can't drift between views.
6. **Portraits ship as optimised WebP, never the camera original.** `assets/images/team/*.webp` are
   800×1000 centre-cropped 4:5 cutouts; full-res sources live in `assets/images/team/originals/`
   (gitignored). The two team originals were 9.8 MB and 7.7 MB — putting those on the page would
   wreck the LCP the SEO plan depends on. Recipe:
   `ffmpeg -i in.png -vf "crop=W:H:X:Y,scale=800:1000:flags=lanczos" -c:v libwebp -quality 88 out.webp`
7. **Never invent a person's job title or credentials.** This is an IRDAI-licensed advisory site;
   roles under a real face are a regulated claim. Ship a visible placeholder instead.

## Local preview

`.claude/launch.json` + `.claude/static-server.js` (dependency-free node static server, port 4321).
Needed because `file://` renders without CSS. Note `.fade-up` elements start at `opacity:0` and the
IntersectionObserver in `js/main.js` does not fire in a non-composited browser pane — add `.visible`
manually when screenshotting:
`document.querySelectorAll('.fade-up').forEach(e=>e.classList.add('visible'))`

The Astro build previews separately on port 4322 (`preview_start` config `astro`, serving
`site/dist/` — build first). The pane also screenshots blank once a page is scrolled: to capture
below the fold, set a tall viewport and shift the article with a negative `margin-top` while
`scrollY` is 0, rather than scrolling.

## Permissions

`.claude/settings.json` grants blanket `Bash`/`PowerShell`/`Read`/`Edit`/`Write`, absolute-path
rules for this folder, the Perfecplan reference folder, `~/.claude` and the scratchpad, plus the
`WebFetch` domains used for research. `.claude/settings.local.json` is gitignored and rewritten by
the harness — do not hand-edit it. Settings changes may need a restart to take effect mid-session.
