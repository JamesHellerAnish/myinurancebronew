/**
 * /data/glossary.json — SEO_ASTRO_PLAN.md §10.6, machine-readable endpoints.
 *
 * The same collection the pages render, served as JSON so an assistant or a researcher can
 * take the whole set in one request instead of crawling 28 pages. §10.5's argument is that
 * structured data is the highest-leverage GEO work; this is the same idea without the HTML.
 *
 * Provenance travels with every term. A definition lifted from an IRDAI-filed wording should
 * never circulate without the UIN it came from — that is what makes it checkable rather than
 * just another scraped glossary.
 */
import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export const GET: APIRoute = async ({ site }) => {
  const terms = (await getCollection('glossary')).sort((a, b) =>
    a.data.term.localeCompare(b.data.term),
  )

  const body = {
    '@context': 'https://schema.org',
    name: 'Myinsurancebro insurance glossary',
    url: new URL('glossary/', site).href,
    licence:
      'The plain-English explanations are Myinsurancebro editorial. The quoted legal ' +
      'definitions belong to the insurers whose IRDAI-filed wordings they are taken from, ' +
      'and each carries its source and UIN.',
    count: terms.length,
    terms: terms.map((entry) => ({
      term: entry.data.term,
      slug: entry.data.slug,
      url: new URL(`glossary/${entry.data.slug}/`, site).href,
      plain: entry.data.plain,
      whyItMatters: entry.data.whyItMatters,
      legalDefinition: entry.data.definition,
      source: entry.data.source,
      related: entry.data.related,
    })),
  }

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // Static file, but say so — this is meant to be fetched by other people's tools.
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
