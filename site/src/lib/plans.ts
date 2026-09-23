// SEO_ASTRO_PLAN.md §5.2 / §11 / §16.8 — plan publication.
//
// 2026-09-11, owner decision: publish every record regardless of verificationStatus, and
// disclose verification state ON THE PAGE instead of hiding the page. Previously this file
// hard-gated on verificationStatus === 'verified' (a per-record binary), which meant a
// record with nine confirmed fields and one open question was invisible in its entirety.
// The owner's call was that per-field honesty on a live page is the more useful posture for
// this site than an all-or-nothing publish gate — see each record's verificationNote and the
// "Verification status" block on the plan page template, which renders it. §16.8 (a licensed
// human should still review the content) still stands as a separate, ongoing obligation; it
// is no longer what decides whether a page exists.
//
// Every route that generates a plan page still sources its paths from publishablePlans(),
// not getCollection('plans') directly, so there is one place this policy is implemented.
import { getCollection, type CollectionEntry } from 'astro:content'

export type Plan = CollectionEntry<'plans'>
export type PlanCategory = Plan['data']['category']

/** The only sanctioned source of plan pages. Currently: everything. */
export async function publishablePlans(): Promise<Plan[]> {
  return getCollection('plans')
}

/** Plans in one category, best score first. */
export async function plansByCategory(category: PlanCategory): Promise<Plan[]> {
  const plans = await publishablePlans()
  return plans
    .filter((p) => p.data.category === category)
    .sort((a, b) => b.data.score - a.data.score)
}

/** Look up one plan by its category + insurer + plan slug triple, as the URL carries it. */
export async function findPlan(
  category: string,
  insurerSlug: string,
  slug: string,
): Promise<Plan | undefined> {
  const plans = await publishablePlans()
  return plans.find(
    (p) =>
      p.data.category === category &&
      p.data.insurerSlug === insurerSlug &&
      p.data.slug === slug,
  )
}

/** Canonical URL path for a plan page. One place, so the mesh and the sitemap agree. */
export function planPath(plan: Plan): string {
  return `/${categoryPath(plan.data.category)}/${plan.data.insurerSlug}/${plan.data.slug}/`
}

/** Category key → URL segment. §6.2. */
export function categoryPath(category: PlanCategory): string {
  const paths: Record<PlanCategory, string> = {
    term: 'term-insurance',
    health: 'health-insurance',
    'super-topup': 'super-top-up',
    'senior-health': 'senior-citizen-health-insurance',
    'critical-illness': 'critical-illness-insurance',
    'personal-accident': 'personal-accident-insurance',
    'hospital-cash': 'hospital-cash-insurance',
  }
  return paths[category]
}

export const CATEGORY_LABELS: Record<PlanCategory, string> = {
  term: 'Term Life Insurance',
  health: 'Health Insurance',
  'super-topup': 'Super Top-Up',
  'senior-health': 'Senior Citizen Health Insurance',
  'critical-illness': 'Critical Illness Insurance',
  'personal-accident': 'Personal Accident Insurance',
  'hospital-cash': 'Hospital Daily Cash',
}

/**
 * Unordered pairs within a category — C(n,2), never n×(n−1).
 *
 * §13 lists "A-vs-B and B-vs-A both generated" as a High risk: it doubles the largest page
 * family with pure duplicates. Emitting one direction only is the mitigation, and sorting
 * the pair by slug makes the chosen direction deterministic across builds.
 */
export function comparisonPairs(plans: Plan[]): Array<[Plan, Plan]> {
  const sorted = [...plans].sort((a, b) => a.data.slug.localeCompare(b.data.slug))
  const pairs: Array<[Plan, Plan]> = []

  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      pairs.push([sorted[i], sorted[j]])
    }
  }

  return pairs
}

/**
 * Sibling plans for the internal-linking mesh (§9.3: a plan page links 8 same-category
 * plans). The mesh is what makes a large page set crawlable rather than orphaned — §2.
 */
export async function siblingPlans(plan: Plan, limit = 8): Promise<Plan[]> {
  const siblings = await plansByCategory(plan.data.category)
  return siblings.filter((p) => p.id !== plan.id).slice(0, limit)
}
