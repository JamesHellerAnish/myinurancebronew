// SEO_ASTRO_PLAN.md §6.2 — the insurer axis.
//
// Insurers are a separate collection from plans and carry their own IRDAI figures (CSR,
// complaints per 10,000 claims, book size). Those come from one citable source — the IRDAI
// Annual Report and the public grievance disclosures — which is why they are not behind the
// plan verification gate: that gate exists for plan facts that have to be read out of a
// policy wording, one document per plan.
//
// Insurer *pages*, however, are only generated where the insurer has a publishable plan.
// An insurer page with no plans on it is a thin page, and 19 of them is the scaled-content
// shape §13 warns about.
import { getCollection, type CollectionEntry } from 'astro:content'
import { publishablePlans, type Plan, type PlanCategory } from './plans'

export type Insurer = CollectionEntry<'insurers'>

/** Which insurer kind sells which category. §6.2: term is life, everything else is health. */
export function kindFor(category: PlanCategory): Insurer['data']['kind'] {
  return category === 'term' ? 'life' : 'health'
}

/** Every insurer that sells in this category, best score first. Not gated — see the note above. */
export async function insurersForCategory(category: PlanCategory): Promise<Insurer[]> {
  const kind = kindFor(category)
  const all = await getCollection('insurers')

  return all
    .filter((insurer) => insurer.data.kind === kind)
    .sort((a, b) => (b.data.score ?? 0) - (a.data.score ?? 0))
}

/**
 * Insurers that have at least one publishable plan in this category, with those plans.
 * This is what generates insurer pages — never the full registry.
 */
export async function insurersWithPlans(
  category: PlanCategory,
): Promise<Array<{ insurer: Insurer; plans: Plan[] }>> {
  const [all, plans] = await Promise.all([getCollection('insurers'), publishablePlans()])
  const inCategory = plans.filter((plan) => plan.data.category === category)

  return all
    .map((insurer) => ({
      insurer,
      plans: inCategory
        .filter((plan) => plan.data.insurerSlug === insurer.data.slug)
        .sort((a, b) => b.data.score - a.data.score),
    }))
    .filter((entry) => entry.plans.length > 0)
    .sort((a, b) => (b.insurer.data.score ?? 0) - (a.insurer.data.score ?? 0))
}

/** Canonical path for an insurer page. One place, so the mesh and the sitemap agree. */
export function insurerPath(category: string, slug: string): string {
  return `/${category}/companies/${slug}/`
}

/**
 * Rank of an insurer within its own kind, by claim settlement ratio.
 *
 * §13 lists unsourced comparative claims as a compliance risk, so a rank is only ever
 * stated alongside the field it was computed on and the pool it was computed over — which
 * is why this returns the total too, and never a bare "India's best".
 */
export async function csrRank(insurer: Insurer): Promise<{ rank: number; of: number } | null> {
  if (insurer.data.csr == null) return null

  const all = await getCollection('insurers')
  const pool = all.filter((i) => i.data.kind === insurer.data.kind && i.data.csr != null)
  const sorted = [...pool].sort((a, b) => (b.data.csr ?? 0) - (a.data.csr ?? 0))
  const index = sorted.findIndex((i) => i.data.slug === insurer.data.slug)

  return index < 0 ? null : { rank: index + 1, of: pool.length }
}
