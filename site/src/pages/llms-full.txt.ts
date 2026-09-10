/**
 * llms-full.txt — SEO_ASTRO_PLAN.md §10.3. The same map as llms.txt, expanded to the full
 * plan facts in one document, for models that ingest a single file rather than crawling.
 *
 * Same generation source and the same publishablePlans() gate as the pages, so an
 * unverified figure cannot reach it.
 */
import type { APIRoute } from 'astro'
import { CATEGORY_LABELS, planPath, type Plan } from '../lib/plans'
import { INTRO, NOTES, NO_PLANS_NOTICE, plansByCategoryGrouped } from '../lib/llms'
import profiles from '../data/profiles.json'

type ProfileSet = { assumption: string; rows: Array<{ key: string; label: string }> }
const PROFILES = profiles as Record<string, ProfileSet>

const rupee = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function list(label: string, items: string[]): string[] {
  if (items.length === 0) return []
  return ['', `**${label}**`, '', ...items.map((item) => `- ${item}`)]
}

function premiums(plan: Plan): string[] {
  const set = PROFILES[plan.data.category]
  const rows = set?.rows.filter((row) => plan.data.premiums[row.key] != null) ?? []
  if (rows.length === 0) return []

  return [
    '',
    `**Indicative annual premiums** (${set.assumption} — illustrations, not quotes)`,
    '',
    ...rows.map((row) => `- ${row.label}: ${rupee.format(plan.data.premiums[row.key])}`),
  ]
}

function planBlock(plan: Plan, url: string): string {
  const d = plan.data

  const facts = [
    `- Score: ${d.score}/5`,
    `- Claim settlement ratio (${d.insurer}): ${d.metrics.csr}%`,
    `- Complaints per 10,000 claims: ${d.metrics.complaints}`,
    d.coverRange ? `- Cover available: ${d.coverRange}` : '',
    d.entryAge ? `- Entry age: ${d.entryAge}` : '',
    d.tenure ? `- Term: ${d.tenure}` : '',
    d.roomRent ? `- Room rent limit: ${d.roomRent}` : '',
    d.waiting?.ped != null ? `- Pre-existing disease waiting period: ${d.waiting.ped} years` : '',
  ].filter(Boolean)

  return [
    `### ${d.insurer} ${d.name}`,
    '',
    `URL: ${url}`,
    ...(d.subtitle ? ['', d.subtitle] : []),
    '',
    ...facts,
    ...list('Covers', d.covered),
    ...list('Key features', d.features),
    ...list('Riders', d.riders),
    ...list('Does not cover', d.notCovered),
    ...premiums(plan),
    ...list('Strengths', d.pros),
    ...list('Weaknesses', d.cons),
    '',
    `**Verdict.** ${d.verdict}`,
    ...(d.sources.length > 0
      ? ['', '**Sources**', '', ...d.sources.map((s) => `- ${s.label}: ${s.url}`)]
      : []),
  ].join('\n')
}

export const GET: APIRoute = async ({ site }) => {
  const grouped = await plansByCategoryGrouped()

  const sections = grouped.map(([category, plans]) =>
    [
      `## ${CATEGORY_LABELS[category]}`,
      ...plans.map((plan) => planBlock(plan, new URL(planPath(plan), site).href)),
    ].join('\n\n'),
  )

  const body = [
    '# Myinsurancebro — full plan data',
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
