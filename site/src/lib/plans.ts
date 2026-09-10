// SEO_ASTRO_PLAN.md §5.2 / §11 / §16.8 — the publication gate.
//
// Every route that generates a plan page MUST source its paths from publishablePlans().
// Calling getCollection('plans') directly in a route bypasses the gate and can publish an
// unverified figure under an IRDAI-licensed advisor's name. That is a compliance problem,
// not a style preference.
import { getCollection, type CollectionEntry } from 'astro:content'

export type Plan = CollectionEntry<'plans'>
export type PlanCategory = Plan['data']['category']

/**
 * Dev-only escape hatch.
 *
 * Right now all 10 migrated records are `migrated`, so a strict gate yields zero plan
 * pages and there is nothing to look at while building the template — and §2.1 lesson 4
 * is that you must look at one page before generating thousands.
 *
 * So: unverified records render in `astro dev` and in an explicit opt-in build, and never
 * in a plain production build. Fails closed — anything other than the exact string '1'
 * leaves the gate shut.
 */
function unverifiedAllowed(): boolean {
  if (process.env.PUBLISH_UNVERIFIED === '1') return true
  return import.meta.env.DEV === true
}

let warned = false

/**
 * The only sanctioned source of plan pages.
 *
 * Returns records cleared for publication: `verified` always, plus `migrated`/`extracted`
 * when the dev hatch above is open.
 */
export async function publishablePlans(): Promise<Plan[]> {
  const all = await getCollection('plans')
  const verified = all.filter((p) => p.data.verificationStatus === 'verified')

  if (!unverifiedAllowed()) {
    if (verified.length === 0 && !warned) {
      warned = true
      console.warn(
        '[plans] 0 of ' +
          all.length +
          ' plan records are verified, so no plan pages will be generated.\n' +
          '        Verify records against the policy wording (§16.7) and set\n' +
          "        verificationStatus: 'verified' with sources[] and lastVerified.\n" +
          '        To preview unverified records anyway: PUBLISH_UNVERIFIED=1 npm run build',
      )
    }
    return verified
  }

  const unverified = all.filter((p) => p.data.verificationStatus !== 'verified')
  if (unverified.length > 0 && !warned) {
    warned = true
    console.warn(
      `[plans] ⚠ PUBLISHING ${unverified.length} UNVERIFIED plan record(s). ` +
        'Preview only — these must not be deployed (§16.8).',
    )
  }

  return all
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
