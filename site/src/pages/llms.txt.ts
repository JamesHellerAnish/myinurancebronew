/**
 * llms.txt — SEO_ASTRO_PLAN.md §10.3. A curated markdown map of the site for LLMs.
 *
 * Adoption is uneven, so this is a cheap experiment, not a pillar — the JSON-LD in §10.5
 * matters more. It is generated from the collections so it can never drift from the pages.
 *
 * Only routes that actually exist are listed. The glossary is generated from the collection,
 * so a term appears here exactly when its page does.
 */
import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { CATEGORY_LABELS } from '../lib/plans'
import { INTRO, NOTES, NO_PLANS_NOTICE, planLine, plansByCategoryGrouped } from '../lib/llms'

export const GET: APIRoute = async () => {
  const grouped = await plansByCategoryGrouped()

  const sections = grouped.map(([category, plans]) =>
    [`## ${CATEGORY_LABELS[category]}`, '', ...plans.map(planLine)].join('\n'),
  )

  // §10.3 lists a Glossary section. Each term carries its gloss, because the one-line summary
  // is the part a model can actually use — a bare list of links is a menu, not a map.
  const terms = (await getCollection('glossary')).sort((a, b) =>
    a.data.term.localeCompare(b.data.term),
  )

  if (terms.length > 0) {
    sections.push(
      [
        '## Glossary',
        '',
        ...terms.map((t) => {
          // First sentence only. Strip any trailing stop before adding our own, or a gloss
          // that is a single sentence comes out with two.
          const summary = t.data.plain.split('. ')[0].replace(/\.\s*$/, '')
          return `- [${t.data.term}](/glossary/${t.data.slug}/): ${summary}.`
        }),
      ].join('\n'),
    )
  }

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
