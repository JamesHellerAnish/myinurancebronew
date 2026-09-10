/**
 * Copy the legacy site's static assets and PHP endpoints into site/public/.
 *
 * SEO_ASTRO_PLAN.md §4.3 — the Hostinger constraint. Anything in public/ is copied to
 * dist/ byte-for-byte, so the PHP lead pipeline survives the migration untouched. The lead
 * form contract is frozen (CLAUDE.md invariant 1): action="send-mail.php" with fields
 * name, phone, email, product, preferred_time.
 *
 * These copies are generated, not authored — site/public/ is gitignored. The originals at
 * the repo root stay the single source of truth, so there is no second copy to drift.
 *
 * Runs automatically via the `prebuild`/`predev` npm hooks.
 */
import { cpSync, mkdirSync, existsSync, copyFileSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const siteRoot = join(here, '..')
const repoRoot = join(siteRoot, '..')
const publicDir = join(siteRoot, 'public')

/**
 * Directories copied wholesale from the repo root.
 *
 * `js/` is here for the legacy home page only — see the index.html note in FILES. When the
 * home page is ported to Astro (§12 step 7) and the compare engine becomes an island, these
 * scripts stop being served as-is and this entry goes.
 */
const DIRS = ['css', 'assets', 'js']

/**
 * Directory names never copied, at any depth.
 *
 * `originals/` holds full-resolution masters — the 4096×4096 logo and the 9.8 MB portrait
 * sources (CLAUDE.md invariant 6). They are the source of truth and belong in the repo, but
 * nothing on the site requests them, so deploying them would upload megabytes no page reads.
 * The optimised siblings next to them are what ship.
 */
const EXCLUDED_DIRS = new Set(['originals'])

/**
 * Individual files. The PHP endpoints and .htaccess are deliberately listed one by one
 * rather than globbed — CLAUDE.md invariant 3 keeps customer PII out of the deploy, and a
 * glob is exactly how *-config.php or a stray leads.json ends up shipped by accident.
 */
const FILES = [
  'send-mail.php',
  'lead-store.php',
  'view-leads.php',
  '.htaccess',

  // index.html was copied here as an interim `/` while the home page was unported. It is
  // src/pages/index.astro now, so copying the legacy file would put a second index.html in
  // the build racing the generated one for the same URL.
]

mkdirSync(publicDir, { recursive: true })

const copied = []
const skipped = []

for (const dir of DIRS) {
  const from = join(repoRoot, dir)
  if (!existsSync(from)) {
    skipped.push(dir)
    continue
  }
  cpSync(from, join(publicDir, dir), {
    recursive: true,
    filter: (src) => !EXCLUDED_DIRS.has(basename(src)),
  })
  copied.push(`${dir}/`)
}

for (const file of FILES) {
  const from = join(repoRoot, file)
  if (!existsSync(from)) {
    skipped.push(file)
    continue
  }
  copyFileSync(from, join(publicDir, file))
  copied.push(file)
}

console.log(`[sync-public] copied: ${copied.join(' · ')}`)
if (skipped.length) console.log(`[sync-public] not found, skipped: ${skipped.join(' · ')}`)
