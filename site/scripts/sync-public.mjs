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
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const siteRoot = join(here, '..')
const repoRoot = join(siteRoot, '..')
const publicDir = join(siteRoot, 'public')

/** Directories copied wholesale from the repo root. */
const DIRS = ['css', 'assets']

/**
 * Individual files. The PHP endpoints and .htaccess are deliberately listed one by one
 * rather than globbed — CLAUDE.md invariant 3 keeps customer PII out of the deploy, and a
 * glob is exactly how *-config.php or a stray leads.json ends up shipped by accident.
 */
const FILES = ['send-mail.php', 'lead-store.php', 'view-leads.php', '.htaccess']

mkdirSync(publicDir, { recursive: true })

const copied = []
const skipped = []

for (const dir of DIRS) {
  const from = join(repoRoot, dir)
  if (!existsSync(from)) {
    skipped.push(dir)
    continue
  }
  cpSync(from, join(publicDir, dir), { recursive: true })
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
