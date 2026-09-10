// SEO_ASTRO_PLAN.md §5.3 + §16.1.
// ⚠ Astro 5 API: this file lives at src/content.config.ts (NOT src/content/config.ts),
// and collections take `loader:`, not `type:`. Writing the Astro 4 form fails at build
// with a non-obvious error — see §16.1.
import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

/**
 * Verification gate.
 *
 * §5.2 makes `sources[]` and `lastVerified` non-optional, and §16.8 requires a licensed
 * human to sign off every record before it publishes under an IRDAI-licensed name.
 * But the 10 records migrated out of js/policy-data.js predate that pipeline and have
 * no clause-level citation yet.
 *
 * Rather than weaken the schema to let them through, records carry an explicit status
 * and the refinement below enforces the §5.2 contract on anything claiming to be
 * `verified`. `migrated` records build fine but are filtered out of page generation by
 * publishablePlans() in src/lib/plans.ts — so an unverified record can never silently
 * become a published page.
 */
const verificationStatus = z.enum(['migrated', 'extracted', 'verified'])

const source = z.object({
  label: z.string(),
  url: z.string().url(),
  /** Clause reference where the figure was read, e.g. "Section C.1.a". §16.7. */
  clause: z.string().optional(),
})

const plans = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/plans' }),
  schema: z
    .object({
      id: z.string(),
      category: z.enum([
        'term',
        'health',
        'super-topup',
        'senior-health',
        'critical-illness',
        'personal-accident',
        'hospital-cash',
      ]),
      insurer: z.string(),
      insurerShort: z.string().optional(),
      name: z.string(),
      slug: z.string(),
      insurerSlug: z.string(),

      tagline: z.string().optional(),
      subtitle: z.string().optional(),
      monogram: z.string().optional(),
      accent: z.string().optional(),

      score: z.number().min(0).max(5),
      scoreBreakdown: z
        .object({
          features: z.number(),
          insurer: z.number(),
          premium: z.number(),
        })
        .optional(),

      metrics: z.object({
        csr: z.number().min(0).max(100),
        complaints: z.number(),
        solvency: z.number().optional(),
        network: z.number().optional(),
        businessCr: z.number().nullable().optional(),
      }),

      entryAge: z.string().optional(),
      coverRange: z.string().optional(),
      tenure: z.string().optional(),

      // Health-shaped fields. Optional because term plans do not carry them.
      restoration: z.string().optional(),
      bonus: z.string().optional(),
      roomRent: z.string().optional(),
      consumables: z.string().optional(),
      waiting: z
        .object({
          ped: z.number().optional(),
          specific: z.number().optional(),
          maternity: z.string().optional(),
        })
        .optional(),

      // Term-shaped fields.
      criticalIllness: z.string().optional(),
      premiumBreak: z.boolean().optional(),
      lifeStageBoost: z.boolean().optional(),
      smartExit: z.boolean().optional(),

      premiums: z.record(z.number()),

      bestFor: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([]),
      features: z.array(z.string()).min(4),
      covered: z.array(z.string()).min(3),
      notCovered: z.array(z.string()).min(3),
      riders: z.array(z.string()).default([]),
      pros: z.array(z.string()).min(3),
      // A plan with no cons reads as an advertisement. §5.3, §16.4.
      cons: z.array(z.string()).min(2),
      verdict: z.string().min(200),

      verificationStatus,
      lastVerified: z.coerce.date().optional(),
      sources: z.array(source).default([]),
      /** Free-text note on what still needs checking before this record can be published. */
      verificationNote: z.string().optional(),
    })
    .superRefine((plan, ctx) => {
      // The §5.2 contract, enforced only where the record claims to be verified.
      if (plan.verificationStatus !== 'verified') return

      if (!plan.lastVerified) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['lastVerified'],
          message: `Plan "${plan.id}" is marked verified but has no lastVerified date (§5.2).`,
        })
      }
      if (plan.sources.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['sources'],
          message: `Plan "${plan.id}" is marked verified but cites no sources (§5.2, §11).`,
        })
      }
    }),
})

const insurers = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/insurers' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    /** 'life' insurers sell term; 'general'/'health' insurers sell the health family. */
    kind: z.enum(['life', 'health']),
    logo: z.string(),
    accent: z.string(),
    initials: z.string(),
    score: z.number().min(0).max(5).optional(),
    csr: z.number().min(0).max(100).optional(),
    complaints: z.number().optional(),
    solvency: z.number().optional(),
    businessCr: z.number().nullable().optional(),
  }),
})

const personas = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/personas' }),
  schema: z.object({
    key: z.string(),
    label: z.string(),
    ageRange: z.string(),
    headline: z.string().optional(),
    pains: z
      .array(z.object({ heading: z.string(), body: z.string() }))
      .default([]),
    planRecommendations: z
      .array(z.object({ planId: z.string(), reason: z.string() }))
      .default([]),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    relatedPersonas: z.array(z.string()).default([]),
    searchIntent: z.array(z.string()).default([]),
  }),
})

export const collections = { plans, insurers, personas }
