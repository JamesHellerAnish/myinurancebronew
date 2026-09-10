// SEO_ASTRO_PLAN.md §8.1 — the ONLY place a <title> is composed.
//
// Perfecplan's bug: a layout-level `%s | Perfecplan` template AND four route families
// that also baked `| Perfecplan` into their own title string, producing
// "... — Rates & Packages | Perfecplan | Perfecplan" on ~5,150 pages. Nothing caught it
// because a duplicated brand suffix is not a build error anywhere.
//
// The defence is structural: one function, and an assertion that fails the build.

export const BRAND = 'Myinsurancebro'

/** Google truncates around 60 characters. */
export const TITLE_MAX = 60

export class TitleError extends Error {}

/**
 * Compose a page title. Pass `brand: false` only for the homepage, where the brand
 * is the whole title and a suffix would repeat it.
 */
export function title(page: string, opts?: { brand?: boolean }): string {
  const trimmed = page.trim()

  if (!trimmed) {
    throw new TitleError('title() called with an empty page title')
  }

  // Catch a caller that already appended the brand — the exact Perfecplan failure.
  //
  // Only when a suffix is actually going to be added. `brand: false` is the homepage, where
  // the brand IS the title ("Myinsurancebro — Compare & Buy…"); rejecting that would be the
  // guard firing on the one page it was never meant to cover. The duplicate-brand assertion
  // below still runs either way, so "Myinsurancebro | Myinsurancebro" is still a build error.
  if (opts?.brand !== false && trimmed.toLowerCase().includes(BRAND.toLowerCase())) {
    throw new TitleError(
      `title() received a page title that already contains "${BRAND}": ${trimmed}\n` +
        'Pass the bare page title; the brand suffix is added here and nowhere else.\n' +
        'If this is the homepage, pass brand: false.',
    )
  }

  const composed = opts?.brand === false ? trimmed : `${trimmed} | ${BRAND}`

  assertTitle(composed)
  return composed
}

/**
 * Build-time assertion. Throws on a duplicated brand (a hard error — it is always a bug)
 * and warns on overlength (a judgement call; some long titles are still the right call).
 */
export function assertTitle(composed: string): void {
  const occurrences = composed.toLowerCase().split(BRAND.toLowerCase()).length - 1

  if (occurrences > 1) {
    throw new TitleError(
      `Title contains "${BRAND}" ${occurrences} times: ${composed}`,
    )
  }

  if (composed.length > TITLE_MAX) {
    console.warn(
      `[seo] title is ${composed.length} chars and will truncate in SERPs: ${composed}`,
    )
  }
}

/**
 * §9.2: meta descriptions run 150–160 chars, unique, and should contain a number —
 * a ₹ figure, a percentage, a count. Numbers measurably lift CTR.
 */
export function assertDescription(description: string, pageUrl: string): void {
  if (description.length < 120 || description.length > 165) {
    console.warn(
      `[seo] description is ${description.length} chars (target 150–160) on ${pageUrl}`,
    )
  }
  if (!/\d/.test(description)) {
    console.warn(`[seo] description contains no number on ${pageUrl}`)
  }
}

/** Characters that `title()` will append: " | Myinsurancebro". */
export const BRAND_SUFFIX_LENGTH = ` | ${BRAND}`.length

/**
 * Pick the first bare page title that still fits under TITLE_MAX once the brand suffix
 * is appended. Callers pass candidates longest-first — full insurer name, short name,
 * short name without the "Review" qualifier — and get the most informative one that fits.
 *
 * Defect 2 in §0b: two of ten titles ran over because the template composed one string
 * with no length budget. A budget belongs here, next to TITLE_MAX, not in each route.
 * If nothing fits, the last (shortest) candidate is returned and assertTitle() warns —
 * a truncated title is better than a build that silently drops a page.
 */
export function fitTitle(candidates: string[]): string {
  const usable = candidates.map((c) => c.trim()).filter(Boolean)

  if (usable.length === 0) {
    throw new TitleError('fitTitle() called with no non-empty candidates')
  }

  const budget = TITLE_MAX - BRAND_SUFFIX_LENGTH
  return usable.find((c) => c.length <= budget) ?? usable[usable.length - 1]
}

/** §9.2 target band for meta descriptions. */
export const DESCRIPTION_MIN = 150
export const DESCRIPTION_MAX = 160

/**
 * Compose a meta description to a length budget: a mandatory `core` sentence carrying the
 * numbers, plus at most one closing clause from `tails`. The tails are alternatives, not
 * additions — the first one that keeps the whole string inside DESCRIPTION_MAX wins, so
 * callers order them longest (most informative) first and finish with a short catch-all.
 *
 * Defect 1 in §0b: the plan template concatenated four fixed clauses, which ran 168–187 chars
 * on every record. assertDescription() was right; the generator had no budget.
 */
export function fitDescription(core: string, tails: string[] = []): string {
  const out = core.trim()

  for (const tail of tails) {
    const clause = tail.trim()
    if (!clause) continue

    const candidate = `${out} ${clause}`
    if (candidate.length <= DESCRIPTION_MAX) return candidate
  }

  return out
}
