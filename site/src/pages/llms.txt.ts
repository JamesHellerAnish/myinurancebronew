/**
 * llms.txt — SEO_ASTRO_PLAN.md §10.3. A curated markdown map of the site for LLMs.
 *
 * Adoption is uneven, so this is a cheap experiment, not a pillar — the JSON-LD in §10.5
 * matters more. It is generated from the collections so it can never drift from the pages.
 *
 * Only routes that actually exist are listed. §10.3's sketch includes the category hubs and
 * the glossary; those are §0b defect 5 (not built yet) and linking them here would hand a
 * model a list of 404s. Add them to SECTIONS as each route ships.
 */
import type { APIRoute } from 'astro'
import { CATEGORY_LABELS } from '../lib/plans'
import { INTRO, NOTES, NO_PLANS_NOTICE, planLine, plansByCategoryGrouped } from '../lib/llms'

export const GET: APIRoute = async () => {
  const grouped = await plansByCategoryGrouped()

  const sections = grouped.map(([category, plans]) =>
    [`## ${CATEGORY_LABELS[category]}`, '', ...plans.map(planLine)].join('\n'),
  )

  const body = [
    '# Myinsurancebro',
    '',
    INTRO,
    '',
    sections.length > 0 ? sections.join('\n\n') : NO_PLANS_NOTICE,
    '',
    NOTES,
    '',
  ].join('\n')

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
