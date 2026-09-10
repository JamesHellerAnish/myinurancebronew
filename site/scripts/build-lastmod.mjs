/**
 * Build the URL → lastmod map the sitemap uses. SEO_ASTRO_PLAN.md §9.1 and §16.2.
 *
 * §16.2's finding is that `changefreq` and `priority` are ignored by Google and `lastmod` is
 * the one sitemap signal that still counts — and only if it is honest. So it comes from each
 * record's own `lastVerified`, not from the build clock: a rebuild that changed nothing must
 * not tell Search Console the page is new.
 *
 * This runs as part of the prebuild hook, before astro.config reads the file. It reads the
 * generated content JSON straight off disk because @astrojs/sitemap's `serialize` runs
 * outside the content-collection API.
 *
 * Pages with no meaningful date (the home page, hubs) are deliberately absent from the map
 * and ship no lastmod at all, which is better than a fabricated one.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const siteRoot = join(here, '..')
const plansDir = join(siteRoot, 'src', 'content', 'plans')
const outFile = join(siteRoot, 'src', 'data', 'lastmod.json')

/** Mirrors categoryPath() in src/lib/plans.ts. */
const CATEGORY_PATHS = {
  term: 'term-insurance',
  health: 'health-insurance',
  'super-topup': 'super-top-up',
  'senior-health': 'senior-citizen-health-insurance',
  'critical-illness': 'critical-illness-insurance',
  'personal-accident': 'personal-accident-insurance',
  'hospital-cash': 'hospital-cash-insurance',
}

const map = {}
let skipped = 0

for (const file of readdirSync(plansDir).filter((f) => f.endsWith('.json'))) {
  const plan = JSON.parse(readFileSync(join(plansDir, file), 'utf8'))

  if (!plan.lastVerified) {
    skipped++
    continue
  }

  const path = `/${CATEGORY_PATHS[plan.category]}/${plan.insurerSlug}/${plan.slug}/`
  map[path] = new Date(plan.lastVerified).toISOString()
}

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, JSON.stringify(map, null, 2) + '\n')

console.log(
  `[lastmod] ${Object.keys(map).length} dated URL(s)` +
    (skipped ? `, ${skipped} record(s) with no lastVerified` : ''),
)
