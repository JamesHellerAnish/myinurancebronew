/**
 * robots.txt — SEO_ASTRO_PLAN.md §10.2.
 *
 * Generated rather than dropped in public/, because public/ is wiped and rebuilt by
 * sync-public.mjs and is gitignored: a hand-authored file there is untracked and one
 * `npm run migrate` away from vanishing.
 *
 * The bot list is a decision, not boilerplate. Retrieval crawlers are what put us in a
 * live AI answer with attribution; training crawlers only feed future model weights.
 * Both are allowed today. To opt out of training while keeping citations, flip
 * TRAINING_CRAWLERS to 'Disallow' — that one constant is the whole switch.
 *
 * §10.2 note: bot names change. Re-check the list before launch; it was verified
 * August 2026.
 */
import type { APIRoute } from 'astro'

/** Fetch live to answer a question being asked right now. These earn citations. */
const RETRIEVAL_CRAWLERS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
]

/** Crawl to build future model knowledge. No traffic, no attribution. */
const TRAINING_CRAWLERS = [
  'GPTBot',
  'ClaudeBot',
  'anthropic-ai',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Bytespider',
  'Meta-ExternalAgent',
  'Amazonbot',
  'Diffbot',
  'cohere-ai',
  'FacebookBot',
]

/** Flip to 'Disallow' to opt out of being training data without losing AI citations. */
const TRAINING_RULE: 'Allow' | 'Disallow' = 'Allow'

/**
 * The Basic-auth lead dashboard. .htaccess already sends X-Robots-Tag: noindex on it
 * (CLAUDE.md invariant 2), and this is the belt to that pair of braces.
 */
const DISALLOWED = ['/view-leads.php', '/lead-store.php']

function block(agents: string[], rule: string): string {
  return agents.map((agent) => `User-agent: ${agent}\n${rule}: /`).join('\n\n')
}

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href

  const body = `# myinsurancebro.com — see SEO_ASTRO_PLAN.md §10.2

User-agent: *
Allow: /
${DISALLOWED.map((path) => `Disallow: ${path}`).join('\n')}

# ── Retrieval crawlers: these decide whether we are cited in live AI answers ──

${block(RETRIEVAL_CRAWLERS, 'Allow')}

# ── Training crawlers: they build future model knowledge, with no attribution ──

${block(TRAINING_CRAWLERS, TRAINING_RULE)}

Sitemap: ${sitemap}
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
