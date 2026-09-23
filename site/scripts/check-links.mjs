/**
 * Link audit over the built site. SEO_ASTRO_PLAN.md §9.3 — the internal mesh is what makes a
 * large page set crawlable rather than orphaned, so a dead link in it is not cosmetic.
 *
 *   node scripts/check-links.mjs
 *
 * Checks four things a broken link can hide in:
 *   1. internal hrefs        — does the target page exist in dist/
 *   2. asset references      — src= on img/script/link, and CSS url()
 *   3. fragment targets      — does #id exist on the page it points at
 *   4. orphans               — pages nothing links to
 *
 * Exits non-zero if anything is broken, so it can gate a deploy.
 */
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const dist = join(here, '..', 'dist')

if (!existsSync(dist)) {
  console.error('[links] no dist/ — run a build first')
  process.exit(1)
}

/** Every built HTML page, as a site-absolute URL path. */
const pages = new Map()
;(function walk(dir, base) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) walk(full, `${base}/${entry.name}`)
    else if (entry.name === 'index.html') pages.set(`${base}/`, full)
    else if (entry.name.endsWith('.html')) pages.set(`${base}/${entry.name}`, full)
  }
})(dist, '')

/** Ids present on each page, for fragment checking. */
const idsByPage = new Map()
for (const [url, file] of pages) {
  const html = readFileSync(file, 'utf8')
  const ids = new Set()
  for (const m of html.matchAll(/\sid="([^"]+)"/g)) ids.add(m[1])
  idsByPage.set(url, ids)
}

function exists(path) {
  const asDir = join(dist, path, 'index.html')
  const asFile = join(dist, path)
  if (existsSync(asDir)) return true
  return existsSync(asFile) && statSync(asFile).isFile()
}

const broken = []
const linkedTo = new Set(['/'])
let checked = 0

for (const [url, file] of pages) {
  const html = readFileSync(file, 'utf8')

  // href on <a> and <link>, src on <img>/<script>
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const raw = m[1]

    // Skip protocol, mail, tel, data URIs and bare fragments handled below.
    if (/^(https?:|mailto:|tel:|data:|\/\/)/.test(raw)) continue

    const [path, hash] = raw.split('#')
    const target = path === '' ? url : path.startsWith('/') ? path : resolve('/', dirname(url), path)

    checked++

    if (path !== '') {
      linkedTo.add(target)
      if (!exists(target)) {
        broken.push({ type: 'missing page/asset', from: url, link: raw })
        continue
      }
    }

    // Fragment: only checkable when the target is a page we built.
    if (hash) {
      const ids = idsByPage.get(target.endsWith('/') ? target : `${target}/`)
      if (ids && !ids.has(hash)) {
        broken.push({ type: 'missing #anchor', from: url, link: raw })
      }
    }
  }
}

// url() references inside the shipped CSS — fonts and background images live here, and a
// wrong path fails silently in the browser rather than erroring.
for (const cssFile of ['css/style.css', 'css/components.css', 'css/pages.css', 'css/fonts.css']) {
  const full = join(dist, cssFile)
  if (!existsSync(full)) continue

  for (const m of readFileSync(full, 'utf8').matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) {
    const raw = m[1]
    if (/^(https?:|data:|\/\/)/.test(raw)) continue

    checked++
    const target = raw.startsWith('/') ? raw : resolve('/', dirname(`/${cssFile}`), raw)
    if (!exists(target)) broken.push({ type: 'missing CSS asset', from: cssFile, link: raw })
  }
}

const orphans = [...pages.keys()].filter((url) => url !== '/' && !linkedTo.has(url))

console.log(`[links] ${pages.size} pages, ${checked} references checked`)

if (broken.length > 0) {
  console.log(`\n[links] ❌ ${broken.length} broken:\n`)
  for (const b of broken) console.log(`  ${b.type.padEnd(20)} ${b.link}\n${' '.repeat(23)}on ${b.from}`)
} else {
  console.log('[links] ✅ no broken links')
}

if (orphans.length > 0) {
  console.log(`\n[links] ⚠ ${orphans.length} page(s) nothing links to (crawlable only via sitemap):`)
  for (const o of orphans) console.log(`  ${o}`)
}

process.exit(broken.length > 0 ? 1 : 0)
