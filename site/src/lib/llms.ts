// SEO_ASTRO_PLAN.md §10.3 — the shared parts of llms.txt and llms-full.txt.
//
// Both files are generated from the same collection query as the pages themselves, so they
// cannot drift from what is actually published — and they inherit the publishablePlans()
// gate, which means an unverified figure cannot leak into a file we hand to a model.
import { publishablePlans, planPath, CATEGORY_LABELS, type Plan, type PlanCategory } from './plans'
import { complaintsPhrase } from './format'
import meta from '../data/meta.json'

/** The standing description. Advisor, not underwriter — CLAUDE.md invariant 4. */
export const INTRO = [
  '> IRDAI-licensed insurance advisory in India. Independent, data-led comparison of term life',
  '> and health insurance plans, scored against IRDAI claim-settlement and grievance',
  '> disclosures. We are an advisor, not an insurer — we do not underwrite any product.',
].join('\n')

export const NOTES = [
  '## Notes',
  '',
  '- Premiums are indicative illustrations for the stated profiles, not quotes. Your premium',
  '  depends on age, health, city, habits and underwriting.',
  `- Scoring: ${meta.weighting}.`,
  `- Claim settlement ratios and complaint volumes are ${meta.period}.`,
  `- Source: ${meta.source}.`,
  `- Figures last verified: ${meta.updated}.`,
].join('\n')

/** Published plans grouped by category, best score first, in a stable category order. */
export async function plansByCategoryGrouped(): Promise<Array<[PlanCategory, Plan[]]>> {
  const plans = await publishablePlans()
  const order = Object.keys(CATEGORY_LABELS) as PlanCategory[]

  return order
    .map((category): [PlanCategory, Plan[]] => [
      category,
      plans
        .filter((p) => p.data.category === category)
        .sort((a, b) => b.data.score - a.data.score),
    ])
    .filter(([, group]) => group.length > 0)
}

/**
 * One line per plan, each carrying its headline numbers — §10.3.
 *
 * 2026-09-11: pages now publish regardless of verificationStatus (see lib/plans.ts) and
 * disclose it inline instead of gating on it. This file is what we hand directly to a model,
 * so the same disclosure has to travel here too, or an AI crawler gets an unverified figure
 * with no caveat while a human reader gets one.
 */
export function planLine(plan: Plan): string {
  const d = plan.data
  const line = `- [${d.insurer} ${d.name}](${planPath(plan)}): Score ${d.score}/5, CSR ${d.metrics.csr}%, ${complaintsPhrase(d.metrics.complaints)} per 10,000 claims`

  if (d.verificationStatus !== 'verified') return `${line} — NOT YET INDEPENDENTLY VERIFIED`
  if (d.unverifiedFields.length > 0) {
    return `${line} (unsourced fields: ${d.unverifiedFields.join(', ')})`
  }
  return line
}

/**
 * Shown in place of the plan sections when nothing is publishable. Silence would read as
 * "this site has no plans"; saying why is more useful to a model and to a human reading it.
 */
export const NO_PLANS_NOTICE = [
  'No plan pages are currently published: every record is being re-verified against the',
  'policy wording before it goes live. See /methodology/ for how plans are scored.',
].join('\n')
