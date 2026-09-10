/**
 * Extract IRDAI standard definitions from the harvested policy wordings.
 *
 * SEO_ASTRO_PLAN.md §1027 is explicit that the glossary is **not original writing**: the legal
 * definitions are lifted from the wordings (~73 IRDAI-standard definitions per document), and
 * the editorial work is the plain-English gloss and the "why it matters" layered on top.
 *
 * So this script only ever produces the legal half, with its provenance. The editorial half
 * is hand-authored in data-raw/glossary/editorial.json, and build-glossary.mjs merges them.
 * Keeping them in separate files is the point — it makes it impossible to quietly paraphrase
 * a regulated definition and lose track of whether a sentence came from the insurer or from us.
 *
 *   node scripts/extract-glossary.mjs
 *
 * Output: data-raw/glossary/definitions.json (committed — it is the deliverable of a harvest).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(here, '..', '..')
const rawDir = join(repoRoot, 'data-raw')
const outDir = join(rawDir, 'glossary')

/**
 * Wordings that number their definitions in a parseable "N. Term: means …" form, with the
 * provenance to cite. Add a source here once its extract is confirmed to use that shape —
 * several wordings run the definitions as prose and need a different reader.
 */
const SOURCES = [
  {
    file: 'extracted/health-abhi-activ-one-max.txt',
    insurer: 'Aditya Birla Health',
    document: 'Activ One policy wording',
    uin: 'ADIHLIP27048V022627',
  },
]

/** "12. Co-Payment: means a cost-sharing requirement …" up to the next numbered item. */
const DEFINITION =
  /^\s*(\d+)\.\s+([A-Z][A-Za-z0-9 /()'’,.-]{2,60}?):\s*means\s+([\s\S]*?)(?=\n\s*\d+\.\s+[A-Z]|\n\s*Section\s|\n\s*[A-Z]\.\d)/gm

export function slugify(term) {
  return term
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Collapse the hard-wrapped PDF text back into sentences, and drop page furniture. */
function tidy(body) {
  return body
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !/^(Product Name:|Aditya Birla Health|Trademark|CIN:|IRDA Registration|\d{4} \d{3} \d{4})/.test(line))
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/�/g, '—')
    .trim()
}

mkdirSync(outDir, { recursive: true })

const terms = new Map()

for (const source of SOURCES) {
  const path = join(rawDir, source.file)
  if (!existsSync(path)) {
    console.warn(`[glossary] missing extract, skipped: ${source.file}`)
    continue
  }

  const text = readFileSync(path, 'utf8')

  for (const [, , rawTerm, rawBody] of text.matchAll(DEFINITION)) {
    const term = rawTerm.trim().replace(/\s+/g, ' ')
    const slug = slugify(term)
    const definition = tidy(rawBody)

    // A one-line fragment is a parse artefact, not a definition.
    if (!slug || definition.length < 60) continue
    // First source wins, so re-running with more wordings never silently rewrites a citation.
    if (terms.has(slug)) continue

    terms.set(slug, {
      slug,
      term,
      definition: `means ${definition}`,
      source: {
        insurer: source.insurer,
        document: source.document,
        uin: source.uin,
        file: source.file,
      },
    })
  }
}

const rows = [...terms.values()].sort((a, b) => a.term.localeCompare(b.term))
writeFileSync(join(outDir, 'definitions.json'), JSON.stringify(rows, null, 2) + '\n')

console.log(`[glossary] extracted ${rows.length} definitions → data-raw/glossary/definitions.json`)
