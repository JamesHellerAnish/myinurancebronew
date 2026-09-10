/**
 * Migrate js/policy-data.js into Astro content collections.
 *
 * SEO_ASTRO_PLAN.md §5 / §16.1. policy-data.js is a plain `var policyData = {...}`
 * script with no module wrapper, so it is read and evaluated rather than imported.
 *
 * Idempotent: rerun it any time policy-data.js changes. It overwrites the generated
 * records and leaves anything hand-authored alone (nothing is hand-authored yet).
 *
 * Source URLs are pulled from data-raw/manifest.json where the harvest has found one,
 * so migrated records keep a real citation trail instead of an invented one. Every
 * record lands as verificationStatus: 'migrated' — never 'verified'. Promotion to
 * 'verified' is a human decision (§16.8), not something this script can do.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const siteRoot = join(here, '..')
const repoRoot = join(siteRoot, '..')

const contentDir = join(siteRoot, 'src', 'content')
const dataDir = join(siteRoot, 'src', 'data')

/** Slugify an insurer or plan name into a URL segment. §6.1: lowercase, hyphenated. */
function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function loadPolicyData() {
  const src = readFileSync(join(repoRoot, 'js', 'policy-data.js'), 'utf8')
  // The file assigns to a bare `var`. Evaluate it in an isolated function scope and
  // hand the object back, rather than polluting anything or parsing it by hand.
  const fn = new Function(`${src}; return policyData;`)
  return fn()
}

function loadManifest() {
  try {
    const raw = readFileSync(join(repoRoot, 'data-raw', 'manifest.json'), 'utf8')
    const manifest = JSON.parse(raw)
    return new Map((manifest.plans ?? []).map((p) => [p.id, p]))
  } catch {
    console.warn('[migrate] no data-raw/manifest.json — records will carry no sources')
    return new Map()
  }
}

function sourcesFor(entry) {
  if (!entry) return []
  const out = []
  if (entry.sourceUrl) {
    out.push({
      label: `${entry.insurer} — ${entry.name} policy wording`,
      url: entry.sourceUrl,
    })
  }
  if (entry.productPage) {
    out.push({
      label: `${entry.insurer} — ${entry.name} product page`,
      url: entry.productPage,
    })
  }
  return out
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

// ── Run ──────────────────────────────────────────────────────────────────────
const policyData = loadPolicyData()
const manifest = loadManifest()

// Wipe generated collections so a renamed plan does not leave an orphan behind.
for (const collection of ['plans', 'insurers', 'personas']) {
  rmSync(join(contentDir, collection), { recursive: true, force: true })
}

const counts = { plans: 0, insurers: 0, personas: 0 }
const missingSources = []

// ── Plans ────────────────────────────────────────────────────────────────────
for (const [productKey, product] of Object.entries(policyData.products)) {
  for (const plan of product.plans) {
    const manifestEntry = manifest.get(plan.id)
    const sources = sourcesFor(manifestEntry)

    if (sources.length === 0) missingSources.push(plan.id)

    const record = {
      ...plan,
      category: plan.category ?? productKey,
      slug: slugify(plan.name),
      insurerSlug: slugify(plan.insurer),

      verificationStatus: 'migrated',
      sources,
      verificationNote:
        'Migrated from js/policy-data.js. Figures predate the §16.7 primary-source ' +
        'pipeline and have not been re-read against the policy wording. Not publishable ' +
        'until re-verified and signed off (§16.8).',
    }

    // `icon` is a presentation concern from the old compare engine, not plan data.
    delete record.icon

    writeJson(join(contentDir, 'plans', `${plan.id}.json`), record)
    counts.plans++
  }
}

// ── Insurers ─────────────────────────────────────────────────────────────────
// brands is the branding registry; companies carries the league-table metrics.
// brandFor() reconciles the two at runtime today (CLAUDE.md invariant 5); here the
// reconciliation happens once, at migration time, into a single record per insurer.
const companyMetrics = new Map()
for (const [kind, rows] of Object.entries(policyData.companies)) {
  for (const row of rows) {
    companyMetrics.set(row.name, { ...row, kind: kind === 'term' ? 'life' : 'health' })
  }
}

for (const [name, brand] of Object.entries(policyData.brands)) {
  const metrics = companyMetrics.get(name)
  const record = {
    name,
    slug: slugify(name),
    kind: metrics?.kind ?? (/(life|prudential)/i.test(name) ? 'life' : 'health'),
    logo: brand.logo,
    accent: brand.accent,
    initials: brand.initials,
  }

  if (metrics) {
    Object.assign(record, {
      score: metrics.score,
      csr: metrics.csr,
      complaints: metrics.complaints,
      solvency: metrics.solvency,
      businessCr: metrics.businessCr,
    })
  }

  writeJson(join(contentDir, 'insurers', `${record.slug}.json`), record)
  counts.insurers++
}

// ── Personas ─────────────────────────────────────────────────────────────────
// Only the 3 that exist today. §7 expands these to 16; the other 13 are hand-authored
// content, not something a migration can synthesise — but they are authored in
// js/policy-data.js like these three, and arrive here the same way.
//
// The panel copy used to live only in index.html's markup, which is why these records were
// once empty. It is in the data file now, so the home page renders them from the collection.
for (const persona of policyData.personas) {
  const record = {
    key: persona.key,
    label: persona.label,
    ageRange: persona.age,

    // Presentation hints for the picker tile. They belong with the copy: the icon is part
    // of how the persona reads, and splitting them means editing two files to add one.
    icon: persona.icon ?? 'target',
    tone: persona.tone ?? '',
    teaser: persona.teaser ?? '',

    headline: persona.headline ?? '',
    intro: persona.intro ?? '',

    pains: persona.pains ?? [],
    planRecommendations: persona.planRecommendations ?? [],
    faqs: persona.faqs ?? [],
    relatedPersonas: persona.relatedPersonas ?? [],
    searchIntent: persona.searchIntent ?? [],
  }
  writeJson(join(contentDir, 'personas', `${persona.key}.json`), record)
  counts.personas++
}

// ── Shared data (not collections — read directly by templates) ───────────────
writeJson(join(dataDir, 'meta.json'), policyData.meta)
writeJson(join(dataDir, 'methodology.json'), policyData.methodology)
writeJson(join(dataDir, 'profiles.json'), policyData.profiles)
writeJson(join(dataDir, 'compare-rows.json'), policyData.compareRows)

// ── Report ───────────────────────────────────────────────────────────────────
console.log(
  `[migrate] ${counts.plans} plans · ${counts.insurers} insurers · ${counts.personas} personas`,
)
console.log(`[migrate] all ${counts.plans} plans written as verificationStatus: 'migrated'`)

if (missingSources.length) {
  console.log(
    `[migrate] ${missingSources.length} plan(s) have no source URL in data-raw/manifest.json:`,
  )
  for (const id of missingSources) console.log(`           · ${id}`)
}
