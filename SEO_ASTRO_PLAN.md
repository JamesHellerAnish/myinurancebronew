# Myinsurancebro — Astro Programmatic SEO Plan of Action

**Created:** 2026-08-13 · **Last updated:** 2026-09-10
**Branch:** `revamp/audience-redesign-and-compare`
**Status:** Planning complete · Scope locked (§14) · Research done (§16) · Harvest started (§16.7) ·
**Astro Phase 0 in progress — shell builds, 10 plan pages, §1.2 thesis verified, plan template
styled and inspected in a browser, robots/llms.txt shipped, chrome + home + methodology + category
hubs live, every internal link resolving. §0a blockers all cleared. **Phase 0 is complete** bar the
persona authoring pass. See §0b.**
**Purpose:** Living handover doc. Update it as work proceeds so progress survives a context reset.

---

## 0b. Session log — 2026-09-10 (Astro Phase 0 — shell built and building)

**Astro is installed, the migration runs, and the build is green: 10 plan pages + sitemap.**
Nothing is committed. Nothing is deployed.

### 🔴 The §1.2 thesis is now proven, not asserted

The whole migration argument was that client-rendered content is invisible to AI crawlers. Measured
on the built output of `/health-insurance/hdfc-ergo/optima-secure/` (15.7 KB of static HTML):

| Check | Result |
|---|---|
| `97.61` (the CSR) in raw HTML | **4 occurrences** — was 0 on the legacy site |
| Real `<tr>` rows | **5** — a genuine `<table>`, not a div grid (§8 block 6) |
| JSON-LD blocks | **4** — Organization · BreadcrumbList · FAQPage · FinancialProduct |
| Self-referencing canonical | ✅ `https://myinsurancebro.com/health-insurance/hdfc-ergo/optima-secure/` |
| `<script>` tags | **4 — all of them JSON-LD.** Zero client JavaScript on a plan page. |

That last row is the §4.1 payoff: a plan page ships no JS at all.

> **Updated after the chrome landed:** a plan page now carries **6** `<script>` tags — the 4
> JSON-LD blocks, a 158-byte inline theme setter, and the 895-byte inlined chrome module (nav
> scroll state, hamburger, theme toggle). Both are inlined by Astro, so it is still **zero
> JavaScript requests** and nothing above renders content. The content claim in every other row
> is unchanged; the "no JS at all" phrasing is not, and the trade was made knowingly to fix
> defect 7. See "What shipped in the third pass".

### What is on disk

```
site/
  package.json          pre{dev,build} hooks run sync-public.mjs
  astro.config.mjs      static · trailingSlash always · format directory · sitemap + mdx
  tsconfig.json         .gitignore (dist, .astro, node_modules, public/)
  scripts/
    migrate-policy-data.mjs   policy-data.js → content collections
    sync-public.mjs           css/ assets/ js/ + the 3 PHP files + .htaccess → public/
    make-og-image.mjs         → ../assets/images/og-default.png   (run by hand)
    make-logo-sizes.mjs       → the display-size logo copies       (run by hand)
  src/
    content.config.ts   Astro 5 loader API, Zod schema + verification refinement
    lib/seo.ts          the ONE title composer — throws on a doubled brand
                        · fitTitle() / fitDescription() length budgets
    lib/plans.ts        publishablePlans() gate · comparisonPairs() C(n,2) · categoryPath()
    lib/schema.ts       Organization/InsuranceAgency · Breadcrumb · FAQ · FinancialProduct
    lib/llms.ts         shared body of llms.txt + llms-full.txt, behind the same gate
    lib/format.ts       complaintsPhrase() and other per-record prose
    layouts/Base.astro
    components/seo/     SEO.astro · JsonLd.astro · Disclaimer.astro
    components/Header.astro · Footer.astro    legacy classes, absolute links
    pages/index.astro                         all 15 sections, via components/home/
    components/home/                          Sprite · Hero · Marquee · Personas · …
    lib/home.ts                               the 9 FAQs: markup AND FAQPage schema
    pages/methodology.astro                   §13's comparative-claim mitigation
    pages/[category]/index.astro              product hub, only where plans exist
    pages/[category]/[insurer]/[plan].astro   all 12 §8 blocks, in order
    pages/robots.txt.ts · llms.txt.ts · llms-full.txt.ts
    content/            10 plans · 19 insurers · 3 personas   (generated — rerun migrate)
    data/               meta · methodology · profiles · compare-rows  (generated)

css/pages.css           the Astro-only content layer, linked from Base.astro only
assets/images/og-default.png   1200×630 share card (source asset, committed)
```

`site/public/` and `site/src/content/` are **generated**. Rerun `npm run migrate` after any change
to `js/policy-data.js`; `sync-public.mjs` runs automatically before dev and build.

### Commands

```bash
cd site
npm run migrate                      # policy-data.js → collections
PUBLISH_UNVERIFIED=1 npm run build   # see the pages (all 10 records are unverified)
npm run build                        # honest build → 0 plan pages today, by design
node scripts/make-og-image.mjs       # regenerate the share card after a wording change
```

Use `npm run build`, never `npx astro build` — the latter skips the `prebuild` hook, so `css/`
and `assets/` never reach `public/` and the pages render unstyled against stale files.
Then preview the built output on **port 4322** (`preview_start` config `astro`).

### The verification gate — deliberate deviation from §5.3

§5.2 makes `sources[]` and `lastVerified` required, but the 10 migrated records predate the §16.7
pipeline. Rather than weaken the schema: records carry `verificationStatus`
(`migrated` | `extracted` | `verified`), a `superRefine` enforces the §5.2 contract on anything
claiming `verified`, and `publishablePlans()` in `src/lib/plans.ts` is the **only** sanctioned source
of plan pages. All 10 landed as `migrated`, so a plain `npm run build` generates **zero** plan pages.
`PUBLISH_UNVERIFIED=1` opens a dev-only hatch that fails closed and prints a loud warning, plus a
visible "Preview only" banner on the page itself.

> **Rule for every future route: never call `getCollection('plans')` directly.** That bypasses the
> gate and can publish an unverified figure under an IRDAI-licensed name.

### Known defects, in priority order

1. ✅ **Fixed — meta descriptions.** `fitDescription()` in `src/lib/seo.ts` composes them to a
   budget: a mandatory core sentence carrying the numbers, plus the first optional tail clause
   that keeps the string ≤160. All 10 now land 149–160; `assertDescription` is silent.
2. ✅ **Fixed — overlength titles.** `fitTitle()` takes candidates longest-first and returns the
   first that fits under 60 with the brand suffix. `[plan].astro` passes three:
   full insurer → `insurerShort` → `insurerShort` without "Review". Longest title is now 60
   (`HDFC Life Click2Protect Supreme Plus Review`), SBI General resolves at 59.
3. ✅ **Fixed — OG image.** `assets/images/og-default.png` exists, 1200×630, 130 KB, generated by
   `site/scripts/make-og-image.mjs` (run by hand, not a build hook — the file is a committed
   source asset). No logo on it yet: the logo commits are still unmerged (§0a blocker 1).
4. 🟡 Fonts still load from `fonts.googleapis.com` — §9.1 wants them self-hosted.
5. 🟡 **Partly cleared.** `/methodology/` and `/[category]/` are built; the plan template no
   longer links the two that are not (`/[category]/best-plans/`, `/[category]/companies/[insurer]/`).
   A build-time link audit confirms every internal href in `dist/` resolves. Still to build:
   best-plans, insurer pages, glossary — add them to `llms.txt` as each ships.
6. ✅ **Fixed — the template has now been looked at in a browser**, and it was exactly the
   Perfecplan bug: every class the template emits had no rule. See "The CSS layer" below.
7. ✅ **Fixed — theme mismatch.** An inline blocking script in `Base.astro` applies the saved
   `mib-theme` before first paint. Verified across the legacy/Astro boundary in both directions.
   It cost the "zero `<script>` tags except JSON-LD" line, knowingly — see the note under the
   §1.2 table.
8. 🟡 `npm run check` cannot run — `@astrojs/check` and `typescript` are not installed. The build
   only strips types, so nothing type-checks the new libs today.
10. 🟡 The navbar is cramped between 768 px (where `.nav-links` hides for the hamburger) and
   ~1050 px — the brand and the first nav link sit flush with no gap. Measured: no overlap, and
   the legacy one-pager has the same weak spot with its own five items, so this is inherited,
   not introduced. Fixing it means touching shared `style.css`, which changes the live site too.
9. 🟡 With 0 verified plans a plain `npm run build` emits **no sitemap at all** (`@astrojs/sitemap`
   has nothing to serialise), while `robots.txt` still advertises `/sitemap-index.xml`. Harmless
   until launch, and self-resolving once any plan verifies — but do not deploy a 0-page build.

### What shipped in the second pass (same day)

**The CSS layer — `css/pages.css`.** The prediction in the old next-move 2 was right: the page
rendered as an unstyled document below the chrome. Every class the plan template emits now has a
rule — `.plan-page` (72ch measure), `.breadcrumbs`, `.answer-block`, `.key-facts`, `.table-scroll`
and the table, `.pros-cons`, the `<details>` FAQ, `.sources`, `.verification-warning`,
`.internal-links`, `.plan-cta` including the frozen booking form, `.policy-disclaimer`.

It is a **new file at the repo root**, linked only from `Base.astro`, so `style.css` and
`components.css` stay the shared design system rather than being forked. Everything resolves
through the existing tokens, so `[data-theme]` light/dark works with no second palette.

Verified in the browser pane at 900 px and at 375 px: no horizontal overflow at 375
(`scrollWidth === clientWidth === 375`), the premium table fits without needing its scroll
wrapper at that width, and dark mode renders correctly.

> **Browser-pane note.** Screenshots of this pane paint blank when the page is scrolled. To
> capture a section below the fold, set a tall viewport and shift the article with
> `document.querySelector('.plan-page').style.marginTop = '-2700px'` at `scrollY === 0`.
> Add this to the `.fade-up`/`.visible` trick already in CLAUDE.md.

**`robots.txt`, `llms.txt`, `llms-full.txt`** — §10.2/§10.3, all three as Astro endpoints
(`src/pages/*.txt.ts`), not files in `public/`: `public/` is gitignored and rebuilt by
`sync-public.mjs`, so a hand-authored file there is untracked and one migrate away from gone.
`llms.txt`/`llms-full.txt` generate from `publishablePlans()`, so they inherit the verification
gate — an unverified figure cannot leak into the file we hand to a model — and on an honest build
they render a plain "no plans published, they are being re-verified" notice instead of an empty
list. `robots.txt` allows retrieval and training crawlers, with the training decision reduced to
one `TRAINING_RULE` constant to flip.

**`src/lib/format.ts`** — `complaintsPhrase()`, because "1 complaints per 10,000 claims" was
being stamped onto the HDFC Life page, its meta description and `llms.txt`.

**Preview.** `.claude/launch.json` gained an `astro` config: `astro preview` on **port 4322**,
serving `site/dist/`. Build first — it serves the built output, not the source. Note that
`npx astro build` **skips the `prebuild` hook**, so `css/` never reaches `public/`; always use
`npm run build`.

### What shipped in the third pass — the chrome and the Phase 0 routes

**Header and footer** (`src/components/Header.astro`, `Footer.astro`), wired into `Base.astro`
so every page gets them. Class names are copied verbatim from `index.html`, so the existing
rules in `style.css` style them with no new CSS — the only additions were `main { padding-top:
var(--navbar-height) }` (the navbar is `position: fixed`, so without it the breadcrumb rendered
underneath it) and two small table helpers.

The links are the one deliberate divergence from the legacy markup. The one-pager's nav is all
bare `#anchors`, which resolve against the wrong document from a generated page; they are
absolute here. And the legacy footer's `href="#"` placeholders (Motor, Travel, Articles,
Careers…) are dropped rather than ported — harmless on one page, but they would have become the
same dead link repeated across ~2,900.

**Defect 7 is fixed.** `Base.astro` carries a 158-byte inline blocking script that applies the
saved theme before first paint, reading the same `mib-theme` key as `js/main.js`. Verified
end-to-end: toggling to dark on the legacy home page and navigating to a generated page arrives
dark, with the right toggle icon and `--color-bg` — the preference now survives the boundary
between the two halves of the migration in both directions.

**`/methodology/`** — the page §13 names as the mitigation for comparative-claim risk. Weights
come from `src/data/methodology.json`, the same file the scoring reads, so the page cannot drift
from the arithmetic. Covers the plan weights, the per-category insurer weights, data sources and
averaging period, an explicit independence statement including the commission disclosure, what a
score cannot tell you, and 4 FAQs with FAQPage schema.

**`/[category]/`** — the product hub, generated only for categories that have publishable plans
(`src/pages/[category]/index.astro`). A hub listing nothing is a thin page, and seven empty hubs
is the exact shape §13 warns about. Carries a scored table of every plan in the category with
CSR, complaints and entry premium, a verdict list, and 3 FAQs.

**Dead links removed from the plan template.** It was emitting `/[category]/best-plans/` and
`/[category]/companies/[insurer]/`, neither of which is built. The insurer one was worse than an
ordinary 404: it sat in the breadcrumb trail, so it was also being published inside
`BreadcrumbList` JSON-LD. The insurer crumb is gone until those pages exist — one line to
restore.

**A link audit now runs over the build.** Every internal `href` in `dist/` resolves to a real
file. That check is worth keeping as the page count grows.

**`/` serves the legacy one-pager, as an interim.** `sync-public.mjs` copies `index.html` and
`js/` into the build. Without it the build had no home page while the nav brand, every
breadcrumb and every footer linked to `/` — the most-linked URL on the site would have been its
only 404. It is unmanaged HTML: its own `<head>` and `<title>`, not composed by `Base.astro` or
checked by the SEO assertions. **Delete that entry from `FILES` the moment
`src/pages/index.astro` exists.**

### What shipped in the fourth pass — the home page port

**`src/pages/index.astro` — all 15 sections, under `Base.astro`.** The section markup is
extracted verbatim into `src/components/home/` (16 components, Sprite through FinalCta), so the
design is unchanged. What changed is only the wrapper: `<head>`, navbar and footer are gone,
because the layout and chrome components own them now. **The interim `index.html` copy in
`sync-public.mjs` is deleted** — with a real route generating `/index.html`, keeping the legacy
file would have put two files racing for the same URL.

**The compare engine now ships a static table (§12 step 10 / §1.2).** `#cmpGrid` is
server-rendered with a real `<table>` of every publishable plan; `compare.js` overwrites its
`innerHTML` on hydration, so a visitor sees the interactive cards exactly as before and a
crawler sees a genuine table. Verified both halves: **11 `<tr>` rows and the string `97.61` now
appear in the home page's raw HTML, where there were none** — and after hydration `#cmpGrid`
holds 5 `.plan-card` elements with the league table and premium sections rendered as usual.

The fallback rows come from `publishablePlans()`, the same gate as every plan page, so an
unverified figure cannot be published there either. While nothing is verified it renders no
rows and the interactive engine still works off `js/policy-data.js` — no regression against the
live site.

**The FAQ is one source now.** Nine questions moved from markup into `src/lib/home.ts`, which
feeds both the rendered accordion and the FAQPage JSON-LD. In `index.html` they existed only as
markup, so adding schema would have meant a hand-kept second copy — and schema that disagrees
with the visible page is a structured-data violation, not just untidy.

**`js/main.js` gained a chrome guard.** The Astro header renders the same `#navbar`,
`#themeToggle` and `#hamburger` ids that `main.js` binds, so both were about to handle every
click — two theme listeners flip the theme twice, which reads as a broken toggle. `Header.astro`
marks its header `data-astro-chrome` and `main.js` skips its sections 1 and 2 when it sees it.
The attribute is absent on the legacy one-pager, which keeps behaving exactly as before.
Verified: one click, one flip.

Also fixed: `title()` threw on the homepage, because the guard against a caller pre-appending
the brand fired on the one page where the brand legitimately *is* the title. It now only
applies when a suffix is actually going to be added; `brand: false` skips it, and the
duplicate-brand assertion still catches `Myinsurancebro | Myinsurancebro`.

Interactions verified in the browser after the port: theme toggle, FAQ accordion (aria-expanded
and measured max-height), persona picker, journey tabs, compare hydration. All 18 internal links
in `dist/` resolve.

### 🔴 The persona panels are NOT data-driven — and should not be yet

§12 step 7 asks for "persona panels now data-driven". **Doing that today would delete content.**

The personas collection holds only `key`, `label` and `ageRange`. Every record has
`pains: []`, `planRecommendations: []` and `faqs: []`, because `js/policy-data.js` — the source
the migration reads — only ever carried those three fields:

```js
personas: [
  { key: 'genz', label: 'Just started earning', age: '22–28' },
  …
]
```

The actual persona content — 27 pain-point and recommendation blocks across the three panels —
exists **only** as hand-written HTML in `index.html`. Rendering the panels from the collection
would swap all of it for empty arrays.

So the panels stay as ported markup, with the content intact. Making them data-driven is a
**content task, not a porting one**, and it has a decision in it: `src/content/` is generated
and must not be hand-edited (CLAUDE.md), so the panel copy has to be authored into
`js/policy-data.js` and flow through `npm run migrate`. That is the same work as §7's 13 new
personas, and it should be done once, for all of them, rather than twice.

### CWV measurement — 2026-09-10, the Phase 1a gate

Measured on the built output over `astro preview`, in the browser pane at 1280×900 and at
375×812. **These are lab numbers on localhost with no throttling and a warm cache — they are
not field CWV.** Absolute pass/fail needs a throttled run or CrUX data after deploy. What they
do establish is structure, which is cache-independent.

| Metric | Plan page | Home page | Verdict |
|---|---|---|---|
| **CLS** | **0** | **0** (desktop and mobile) | 🟢 Green, and genuinely so — zero shifts recorded, not "small" |
| **LCP element** | `p.answer-block` — text | hero `<span>` — text | 🟢 Text, not an image |
| LCP (unthrottled localhost) | **96 ms** | 1,416 ms | plan pages are fast; the home page is not |
| TTFB / load | 6 ms / 57 ms | 9 ms / 213 ms | static files, as expected |
| HTML (gz) | 18.9 KB (5.8 KB) | 80.6 KB (20.7 KB) | |

**Render-blocking CSS, every page:** 101.1 KB raw, **19.2 KB gzipped** across style.css,
components.css and pages.css. Fine.

**Home-page JavaScript:** 114.6 KB raw, **29.2 KB gzipped** — policy-data.js, compare.js,
main.js. Loaded on the home page only; a plan page still ships none.

#### 🔴 The one blocking problem: `assets/images/chief-advisor.png` is 2.29 MB

§13 predicted this ("a 2.3 MB preloaded hero portrait") and the measurement confirms it is the
worst thing on the site by an order of magnitude — it is **84% of the entire 2.7 MB asset
directory**.

| | |
|---|---|
| Transferred | **2,341,112 bytes** (measured with `cache: 'reload'`, not estimated) |
| Natural size | 1471 × 1809 |
| Displayed | 404 × 505 desktop · **274 × 342 mobile** |
| Pixels shipped vs needed | **11× desktop**, 2.8× even at 2× mobile DPR |
| Above the fold on mobile | **Yes** — top edge at y=236 in an 813 px viewport |
| Loading | `fetchpriority="high"`, not lazy |

What that costs, as transfer time for this one file:

| Connection | Time |
|---|---|
| Lighthouse Slow 4G (1.6 Mbps) | **11.7 s** |
| Typical India 4G (8 Mbps) | 2.3 s |
| Good 4G/5G (25 Mbps) | 0.7 s |

It is not the LCP element on an unthrottled desktop load — text wins that race locally — but it
is above the fold on mobile, marked high priority, and it saturates the connection while the
fonts and CSS the text LCP actually depends on are still arriving. On a throttled connection it
becomes the LCP element.

**The fix is the recipe the repo already uses** (CLAUDE.md invariant 6, the same treatment the
two team portraits got): re-encode to WebP at ~880×1080, keep the original in
`assets/images/originals/`. Expect **~2.29 MB → 60–100 KB**. Not done yet: it changes the hero
image of the live site, so it is the owner's call — the same call as the logo.

#### 🟡 Fonts are still third-party (defect 4, §9.1)

152 KB of woff2 pulled from `fonts.gstatic.com` behind a render-blocking stylesheet from
`fonts.googleapis.com`. Both pages' LCP is **text**, so LCP is gated on that third-party
round-trip — which is exactly why self-hosting them is a CWV task and not cosmetic. Invisible on
localhost with a warm cache; it will not be invisible in the field.

#### What this means for the gate

The Phase 0 → 1a gate is "site live, CWV green, indexed". Structurally the site is in good
shape: CLS is a true zero, plan pages render in under 100 ms, and the render-blocking CSS is
19 KB gzipped. **Two things stand between here and a defensible "green": the 2.29 MB portrait
and the third-party fonts.** Both are known, both are cheap, and neither needs more pages.

Re-measure after fixing them, and do it against a deployed URL or a throttled run — not
localhost.

### Next moves, in order

1. **Fix the two CWV blockers above** — the portrait re-encode and the font self-hosting.
2. **Authoring pass on the personas** — lift the existing panel copy out of `Personas.astro`
   into `js/policy-data.js`, re-run the migration, then drive the panels from the collection.
   Do it alongside §7's 13 new personas rather than as a separate pass.
3. Phase 0 is otherwise **complete**: shell, design system, chrome, home, methodology, category
   hubs, robots/llms.txt, sitemap. CWV measured (above) — the gate needs those two fixes, then a
   deploy decision. Not more pages.
4. Then §5 data expansion (Track A), which gates everything downstream. Nothing below Phase 1a
   should start before the 10 migrated records are verified — a plain `npm run build` still
   publishes zero plan pages by design.
3. Only then: §5 data expansion, which gates everything downstream.
4. ✅ Done — all three §0a blockers are cleared: committed, merged, logo optimised to 20 KB and
   consolidated onto one path. The OG card now carries the badge. The chrome work in step 1 has
   a real logo to point at, at `assets/images/my-insurance-bro-logo.png`.

### ⚠ Permissions — unresolved

`.claude/settings.json` was changed to `"defaultMode": "bypassPermissions"` this session, and the
user **reports still being prompted after a restart**. Likely `disableBypassPermissionsMode` set by
managed policy, in which case bypass is refused at startup and the session silently falls back.
If so the workable fix is to tighten the allow list instead: the bare `"Bash"` / `"PowerShell"`
entries do nothing useful (command tools need a specifier like `PowerShell(git:*)`), and
`.claude/settings.local.json` has accumulated ~40 one-off rules that should be collapsed into a few
patterns. **Also: chained commands (`a; b`) and quoted here-strings defeat prefix matching — run one
command per call.**

---

## 0a. ✅ RESOLVED — the three blockers are cleared (2026-09-10, later session)

**All three are done. This section is kept as the record of what happened; nothing here blocks.**

> - **1. The merge landed.** Tree committed as `f2c9ab9`, `origin/main` merged as `717333c`. Clean,
>   no conflicts, exactly as the dry-run predicted.
> - **2. The tree was dirty; it is committed.**
> - **3. The logo is optimised** — and it turned out to be a bigger problem than this section
>   described. See "The logo, as resolved" below.

### The logo, as resolved

The owner added a **third** variant mid-session — a 4096×4096, 1.25 MB master at
`assets/images/my-insurance-bro-logo.png` — while `origin/main` carried a 2588×2588, 730 KB copy at
the **repo root**, and `assets/images/logo.png` held the superseded 23 KB one. All nine references
on `origin/main` pointed at the root path.

Two things made that untenable beyond the file size. The root path is **not copied into the Astro
build** — `sync-public.mjs` syncs `css/` and `assets/`, not root-level PNGs — so a root-hosted logo
would 404 on every generated page. And a 4096 px square badge is a bad `og:image`: every platform
crops it.

Settled state, owner's call, "canonical in images, optimised":

| Path | What | Size |
|---|---|---|
| `assets/images/my-insurance-bro-logo.png` | the mark, 272×272 (2× of 134×136) | **20.4 KB** |
| `assets/images/apple-touch-icon.png` | 180×180 | 11.4 KB |
| `assets/images/favicon-192.png` | 192×192 | 12.6 KB |
| `assets/images/og-default.png` | 1200×630 share card, badge composited top-right | 165 KB |
| `assets/images/originals/my-insurance-bro-logo-4096.png` | the master — referenced by nothing | 1.25 MB |

`site/scripts/make-logo-sizes.mjs` regenerates the first three from the master; `make-og-image.mjs`
regenerates the card. `sync-public.mjs` now excludes any directory named `originals/` at any depth,
so neither the logo master nor the 17.5 MB of portrait originals reaches the deploy.

Deleted as duplicates: the root `my-insurance-bro-logo.png` and `assets/images/logo.png`.
All 12 references across `index.html`, `default.php` and `view-leads.php` retargeted, and
`index.html`'s `og:image` — which was a **relative** URL, so no scraper could ever resolve it — is
now the absolute card URL with `og:image:width`/`height` and an `og:url` beside it.

**Net effect: the logo went from 1.25 MB on every page to 20 KB.**

### The original text of this section follows, for the record

### 1. 🔴 Your logo commits are NOT on this branch

Two commits made on another machine live on **`origin/main`**, never merged here:

| Commit | What |
|---|---|
| `9d09d4c` | Updated website logo everywhere — new `assets/images/logo.png` (730 KB), root copy `my-insurance-bro-logo.png`, favicon + apple-touch-icon, `og:image`, navbar/footer `src`, `default.php`, `view-leads.php` |
| `b86dd1f` | Updated logo error — `css/style.css` logo sizing |

```
* b86dd1f (origin/main)  Updated logo error
* 9d09d4c                Updated website logo everywhere
*   a4980b0              Merge PR #1
|\
| | * 99850c4 (HEAD → revamp/…)  Group the compare filter chips
| | * 70e1b53                    Show each insurer's real logo
| |/
| * 9d292d8                      Stop a BOM in the dashboard config
```

PR #1 merged the revamp branch into `main` at `9d292d8`; the logo work then landed on `main`, while
`70e1b53` + `99850c4` landed on `revamp`. The two lines diverged — **nothing was overwritten.**
Local `assets/images/logo.png` is still the old 23,279-byte file; `origin/main` has 730,766 bytes.

`git merge-tree` dry-run on 2026-09-10: **clean, no conflicts.** Fix:

```bash
git add -A && git commit -m "Add team section and Astro SEO plan"
git merge origin/main
```

### 2. Uncommitted work in the tree

Modified `index.html`, `css/components.css`, `.gitignore`; untracked `CLAUDE.md`,
`SEO_ASTRO_PLAN.md`, `data-raw/`, `.claude/`, `assets/images/team/`. Commit or stash before merging —
git will refuse a merge that touches modified `index.html`.

### 3. 🟠 The new logo is 730 KB

For an image rendering at 134×136 px, loaded on **every page** and used as the favicon — ~30× the
old file. This directly damages the LCP that §9.1 and the whole ranking thesis depend on. Optimise it
with the §16.9 recipe before the Astro build locks it in.

---

## 0. Read this first

This document is the plan for rebuilding myinsurancebro.com as an **Astro static site** with a
programmatic SEO page mesh of **~2,900 pages** — the same technique Perfecplan used to reach 5,229
pages, adapted for insurance and hardened against the ways that technique fails in a YMYL (Your
Money or Your Life) category.

> **Scope decisions taken 2026-08-13 (§14):**
> **(a) The city axis is cut** — per-city network-hospital counts and premium zone loadings are not
> reliably sourceable, and a city page without them is a doorway page. This removed 2,160 pages.
> **(b) Seven product categories, all protection.** Term life and base health, plus five Tier A
> additions: **super top-up, senior citizen health, critical illness, personal accident and hospital
> daily cash.** All five are sold by insurers already in the dataset and reuse the health schema, so
> marginal cost is near zero.
> **(c) No motor, travel, home, cyber or pet, and no savings-linked life products** (ULIP, endowment,
> guaranteed-return, child plans). The first group makes you an aggregator; the second is
> mis-sold product you would have to recommend against. Keeps the independent-advisor positioning tight.

Three things you should know before reading anything else:

1. **The single biggest SEO defect on the site today is not page count.** It is that ~80% of your
   best content — every plan deep-dive, the premium tables, the insurer league table, the
   methodology — **does not exist in the HTML**. It is injected by `js/compare.js` at runtime. See §1.2.
   Fixing that alone is worth more than the first thousand new pages.
2. **The dataset is the bottleneck, not the templates.** You have **10 plans**. Ditto covers ~40 and
   is the site you are being compared against. No amount of page generation fixes a 10-row dataset —
   generation just multiplies it. Data expansion is Track A and it gates everything else. See §5.
3. **Do not ship everything at once.** Perfecplan is a local service business, where
   service × location is a legitimate axis. Insurance is national, and Google's scaled-content-abuse
   policy targets exactly this shape of site. The plan is phased with indexing gates. See §9.4 and §13.

**On not matching Perfecplan's 5,229:** you will land at roughly half that, and that is the correct
outcome, not a shortfall. Perfecplan's count is inflated by an axis that is legitimate for a wedding
planner and would have been a liability here. ~2,900 pages that are each the best answer to a real
query beats 5,000 that dilute the domain. Indexed-and-ranking page count is the metric; total page
count is vanity.

---

## 1. Where the site is today

### 1.1 Inventory

| Asset | Size | Notes |
|---|---|---|
| `index.html` | ~94 KB, ~1,680 lines | Entire site. **15 sections**, one page. |
| `css/style.css` | 2,297 lines | Design system, tokens, `data-theme` light/dark |
| `css/components.css` | 1,715 lines | Component layer |
| `js/policy-data.js` | 910 lines | **The asset.** Structured plan dataset. |
| `js/compare.js` | 909 lines | Compare engine — explore / compare / deep-dive modes |
| `js/main.js` | 565 lines | Nav, personas, counters, form, modal |
| `send-mail.php` · `lead-store.php` · `view-leads.php` | — | Lead capture + Basic-auth dashboard |
| `.htaccess` | — | Denies `leads.json`, `*-config.php`, dotfiles; `noindex` on the dashboard |
| `assets/logos/*.png` | 18 files | Insurer logos, already wired through `brandFor()` |

**Existing sections in `index.html`:** hero · personas · products · compare · stats · advisor ·
**team** · claim-support · how-it-works · journey · reviews · checklist · faq · cta

> `#team` was added 2026-09-10 — "Meet our team", two portraits in a row on the same ink+mesh-glow
> treatment as `#advisor`. Portraits are **optimised WebP** (`assets/images/team/*.webp`, 800×1000,
> 4:5 centre-crop, 151 KB for the pair) with the 17.5 MB camera originals kept in
> `assets/images/team/originals/` (gitignored). See §16.9.
> **⚠ Roles and bios are visible placeholders** — real titles must not be invented on an
> IRDAI-licensed site. Fill them in before this section ports to Astro.

**Existing dataset (`policyData`):**
- `meta` — period `FY 2024–26`, updated `August 2026`, source, weighting
- `methodology` — plan weighting (features 45 / insurer 45 / premium 10) + separate company weightings
- `profiles` — term (6 age/gender rows, ₹2 Cr to 65, Delhi 110010) and health (4 rows, ₹15 L, Delhi)
- `compareRows` — the matrix row definitions per product
- `companies` — 6 life insurers + 10 health insurers with CSR, complaints, solvency, business
- `brands` — 19 insurers → logo, accent colour, initials, with a safe monogram fallback
- `personas` — **3 only**: `genz`, `newparent`, `sandwich`
- `products.term.plans` — **5 plans** · `products.health.plans` — **5 plans**

Each plan carries: `id, insurer, name, score, scoreBreakdown, metrics, entryAge, coverRange, tenure,
premiums{6 or 4 profiles}, bestFor[], tags[], features[], covered[], notCovered[], riders[], pros[],
cons[], verdict`. **This is a genuinely good schema** — richer per-plan than Perfecplan's per-service
schema. It transfers to Astro content collections almost unchanged.

### 1.2 🔴 Finding 1 — your best content is invisible to crawlers

In the shipped HTML, the entire comparison engine is empty containers:

```html
<div class="cmp-filters" id="cmpFilters"></div>
<div class="cmp-grid"    id="cmpGrid"></div>
<div id="cmpMatrixHost"></div>
<div id="cmpDeepBody"></div>
<div id="cmpPremiumHost"></div>
<div id="cmpLeagueHost"></div>
<div id="cmpMethodHost"></div>
```

Everything inside them is rendered by `compare.js` after load. Consequences:

- **Google** can render JS, but does so on a second, delayed, budget-limited pass. Client-rendered
  content is systematically under-weighted and slower to index.
- **AI crawlers mostly do not execute JavaScript at all.** GPTBot, ClaudeBot, PerplexityBot,
  CCBot and OAI-SearchBot fetch raw HTML. To every one of them, your comparison engine — the thing
  that actually differentiates you — **is a set of empty `<div>`s.** You are invisible in exactly the
  surface you asked to optimise for (ask #5).
- All 10 plan deep-dives, all premium figures, the whole league table: zero indexable text.

**Astro fixes this structurally.** Static rendering at build time means the tables ship as real HTML.
This is the strongest single argument for the migration and it should be treated as the primary
success metric, not a side effect.

### 1.3 🟠 Finding 2 — one URL cannot rank for the query space

Every intent — "best term plan", "HDFC Optima Secure+ review", "Care Supreme vs Optima Secure",
"health insurance for parents", "what is room rent capping" — currently resolves to `/` plus a hash
anchor. Hash fragments are not separate URLs. You are competing for hundreds of distinct queries
with a single indexable document, against Ditto and PolicyBazaar who have a dedicated URL for each.

### 1.4 🟡 Finding 3 — thin metadata

`index.html` has `<title>`, `description`, `keywords`, two `og:` tags. Missing sitewide:
canonical, `og:image`, `og:url`, Twitter card, **all JSON-LD**, `robots.txt`, `sitemap.xml`,
`llms.txt`, author/reviewer markup, `dateModified`. For a YMYL finance site with no
`Organization`, `FinancialProduct` or `FAQPage` schema, this is the floor, not a nice-to-have.

### 1.5 What is already good — keep it

- The design system (4,000 lines of CSS) is solid and ports as-is.
- `policyData` is well-structured, sourced and dated, with an honest disclaimer.
- The persona concept is the right positioning — it just needs to become URLs.
- Real insurer logos with a monogram fallback (`brandFor()`) — reuse the function verbatim.
- IRDAI sourcing + methodology transparency is genuine E-E-A-T. Most competitors fake this.

---

## 2. What Perfecplan actually did — the transferable mechanism

Verified by reading `C:/Users/naben/Downloads/Perfecplan/web`, not by trusting its comments.

**Measured scale:** 197 locations × 25 services = 4,925 cross-product pages, + 304 others =
**5,229 pages**, sitemap 5,222 URLs.

**The mechanism, in five parts:**

| Part | Perfecplan (Next.js) | Astro equivalent |
|---|---|---|
| Data layer | `src/lib/constants/*.ts` with `loc()` / `svc()` factories, auto-derived slugs | `src/content/` collections + Zod schemas, or `src/data/*.ts` |
| Static generation | `generateStaticParams()` on 7 dynamic routes; nested loop for the cross-product | `getStaticPaths()` on `[...]` routes |
| Per-page metadata | `generateMetadata()` → unique title, description, canonical, OG, permuted keyword array | `<SEO>` component invoked in the page frontmatter |
| Content depth | Genuinely templated body copy — location-specific H2/H3, `isDestination` conditional block, generated FAQs | Same pattern, more conditional branches |
| Internal linking | **16 sibling locations + 12 sibling services = 28 links per page** | Same — this is what makes the mesh crawlable rather than orphaned |
| Structured data | `Organization` global, `Service` + `LocalBusiness` + `FAQPage` per page, auto `BreadcrumbList` | Same, different schema types (§10) |
| Discovery | `sitemap.ts` enumerating all 5.2k URLs with priorities, `robots.ts` pointing at it | `@astrojs/sitemap` |

**The 28-links-per-page mesh is the load-bearing part.** Without it, 5,000 pages are 5,000 orphans
and Google crawls maybe 300 of them. Carry this over exactly.

### 2.1 Mistakes in Perfecplan to not repeat

Documented in its own handover as open defects — free lessons:

1. **Duplicated brand suffix in every `<title>`.** The layout sets a `%s | Perfecplan` template while
   four route families also bake `| Perfecplan` into their own title string, producing
   `... — Rates & Packages | Perfecplan | Perfecplan` — 84 chars, brand twice, truncated in SERPs, on
   ~5,150 pages. **Rule for us: exactly one place composes the title. Assert it in a build test.**
2. **OG images silently absent.** Next's file-convention `opengraph-image.tsx` did *not* reach pages
   that set their own `openGraph` block — pages shipped with no social preview. **Rule for us: one
   `<SEO>` component, always sets `og:image`, no per-page opt-outs.**
3. **CSS comment containing `**/` truncated the stylesheet, and `next build` exited 0 anyway.** Only
   the dev server surfaced it. **Rule for us: a green build is not evidence the CSS parses — always
   load a page after touching global CSS.**
4. **21 CSS classes used by the SEO pages had zero rules** — the pages were unstyled below the
   chrome for two sessions before anyone noticed. **Rule for us: build one page template end-to-end
   and look at it before generating 4,000 of them.**

---

## 3. Reference teardown — Ditto and PolicyBazaar

### 3.1 Ditto (joinditto.in) — the model to follow

Ditto is the closest competitor in positioning (advisory-led, no spam, IRDAI-certified experts) and
its URL taxonomy is the one to mirror:

```
/term-insurance/what-is-term-insurance/
/term-insurance/best-plans-in-india/
/term-insurance/companies/
/term-insurance/compare-plans/
/term-insurance/1-cr-term-insurance/          ← cover-amount page
/term-insurance/cover-calculator/
/term-insurance/checklist/
/health-insurance/best-health-plans-in-india/
/health-insurance/companies/
/health-insurance/senior-citizen-health-insurance/
/health-insurance/15-lakh-health-insurance-in-india/   ← cover-amount page
/health-insurance/best-family-health-insurance-plans/
/health-insurance/[insurer]/[plan]/           ← plan page
/health-insurance/[insurer]/reviews/          ← insurer review page
/health-insurance/data-lab/
/articles/health-insurance/...
```

**What their `best-health-plans-in-india` page contains** — this is effectively the target spec for
our category pages:

- Proprietary rating framework with a **linked methodology page**
- Top-5 table with scores, linking out to individual plan pages
- Per plan: logo, overall score, **four sub-scores** (premium / insurer / features / customer service),
  6–10 key features, a takeaway paragraph
- **Premium comparison table** across 4 profiles (individual 25, couple 31+32, family 35/34/5,
  seniors 62+63) at ₹15 L, Delhi 110001
- **Insurer performance table** — CSR, complaints per 10,000 claims, annual business, with
  industry-average benchmarks for context
- **28 FAQs**
- Named writer + reviewer with LinkedIn profiles and IRDAI certification badge
- Customer testimonials with aggregate rating
- Disclosure of insurer partnerships alongside the unbiased-methodology claim

> **Note:** your `policyData` already mirrors this almost exactly — same four health profiles, same
> Delhi baseline, same CSR/complaints/business metrics, same 45/45/10 weighting shape, and the same
> five health plans. The data model is competitive today. **The delivery is what is missing.**

### 3.2 PolicyBazaar — the volume playbook

Different game — an aggregator with an enormous programmatic surface. Confirmed patterns:

```
/health-insurance/health-insurance-india/
/health-insurance/individual-health-insurance/
/health-insurance/parents/                                    ← audience page
/health-insurance/maternity/                                  ← condition/need page
/health-insurance/mumbai/                                     ← city page
/health-insurance/filter/health-insurance+5-lakh-sum-insured/           ← faceted
/health-insurance/filter/health-insurance+with-maternity-cover/         ← faceted
/health-insurance/filter/health-insurance+5-lakh-sum-insured+for-care-health/  ← 2-facet cross
/health-insurance/individual-health-insurance/articles/[slug]/
```

**Take from PolicyBazaar:** the *axes* — audience, need/condition, city, sum insured, insurer — and
the idea of crossing two facets in one URL.

**Do not take:** the `filter/a+b+c` URL shape. It invites unbounded facet combinations, which is the
classic crawl-budget and thin-content trap. We enumerate a fixed, curated set of crosses instead.

---

## 4. Target architecture — Astro

### 4.1 Stack

```
Astro 5.x · output: 'static' · zero UI framework by default
@astrojs/sitemap        sitemap + index splitting
@astrojs/mdx            long-form guides
astro:content           collections + Zod validation
sharp                   image optimisation (built in)
```

**No React/Vue/Svelte.** The only interactive surface is the compare engine, and `compare.js` is
already framework-free vanilla JS. It becomes a script loaded *only* on pages that need it. Today it
loads on every page view because there is only one page; in Astro, a glossary page ships **zero
JavaScript**. That is the Astro win you asked for.

```js
// astro.config.mjs
export default defineConfig({
  site: 'https://myinsurancebro.com',
  output: 'static',
  trailingSlash: 'always',           // matches Ditto/PolicyBazaar; pick once, never change
  build: { format: 'directory' },    // → /path/index.html, which Apache serves natively
  integrations: [sitemap({ ... }), mdx()],
})
```

### 4.2 Directory layout

```
src/
  content.config.ts        ⚠ Astro 5 location — NOT src/content/config.ts. See §16.1.
  content/
    plans/                 one .json or .yaml per plan (migrated from policy-data.js)
    insurers/              one per insurer, incl. logo + accent + metrics
    personas/              16 life-stage personas (§7)
    conditions/            pre-existing conditions & needs
    # cities/ — CUT, see §6.4. Do not add without the underlying data.
    glossary/             ~250 terms
    guides/                MDX long-form
  data/
    profiles.ts            premium illustration profiles
    methodology.ts         scoring weights
    compare-rows.ts        matrix row definitions
  components/
    seo/  SEO.astro · JsonLd.astro · Breadcrumbs.astro · InternalLinks.astro · FaqSection.astro
          KeyFacts.astro · AnswerBlock.astro · Sources.astro · LastUpdated.astro
    plan/ PlanCard.astro · PlanTable.astro · PremiumTable.astro · LeagueTable.astro
          ScoreBar.astro · ProsCons.astro · CoverageMatrix.astro
    ui/   (ported from components.css)
  layouts/
    Base.astro · Article.astro · ProgrammaticPage.astro
  pages/
    [the URL taxonomy in §6]
public/
  send-mail.php  lead-store.php  view-leads.php   ← copied verbatim, Astro passes public/ through
  .htaccess  assets/  robots.txt  llms.txt  llms-full.txt
```

### 4.3 Hostinger / Apache compatibility — the critical constraint

You are on shared Apache hosting with PHP, not Vercel. This is fine, and it is why **Astro static is
the right call and Next.js would have been the wrong one**.

- `astro build` → `dist/` → upload contents to `public_html/`. No Node runtime on the server.
- **PHP endpoints survive.** Anything in `public/` is copied to `dist/` byte-for-byte. Put
  `send-mail.php`, `lead-store.php`, `view-leads.php` and `.htaccess` there and they keep working.
- The lead form contract stays identical — `action="send-mail.php"`, fields
  `name`, `phone`, `email`, `product`, `preferred_time`. **Do not change these**; `lead-store.php`
  writes to `../myinsurancebro-private/leads.json` and `view-leads.php` reads that shape.
- `build.format: 'directory'` produces `/health-insurance/index.html`, which Apache serves for
  `/health-insurance/` with no rewrite rules.
- Keep the existing `.htaccess` security block verbatim — it is correct and non-obvious
  (every directive wrapped in `<IfModule>` so a missing module doesn't 500 the site).
- Add to `.htaccess`: 301s from any old hash-anchor entry points, long-cache headers for
  `/_astro/*` (content-hashed, safe to cache for a year), gzip/brotli.

### 4.4 Migration order

Astro can be developed alongside the current site — build to `dist/`, deploy when a phase is ready.
Recommended: build Phase 1 in full, verify, **then** cut over. Do not deploy a half-built mesh.

---

## 5. Track A — data expansion (the real prerequisite)

**You have 10 plans. Ditto has ~40. This gates everything downstream** — plan pages, comparison
pages, category pages and the entire persona × plan mapping all read from this table.

Generating 4,000 pages from 10 plans produces 4,000 pages that all say the same thing. That is the
failure mode Google's scaled-content-abuse policy exists to catch.

### 5.1 Target dataset

| Collection | Now | Target | Notes |
|---|---:|---:|---|
| Health plans (base indemnity) | 5 | **35** | incl. maternity-inclusive and budget/Arogya Sanjeevani tiers |
| Term plans | 5 | **22** | incl. return-of-premium, whole-life, increasing-cover, smoker-rated variants |
| **Super top-up** | 0 | **12** | Tier A. Deductible mechanic is the whole product — model `deductible` as a first-class field. |
| **Senior citizen health** | 0 | **10** | Tier A. Distinct rules: entry-age caps, mandatory co-pay, sub-limits, PED handling. Not a filter on base health. |
| **Critical illness** | 0 | **8** | Tier A. Lump sum on diagnosis. Model `illnessesCovered` (count + list) and `survivalPeriod`. |
| **Personal accident** | 0 | **8** | Tier A. IRDAI's standard *Saral Suraksha Bima* gives a clean like-for-like baseline across insurers. |
| **Hospital daily cash** | 0 | **5** | Tier A. Smallest category; mostly a rider conversation. |
| Insurers | 19 | **26** | ~15 health/general + ~13 life |
| Personas | 3 | **16** | §7 |
| Conditions/needs | 0 | **24** | diabetes, hypertension, thyroid, PCOS, asthma, cardiac, cancer survivor, obesity/BMI, maternity, senior, pre-existing generally, mental health, IVF, day-care, OPD, dental, ayush, bariatric, cataract, knee replacement, dialysis, portability, top-up, no-room-rent-limit |
| Glossary terms | 0 | **250** | **Source: extract from policy wordings — ~73 IRDAI-standard definitions per document (§16.7).** Not original writing. The editorial work is the plain-English gloss and "why it matters", layered on the legal definition. |
| Guides | 0 | **120** | MDX |

**Cities: cut.** See §6.4.

**Tier A added (2026-08-13).** Five new categories, **100 plans total across seven categories**.

Why these five and not others — the test was *marginal cost*, not product taxonomy. All five are
sold by insurers **already in your dataset**, reuse the `products.health` schema shape, share the
same logos and the same IRDAI CSR/complaint figures, and belong in the same advisory conversation.
Adding them costs plan records, not a second business.

**The concrete gap they close:** several of the 16 personas in §7 currently have no product to
recommend —

| Persona | Had no product | Now served by |
|---|---|---|
| `buying-for-parents`, `senior` | ✗ | Senior citizen health |
| `woman-own-cover` | ✗ | Critical illness (breast/cervical cover) |
| `sole-breadwinner`, `home-loan` | partial | Critical illness alongside term |
| `gig-worker`, `self-employed` | partial | Personal accident |
| `first-job` (employer cover only) | ✗ | **Super top-up** — the highest-value advice on this list |

Super top-up deserves the emphasis: someone with ₹5 L of employer cover should usually buy a ₹20 L
super top-up rather than a ₹10 L base plan. It is cheap, high-intent, poorly explained everywhere
else, and you currently have no product to point them at.

**Still out:** motor, travel, home, cyber, pet, gadget — these make you an aggregator competing with
larger aggregators. Also out: ULIP, endowment, guaranteed-return and child plans — heavily mis-sold
products where the honest advice is usually "buy term and invest the difference". Those stay
**content-only candidates** for a later phase (they are strong E-E-A-T and traffic plays precisely
because you can publish the honest answer and PolicyBazaar cannot), but they get **no plan pages and
no dataset maintenance burden** now.

Note the other compensating moves: glossary 150→250, guides 60→120, conditions 20→24. Deepening what
you cover is what replaces the breadth that was cut, and it is cheaper and safer than adding fronts.

### 5.2 Per-plan fields to add beyond the current schema

The current schema is strong. For plan pages and comparison pages to be substantive, add:

`roomRentLimit` · `copayment` · `subLimits[]` · `restorationBenefit` · `noClaimBonus` ·
`pedWaitingPeriod` · `specificIllnessWaiting` · `maternityWaiting` · `initialWaiting` ·
`networkHospitals` (count) · `preHospitalisation` / `postHospitalisation` days · `dayCareProcedures` ·
`ambulanceCover` · `domiciliary` · `opdCover` · `healthCheckup` · `sumInsuredOptions[]` ·
`claimProcessSteps[]` · `portabilityNotes` · `renewability` · `lastVerified` (date) ·
`sources[]` (URL + label — **required**, see §11)

`lastVerified` and `sources[]` are not optional. They drive `dateModified` in schema, the
"Last verified" line on every page, and the citation trail that both Google's YMYL evaluation and
AI-crawler attribution depend on.

### 5.3 Zod schema enforces it

```ts
// src/content.config.ts — build fails on bad data, which for insurance is a compliance control.
// ⚠ Astro 5 syntax: `loader`, not `type: 'data'`. See §16.1 before writing this file.
import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const plans = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/plans' }),
  schema: z.object({
    id: z.string(),
    category: z.enum([
      'term', 'health', 'super-topup', 'senior-health',
      'critical-illness', 'personal-accident', 'hospital-cash',
    ]),
    insurer: z.string(),
    name: z.string(),
    score: z.number().min(0).max(5),
    metrics: z.object({ csr: z.number().min(0).max(100), complaints: z.number(), solvency: z.number().optional() }),
    premiums: z.record(z.number()),
    features: z.array(z.string()).min(4),
    covered: z.array(z.string()).min(3),
    notCovered: z.array(z.string()).min(3),
    pros: z.array(z.string()).min(3),
    cons: z.array(z.string()).min(2),   // a plan with no cons reads as an ad
    verdict: z.string().min(200),
    lastVerified: z.date(),
    sources: z.array(z.object({ label: z.string(), url: z.string().url() })).min(1),
  }),
})
```

---

## 6. URL taxonomy and page inventory

### 6.1 Design rules

1. **Every URL must answer a query a real person types.** If you cannot state the query, delete the route.
2. **Two facets maximum per URL.** Three-facet crosses (city × persona × cover) are where thin content lives.
3. **Trailing slash always**, lowercase, hyphenated, no dates in paths.
4. **One canonical per page, self-referencing.** No exceptions.
5. **Every generated page carries ≥20 contextual internal links** (the Perfecplan mesh rule).

### 6.2 Full route map

```
/                                                       home
/compare/                                               the interactive engine
/methodology/                                           how we score — linked from every score
/claims-support/  /about/  /contact/  /advisors/

── The 7 categories ─────────────────────────────────────────────────────
   [category] ∈ health-insurance · term-insurance · super-top-up
                senior-citizen-health-insurance · critical-illness-insurance
                personal-accident-insurance · hospital-cash-insurance

/[category]/                                            product hub          × 7
/[category]/best-plans/                                 the Ditto-style flagship × 7

── Plans ────────────────────────────────────────────────────────────────
/[category]/[insurer]/[plan]/                           e.g. /health-insurance/hdfc-ergo/optima-secure-plus/
                                                             /super-top-up/care/enhance/

── Insurers ─────────────────────────────────────────────────────────────
/[category]/companies/                                  index               × 7
/[category]/companies/[insurer]/                        insurer review, only where they sell it
/insurers/[insurer]/claim-settlement-ratio/             high-intent standalone

── Comparisons (the biggest genuinely-useful multiplier) ────────────────
/compare/[category]/[planA]-vs-[planB]/                 WITHIN a category only — never across.
                                                        Comparing a term plan to a PA plan is nonsense.
/compare/insurers/[insurerA]-vs-[insurerB]/

── Personas / life stages (ask #3) ──────────────────────────────────────
/for/[persona]/                                         hub
/for/[persona]/[category]/                              only where the pairing is real

── Cover amount ─────────────────────────────────────────────────────────
/health-insurance/cover/[amount]/                       5-lakh … 1-crore
/term-insurance/cover/[amount]/                         25-lakh … 10-crore
/critical-illness-insurance/cover/[amount]/             10-lakh … 1-crore
/personal-accident-insurance/cover/[amount]/            25-lakh … 2-crore
/super-top-up/deductible/[amount]/                      the defining facet of this product
/[category]/cover/[amount]/[persona]/                   curated crosses only

── Conditions & needs ───────────────────────────────────────────────────
/health-insurance/for/[condition]/                      diabetes, maternity, senior-citizens …
/health-insurance/for/[condition]/cover/[amount]/       curated crosses only

── Plan × persona / plan × condition (§6.5) ─────────────────────────────
/[category]/[insurer]/[plan]/for/[persona]/             driven by the existing bestFor[] field
/health-insurance/companies/[insurer]/[condition]/      "does Niva Bupa cover diabetes?"

── Cities ───────────────────────────────────────────────────────────────
   CUT — see §6.4. Do not add these routes without the underlying data.

── Knowledge ────────────────────────────────────────────────────────────
/glossary/                    /glossary/[term]/
/guides/                      /guides/[slug]/
/calculators/term-cover/  /calculators/health-cover/  /calculators/hlv/  /calculators/premium-by-age/
/tax/section-80d/  /tax/section-80c/  /tax/80d-senior-citizens/
```

### 6.3 Page count math

Assuming the §5.1 target dataset (**100 plans across 7 categories**, 26 insurers, 16 personas,
24 conditions, 250 glossary terms) and **no city axis**:

| Route family | Formula | Pages |
|---|---|---:|
| Static / hub / money pages | incl. 7 category hubs + 7 best-plans | 50 |
| Plan pages | 35 + 22 + 12 + 10 + 8 + 8 + 5 | **100** |
| Insurer × category (curated — only where they sell it) | ~60 | 60 |
| Insurer CSR pages | 26 | 26 |
| Plan vs plan **within category** | 595 + 231 + 66 + 45 + 28 + 28 + 10 | **1,003** |
| Insurer vs insurer | C(15,2) + C(13,2) = 105 + 78 | 183 |
| Persona hubs | 16 | 16 |
| Persona × category (curated) | ~60 of 112 | 60 |
| Cover / deductible amount (national) | 8 + 9 + 5 + 5 + 6 | 33 |
| Cover × persona (curated) | ~300 of 528 | 300 |
| Conditions | 24 | 24 |
| Condition × cover (curated) | ~120 of 192 | 120 |
| Plan × persona (curated via `bestFor[]`) | ~3.4 personas × 100 plans | **340** |
| Insurer × condition (curated) | ~200 of 360 | 200 |
| Glossary | 250 | 250 |
| Guides | 120 | 120 |
| Calculators + tax | 12 + 12 | 24 |
| **Total** | | **≈ 2,900** |

**Target: ~2,900 pages of defensible quality**, versus Perfecplan's 5,229. Fewer pages, far higher
survival rate.

> Tier A added ~450 pages, not the ~320 estimated when the decision was taken. The extra comes from
> the curated crosses (cover × persona, plan × persona) growing alongside the plan count, not from
> the plan pages themselves. **Every "curated" row above is a ceiling, not a quota** — if a pairing
> has nothing distinct to say, do not generate it. The counts assume roughly half of each
> theoretical cross survives curation.

**The C(n,2) leverage, restated:** comparison pages are now 1,003 of the 2,900 — over a third of the
site — and they scale quadratically with the dataset. This is why §5 data expansion is the critical
path and template work is not.

### 6.4 The city axis — cut, and why

**Decision taken 2026-08-13: no city pages.** Recorded here so nobody re-adds them in six months
without the data.

A city page that only swaps "Mumbai" for "Delhi" in the H1 is a doorway page — ignored at best,
penalised at worst. To be legitimate, each city record needed genuinely local facts:

- Network hospital **count per insurer in that city**
- 5–10 **named** major network hospitals
- Premium **zone loading** — Indian health insurers zone-rate, and Zone A (Mumbai/Delhi) costs
  materially more than Zone C
- State health scheme context (MJPJAY, Ayushman Bharat variants) and its interaction with private cover
- City-specific typical hospitalisation cost band

That data is not reliably sourceable, so the axis is out. This removed **2,160 pages** (city × product
240 + city × persona 1,920).

**If this changes later**, there is a cheaper partial substitute worth considering before returning to
cities: **state-level pages** (28 states + 8 UTs × 2 products = 72 pages). State government health
schemes *are* public and sourceable from government portals, which makes a state page genuinely
differentiated in a way a city page was not. Treat as a Phase 4 candidate, not a launch item.

### 6.5 Where the volume came back from

Cutting cities removed 2,160 pages. About 1,200 came back through axes that run off data you
**already hold or are already adding**, at materially lower risk, because each one answers a question
a real person types:

| Axis | Pages | Why it's defensible |
|---|---:|---|
| **Tier A categories** — super top-up, senior health, CI, PA, hospital cash | ~450 | 43 new plan records → 177 new comparison pages via C(n,2), plus hubs and curated crosses. Same insurers, same schema, same claim-support promise. Closes the persona gaps in §5.1. |
| **Plan × persona** — `/health-insurance/care/care-supreme/for/new-parent/` | 340 | The `bestFor[]` field **already exists in `policy-data.js`** and already maps plans to personas. Only generate where the mapping exists — never the full 100×16 cross. Answers "is Care Supreme good for a new parent?" |
| **Insurer × condition** — `/health-insurance/companies/niva-bupa/diabetes/` | 200 | "Does Niva Bupa cover diabetes?" is a high-intent query with a factual answer sitting in the policy wording. Needs the PED/waiting-period fields from §5.2. |
| **Condition × cover** | 120 | "₹10 lakh health insurance for diabetics" — curated, not the full cross. |
| **Glossary 150 → 250** | +100 | Cheapest and safest pages on the site, and the strongest AI-crawler surface (§10.5, `DefinedTerm`). Definitional queries are exactly what assistants answer. |
| **Guides 60 → 120** | +60 | Genuine editorial. Slowest to produce, highest per-page value. |

**The compounding point is worth internalising:** because comparison pages are C(n,2), every plan you
add to the dataset is worth far more than one page. Going 30→35 health plans adds 5 plan pages and
**160 comparison pages**. Data expansion is the highest-leverage work in this entire plan.

**The counterweight:** C(n,2) cuts both ways. A quadratic tier built on a thin or unverified dataset
multiplies the thinness just as fast. This is why comparison pages are Phase 3, behind the plan,
glossary and guide tiers that establish topical authority first.

---

## 7. Expanded persona / category system (ask #3)

You currently have 3. Here are **16**, each with a distinct search intent, a distinct pain, and a
distinct plan recommendation — which is what makes them real pages rather than tab labels.

| # | Key | Persona | Age | Core anxiety | Primary product |
|---|---|---|---|---|---|
| 1 | `first-job` | Just started earning | 22–28 | Group cover vanishes on resignation; aged off parents' floater | Health (own name) |
| 2 | `newly-married` | Newly married | 25–32 | Two incomes, one household, no joint cover; floater vs individual | Health floater + term |
| 3 | `dink-couple` | Working couple, no kids yet | 27–35 | Cheapest window to lock entry age & serve waiting periods | Health + term |
| 4 | `new-parent` | New or expecting parent | 28–38 | Maternity waiting 2–4 yrs; newborn day-1 cover | Health w/ maternity |
| 5 | `school-parent` | Parent of school-age kids | 32–45 | Cover must outlive the school-fee horizon | Term (high cover) |
| 6 | `home-loan` | Home loan / big EMI | 28–45 | Family inherits the EMI if income stops | Term = loan protection |
| 7 | `sole-breadwinner` | Single-income household | 30–50 | Single point of failure, no second income to absorb a shock | Term + CI rider |
| 8 | `sandwich` | Kids *and* parents to cover | 45–60 | Two generations, entry age closing on the parents | Health multi-policy |
| 9 | `self-employed` | Self-employed / freelancer | 25–50 | Zero group cover; income irregular; no HR to fall back on | Health + term |
| 10 | `gig-worker` | Gig / contract worker | 22–40 | No employer cover, platform cover is thin, budget-sensitive | Budget health |
| 11 | `buying-for-parents` | Buying for parents | 30–50 | Entry-age caps, PED waiting, senior loading | Senior health |
| 12 | `senior` | Senior citizen (60+) | 60+ | Entry-age limits, co-pay, sub-limits, portability | Senior health |
| 13 | `pre-existing` | Has a pre-existing condition | any | Will the claim be rejected; which insurer accepts my profile | Health, PED-friendly |
| 14 | `nri` | NRI / recently returned | 28–50 | Residency rules, cover for parents in India, tax treatment | Term + parents' health |
| 15 | `woman-own-cover` | Woman buying her own cover | 25–50 | Maternity, critical-illness (breast/cervical), homemaker eligibility | Health + CI |
| 16 | `hni-business` | Business owner / HNI | 35–55 | ₹5 Cr+ cover, keyman, tax-efficient structuring | High-cover term |

**Implementation:** each persona is a content-collection entry with `key, label, ageRange,
headline, pains[] (3–5, each with heading + body), planRecommendations[] (plan ids + reason),
faqs[] (5–8), relatedPersonas[], searchIntent[]`.

This replaces the hardcoded persona panels in `index.html` — the same three panels get generated from
data, and 13 more come free. The homepage tab UI stays (pick the top 4–5), while all 16 get their own
`/for/[persona]/` URL.

---

## 8. Page templates — required blocks

Every programmatic page carries these in order. **This is the anti-thin-content contract**; a page
that cannot fill all of them should not be generated.

1. **Breadcrumbs** — visible + `BreadcrumbList` JSON-LD
2. **H1** — unique, ≤60 chars, no brand suffix (composed in exactly one place)
3. **Answer block** — 40–60 words directly answering the page's query, in a `<p>` immediately after
   the H1. *This is the single highest-leverage block for both featured snippets and AI citation.*
4. **Key facts `<dl>`** — 4–8 machine-readable fact pairs
5. **Main content** — 600–1,500 words, genuinely conditional on the page's variables
6. **A real `<table>`** — premiums, coverage or comparison. Never a div grid, never an image.
7. **Pros / cons** — both populated; a plan with no cons reads as an advertisement
8. **FAQ** — 5–8 Q&As, templated per variable, + `FAQPage` JSON-LD
9. **Sources + last verified** — visible line, feeding `dateModified`
10. **CTA** — the existing booking form (`send-mail.php`, unchanged fields)
11. **Internal links** — ≥20 contextual siblings (Perfecplan's mesh rule)
12. **Disclaimer** — reuse the existing one verbatim; it is well-written and compliant

### 8.1 Title composition — one function, no exceptions

```ts
// src/lib/seo.ts — the ONLY place a <title> is built. Perfecplan's bug was two places.
export function title(page: string, opts?: { brand?: boolean }) {
  const t = opts?.brand === false ? page : `${page} | Myinsurancebro`
  if (t.length > 60) console.warn(`[seo] title ${t.length} chars, will truncate: ${t}`)
  return t
}
```

Add a build-time assertion that no page title contains `Myinsurancebro` twice. This is a one-line
test that would have saved Perfecplan 5,150 broken titles.

---

## 9. Google SEO plan of action

### 9.1 Technical foundation (Phase 0 — before any content page ships)

- [ ] `robots.txt` — allow all, point at sitemap index
- [ ] `sitemap-index.xml` via `@astrojs/sitemap`, split at 45,000 URLs (we are far under, but the
      index shape is what Search Console prefers), with `lastmod` from `lastVerified`
- [ ] Self-referencing canonical on every page
- [ ] Single `<SEO>` component — title, description, canonical, OG (incl. **`og:image` always**),
      Twitter card, `robots` directives
- [ ] `Organization` + `InsuranceAgency` JSON-LD sitewide, with IRDAI registration number
- [ ] Core Web Vitals: Astro static + no framework should give LCP < 1.5s. Self-host Inter and
      Space Grotesk (kill the two `fonts.googleapis.com` round-trips), keep the existing
      `chief-advisor.png` preload, convert images to AVIF/WebP via `astro:assets`
- [ ] 301s from old hash entry points in `.htaccess`
- [ ] Search Console + Bing Webmaster, sitemap submitted
- [ ] `X-Robots-Tag: noindex` retained on `view-leads.php` (already in `.htaccess`)

### 9.2 On-page rules

| Element | Rule |
|---|---|
| Title | ≤60 chars, primary keyword first, brand suffix added once by `title()` |
| Meta description | 150–160 chars, unique, contains a number (₹ figure, %, count) — numbers lift CTR |
| H1 | One per page, matches search intent, ≠ title verbatim |
| H2/H3 | Phrased as questions where natural — feeds both PAA and AI extraction |
| Keywords meta | Permuted per page like Perfecplan. Near-zero ranking value, harmless, and useful as an internal audit of intent coverage |
| Word count | 600 floor for programmatic, 1,200+ for money pages. Never pad. |
| Images | `alt` describing the insurer/plan, width+height set, lazy below fold |

### 9.3 Internal linking mesh

Per Perfecplan's proven pattern, each programmatic page links:

| Page type | Links out to |
|---|---|
| Plan page | 8 same-category plans · 4 comparisons involving this plan · its insurer page · 3 relevant personas · 4 glossary terms mentioned in the body |
| Comparison page | both plan pages · 8 other comparisons · both insurer pages · the category page |
| Persona page | 5 recommended plans · both product hubs · 4 sibling personas · 3 relevant guides |
| Plan × persona | the parent plan · the persona hub · 4 sibling personas · 3 alternative plans for that persona |
| Insurer × condition | the insurer page · the condition page · 6 sibling conditions · 3 plans from that insurer |
| Glossary term | 5 related terms · 3 plans where the term is material · 2 guides |

**Glossary terms should auto-link on first mention in body copy.** Cheap to implement, and it wires
150 otherwise-orphaned pages into the mesh.

### 9.4 Phased rollout with indexing gates

**Do not publish 2,900 URLs in week one.** Dumping a large mesh on a low-authority domain is the
fastest way to get the whole site classified as scaled content.

| Phase | Ships | Pages | Cumulative | Gate to proceed |
|---|---|---:|---:|---|
| **0** | Astro shell, design-system port, technical foundation, home | ~10 | 10 | Site live, CWV green, indexed |
| **1a** | **Term + base health only** — plans, insurers + CSR, 16 personas, hubs, best-plans, calculators, tax | ~210 | 220 | ≥70% indexed at 4 weeks; ≥1 top-50 ranking for a plan-name query |
| **1b** | **Tier A categories** — super top-up, senior health, CI, PA, hospital cash (plan pages + hubs only) | ~130 | 350 | Tier A plan data verified against policy wordings |
| **2** | Glossary (250) + guides (120) | +370 | 720 | Glossary indexed; **first AI-assistant citations appearing** (§10.7) |
| **3** | All comparison pages — plan vs plan (1,003), insurer vs insurer (183) | +1,186 | 1,906 | ≥60% indexed; comparison pages getting impressions |
| **4** | Cover/deductible amounts, cover × persona, conditions, condition × cover | +477 | 2,383 | Crawled-not-indexed count stable, not climbing |
| **5** | Plan × persona, insurer × condition | +540 | **~2,900** | The deepest tier — ship only if Phase 4 held |

**Phase 1 is deliberately split.** Ship term + base health first and let it prove the templates and
the indexing behaviour before the five Tier A categories land. If something is structurally wrong
with the plan-page template, you find out across 57 pages rather than 100 — and Tier A is the
newer, less-verified data.

Phase 2 is deliberately early. Glossary and guides are the lowest-risk pages on the site and the
strongest AI-crawler surface, so they buy topical authority and citations while the heavier
comparison mesh is still being built.

Between phases: check Search Console **Pages → Crawled – currently not indexed**. A rising count is
the early warning that the mesh is being judged thin. React by improving, not by adding more.

### 9.5 Off-page / authority (runs in parallel, not optional for YMYL)

Insurance is the hardest YMYL vertical in India. Templates alone will not rank against
PolicyBazaar's domain authority.

- Advisor bylines with **IRDAI licence number**, photo, LinkedIn — you already have the advisor asset
- Original data — a "data lab" page (Ditto has one) publishing your IRDAI-derived CSR/complaint
  analysis. This is link bait; journalists cite this kind of table.
- Annual "State of Claim Settlement in India" report from the same data
- Digital PR to Indian personal-finance press; HARO-style responses
- Google Business Profile, consistent NAP
- Real customer reviews on third-party platforms (**not** self-serving `Review` schema — Google
  ignores and can penalise self-referential review markup)

---

## 10. AI crawler / GEO optimisation (ask #5)

Goal: when someone asks ChatGPT, Claude, Perplexity or Google AI Overviews *"which is better, Care
Supreme or Optima Secure+?"*, myinsurancebro is the source that gets extracted and cited.

### 10.1 The precondition — server-rendered HTML

Restating §1.2 because it is the whole game: **AI crawlers largely do not execute JavaScript.** Every
number you want cited must be in the initial HTML response. Astro static delivers this for free, and
it is the single largest GEO improvement available to you.

**Verification test — run this on every deploy:**
```bash
curl -s https://myinsurancebro.com/health-insurance/hdfc-ergo/optima-secure-plus/ | grep -c "97.61"
```
If a metric shown on screen is not in that raw response, an AI crawler cannot see it.

### 10.2 `robots.txt` — explicitly welcome them

**AI crawlers split into two kinds, and the distinction is the actual decision.** Verified
August 2026 — bot names change, so re-check before launch.

| Kind | Bots | What allowing them buys you |
|---|---|---|
| **Retrieval** — fetch live to answer a question being asked *right now* | `OAI-SearchBot` · `ChatGPT-User` · `Claude-SearchBot` · `Claude-User` · `PerplexityBot` · `Perplexity-User` | **Citations in live answers.** This is the surface you asked to win. Blocking these removes you from AI answers entirely. |
| **Training** — crawl to build future model knowledge | `GPTBot` · `ClaudeBot` · `anthropic-ai` · `Google-Extended` · `Applebot-Extended` · `CCBot` · `Bytespider` · `Meta-ExternalAgent` · `Amazonbot` · `Diffbot` · `cohere-ai` · `FacebookBot` | Future models know your brand. No direct traffic, no attribution. |

A business can rationally allow **retrieval** and block **training** — you keep the citations and
opt out of being training data. The config below allows both; flip the training block to `Disallow`
if you'd rather not feed model training.

```
User-agent: *
Allow: /

# ── Retrieval crawlers — these decide whether you get cited in live AI answers ──
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: Claude-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Perplexity-User
Allow: /

# ── Training crawlers — flip to Disallow if you don't want to be training data ──
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: CCBot
Allow: /
User-agent: Bytespider
Allow: /
User-agent: Meta-ExternalAgent
Allow: /
User-agent: Amazonbot
Allow: /
User-agent: Diffbot
Allow: /
User-agent: cohere-ai
Allow: /
User-agent: FacebookBot
Allow: /

Sitemap: https://myinsurancebro.com/sitemap-index.xml
```

> **Notes.** `Google-Extended` controls Gemini/AI-Overviews *training* only — it does **not** affect
> normal Googlebot indexing or whether you appear in AI Overviews, which follows regular indexing.
> Blocking it does not remove you from Google Search. Compliance is voluntary and depends on the
> operator; `Bytespider` is reported as only partially compliant.
>
> The trade-off, stated plainly: allowing these means your content grounds AI answers — that is how
> you get cited, and it also means the answer is consumed without a click. For an advisory business
> whose conversion is a phone call, citation-with-attribution is worth more than the lost pageview.
> Business call — flagging it, not deciding it.

### 10.3 `llms.txt` and `llms-full.txt`

`llms.txt` at the root — a curated markdown map of the site for LLMs. Adoption is still uneven in
2026, so treat it as a cheap experiment, not a pillar. **The structured data in §10.5 matters more.**

```markdown
# Myinsurancebro

> IRDAI-licensed insurance advisory in India. Independent, data-led comparison of term life and
> health insurance plans, scored against IRDAI claim-settlement and grievance disclosures.
> We are an advisor, not an insurer — we do not underwrite any product.

## Methodology
- [How we score plans](/methodology/): Plan features 45%, insurer strength 45%, premium 10%.
  Data from IRDAI Annual Report and public grievance disclosures, FY 2024–26 three-year averages.

## Health insurance
- [Best health insurance plans](/health-insurance/best-plans/): Top plans scored and compared
- [All health insurers](/health-insurance/companies/): CSR, complaints per 10,000 claims, GWP
- [HDFC ERGO Optima Secure+](/health-insurance/hdfc-ergo/optima-secure-plus/): Score 4.99/5, CSR 97.61%
- ... one line per plan, each with the headline number

## Term insurance
- ...

## Comparisons
- ...

## Glossary
- [Room rent capping](/glossary/room-rent-capping/): ...

## Notes
- Premiums are indicative illustrations for stated profiles, not quotes.
- Figures last verified: August 2026.
```

`llms-full.txt` — the same content expanded to full plan facts in one file, for models that ingest a
single document. Generate both at build time from the collections so they never drift.

### 10.4 Content patterns that get extracted

| Pattern | Why it works |
|---|---|
| **Answer-first paragraph** (40–60 words) right after the H1 | Extractable as a complete answer without surrounding context |
| **Question-shaped H2/H3** | Matches the prompt phrasing the user actually typed |
| **Self-contained sections** | Each section must make sense quoted alone — never "as mentioned above" |
| **Explicit units and dates everywhere** | "₹10,149 per year (FY 2024–26, ₹15 L cover, Delhi, age 25)" not "₹10,149" |
| **Real `<table>` with `<caption>` and `<th scope>`** | Parses into structured rows; a div-grid does not |
| **`<dl>` key-facts blocks** | Unambiguous fact pairs |
| **Named entities spelled in full on first use** | "Insurance Regulatory and Development Authority of India (IRDAI)" |
| **Explicit comparison verdicts** | "Care Supreme is better for X; Optima Secure+ is better for Y" — directly answers a comparison prompt |
| **Visible `Last verified: 12 August 2026` + sources** | Recency and provenance are heavily weighted in citation selection |

**Anti-patterns to avoid:** text baked into images, JS-gated tabs hiding content, infinite scroll,
content behind an interaction, "click to expand" that isn't in the DOM, PDF-only data.

> Note on the existing accordion FAQs and tabbed persona panels: keep them, but ensure the content is
> **in the DOM and hidden with CSS**, never injected on click. The current persona panels already do
> this correctly — the compare engine does not.

### 10.5 Structured data (JSON-LD) — the highest-leverage GEO work

| Page type | Schema |
|---|---|
| Sitewide | `Organization` + `InsuranceAgency` (the **business** — `InsuranceAgency` is a `LocalBusiness`/`FinancialService` subtype), `identifier` = IRDAI registration no. |
| Plan page | `FinancialProduct` for the **plan**. ⚠ There is **no insurance-specific subtype** — schema.org's `FinancialProduct` subtypes are only `BankAccount`, `CurrencyConversionService`, `InvestmentOrDeposit`, `LoanOrCredit`, `PaymentCard`, `PaymentService`. Use `FinancialProduct` directly with `provider` (the insurer as `Organization`), `category`, `audience`, `termsOfService`, `feesAndCommissionsSpecification`, `offers`. All verified present (§16.3). |
| Plan / comparison | `AggregateRating` **only from your own stated methodology**, `Rating` with `bestRating: 5` and `ratingExplanation` linking `/methodology/` |
| Comparison page | `ItemList` of the two `FinancialProduct`s + `FAQPage` |
| Category page | `ItemList` (ranked) + `FAQPage` |
| Insurer page | `Organization` for the insurer + `Dataset` for the metrics table |
| Glossary term | **`DefinedTerm`** in a `DefinedTermSet` — underused and highly extractable |
| Guides | `Article` with `author` (`Person` + IRDAI credential), `reviewedBy`, `datePublished`, `dateModified` |
| Claim process | `HowTo` |
| All | `BreadcrumbList`, emitted automatically by the `Breadcrumbs` component |

Add `speakable` on the answer block. Add `citation` pointing at the IRDAI source for every metric.

### 10.6 Machine-readable data endpoints

Publish `/data/plans.json`, `/data/insurers.json`, `/data/glossary.json` — the same collections,
generated at build. Link them from `llms.txt` and via `<link rel="alternate" type="application/json">`.
Costs nothing, gives agents a clean path to your data, and makes the site genuinely useful to
developers — which attracts links.

### 10.7 Measuring GEO

- Server log analysis for `GPTBot`, `ClaudeBot`, `PerplexityBot` user-agents — are they crawling,
  and which pages? (Hostinger provides raw access logs.)
- Referral traffic from `chat.openai.com`, `perplexity.ai`, `claude.ai` in GA4 — segment it
- Monthly manual prompt panel: ask each assistant 20 fixed questions
  ("best health insurance for parents in India", "Care Supreme vs Optima Secure+"), record whether
  myinsurancebro is cited. This is currently the only reliable measurement method.

---

## 11. Compliance and E-E-A-T — non-negotiable for this vertical

Insurance is YMYL. Google holds it to the highest evaluation standard, and IRDAI holds you to a legal one.

- **IRDAI registration number** in the footer of every page and in `Organization` schema
- **Named author + reviewer** on every content page, with IRDAI certification. You already have the
  chief-advisor asset — use it as a real byline, not decoration.
- **`Last verified` date** on every page carrying a number, driven by `lastVerified`
- **Sources cited** — IRDAI Annual Report, insurer policy wordings — with links
- **Existing disclaimer reused verbatim.** It is well-drafted: premiums are illustrations not quotes,
  scores are your own assessment, you are an advisor and not an underwriter. Put it on every page
  that shows a premium or a score.
- **Disclose insurer relationships.** Ditto does this on the same page as its unbiased-methodology
  claim, and it *increases* trust rather than reducing it.
- **Superlatives need a stated basis.** "Best" must resolve to your published methodology. IRDAI
  advertisement regulations apply to comparative claims.
- **Never state a premium as a quote.** Always "indicative illustration for [stated profile]".

**Flagging two risks explicitly:**

1. The current data says `updated: 'August 2026'` with `FY 2024–26` three-year averages. A 2,900-page
   site whose every page displays those numbers means a data refresh touches every page. Build the
   refresh path — a single collection edit that rebuilds — deliberately, and diarise the IRDAI annual
   report release (it lands around **December**).
2. 🔴 **The FY2026 attribution needs checking.** IRDAI's latest annual report is **FY2024-25**
   (published 30 Dec 2025) — see §16.7. FY2026 figures cannot have come from it. Either they came
   from insurer public disclosures (Form NL-*), in which case the source line should say so, or the
   period is misstated. Resolve before launch: this number appears on every page, under your IRDAI
   licence.

---

## 12. Build order for the next session

| # | Task | Depends on |
|---|---|---|
| **0a** | **`git merge origin/main`** — pull in the missing logo commits. Commit/stash first. See §0a. | — |
| **0b** | Optimise the 730 KB logo per §16.9 before it gets baked into the Astro build | 0a |
| 1 | `npm create astro@latest` in a `site/` subfolder; config per §4.1 | 0a |
| 2 | Port `style.css` + `components.css` into Astro; build **one** page and look at it (Perfecplan lesson #4) | 1 |
| ~~3~~ | ✅ Chrome ported: nav, footer, theme toggle. WhatsApp float and modal still live in main.js. | 2 |
| 4 | **`src/content.config.ts`** Zod schemas (§5.3). **Read §16.1 first — Astro 5 syntax, not Astro 4.** | 1 |
| 5 | Migrate `policy-data.js` → collections; **byte-for-byte value check** against the old file | 4 |
| 6 | `SEO.astro`, `JsonLd.astro`, `Breadcrumbs.astro`, `title()` + the duplicate-brand assertion | 3 |
| ~~7~~ | ✅ Home page ported — all 15 sections. **Persona panels are NOT data-driven**: the collection has no panel content to drive them with. See §0b. | 3, 5 |
| 8 | Plan page template end-to-end for **one** plan; verify all 12 blocks of §8 render | 5, 6 |
| 9 | `getStaticPaths` for all 100 plan pages across the 7 categories | 8 |
| ~~10~~ | ✅ Static fallback table shipped inside `#cmpGrid`; compare.js still loads as a plain script rather than a scoped island. | 5 |
| 11 | 13 new personas authored (§7) + `/for/[persona]/` routes | 5 |
| 12 | Insurer pages, glossary, guides, calculators | 5 |
| 13 | `robots.txt`, sitemap, `llms.txt`, `llms-full.txt`, `/data/*.json` generators | 9 |
| 14 | Copy PHP + `.htaccess` into `public/`; verify the form posts correctly from a built page | 1 |
| 15 | Build, `curl` verification (§10.1), CWV check, deploy Phase 1 | all |

**Verification commands**
```bash
npm run build && npx serve dist
```
Then confirm: page count in build output, every metric present in `curl` output, no title contains
the brand twice, sitemap URL count matches the route math.

**Previewing the current (pre-Astro) site:** `.claude/launch.json` + `.claude/static-server.js` — a
dependency-free node static server on port 4321. Needed because `file://` renders the site with no
CSS. Two gotchas when screenshotting:

- `.fade-up` elements sit at `opacity: 0` until the IntersectionObserver in `js/main.js` fires, and
  it does **not** fire in a non-composited browser pane. Reveal them manually:
  `document.querySelectorAll('.fade-up').forEach(e => e.classList.add('visible'))`
- Revealing them changes page height, so scroll to your target **after** revealing, not before.

---

## 13. Risks — read before committing to the page count

| Risk | Severity | Mitigation |
|---|---|---|
| ~~Scaled content abuse from city pages~~ | **Retired** | **The city axis was cut (§6.4).** This was the single largest risk in the original plan and the decision removed it outright. |
| **10 plans cannot fill 2,900 pages.** With cities gone the mesh leans almost entirely on plan and insurer data, so a thin dataset shows faster and more visibly. Tier A raises the bar again — it needs **43 new plan records across five categories you have never covered**, each verified against policy wordings. | **High** | Track A data expansion is the hard gate on Phases 1b and 3–5. Do not start Phase 3 below ~30 health plans; do not ship Phase 1b on unverified Tier A data. |
| **Residual scaled-content risk in the C(n,2) comparison tier** — 826 comparison pages is still the largest single family. | Medium | Ship it as Phase 3, after Phase 1–2 have established topical authority. Each page must carry a genuine verdict, not a swapped-variable table. |
| **YMYL authority ceiling.** PolicyBazaar and Ditto have years of domain authority. Templates alone will not close that. | High | §9.5 off-page work runs in parallel from day one, not after. |
| **Data freshness across 2,900 pages and 7 categories.** One IRDAI release invalidates every page. | Medium | Single-source collections; `lastVerified` per record; scheduled annual refresh. |
| **Comparison pages could read as duplicative** (A-vs-B and B-vs-A). Now higher-stakes: this is the biggest page family. | **High** | Generate **one** canonical direction per pair; 301 the reverse. C(n,2), never n×(n−1). A build assertion should fail if both directions are ever emitted. |
| **IRDAI advertising compliance on comparative claims.** | Medium | Every superlative resolves to `/methodology/`; disclaimer on every page with a number; legal review before Phase 2. |
| **Losing the working PHP lead pipeline in migration.** | Medium | PHP files go in `public/` untouched; form field names frozen; test a real submission before cutover. |
| **Build time at 2,900 pages.** | Low | Astro static is fast; Perfecplan's 5,229 Next pages build fine. Non-issue until ~10k. |
| **Unoptimised images sink the LCP the whole thesis rests on.** A 730 KB logo on every page and a 2.3 MB preloaded hero portrait. The ranking argument in §9.1 assumes CWV green. | **High** | §16.9 recipe; `astro:assets` at build time. Measure CWV before and after Phase 1, not at the end. |
| **Work split across two machines diverging again.** The logo commits sat unmerged on `origin/main` for 3 days while work continued on `revamp`. | Medium | `git fetch --all` at the start of every session; check §0a before writing code. Merge to a single branch before Astro work begins. |

---

## 14. Decisions

### Locked — 2026-08-13

| # | Decision | Consequence |
|---|---|---|
| 1 | **City axis cut** — per-city hospital counts and zone loadings not reliably sourceable | −2,160 pages. Largest penalty risk in the plan removed. State-level pages held as a Phase 4 candidate (§6.4). |
| 2 | ~~Term + health only~~ — **superseded by #5 below** | Held for 1 day. Recorded so the reasoning trail stays intact. |
| 3 | **Target ~2,900 pages**, not Perfecplan's 5,229 | Deliberate. Just over half the count, much higher expected survival rate. |
| 4 | **Volume recovered via plan × persona, insurer × condition, deeper glossary/guides** (§6.5) | Runs off data already in `policy-data.js` (`bestFor[]`) plus the §5.2 field additions. |
| 5 | **Tier A added — 7 categories total.** Term, base health, super top-up, senior citizen health, critical illness, personal accident, hospital daily cash | +43 plans → +450 pages. Same insurers, same schema, near-zero marginal cost. Closes the persona/product gaps in §5.1. Ships as Phase 1b, behind term + health. |
| 6 | **Still excluded:** motor, travel, home, cyber, pet · and ULIP, endowment, guaranteed-return, child plans | First group makes you an aggregator. Second group is mis-sold product you would recommend against — retained as **content-only candidates** (§5.1), no plan pages. |

### Still open

1. **Repo layout** — Astro in a `site/` subfolder with `dist/` deployed to `public_html`, or Astro at
   the repo root? Subfolder is cleaner given the PHP files already live at root. *Default if
   unanswered: subfolder.*
2. **AI crawler policy** — confirm you want to allow all AI crawlers (§10.2 trade-off: citation and
   attribution in exchange for consumption without a click). *Default if unanswered: allow all.*
3. ~~**Data expansion resource**~~ — **largely resolved 2026-08-14.** §16.7 documents a tested
   primary-source pipeline (insurer policy wording PDF → `pdftotext` → clause-level extraction,
   cross-checked against the product page). No comparator scraping needed. What still needs a human:
   downloading the IRDAI annual report (over the fetch size limit), handling the two bot-blocked
   insurers, and **signing off each record before it publishes under an IRDAI-licensed name**.
   Remaining decision is throughput, not method: **90 plan records at roughly 2 fetches + 1 review
   each.**
4. **Team roles and bios** (added 2026-09-10) — `#team` ships with visible "Role to be added"
   placeholders. Deliberately not guessed: inventing a job title under a real person's face on an
   IRDAI-licensed advisory site is a regulated claim. **Blocks nothing**, but must be filled before
   that section ports to Astro.
5. **Nav link for `#team`?** Not added — `#advisor` isn't in the nav either, so the new section
   follows the existing pattern. One-line change to both the desktop nav and mobile drawer if wanted.

### Harvest status — 2026-09-10

| | |
|---|---|
| Plans tracked in `data-raw/manifest.json` | **15** of ~90 |
| With a source URL | 13 |
| Fully extracted | 1 (`hdfcergo-optima-secure.txt`, 3,275 lines) |
| Blocked / needs manual download | See `data-raw/MANUAL-DOWNLOAD.md` |

**Highest-yield next move:** hit the five bulk-discovery index pages listed in
`manifest.json → indexPages`. Each lists many PDFs at once — potentially dozens of URLs in five
fetches, versus one search per plan.

---

## 15. Reference

- Perfecplan handover: `C:/Users/naben/Downloads/Perfecplan/web/DESIGN3_PORT_SUMMARY.md`
- Perfecplan cross-product generator: `C:/Users/naben/Downloads/Perfecplan/web/src/app/services/[slug]/[location]/page.tsx`
- Perfecplan data layer: `C:/Users/naben/Downloads/Perfecplan/web/src/lib/constants/`
- Current dataset: [js/policy-data.js](js/policy-data.js)
- Current compare engine: [js/compare.js](js/compare.js)
- Ditto category page (template target): https://joinditto.in/health-insurance/best-health-plans-in-india/
- Ditto rating framework: https://joinditto.in/articles/health-insurance/health-insurance-policy-insurer-rating-framework/
- PolicyBazaar facet patterns: https://www.policybazaar.com/health-insurance/parents/ · `/health-insurance/mumbai/` · `/health-insurance/maternity/`
- Astro docs: https://docs.astro.build

---

## 16. Appendix — verified technical reference (2026-08-14, §16.9 added 2026-09-10)

**Everything in this section was checked against primary sources on 2026-08-14 so the dev session
does not have to stop and look things up.** Three errors in the earlier draft were found and fixed
in place; they are recorded here so nobody reintroduces them.

### 16.1 ⚠ Astro 5 content collections — the API changed from Astro 4

Verified: https://docs.astro.build/en/guides/content-collections/

| | Astro 4 (**wrong** — was in the earlier draft) | Astro 5 (**correct**) |
|---|---|---|
| Config file | `src/content/config.ts` | **`src/content.config.ts`** |
| Source | `type: 'content'` / `type: 'data'` | **`loader:`** |
| Loaders | — | `glob()` / `file()` from **`astro/loaders`** |

```ts
// src/content.config.ts
import { defineCollection } from 'astro:content'
import { glob, file } from 'astro/loaders'
import { z } from 'astro/zod'

const plans = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/plans' }),
  schema: z.object({ /* §5.3 */ }),
})

const methodology = defineCollection({
  loader: file('src/data/methodology.json'),
  schema: z.object({ /* … */ }),
})

export const collections = { plans, methodology }
```

Query with `getCollection(name)` and `getEntry(collection, id)`, both from `astro:content`.

**Why this mattered:** writing the Astro 4 form would have failed at build with a non-obvious error,
and it is the very first file of the project.

### 16.2 `@astrojs/sitemap` — verified config

Verified: https://docs.astro.build/en/guides/integrations-guide/sitemap/

- **`site` in `astro.config.mjs` is mandatory** and must start with `http(s)://`, or nothing is emitted.
- Output is **`sitemap-index.xml`** plus **`sitemap-0.xml`, `sitemap-1.xml`, …**
- `entryLimit` defaults to **45,000**. At ~2,900 pages we produce one child file — the index is still
  emitted, which is the shape Search Console prefers.
- `changefreq` and `priority` are **ignored by Google** (confirmed in the docs). Set them for other
  engines if you like, but do not expect them to do anything for Google. **`lastmod` is the one that
  matters** — drive it from `lastVerified`.
- `serialize(item)` customises each entry; return `undefined` to drop one.

```js
sitemap({
  serialize(item) {
    if (/\/(health|term)-insurance\/[^/]+\/[^/]+\/$/.test(item.url)) item.priority = 0.9  // plan pages
    if (/\/glossary\//.test(item.url)) item.priority = 0.4
    if (/\/view-leads/.test(item.url)) return undefined
    return item
  },
})
```

### 16.3 schema.org — `FinancialProduct` verified

Verified: https://schema.org/FinancialProduct

- **`InsuranceAgency` is NOT a subtype of `FinancialProduct`** (the earlier draft implied it was).
  It descends from `LocalBusiness`/`FinancialService` — use it for **the business**, not the plan.
- `FinancialProduct` has no insurance-specific subtype. Its only subtypes are `BankAccount`,
  `CurrencyConversionService`, `InvestmentOrDeposit`, `LoanOrCredit`, `PaymentCard`, `PaymentService`.
  **Use `FinancialProduct` directly for plans.**
- Confirmed available: `feesAndCommissionsSpecification`, `interestRate`, `annualPercentageRate`
  (direct) · `provider`, `areaServed`, `termsOfService`, `offers`, `aggregateRating`, `review`,
  `category`, `audience`, `brand` (from `Service`) · `identifier`, `url`, `name`, `description`
  (from `Thing`).

### 16.4 Ditto plan-page template — full section order

From https://joinditto.in/health-insurance/care/care-supreme/ — **this is the spec to build the plan
template against.** Section order as shipped:

1. **Plan header** — name, score (4.41/5), key-metric boxes: sum insured range, premium band,
   entry age (adult *and* child), exit age (adult *and* child), "Download Policy Info"
2. **Sticky tab nav** — Overview · Experts' Review · Insurer Profile · Features · Waiting Period ·
   Compare · FAQ
3. **Overview** — what the plan is, plus how the score was derived
4. **Experts' Review** — *"Written by [name], Senior Writer"* + *"Reviewed by [name], Editor"* with an
   **IRDAI-Certified badge**, narrative, then separate **Pros** and **Cons** lists
5. **Insurer Profile** — four cards: founded year · CSR (3-yr avg) · network hospitals · complaints
   per 10,000 claims, with the averaging period stated inline
6. **Features** — tiered **Great / Good / additional**, each with a "Customisable" tag where the buyer
   can alter it (e.g. buy down the PED waiting period)
7. **Add-ons** — riders, each flagged Recommended or not, with the actual cap (e.g. "8 consultations
   capped at ₹500")
8. **Exclusions** — with an explicit "illustration only, policy wording governs" disclaimer
9. **Specific-illness waiting list** — the named 2-year conditions
10. **Waiting periods** — initial / specific-illness / PED as three cards, then a **"Ditto's Take"**
    verdict line ("Excellent — waiting periods on this policy are excellent")
11. **What's Missing** — an explicit, honest list of what the plan does *not* do
12. **FAQ** — each answer opening with a bare **Yes / No** before the explanation
13. **CTA** — talk to an advisor / WhatsApp
14. **Footer** — IRDAI registration number **with expiry date**, methodology disclaimer

**Three things to steal outright:**
- **"What's Missing"** as a named section. Naming the weaknesses is the whole trust play, and it maps
  onto your existing `cons[]` and `notCovered[]` fields.
- **Yes/No-first FAQ answers.** Ideal for featured snippets *and* AI extraction (§10.4).
- **A verdict line per section**, not just one at the end — each becomes independently quotable.

Fields this implies beyond §5.2: `foundedYear`, `exitAge`, `entryAgeChild`/`exitAgeChild`,
`featureTier` (great/good/other), `customisable` flag per feature, `addOns[]` with caps,
`specificIllnessList[]`, and a per-section `take` string.

### 16.5 Ditto comparison URL pattern

Pre-built plan-vs-plan pages exist and are nested under the category:

```
/health-insurance/compare-plans/care-supreme-vs-optima-secure/
/health-insurance/compare-plans/optima-restore-vs-reassure/
/health-insurance/compare-plans/care-plus-youth-vs-comprehensive/
```

They use **plan slugs without the insurer prefix**. Ours (`/compare/[category]/[planA]-vs-[planB]/`)
is equivalent and keeps all comparisons under one parent — no change needed, but note theirs pairs
each comparison page with an interactive tool on the category's `compare-plans` hub. Worth mirroring:
**one interactive hub + N static pre-built pages**, so the hub serves humans and the static pages
serve crawlers.

### 16.6 Tier A plan rosters — starting targets

Names gathered to seed the dataset. **Every one still needs verification against the policy wording
before it ships** — this is a research starting point, not data.

**Super top-up (~12):** Care Supreme Enhance · Niva Bupa Recharge · HDFC ERGO Medisure /
Optima Super Secure · Aditya Birla Super Health Plus · ICICI Lombard Activate Booster ·
Star Super Surplus. *Model the aggregate `deductible` as a first-class field — it is the product.*

**Senior citizen (~10):** Star Senior Citizens Red Carpet (⚠ 30% mandatory co-pay — among the
highest in the category, and a genuine differentiator to write about) · Niva Bupa Senior First
(more favourable co-pay) · Care Senior · ManipalCigna Prime Senior (90-day reduced wait) ·
ICICI Lombard Golden Shield (Cashless Anywhere).

**⚠ New insurers this pulls in, not currently in `policyData.brands`:** **ManipalCigna**, **Acko**,
and **Star Health** (present in `brands` but absent from `companies.health`). Each needs a logo in
`assets/logos/` and a row in the league table, or `brandFor()` will fall back to a monogram.

### 16.7 Primary-source data pipeline — TESTED AND WORKING ✅

**The plan data can be sourced from primary sources — insurer policy wordings and IRDAI — without
touching a single comparator site.** Tested end-to-end on 2026-08-14. This resolves the "who sources
the data" question from a resourcing problem into a repeatable procedure.

#### The winning route: policy wording PDFs

Policy wordings are the **authoritative legal document** — what an insurer must honour at claim time,
and what a comparator site is only paraphrasing. They are also small enough to fetch.

```bash
# 1. WebFetch the PDF. It fails to parse but SAVES the file locally and prints the path.
#    (verified: 610 KB for Optima Secure — well under WebFetch's 10 MB ceiling)

# 2. Extract with pdftotext — ships with Git Bash at /mingw64/bin/pdftotext
pdftotext -layout "<saved-pdf-path>" out.txt
#    → verified: 3,275 lines / 186 KB of clause-numbered text
```

**Verified output quality** on HDFC ERGO Optima Secure — real clauses, real numbers, real
IRDAI-standard exclusion codes:

- `Def. 8. Co-Payment` · `Def. 35. Pre-Existing Disease` · `Def. 41. Room Rent` · `Def. 30. Waiting Period`
- `Section C.1.a — Pre-Existing Diseases`: **36 months**, with buy-down options to **24 months**
- `Pre-Existing Diseases (Code- Excl01)` — the IRDAI standard exclusion codes are present, which
  means exclusions can be **normalised across insurers** rather than hand-mapped
- Section C.1 Waiting Periods / C.2 Standard Exclusions structure

**Cross-validation works:** HDFC ERGO's product page said PED = 36 months; the policy wording
confirms 36 months with buy-down. Two independent primary sources agreeing is exactly the
verification standard §11 requires.

> ⚠ `pdftotext` works, but **`pdftoppm` is not installed**, so the Read tool's native PDF mode fails
> with a poppler error. Use `pdftotext -layout` via Bash, not Read, for PDFs.

#### Insurer product pages — roughly half are bot-blocked

| Insurer | Result |
|---|---|
| **HDFC ERGO** | ✅ Full spec extracted — sum insured ladder, room rent, co-pay, all three waiting periods, restoration, 60/180 pre-post, 16,000+ network, riders |
| **Care** | ❌ **403 Forbidden** — WAF blocked |
| **Star Health** | ❌ **403 Forbidden** — WAF blocked |
| **Niva Bupa** | ⚠ 404 on the guessed URL; reachability unknown |

**Do not attempt to work around the 403s.** Those are deliberate access controls. For blocked
insurers use the policy wording PDF route instead (often served from a different host or CDN that
isn't behind the same WAF), or have a human download the PDF into `docs/policy-wordings/` in the
repo, where it can be read locally with no fetching at all. That second path works for **every**
insurer regardless of bot protection and should be the default for anything blocked.

#### IRDAI — index pages yes, annual report PDFs no

- ✅ `https://irdai.gov.in/annual-reports` fetches fine and lists **27 reports** with direct PDF URLs.
- ❌ The PDFs are too big: **FY2024-25 is 12.2 MB**, over WebFetch's **10 MB** limit. FY2023-24 is
  15.1 MB. (FY2022-23 at 3.4 MB would fit, but it's stale.)
  **→ A human must download the annual report; then `pdftotext` it locally.**
- 🔴 **Data-integrity finding: the latest IRDAI annual report is FY2024-25, published 30 Dec 2025.
  There is no FY2025-26 annual report yet** — IRDAI publishes around December.

  The current dataset states `period: 'FY 2024–26 (3-year average)'` and attributes it to the *IRDAI
  Annual Report*. **FY2026 figures cannot have come from an IRDAI annual report, because none exists.**
  They would have to come from insurer quarterly/annual **public disclosures (Form NL-*)**, which are
  published faster. Either the attribution needs correcting to name both sources, or the period needs
  restating. On a site that puts an IRDAI licence in the footer and repeats these numbers across
  ~2,900 pages, this is worth resolving before launch. Ditto states the same FY24–FY26 window, so the
  convention may be defensible — but the source line should say exactly where each number came from.

#### 🎯 Bonus finding — the glossary is nearly free

A single policy wording contained **73 numbered definitions** (`Def. 1`–`Def. 73`) under a heading
literally called **"A.1.1 Standard Definitions"**, plus **"C.2 Standard Exclusions"** carrying the
IRDAI standard exclusion codes **Excl01 – Excl18** (all 18 verified present).

These are **IRDAI-mandated and uniform across every health insurer.** That changes the economics of
two things in this plan:

| Was planned as | Actually is |
|---|---|
| 250 glossary terms, original writing, Phase 2 | ~73 authoritative definitions **per wording**, already IRDAI-standardised — sourced from PDFs you are downloading anyway |
| Exclusions hand-mapped per insurer | Normalise on `Excl01`–`Excl18`, so exclusions become **directly comparable across insurers** |

Sample of what one document yields: Accident · Any One Illness · AYUSH Hospital · AYUSH Day Care
Centre · Cashless Facility · Condition Precedent · Congenital Anomaly · Co-Payment · Cumulative Bonus
· Day Care Centre · Day Care Treatment · Deductible · Dental Treatment · Disclosure of Information
Norm · Domiciliary Hospitalization · Emergency Care · Grace Period · Hospital · Hospitalization ·
Illness …

**Two consequences worth acting on:**

1. The glossary tier stops being 250 pages of original writing and becomes extraction plus an
   editorial pass — write the plain-English gloss and the "why it matters to you" angle on top of
   the legal definition. That is the part comparators do badly and where you differentiate.
2. Because the definitions are standardised, the `DefinedTerm` / `DefinedTermSet` JSON-LD (§10.5)
   describes a **real, citable standard** rather than site-specific jargon — which is exactly the
   shape AI assistants prefer to cite.

**Do not paste the legal text verbatim as the whole page.** It is IRDAI-standard wording reproduced
by every insurer, so a page that is only the definition is duplicate content. The definition is the
anchor; the plain-English explanation and the plan-specific implications are the page.

#### Recommended procedure per plan

1. Fetch the insurer product page for the marketing-level summary (sum insured ladder, network count,
   headline benefits). If 403 → skip to step 2.
2. Fetch the **policy wording PDF** → `pdftotext -layout` → extract waiting periods, room rent, co-pay,
   sub-limits, exclusions **with clause numbers**.
3. Cross-check the two. Disagreement means read the wording again — it governs.
4. Record `sources[]` with both URLs and `lastVerified` with today's date.
5. CSR / complaints / solvency come from IRDAI separately, **not** from the insurer's own page.

### 16.8 Still requires a human

- **IRDAI annual report PDFs** — over the fetch size limit. Download once, extract locally.
- **Care and Star Health product pages** — bot-blocked; use policy wordings or manual download.
- **Live premium quotes** — per-profile and volatile. The site correctly shows illustrations, not
  quotes, so this is by design and needs no sourcing.
- **Final sign-off on every plan record.** The pipeline gets you accurate raw clauses; a licensed
  human should still approve what gets published under an IRDAI-licensed advisor's name.

Everything else on the critical path is now automatable. Dev can proceed.

### 16.9 Image optimisation — tested recipe

**No ImageMagick on this machine, but `ffmpeg` is installed** and handles everything needed,
including alpha. Proven 2026-09-10 on the team portraits: **17.5 MB → 151 KB (99.2% smaller)** with
the transparent cutouts intact.

```bash
# Centre-crop to a common aspect, downscale, encode as WebP with alpha preserved.
ffmpeg -v error -y -i in.png \
  -vf "crop=W:H:X:Y,scale=800:1000:flags=lanczos" \
  -c:v libwebp -lossless 0 -quality 88 -compression_level 6 out.webp
```

**Reading PNG dimensions and alpha without any tooling** — the IHDR header is at a fixed offset:

```bash
node -e "const b=require('fs').readFileSync('x.png');
console.log(b.readUInt32BE(16)+'x'+b.readUInt32BE(20),'type',b[25])"
# type 6 = RGBA (transparent cutout) · 2 = RGB
```

All three portraits on the site are **type 6 transparent cutouts**, which is why the design works:
`.advisor-portrait img` / `.team-card img` draw only a rounded border, and the dark section
background shows through the subject.

**Convention going forward** — recorded in `CLAUDE.md` as an invariant:

| | |
|---|---|
| Ships | `assets/**/[name].webp`, sized for actual render dimensions at ~2× |
| Kept | Camera originals in an `originals/` subfolder, **gitignored** |
| Never | The camera original in the page |

**Outstanding targets** (all hurt the LCP that §9.1 depends on):

| File | Size | Renders at | Action |
|---|---|---|---|
| `my-insurance-bro-logo.png` / `assets/images/logo.png` | **730 KB** | 134×136, every page + favicon | 🔴 Optimise — see §0a |
| `assets/images/chief-advisor.png` | **2.3 MB** | ~380 px wide | 🟠 Optimise, and it's the **LCP element** (`<link rel=preload>` in `<head>`) |
| `assets/images/team/*.webp` | 151 KB total | 364×455 | ✅ Done |

In Astro this becomes largely automatic — `astro:assets` (`<Image />`) does the resize/format work at
build time. But the **source** files should still be sane; a 730 KB logo means 730 KB read on every
build, and `astro:assets` will not crop for you.
