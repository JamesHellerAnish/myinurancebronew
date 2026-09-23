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
  { file: 'favicon-192.png', px: 192, use: 'rel="icon", and the Android home-screen icon' },
  // The tab slot is 16 or 32 CSS px. Serving the 192 there made the browser downscale
  // 13.7 KB by 6× for a 16px mark — wasteful, and mushy: this badge is a ring of text
  // around a shield, so the small sizes need rendering from the master, not resampling.
  { file: 'favicon-32.png', px: 32, use: 'rel="icon" 32×32 — the browser tab' },
  { file: 'favicon-16.png', px: 16, use: 'rel="icon" 16×16 — tab at 1× DPI' },
]

/**
 * Sizes packed into favicon.ico, smallest first as the format expects.
 *
 * Why an .ico at all: browsers, feed readers and link crawlers request /favicon.ico from
 * the site root unconditionally, whether or not the HTML declares an icon. Without one that
 * is a 404 on every page load, and some clients show a blank page icon rather than falling
 * back to the declared PNG.
 */
const ICO_SIZES = [16, 32, 48]

/** Transparent padding for `fit: contain`. The badge is round on a clear background. */
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 }

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
    .resize(px, px, { fit: 'contain', background: TRANSPARENT })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer()

  writeFileSync(out, png)
  console.log(`[logo] ${file.padEnd(28)} ${px}×${px}  ${(png.length / 1024).toFixed(1).padStart(6)} KB  — ${use}`)
}

/**
 * Write a multi-resolution favicon.ico.
 *
 * ICO is a 6-byte header, then one 16-byte directory entry per image, then the image data.
 * The payloads here are whole PNG files rather than raw DIBs — an ICO may embed PNG
 * directly, which every browser from IE11 on reads, and it avoids hand-rolling a BMP
 * encoder with its bottom-up rows and AND-mask padding.
 *
 * `palette: true` is deliberately not used for these: quantising a 16px badge with
 * anti-aliased text around its rim is where the mark turns to mush.
 */
async function writeIco(source, sizes, out) {
  const pngs = []

  for (const px of sizes) {
    pngs.push(
      await sharp(source)
        .resize(px, px, { fit: 'contain', background: TRANSPARENT })
        .png({ compressionLevel: 9 })
        .toBuffer(),
    )
  }

  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // 1 = icon, 2 = cursor
  header.writeUInt16LE(pngs.length, 4)

  const entries = []
  let offset = 6 + pngs.length * 16

  pngs.forEach((data, i) => {
    const px = sizes[i]
    const entry = Buffer.alloc(16)
    // 0 means 256 in this field; every size here is smaller, but keep the rule explicit.
    entry.writeUInt8(px >= 256 ? 0 : px, 0)
    entry.writeUInt8(px >= 256 ? 0 : px, 1)
    entry.writeUInt8(0, 2) // palette entries, 0 = no colour table
    entry.writeUInt8(0, 3) // reserved
    entry.writeUInt16LE(1, 4) // colour planes — advisory for a PNG payload
    entry.writeUInt16LE(32, 6) // bits per pixel — likewise
    entry.writeUInt32LE(data.length, 8)
    entry.writeUInt32LE(offset, 12)
    entries.push(entry)
    offset += data.length
  })

  const ico = Buffer.concat([header, ...entries, ...pngs])
  writeFileSync(out, ico)
  return ico.length
}

// At the repo root, not in assets/images/: /favicon.ico is a fixed, unnegotiable path.
// sync-public.mjs copies it into the build alongside the PHP endpoints.
const icoPath = join(here, '..', '..', 'favicon.ico')
const icoBytes = await writeIco(master, ICO_SIZES, icoPath)
console.log(
  `[logo] ${'favicon.ico'.padEnd(28)} ${ICO_SIZES.join('/')}px  ` +
    `${(icoBytes / 1024).toFixed(1).padStart(6)} KB  — /favicon.ico at the site root`,
)
