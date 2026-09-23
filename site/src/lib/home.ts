// The home page FAQ — SEO_ASTRO_PLAN.md §10.5.
//
// One source for both the rendered accordion and the FAQPage JSON-LD. In index.html the
// questions existed only as markup, so a schema block would have been a hand-kept second
// copy of the same nine answers — and a schema that disagrees with the visible page is a
// structured-data violation, not just untidy.
//
// Wording is reproduced verbatim from index.html. The commission answers in particular are
// regulated disclosure (§11) — reword them only deliberately.

export interface HomeFaq {
  /** Anchor id, kept from index.html so existing deep links still resolve. */
  id: string
  q: string
  /**
   * Plain text, and it has to stay plain text: it is rendered as a text node by
   * Faq.astro AND used verbatim as the FAQPage `acceptedAnswer.text`. The "which
   * insurers" answer used to carry a `<div class="brand-row">…</div>` blob here, which
   * Astro correctly escaped — so the raw markup and an HTML comment rendered as visible
   * copy on the home page, and went into the schema as well. Structured data, not
   * markup: anything visual belongs in a typed field like `insurers` below.
   */
  a: string
  /** Rendered as a brand row under the answer. Logo filenames live in js/policy-data.js. */
  insurers?: Array<{ name: string; logo: string }>
}

export const homeFaqs: HomeFaq[] = [
  {
    id: "faq1",
    q: "Is your advice really free?",
    a:
      "Yes, 100% free. We don't charge you a single rupee for our advice. We earn a standard commission from the insurance company when you purchase a policy through us — the same commission any agent would earn. This means the price you pay is exactly the same whether you buy directly or through us.",
  },
  {
    id: "faq2",
    q: "How do you make money?",
    a:
      "We receive a standard commission from insurance companies when a policy is purchased through us. This is regulated by IRDAI and is the same commission any distributor earns. Importantly, our commissions don't vary much across insurers, so we have no incentive to push one product over another.",
  },
  {
    id: "faq3",
    q: "Do you help with claims?",
    a:
      "Yes. Six months or six years after you bought it, we handle documentation, insurer follow-ups, escalations and settlement tracking at no extra cost. That is what \"lifetime claim support\" means.",
  },
  {
    id: "faq8",
    q: "I bought my policy somewhere else. Will you still help me claim?",
    a:
      "Yes, and there is no charge. Bank, another agent, an app — send us the policy document and we will file and follow up as though you were our own customer. You are not required to move the policy to us, now or later.",
  },
  {
    id: "faq9",
    q: "My claim was rejected. Is there anything I can still do?",
    a:
      "Often, yes. We read the rejection letter against the policy wording — a fair share cite a clause that does not apply, or a waiting period already served. If it does not hold up we go to the insurer's grievance cell, then the Insurance Ombudsman: a free statutory forum whose decisions bind the insurer.",
  },
  {
    id: "faq4",
    q: "Which insurers do you work with?",
    a:
      "We are an IRDAI-licensed insurance advisor and work with leading insurers across life and health. We continuously evaluate them on claim settlement, complaint volume and servicing, and recommend only the ones that hold up.",
    insurers: [
      { name: 'HDFC Life', logo: 'hdfclife.png' },
      { name: 'ICICI Prudential', logo: 'icicipru.png' },
      { name: 'Axis Max Life', logo: 'axismax.png' },
      { name: 'Tata AIA', logo: 'tataaia.png' },
      { name: 'Bajaj Life', logo: 'bajajlife.png' },
      { name: 'Niva Bupa', logo: 'nivabupa.png' },
      { name: 'HDFC ERGO', logo: 'hdfcergo.png' },
      { name: 'Care Health', logo: 'care.png' },
      { name: 'Aditya Birla', logo: 'abhi.png' },
      { name: 'Star Health', logo: 'star.png' },
      { name: 'SBI General', logo: 'sbigeneral.png' },
    ],
  },
  {
    id: "faq5",
    q: "Can I buy insurance directly through you?",
    a:
      "Yes! Once you've decided on a plan with your advisor's help, we assist you through the entire purchase process — application, medical tests (if needed), payment, and policy issuance. The policy is issued directly by the insurer; we simply facilitate the process and make it seamless.",
  },
  {
    id: "faq6",
    q: "How is My Insurance Bro different from aggregator sites?",
    a:
      "Aggregator sites show you a price comparison and leave you to decide on your own. We go much further: a dedicated human advisor analyzes your specific needs, explains policy details in plain language, helps you through the application, and provides lifetime claims support. We're not a comparison tool — we're your insurance partner.",
  },
  {
    id: "faq7",
    q: "Will I get spam calls after reaching out?",
    a:
      "Never. Zero spam is one of our founding principles. You'll be connected with one dedicated advisor who will call you at a time that works for you. We don't sell your data, we don't auto-dial, and we don't bombard you with follow-ups. If you need space, just tell us.",
  },
]
