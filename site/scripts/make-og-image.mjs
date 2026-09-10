/**
 * Generate the default Open Graph card at assets/images/og-default.png (1200×630).
 *
 * SEO_ASTRO_PLAN.md §0b defect 3: every page points og:image at a file that did not exist,
 * so every share preview fell back to whatever the platform scraped. SEO.astro deliberately
 * makes og:image un-unsettable, which only helps if the default is actually on disk.
 *
 * The card is authored here rather than dropped in as a mystery binary so the wording and
 * the brand colours can be re-derived. Colours come from css/style.css:
 *   --color-ink #0B1220 · --color-accent #6D5AE6 · --color-primary #FFEB3C
 *
 * The output is a committed source asset (assets/ is copied into site/public/ by
 * sync-public.mjs), so this script is run by hand, not by a build hook:
 *
 *   node scripts/make-og-image.mjs
 *
 * No logo is drawn: the logo commits on origin/main are unmerged (§0a blocker 1) and the
 * file in the tree is the superseded 23 KB one. Add the mark here once that merge lands.
 */
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const here = dirname(fileURLToPath(import.meta.url))
const out = join(here, '..', '..', 'assets', 'images', 'og-default.png')

const W = 1200
const H = 630

// System font stack — librsvg resolves the first family it has installed. Every name here
// is a sans-serif, so a miss degrades to a different sans rather than to a serif.
const SANS = 'Segoe UI, Inter, Helvetica Neue, Arial, sans-serif'

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="0.78" cy="0.18" r="0.72">
      <stop offset="0%" stop-color="#6D5AE6" stop-opacity="0.55"/>
      <stop offset="60%" stop-color="#6D5AE6" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#6D5AE6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.08" cy="0.92" r="0.6">
      <stop offset="0%" stop-color="#FFEB3C" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#FFEB3C" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="#0B1220"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>

  <!-- accent rule, echoing the site's yellow-on-ink -->
  <rect x="88" y="150" width="96" height="8" rx="4" fill="#FFEB3C"/>

  <text x="88" y="268" font-family="${SANS}" font-size="82" font-weight="700" fill="#FFFFFF">
    Myinsurancebro
  </text>

  <text x="88" y="352" font-family="${SANS}" font-size="42" font-weight="600" fill="#C7CEDB">
    Term &amp; health insurance, reviewed honestly
  </text>

  <text x="88" y="424" font-family="${SANS}" font-size="30" font-weight="400" fill="#8B94A6">
    Plan-by-plan cover, exclusions, claim settlement ratios
  </text>
  <text x="88" y="470" font-family="${SANS}" font-size="30" font-weight="400" fill="#8B94A6">
    and indicative premiums — illustrations, never quotes.
  </text>

  <text x="88" y="556" font-family="${SANS}" font-size="26" font-weight="600" fill="#FFEB3C" letter-spacing="1.5">
    IRDAI-LICENSED ADVISOR
  </text>
  <text x="${W - 88}" y="556" text-anchor="end" font-family="${SANS}" font-size="26" font-weight="400" fill="#8B94A6">
    myinsurancebro.com
  </text>
</svg>`

const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer()
writeFileSync(out, png)

console.log(`[og] wrote ${out} — ${W}×${H}, ${(png.length / 1024).toFixed(1)} KB`)
