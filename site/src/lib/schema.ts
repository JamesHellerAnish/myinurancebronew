// SEO_ASTRO_PLAN.md §10.5 / §16.3 — structured data builders.
//
// §16.3 correction, verified against schema.org: InsuranceAgency is NOT a subtype of
// FinancialProduct. It descends from LocalBusiness/FinancialService, so it describes THE
// BUSINESS. Plans are FinancialProduct directly — there is no insurance-specific subtype.
import type { Plan } from './plans'

const SITE = 'https://myinsurancebro.com'

/**
 * Sitewide organisation identity (§9.1).
 *
 * ⚠ irdaiRegistration is a placeholder. A licence number is a regulated claim and must not
 * be guessed — fill it from the certificate, with its expiry, before launch. §16.4 notes
 * Ditto publishes the registration number *and* its expiry date in the footer.
 */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'InsuranceAgency',
    '@id': `${SITE}/#organization`,
    name: 'My Insurance Bro',
    url: SITE,
    description:
      'IRDAI-licensed independent insurance advisory in India. Data-led comparison of ' +
      'term life and health insurance plans, scored against IRDAI claim-settlement and ' +
      'grievance disclosures.',
    areaServed: { '@type': 'Country', name: 'India' },
    // TODO(launch): real IRDAI registration number + expiry. Do not invent one.
    // identifier: { '@type': 'PropertyValue', name: 'IRDAI Registration', value: '...' },
  }
}

/**
 * The site name Google prints above the result (§10.5).
 *
 * Without this, Google had nothing authoritative to read and fell back to the bare domain,
 * so results were headed "myinsurancebro.com". `og:site_name` and the <title> were already
 * right, but WebSite structured data is the signal Google documents as primary for the
 * site name — the others are fallbacks it may or may not take.
 *
 * Deliberately narrow:
 *   · Homepage only. Google reads this from the root document; repeating it on ~107 pages
 *     would add bytes everywhere and signal nothing extra.
 *   · `url` is the root with its trailing slash, which is the form Google matches against.
 *   · No `alternateName`. It exists to offer Google a second string to choose from, and
 *     the whole point here is that there is exactly one correct name.
 *   · Separate @id from the organisation: the site and the business are different things,
 *     and `publisher` links them rather than conflating them.
 */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE}/#website`,
    name: 'My Insurance Bro',
    url: `${SITE}/`,
    publisher: { '@id': `${SITE}/#organization` },
    inLanguage: 'en-IN',
  }
}

/**
 * The Chief Advisor as a Person — §11's "named author + reviewer, with IRDAI certification".
 * Name and IRDAI licence number supplied by the owner 2026-09-11. Not independently verified
 * against IRDAI's own register — no lookup tool is available in this session — so this is
 * accepted as owner-stated fact, the same trust model CLAUDE.md invariant 7 uses for the team
 * roles: never invented, used once the owner states it.
 */
export function advisorPersonSchema() {
  return {
    '@type': 'Person',
    '@id': `${SITE}/#chief-advisor`,
    name: 'Danish Pandita',
    jobTitle: 'Chief Advisor & Owner',
    worksFor: { '@id': `${SITE}/#organization` },
    identifier: { '@type': 'PropertyValue', name: 'IRDAI Licence Number', value: 'MBHNOC5128059' },
  }
}

/** BreadcrumbList from an ordered trail. §8 block 1. */
export function breadcrumbSchema(trail: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: new URL(crumb.path, SITE).href,
    })),
  }
}

/**
 * FAQPage. §8 block 8.
 *
 * §16.4: answers should open with a bare Yes/No before explaining — it is what wins
 * featured snippets and what AI assistants extract cleanly.
 */
export function faqSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }
}

/**
 * A plan as FinancialProduct (§16.3).
 *
 * Deliberately omits aggregateRating. Google ignores and can penalise self-serving review
 * markup (§9.5), and our score is our own assessment, not user reviews — marking it up as
 * a rating would misrepresent what it is.
 */
export function planSchema(plan: Plan, url: string) {
  const data = plan.data

  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    '@id': `${new URL(url, SITE).href}#product`,
    name: `${data.insurer} ${data.name}`,
    url: new URL(url, SITE).href,
    category: data.category,
    description: data.subtitle ?? data.verdict.slice(0, 200),
    provider: {
      '@type': 'Organization',
      name: data.insurer,
    },
    areaServed: { '@type': 'Country', name: 'India' },
    brand: { '@type': 'Brand', name: data.insurer },
    ...(data.sources.length > 0
      ? { termsOfService: data.sources[0].url }
      : {}),
  }
}

/**
 * DefinedTerm inside a DefinedTermSet — SEO_ASTRO_PLAN.md §10.5, which flags this as
 * "underused and highly extractable". A glossary entry is exactly the shape an assistant
 * wants to quote, and this is what tells it so.
 *
 * `description` carries our plain-English gloss rather than the lifted legal text: the legal
 * definition belongs to the insurer's wording, and it is the gloss that is ours to publish
 * as the answer.
 */
export function definedTermSchema(term: {
  term: string
  slug: string
  plain: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${SITE}/glossary/${term.slug}/#term`,
    name: term.term,
    description: term.plain,
    url: `${SITE}/glossary/${term.slug}/`,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      '@id': `${SITE}/glossary/#set`,
      name: 'My Insurance Bro insurance glossary',
      url: `${SITE}/glossary/`,
    },
  }
}

/** The set itself, for the glossary index. */
export function definedTermSetSchema(count: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': `${SITE}/glossary/#set`,
    name: 'My Insurance Bro insurance glossary',
    url: `${SITE}/glossary/`,
    description:
      `Plain-English explanations of ${count} insurance terms, each shown beside the ` +
      `verbatim definition from an IRDAI-filed policy wording.`,
  }
}

/**
 * Article — §10.5. Used for guides.
 *
 * Deliberately not FAQPage: a guide is one argument, and marking it up as a set of questions
 * to chase a rich result would misrepresent the page to the crawler that trusts the markup.
 *
 * `author` is now the Chief Advisor (§11's "named author + reviewer, with IRDAI certification")
 * — previously the organisation, because CLAUDE.md invariant 7 blocked an invented byline and
 * there was no person to attribute these to. There is now: see advisorPersonSchema().
 */
export function articleSchema(guide: {
  title: string
  description: string
  published: Date
  updated?: Date
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    datePublished: guide.published.toISOString(),
    dateModified: (guide.updated ?? guide.published).toISOString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}${guide.url}` },
    author: advisorPersonSchema(),
    publisher: { '@id': `${SITE}/#organization` },
  }
}
