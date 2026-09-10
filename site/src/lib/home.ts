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
  a: string
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
      "Absolutely. Claims support is where we truly stand out. Whether it's 6 months or 6 years after you bought the policy, our team will assist you with documentation, follow-ups with the insurer, escalations, and settlement tracking — at no extra cost. This is what \"lifetime claim support\" means.",
  },
  {
    id: "faq8",
    q: "I bought my policy somewhere else. Will you still help me claim?",
    a:
      "Yes — and there is no charge and no catch. If you bought through a bank, another agent, or directly from an app, send us the policy document and we will help you file and follow up on the claim as though you were our own customer. You are not required to move the policy to us, now or later. We do this because the moment someone actually needs a claim is the moment good advice matters most, and far too many people find their original seller has gone quiet by then.",
  },
  {
    id: "faq9",
    q: "My claim was rejected. Is there anything I can still do?",
    a:
      "Often, yes. A rejection is not the end of the process. We start by reading the rejection letter against the actual policy wording, because a meaningful share of rejections cite a clause that does not apply or a waiting period that has already been served. If the rejection does not hold up, we take it to the insurer's grievance cell, and then to the Insurance Ombudsman — a free, statutory forum whose decisions bind the insurer. Send us the policy and the rejection letter and we will tell you honestly whether it is worth contesting.",
  },
  {
    id: "faq4",
    q: "Which insurers do you work with?",
    a:
      "We are an IRDAI-registered corporate agent (composite) and work with leading insurers across life and health. We continuously evaluate them on claim settlement, complaint volume and servicing, and recommend only the ones that hold up. <!-- The accordion measures its own height, so adding this row is safe — see the FAQ block in main.js. --> <div class=\"brand-row\"> <span class=\"brand-chip\"><span class=\"brand-tile xs has-logo\"><img class=\"brand-logo\" src=\"assets/logos/hdfclife.png\" alt=\"\" width=\"22\" height=\"22\" loading=\"lazy\"></span> HDFC Life</span> <span class=\"brand-chip\"><span class=\"brand-tile xs has-logo\"><img class=\"brand-logo\" src=\"assets/logos/icicipru.png\" alt=\"\" width=\"22\" height=\"22\" loading=\"lazy\"></span> ICICI Prudential</span> <span class=\"brand-chip\"><span class=\"brand-tile xs has-logo\"><img class=\"brand-logo\" src=\"assets/logos/axismax.png\" alt=\"\" width=\"22\" height=\"22\" loading=\"lazy\"></span> Axis Max Life</span> <span class=\"brand-chip\"><span class=\"brand-tile xs has-logo\"><img class=\"brand-logo\" src=\"assets/logos/tataaia.png\" alt=\"\" width=\"22\" height=\"22\" loading=\"lazy\"></span> Tata AIA</span> <span class=\"brand-chip\"><span class=\"brand-tile xs has-logo\"><img class=\"brand-logo\" src=\"assets/logos/bajajlife.png\" alt=\"\" width=\"22\" height=\"22\" loading=\"lazy\"></span> Bajaj Life</span> <span class=\"brand-chip\"><span class=\"brand-tile xs has-logo\"><img class=\"brand-logo\" src=\"assets/logos/nivabupa.png\" alt=\"\" width=\"22\" height=\"22\" loading=\"lazy\"></span> Niva Bupa</span> <span class=\"brand-chip\"><span class=\"brand-tile xs has-logo\"><img class=\"brand-logo\" src=\"assets/logos/hdfcergo.png\" alt=\"\" width=\"22\" height=\"22\" loading=\"lazy\"></span> HDFC ERGO</span> <span class=\"brand-chip\"><span class=\"brand-tile xs has-logo\"><img class=\"brand-logo\" src=\"assets/logos/care.png\" alt=\"\" width=\"22\" height=\"22\" loading=\"lazy\"></span> Care Health</span> <span class=\"brand-chip\"><span class=\"brand-tile xs has-logo\"><img class=\"brand-logo\" src=\"assets/logos/abhi.png\" alt=\"\" width=\"22\" height=\"22\" loading=\"lazy\"></span> Aditya Birla</span> <span class=\"brand-chip\"><span class=\"brand-tile xs has-logo\"><img class=\"brand-logo\" src=\"assets/logos/star.png\" alt=\"\" width=\"22\" height=\"22\" loading=\"lazy\"></span> Star Health</span> <span class=\"brand-chip\"><span class=\"brand-tile xs has-logo\"><img class=\"brand-logo\" src=\"assets/logos/sbigeneral.png\" alt=\"\" width=\"22\" height=\"22\" loading=\"lazy\"></span> SBI General</span>",
  },
  {
    id: "faq5",
    q: "Can I buy insurance directly through you?",
    a:
      "Yes! Once you've decided on a plan with your advisor's help, we assist you through the entire purchase process — application, medical tests (if needed), payment, and policy issuance. The policy is issued directly by the insurer; we simply facilitate the process and make it seamless.",
  },
  {
    id: "faq6",
    q: "How is Myinsurancebro different from aggregator sites?",
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
