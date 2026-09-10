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
    name: 'Myinsurancebro',
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
