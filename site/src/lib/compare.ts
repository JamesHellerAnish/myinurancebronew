// SEO_ASTRO_PLAN.md §6.2 / §13 — the comparison tier.
//
// This is the largest single page family in the plan (1,003 plan comparisons at full data), and
// §13 rates "A-vs-B and B-vs-A both generated" as a **High** risk: it would double the biggest
// family with pure duplicates, which is the textbook scaled-content signature.
//
// The mitigation §13 asks for is exactly two things, and both live here:
//   1. C(n,2), never n×(n−1) — one canonical direction per pair, chosen deterministically
//   2. a build assertion that fails if both directions are ever emitted
import { comparisonPairs, type Plan } from './plans'
import compareRows from '../data/compare-rows.json'

export interface CompareRow {
  key: string
  label: string
  type: 'score' | 'percent' | 'number' | 'x' | 'crore' | 'text' | 'bool' | 'years' | 'rupee'
  better?: 'high' | 'low'
  help?: string
}

const ROWS = compareRows as Record<string, CompareRow[]>

/** The matrix rows for a category — the same definition the legacy compare engine renders. */
export function rowsFor(category: string): CompareRow[] {
  return ROWS[category] ?? []
}

/** Read a dotted path like "metrics.csr" or "premiums.m30" off a plan record. */
export function valueAt(plan: Plan, key: string): unknown {
  return key.split('.').reduce<any>((acc, part) => (acc == null ? acc : acc[part]), plan.data)
}

const rupee = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

/** Render a raw value for display, by row type. */
export function formatValue(value: unknown, type: CompareRow['type']): string {
  if (value == null || value === '') return '—'

  switch (type) {
    case 'score':
      return `${value} / 5`
    case 'percent':
      return `${value}%`
    case 'x':
      return `${value}×`
    case 'crore':
      return `₹${Number(value).toLocaleString('en-IN')} Cr`
    case 'years':
      return Number(value) === 1 ? '1 year' : `${value} years`
    case 'rupee':
      return rupee.format(Number(value))
    case 'bool':
      return value ? 'Yes' : 'No'
    default:
      return String(value)
  }
}

/**
 * Which side wins a row, or null where the row is descriptive rather than comparable.
 *
 * Only numeric rows with a stated direction are scored. Text rows ("Room rent limit: No limit
 * — any room category") are shown side by side and left for the reader: deciding that one
 * sentence beats another would be an opinion dressed as a data point.
 */
export function winnerOf(
  a: Plan,
  b: Plan,
  row: CompareRow,
): 'a' | 'b' | null {
  if (!row.better) return null
  if (row.type === 'text' || row.type === 'bool') return null

  const av = valueAt(a, row.key)
  const bv = valueAt(b, row.key)
  if (typeof av !== 'number' || typeof bv !== 'number') return null
  if (av === bv) return null

  const aWins = row.better === 'high' ? av > bv : av < bv
  return aWins ? 'a' : 'b'
}

/** URL slug for a pair. Order is decided by comparisonPairs(), not by the caller. */
export function pairSlug(a: Plan, b: Plan): string {
  return `${a.data.slug}-vs-${b.data.slug}`
}

export class ComparisonDirectionError extends Error {}

/**
 * §13's build assertion.
 *
 * Emitting both `a-vs-b` and `b-vs-a` is the specific failure that would double the largest
 * page family with duplicates. comparisonPairs() already sorts each pair by slug so the chosen
 * direction is deterministic, but "already correct" is not a guarantee — this turns it into
 * one, by failing the build rather than shipping the duplicates.
 *
 * Also catches a plan paired with itself, which would be a nonsense page.
 */
export function assertOneDirection(pairs: Array<[Plan, Plan]>): void {
  const seen = new Map<string, string>()

  for (const [a, b] of pairs) {
    if (a.data.slug === b.data.slug) {
      throw new ComparisonDirectionError(
        `Comparison pairs a plan with itself: ${a.data.slug}`,
      )
    }

    // Order-independent key: both directions of the same pair collapse onto it.
    const canonical = [a.data.slug, b.data.slug].sort().join('::')
    const emitted = pairSlug(a, b)
    const existing = seen.get(canonical)

    if (existing) {
      throw new ComparisonDirectionError(
        `Both directions of a comparison were generated: "${existing}" and "${emitted}".\n` +
          'Source pairs from comparisonPairs() (C(n,2)) — see §13. Emitting both doubles the ' +
          'largest page family on the site with pure duplicates.',
      )
    }

    seen.set(canonical, emitted)
  }
}

/** Publishable pairs for a category, checked. The only sanctioned source of comparison paths. */
export function checkedPairs(plans: Plan[]): Array<[Plan, Plan]> {
  const pairs = comparisonPairs(plans)
  assertOneDirection(pairs)
  return pairs
}
