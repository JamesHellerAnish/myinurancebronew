/**
 * Generate the display-size logo copies from the full-resolution master.
 *
 * The master is a 4096×4096 badge — 1.25 MB, for a mark that renders at 134×136 in the
 * navbar and as a favicon. Shipping it raw put ~30× the needed pixels on every page and
 * worked directly against the LCP the whole SEO plan depends on (SEO_ASTRO_PLAN.md §9.1).
 *
 * This is the same recipe as the team portraits (CLAUDE.md invariant 6): the camera-scale
 * original stays as the source of truth, an optimised sibling is what actually ships.
 *
 *   node scripts/make-logo-sizes.mjs
 *
 * Run it after replacing the master. Outputs are committed source assets, so this is a
 * hand-run script, not a build hook.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const here = dirname(fileURLToPath(import.meta.url))
const images = join(here, '..', '..', 'assets', 'images')

/** The untouched original. Kept in the repo, never referenced by a page, never deployed. */
const MASTER = join(images, 'originals', 'my-insurance-bro-logo-4096.png')

/**
 * Every size a page actually asks for.
 *
 * The logo renders at 134×136, so 272 is the 2× copy — a retina navbar with no waste.
 * 180 is Apple's touch-icon size; 192 is the PNG favicon size Chrome and Android install
 * from. The badge is square, so all three are square crops of the same art.
 */
const SIZES = [
  { file: 'my-insurance-bro-logo.png', px: 272, use: 'navbar and footer, 2× of 134×136' },
  { file: 'apple-touch-icon.png', px: 180, use: 'rel="apple-touch-icon"' },
  { file: 'favicon-192.png', px: 192, use: 'rel="icon"' },
]

if (!existsSync(MASTER)) {
  console.error(
    `[logo] master not found: ${MASTER}\n` +
      '       Put the full-resolution logo there first — it is the source of truth.',
  )
  process.exit(1)
}

const master = readFileSync(MASTER)
const { width, height } = await sharp(master).metadata()
console.log(`[logo] master ${width}×${height}, ${(master.length / 1024).toFixed(0)} KB`)

for (const { file, px, use } of SIZES) {
  const out = join(images, file)

  const png = await sharp(master)
    .resize(px, px, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer()

  writeFileSync(out, png)
  console.log(`[logo] ${file.padEnd(28)} ${px}×${px}  ${(png.length / 1024).toFixed(1).padStart(6)} KB  — ${use}`)
}
