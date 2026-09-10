/**
 * Re-encode the chief advisor portrait to a display-size WebP.
 *
 * SEO_ASTRO_PLAN.md §13 flagged this as High risk and the CWV measurement in §0b confirmed
 * it: the PNG is 2,341,112 bytes — 84% of the whole asset directory — for an image that
 * renders at 404×505 on desktop and 274×342 on mobile. Eleven times the pixels needed, above
 * the fold on mobile, at fetchpriority="high". On Lighthouse's Slow 4G that one file is
 * 11.7 seconds of transfer.
 *
 * Same recipe as the team portraits (CLAUDE.md invariant 6): the full-resolution original
 * stays as the source of truth in assets/images/originals/, an optimised sibling ships.
 *
 *   node scripts/make-portrait.mjs
 *
 * 880 px wide covers both display sizes at 2× DPR (desktop needs 808, mobile 548) without
 * paying for the 1471 px the original carries. Height follows the source aspect ratio
 * exactly, so the <img> width/height attributes stay truthful and CLS stays at zero.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const here = dirname(fileURLToPath(import.meta.url))
const images = join(here, '..', '..', 'assets', 'images')

const MASTER = join(images, 'originals', 'chief-advisor.png')
const OUT = join(images, 'chief-advisor.webp')
const WIDTH = 880

if (!existsSync(MASTER)) {
  console.error(
    `[portrait] master not found: ${MASTER}\n` +
      '           Move the full-resolution PNG there first — it is the source of truth.',
  )
  process.exit(1)
}

const master = readFileSync(MASTER)
const meta = await sharp(master).metadata()

// Derive the height rather than hard-coding it, so a re-shot portrait with a different
// aspect ratio cannot silently letterbox or stretch.
const height = Math.round((WIDTH * meta.height) / meta.width)

const webp = await sharp(master)
  .resize(WIDTH, height, { fit: 'cover' })
  .webp({ quality: 88 })
  .toBuffer()

writeFileSync(OUT, webp)

const saved = 1 - webp.length / master.length
console.log(
  `[portrait] ${meta.width}×${meta.height} ${(master.length / 1024 / 1024).toFixed(2)} MB ` +
    `→ ${WIDTH}×${height} ${(webp.length / 1024).toFixed(1)} KB ` +
    `(${(saved * 100).toFixed(1)}% smaller)`,
)
console.log(`[portrait] set width="${WIDTH}" height="${height}" on the <img>`)
