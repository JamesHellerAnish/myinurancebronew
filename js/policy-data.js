/* ═══════════════════════════════════════════════════════
   MYINSURANCEBRO — POLICY DATASET

   All figures are 3-year averages for FY 2024–26 unless noted,
   compiled from:
     · IRDAI Annual Report & public grievance disclosures
     · Insurer public disclosures (Form NL-* / policy brochures)
     · Insurer policy wordings for coverage, exclusions & waiting periods

   Scores are Myinsurancebro's own assessment. Weighting:
     Plan features 45% · Insurer strength 45% · Premium 10%

   Premiums are indicative illustrations for the stated profile and
   are NOT quotes. Always confirm against the official policy document.
   ═══════════════════════════════════════════════════════ */

var policyData = {

  meta: {
    period: 'FY 2024–26 (3-year average)',
    updated: 'August 2026',
    source: 'IRDAI Annual Report, insurer public disclosures & policy wordings',
    weighting: 'Plan features 45% · Insurer strength 45% · Premium 10%'
  },

  /* ── How we score, shown in the UI for transparency ─────────── */
  methodology: {
    plan: [
      { label: 'Plan features', weight: 45, note: 'Cover structure, restoration, riders, waiting periods, payout flexibility' },
      { label: 'Insurer strength', weight: 45, note: 'Claim settlement ratio, complaint volume, solvency, scale of business' },
      { label: 'Premium', weight: 10, note: 'Cost across standard age and family profiles' }
    ],
    company: {
      term: [
        { label: 'Insurer strength', weight: 60, note: 'Claim settlement, complaints, financial scale' },
        { label: 'Protective features', weight: 30, note: 'Critical illness, waiver of premium, payout options' },
        { label: 'Premium affordability', weight: 10, note: 'Cost across standard profiles' }
      ],
      health: [
        { label: 'Gross written premium', weight: 25, note: 'Scale of the health book' },
        { label: 'Claim settlement ratio', weight: 22, note: '3-year average' },
        { label: 'Hospital network', weight: 17, note: 'Cashless reach' },
        { label: 'Complaint volume', weight: 15, note: 'Grievances per 10,000 claims' },
        { label: 'TPA model', weight: 10, note: 'In-house claims desk vs outsourced' },
        { label: 'Online servicing', weight: 10, note: 'Digital claims and policy management' }
      ]
    }
  },

  /* ── Premium illustration profiles ──────────────────────────── */
  profiles: {
    term: {
      assumption: '₹2 crore cover to age 65 · healthy non-smoker, salaried, Delhi (110010) · annual premium incl. GST',
      rows: [
        { key: 'm25', label: '25, Male' },
        { key: 'f25', label: '25, Female' },
        { key: 'm30', label: '30, Male' },
        { key: 'f30', label: '30, Female' },
        { key: 'm35', label: '35, Male' },
        { key: 'f35', label: '35, Female' }
      ]
    },
    health: {
      assumption: '₹15 lakh sum insured, Delhi · annual premium incl. GST and mandatory add-ons. SBI General is quoted at ₹50 lakh, its minimum base cover.',
      rows: [
        { key: 'ind25', label: 'Individual, 25' },
        { key: 'couple', label: 'Couple — 31 & 32' },
        { key: 'family', label: 'Family of 3 — 35, 34 & 5' },
        { key: 'seniors', label: 'Senior couple — 62 & 63' }
      ]
    }
  },

  /* ── Rows rendered in the side-by-side compare matrix ───────── */
  compareRows: {
    term: [
      { key: 'score', label: 'Myinsurancebro Score', type: 'score', better: 'high' },
      { key: 'metrics.csr', label: 'Claim settlement ratio', type: 'percent', better: 'high', help: '3-year average, individual death claims' },
      { key: 'metrics.complaints', label: 'Complaints per 10,000 claims', type: 'number', better: 'low', help: 'Lower is better — this is how often customers escalate' },
      { key: 'metrics.solvency', label: 'Solvency ratio', type: 'x', better: 'high', help: 'IRDAI requires a minimum of 1.5x' },
      { key: 'metrics.businessCr', label: 'Annual new business', type: 'crore', better: 'high' },
      { key: 'coverRange', label: 'Cover available', type: 'text' },
      { key: 'entryAge', label: 'Entry age', type: 'text' },
      { key: 'criticalIllness', label: 'Critical illness cover', type: 'text' },
      { key: 'premiumBreak', label: 'Premium break / holiday', type: 'bool' },
      { key: 'lifeStageBoost', label: 'Life stage cover boost', type: 'bool' },
      { key: 'smartExit', label: 'Exit with premiums back', type: 'bool' },
      { key: 'premiums.m30', label: 'Premium — 30, Male', type: 'rupee', better: 'low' },
      { key: 'premiums.f30', label: 'Premium — 30, Female', type: 'rupee', better: 'low' }
    ],
    health: [
      { key: 'score', label: 'Myinsurancebro Score', type: 'score', better: 'high' },
      { key: 'metrics.csr', label: 'Claim settlement ratio', type: 'percent', better: 'high', help: '3-year average' },
      { key: 'metrics.complaints', label: 'Complaints per 10,000 claims', type: 'number', better: 'low', help: 'Lower is better' },
      { key: 'metrics.network', label: 'Cashless hospitals', type: 'number', better: 'high' },
      { key: 'metrics.businessCr', label: 'Annual health premium', type: 'crore', better: 'high' },
      { key: 'coverRange', label: 'Sum insured available', type: 'text' },
      { key: 'restoration', label: 'Restoration of cover', type: 'text' },
      { key: 'bonus', label: 'No-claim bonus', type: 'text' },
      { key: 'waiting.ped', label: 'Pre-existing disease wait', type: 'years', better: 'low' },
      { key: 'waiting.specific', label: 'Specific illness wait', type: 'years', better: 'low' },
      { key: 'waiting.maternity', label: 'Maternity cover', type: 'text' },
      { key: 'roomRent', label: 'Room rent limit', type: 'text' },
      { key: 'consumables', label: 'Consumables covered', type: 'text' },
      { key: 'premiums.couple', label: 'Premium — couple, 31 & 32', type: 'rupee', better: 'low' },
      { key: 'premiums.seniors', label: 'Premium — seniors, 62 & 63', type: 'rupee', better: 'low' }
    ]
  },

  /* ── Insurer league tables ──────────────────────────────────── */
  companies: {
    term: [
      { name: 'Axis Max Life', score: 4.9, csr: 99.71, complaints: 3.00, solvency: 1.89, businessCr: 12567 },
      { name: 'HDFC Life', score: 4.55, csr: 99.66, complaints: 1.00, solvency: 1.86, businessCr: 33031 },
      { name: 'ICICI Prudential', score: 4.45, csr: 99.30, complaints: 8.00, solvency: 2.10, businessCr: 22239 },
      { name: 'Bajaj Life', score: 4.45, csr: 99.32, complaints: 2.77, solvency: 3.52, businessCr: 12791 },
      { name: 'SBI Life', score: 4.45, csr: 98.76, complaints: 6.67, solvency: 1.94, businessCr: 38789 },
      { name: 'Aditya Birla Sun Life', score: 4.20, csr: 98.70, complaints: 1.33, solvency: 1.82, businessCr: null }
    ],
    health: [
      { name: 'HDFC ERGO', score: 4.99, csr: 97.61, complaints: 8.87, businessCr: 6596.53 },
      { name: 'Bajaj General', score: 4.99, csr: 95.63, complaints: 3.85, businessCr: 7900.76 },
      { name: 'Aditya Birla Health', score: 4.49, csr: 96.25, complaints: 18.67, businessCr: 4920.43 },
      { name: 'Care Health', score: 4.23, csr: 95.45, complaints: 42.67, businessCr: 8404.67 },
      { name: 'Niva Bupa', score: 4.23, csr: 92.92, complaints: 37.13, businessCr: 6985.24 },
      { name: 'SBI General', score: 3.79, csr: 95.94, complaints: 14.04, businessCr: 4974.56 },
      { name: 'Go Digit', score: 3.69, csr: 99.01, complaints: 19.08, businessCr: 1666.04 },
      { name: 'Generali Central', score: 3.66, csr: 93.50, complaints: 11.68, businessCr: 1597.08 },
      { name: 'ICICI Lombard', score: 3.65, csr: 86.81, complaints: 15.05, businessCr: 7955.27 },
      { name: 'TATA AIG', score: 3.43, csr: 88.94, complaints: 11.47, businessCr: 3776.36 }
    ]
  },

  /* ── Insurer logos ──────────────────────────────────────────
     Keyed by the exact insurer string used elsewhere in this file, so
     `companies[]`, `plans[].insurer` and the static markup in index.html
     all resolve to the same logo.

     `logo` is a file in assets/logos/ — each insurer's own brand icon,
     downloaded from their site and served locally. Never hotlink these:
     the insurers' CDNs can and do block cross-site requests, and a broken
     partner logo on a broker's site looks like a dead partnership.

     `accent` and `initials` are the fallback tile for an insurer we have
     no logo file for — `brandFor()` returns them for anything unknown, so
     a new insurer renders as a coloured monogram rather than a broken
     image. Both are also what the pre-logo design used.

     These are registered trademarks. We display them as the insurers'
     appointed corporate agent, which is normal practice — but see §11 of
     the handoff before adding any insurer we do not actually place.
     ──────────────────────────────────────────────────────────── */
  brands: {
    'Axis Max Life':         { logo: 'axismax.png',      accent: '#7C3AED', initials: 'AM' },
    'Max Life':              { logo: 'axismax.png',      accent: '#7C3AED', initials: 'ML' },
    'HDFC Life':             { logo: 'hdfclife.png',     accent: '#0EA5E9', initials: 'HL' },
    'HDFC ERGO':             { logo: 'hdfcergo.png',     accent: '#DC2626', initials: 'HE' },
    'ICICI Prudential':      { logo: 'icicipru.png',     accent: '#F97316', initials: 'IP' },
    'ICICI Lombard':         { logo: 'icicilombard.png', accent: '#B45309', initials: 'IL' },
    'Bajaj Life':            { logo: 'bajajlife.png',    accent: '#0891B2', initials: 'BL' },
    'Bajaj General':         { logo: 'bajajgeneral.png', accent: '#0E7490', initials: 'BG' },
    'SBI Life':              { logo: 'sbilife.png',      accent: '#1E3A8A', initials: 'SL' },
    'SBI General':           { logo: 'sbigeneral.png',   accent: '#1E3A8A', initials: 'SG' },
    'Aditya Birla Sun Life': { logo: 'absl.png',         accent: '#DB2777', initials: 'AB' },
    'Aditya Birla Health':   { logo: 'abhi.png',         accent: '#DB2777', initials: 'AB' },
    'Care Health':           { logo: 'care.png',         accent: '#16A34A', initials: 'CH' },
    'Niva Bupa':             { logo: 'nivabupa.png',     accent: '#2563EB', initials: 'NB' },
    'Go Digit':              { logo: 'godigit.png',      accent: '#0D9488', initials: 'GD' },
    'Generali Central':      { logo: 'generali.png',     accent: '#9F1239', initials: 'GC' },
    'TATA AIG':              { logo: 'tataaig.png',      accent: '#1E293B', initials: 'TA' },
    'Tata AIA':              { logo: 'tataaia.png',      accent: '#1E293B', initials: 'TA' },
    'Star Health':           { logo: 'star.png',         accent: '#C2410C', initials: 'SH' }
  },

  /* ── Life-stage personas used by the Explore filter ─────────── */
  /* ── Life-stage personas ────────────────────────────────────
     The panel copy for #personas on the home page lives here, not in the markup.
     SEO_ASTRO_PLAN.md §7 and §12 step 7: the Astro home page renders these panels from
     the collection, so this file is the one place the wording exists. Adding a persona
     here and re-running `npm run migrate` is all it takes.

     planRecommendations reference plan ids rather than repeating insurer names or logo
     paths — CLAUDE.md invariant 5 keeps branding resolving through brandFor(). */
  personas: [
    {
      key: 'genz',
      label: 'Just started earning',
      age: '22–28',
      icon: 'briefcase',
      tone: '',
      teaser:
        'First job, first salary — and cover that quietly belongs to your employer, not to you.',
      headline: 'You are covered — until the day you resign',
      intro:
        'Group cover from your employer feels like a solved problem. It is the single most common gap ' +
        'we fix, because it disappears exactly when your income does.',
      pains: [
        {
          icon: 'briefcase',
          heading: 'Your group cover ends the day you leave',
          body:
            'Employer health cover is not portable. It does not follow you to the next job, it does not ' +
            'cover you through a notice period gap, and it ends immediately if you are laid off — which ' +
            'is the exact moment a hospital bill would hurt most.',
        },
        {
          icon: 'users',
          heading: 'You have aged off your parents\' family floater',
          body:
            'Most family floaters drop dependent children at 25. Many people discover this at a claim, ' +
            'not at renewal. If nobody has bought you a plan in your own name, you are uninsured and do ' +
            'not know it yet.',
        },
        {
          icon: 'clock',
          heading: 'Waiting periods only start counting once you buy',
          body:
            'Every health policy makes you wait 2–3 years before pre-existing and named illnesses are ' +
            'covered. Those years pass whether or not you have a policy — so the cheapest year to start ' +
            'serving them is this one, while you are healthy and premiums are at their lowest.',
          stat:
            'A 25-year-old pays ₹10,149/yr — the same cover at 45 costs several times more',
        }
      ],
      planRecommendations: [
        { planId: 'health-abhi-activ-one-max', reason: 'Cheapest health cover on our list' },
        { planId: 'term-bajaj-etouch-2', reason: 'Cheapest ₹2 Cr term cover' },
        { planId: 'health-nivabupa-reassure-2-platinum', reason: 'Rewards buying young — locks in your entry age' }
      ]
    },

    {
      key: 'newparent',
      label: 'New or expecting parent',
      age: '28–38',
      icon: 'baby',
      tone: 'teal',
      teaser:
        'A second person now depends on your income, and the clock on maternity waiting periods has ' +
        'already started.',
      headline: 'The cover has to exist before you need it',
      intro:
        'Maternity and newborn benefits are the one part of health insurance you cannot buy on ' +
        'demand. Almost every gap we see at this stage comes down to timing.',
      pains: [
        {
          icon: 'calendar',
          heading: 'Maternity waiting periods run 2–4 years',
          body:
            'You have to buy the cover well before you start planning, not once you are expecting. None ' +
            'of the five plans we rate covers maternity in its base policy — HDFC ERGO offers it through ' +
            'the Parenthood rider, and Aditya Birla needs a separate product entirely.',
          stat:
            'Buy after conception and maternity is simply not covered',
        },
        {
          icon: 'baby',
          heading: 'Newborns need cover from day one',
          body:
            'A newborn can be admitted to the NICU within hours of birth, and that is one of the most ' +
            'expensive admissions in Indian healthcare. Cover for the child has to already be in place, ' +
            'structured correctly, before the delivery.',
        },
        {
          icon: 'home',
          heading: 'Your term cover now has to clear 20 years of liability',
          body:
            'A child means roughly two decades of dependency, and for most people it arrives alongside a ' +
            'home loan. The cover you bought as a single 25-year-old was not sized for either.',
        },
        {
          icon: 'scale',
          heading: 'Both spouses are usually under-covered',
          body:
            'Cover typically gets bought for the higher earner only. If the other parent is uninsured, ' +
            'the household is still one event away from a crisis — including the cost of replacing unpaid ' +
            'care.',
        }
      ],
      planRecommendations: [
        { planId: 'health-hdfcergo-optima-secure-plus', reason: 'Parenthood maternity rider available' },
        { planId: 'term-axismax-smart-term-plus', reason: '99.71% claim settlement — the highest in India' },
        { planId: 'term-hdfc-click2protect-supreme-plus', reason: 'Raises cover at childbirth, no fresh medicals' }
      ]
    },

    {
      key: 'sandwich',
      label: 'Kids and parents to cover',
      age: '45–60',
      icon: 'users',
      tone: 'warm',
      teaser:
        'You are holding up two generations at once — and you are the single point of failure for ' +
        'both.',
      headline: 'Two generations, one income, no margin for error',
      intro:
        'This is the hardest stage to insure and the one where getting the details wrong is most ' +
        'expensive. Senior-parent cover in particular rewards precision.',
      pains: [
        {
          icon: 'alert-triangle',
          heading: 'Parents over 60 face co-pays, loading and full waiting periods',
          body:
            'Premiums rise steeply, insurers add a co-payment share, and pre-existing conditions — which ' +
            'most people over 60 have — sit behind a 2 to 3 year wait. Which insurer you pick decides ' +
            'whether that wait is two years or three.',
          stat:
            'A senior couple costs ₹66,505–₹78,923/yr at ₹15 L cover',
        },
        {
          icon: 'briefcase',
          heading: 'Your corporate floater will not take them',
          body:
            'Most employer plans either exclude parents outright or price them as a punitive add-on with ' +
            'thin limits. And like all group cover, it ends the day you change jobs — taking your ' +
            'parents\' only protection with it.',
        },
        {
          icon: 'trending-up',
          heading: 'Your kids\' education corpus is exposed',
          body:
            'College costs are a fixed future liability sitting on a single income. Without term cover ' +
            'sized to it, that corpus is the first thing that gets liquidated.',
        },
        {
          icon: 'users',
          heading: 'You are the single point of failure for two generations',
          body:
            'Parents above you, children below, and both financially dependent on you continuing to earn. ' +
            'That is the definition of a risk that has to be transferred rather than absorbed.',
        }
      ],
      planRecommendations: [
        { planId: 'health-sbi-super-health-platinum-infinite', reason: '2-year pre-existing wait — a full year less than the rest' },
        { planId: 'health-hdfcergo-optima-secure-plus', reason: 'Best claims record in health insurance' },
        { planId: 'term-absl-super-term', reason: 'Critical illness cover built into the base plan' }
      ]
    }
  ],

  /* ═══════════════════════════════════════════════════════════
     PRODUCTS
     ═══════════════════════════════════════════════════════════ */
  products: {

    /* ───────────────────────── TERM LIFE ───────────────────── */
    term: {
      key: 'term',
      label: 'Term Life Insurance',
      short: 'Term',
      icon: 'shield',
      blurb: 'Pays your family a lump sum if you are not around. The cheapest way to buy a large cover.',
      csrLabel: 'Individual death claims settled (3-yr avg)',

      plans: [
        {
          id: 'term-axismax-smart-term-plus',
          category: 'term',
          insurer: 'Axis Max Life',
          insurerShort: 'Axis Max',
          name: 'Smart Term Plan Plus',
          monogram: 'AM',
          accent: '#7C3AED',
          icon: 'shield',
          tagline: 'Our top pick',
          subtitle: 'The highest claim settlement ratio in India, paired with the most flexible variant lineup on the market.',
          score: 4.7,
          scoreBreakdown: { features: 4.1, insurer: 5.0, premium: 5.0 },
          metrics: { csr: 99.71, complaints: 3.00, solvency: 1.89, businessCr: 12567 },
          entryAge: '18–65 yrs',
          coverRange: '₹25 L – ₹10 Cr',
          tenure: 'To age 85 / whole life',
          criticalIllness: 'Rider — 64 illnesses, 20 yrs',
          premiumBreak: true,
          lifeStageBoost: false,
          smartExit: false,
          premiums: { m25: 17222, f25: 14640, m30: 20656, f30: 17558, m35: 26552, f35: 22570 },
          bestFor: ['genz', 'newparent', 'sandwich'],
          tags: ['Best all-round', 'Highest CSR', 'Most variants'],
          features: [
            'Six variants — Level Cover, Smart Cover, Early ROP Plus, ROP, Whole Life and Income Protection',
            'Smart Cover pays 1.5× the base cover during the first 15 years, when your liabilities peak',
            'Critical illness rider covering 64 illnesses for up to 20 years',
            'Terminal illness benefit — accelerated payout of up to ₹1 crore on diagnosis',
            'Cover Continuance lets you defer a year of premium without losing the policy',
            'Instant payout of up to ₹2 lakh released to the nominee at claim intimation'
          ],
          covered: [
            'Death from any cause, natural or accidental',
            'Terminal illness — payout accelerated on diagnosis',
            'Critical illness — lump sum on diagnosis (rider)',
            'Premiums waived on listed illnesses or disability (rider)'
          ],
          notCovered: [
            'Suicide within 12 months of policy start or revival',
            'Death traced to a pre-existing condition you did not disclose',
            'Claims found to be fraudulent or materially misrepresented',
            'Hazardous pursuits that were not declared at application'
          ],
          riders: ['Critical Illness — 64 conditions', 'Accidental Death', 'Waiver of Premium', 'Comprehensive Accident Benefit'],
          pros: [
            'At 99.71%, the highest 3-year claim settlement ratio of any Indian life insurer',
            'Only 3 complaints per 10,000 claims — the claims desk rarely needs escalating',
            'Six variants means the plan can be shaped around almost any situation',
            'Priced competitively despite the feature depth',
            'Cover Continuance protects you through a job loss or income gap'
          ],
          cons: [
            'Lower brand recall than HDFC Life or SBI Life, which puts some buyers off',
            'The return-of-premium variants cost significantly more — usually not worth it',
            'Medical underwriting can be strict on covers above ₹2 crore',
            'Solvency of 1.89x is comfortable but below Bajaj Life'
          ],
          verdict: 'This is the plan we recommend most often, and the reason is simple: when your family actually needs to claim, this is the insurer most likely to pay without a fight. The 99.71% settlement ratio and near-zero complaint volume are the two numbers that matter, and Axis Max Life leads on both. The six-variant lineup means we can usually fit it to your situation rather than the other way round. It is not the cheapest, but the gap is small enough that we would not trade it away.'
        },
        {
          id: 'term-hdfc-click2protect-supreme-plus',
          category: 'term',
          insurer: 'HDFC Life',
          insurerShort: 'HDFC Life',
          name: 'Click2Protect Supreme Plus',
          monogram: 'HL',
          accent: '#0EA5E9',
          icon: 'shield',
          tagline: 'Best servicing',
          subtitle: 'One complaint per 10,000 claims — the lowest in the industry. You pay for that reliability.',
          score: 4.4,
          scoreBreakdown: { features: 4.3, insurer: 5.0, premium: 3.0 },
          metrics: { csr: 99.66, complaints: 1.00, solvency: 1.86, businessCr: 33031 },
          entryAge: '18–65 yrs',
          coverRange: '₹25 L – ₹10 Cr',
          tenure: 'To age 85 / whole life',
          criticalIllness: 'Rider — 60 illnesses, 15 yrs',
          premiumBreak: true,
          lifeStageBoost: true,
          smartExit: true,
          premiums: { m25: 19719, f25: 16761, m30: 25153, f30: 21380, m35: 31118, f35: 26451 },
          bestFor: ['newparent', 'sandwich'],
          tags: ['Fewest complaints', 'Life stage boosts'],
          features: [
            'Three variants — Life, Life Plus and Life Goal',
            'Life Stage Boost raises your cover at marriage or childbirth with no fresh medicals',
            'Premium Break lets you pause premiums temporarily while cover stays live',
            'Waiver of premium on critical illness or disability',
            'Critical illness rider covering 60 illnesses for up to 15 years',
            'Nominee can take the payout as a lump sum or as a monthly income'
          ],
          covered: [
            'Death from any cause during the policy term',
            'Terminal illness — full sum assured paid on diagnosis',
            'Accidental death with enhanced payout (rider)',
            'Critical illness across 60 conditions (rider)'
          ],
          notCovered: [
            'Suicide within 12 months of policy start or revival',
            'Death traced to an undisclosed medical condition',
            'Fraudulent claims or material misrepresentation',
            'Self-inflicted injury within the exclusion period'
          ],
          riders: ['Critical Illness — 60 conditions', 'Accidental Death', 'Waiver of Premium', 'Income Benefit'],
          pros: [
            'Just 1 complaint per 10,000 claims — nobody else in the industry is close',
            '99.66% settlement ratio, second only to Axis Max Life',
            'Life Stage Boost is genuinely useful if you marry or have a child mid-term',
            'The largest servicing network of the private life insurers',
            'Buying and servicing online is the smoothest of the five'
          ],
          cons: [
            'Consistently the most expensive of the five — roughly 20% above Bajaj at age 30',
            'Return-of-premium variant carries a steep loading',
            'Rider stacking pushes the premium up quickly',
            'Document requests during underwriting can involve some back-and-forth'
          ],
          verdict: 'If servicing quality is what keeps you up at night, this is the plan. One complaint per 10,000 claims is an extraordinary number and it reflects a claims process that mostly just works. The catch is price — you are paying a real premium over Bajaj or ICICI for that reliability. For a young buyer on a tight budget we would usually point elsewhere; for a family where the payout has to be certain, the extra cost is defensible.'
        },
        {
          id: 'term-icici-iprotect-smart-plus',
          category: 'term',
          insurer: 'ICICI Prudential',
          insurerShort: 'ICICI Pru',
          name: 'iProtect Smart Plus',
          monogram: 'IP',
          accent: '#F97316',
          icon: 'shield',
          tagline: 'Most flexible exit',
          subtitle: 'Strong pricing, a solid 2.10x solvency ratio, and the option to walk away with your premiums back.',
          score: 4.3,
          scoreBreakdown: { features: 3.8, insurer: 4.4, premium: 5.0 },
          metrics: { csr: 99.30, complaints: 8.00, solvency: 2.10, businessCr: 22239 },
          entryAge: '18–65 yrs',
          coverRange: '₹50 L – ₹10 Cr',
          tenure: 'To age 85',
          criticalIllness: 'Rider — 34 illnesses',
          premiumBreak: true,
          lifeStageBoost: true,
          smartExit: true,
          premiums: { m25: 15951, f25: 13558, m30: 19093, f30: 16229, m35: 26030, f35: 22126 },
          bestFor: ['genz', 'newparent'],
          tags: ['Great value', 'Smart Exit'],
          features: [
            'Three variants — Life, Life Plus and Life Rebalance',
            'Life Stage Protection raises cover at marriage, childbirth or a home loan',
            'Smart Exit returns your premiums if you decide the cover is no longer needed',
            'Premium Break of up to a year after a run of regular payments',
            'Instant partial payout of ₹3 lakh at claim intimation on larger covers',
            'Nominee can choose a lump sum or a structured income'
          ],
          covered: [
            'Death from any cause during the policy term',
            'Terminal illness — full sum assured on diagnosis',
            'Accidental death with enhanced payout (rider)',
            'Critical illness across 34 conditions (rider)'
          ],
          notCovered: [
            'Suicide within 12 months of policy start or revival',
            'Death traced to an undisclosed medical condition',
            'Fraudulent claims or material misrepresentation',
            'Self-inflicted injury within the exclusion period'
          ],
          riders: ['Accidental Death', 'Accidental Disability', 'Critical Illness — 34 conditions', 'Waiver of Premium'],
          pros: [
            'Among the cheapest of the five, especially for women',
            'Solvency of 2.10x — the second strongest balance sheet here',
            'Smart Exit is a real safety valve if your circumstances change',
            'Large, established insurer with deep servicing infrastructure',
            'Life Stage Protection covers the milestones that actually change your cover need'
          ],
          cons: [
            '8 complaints per 10,000 claims — the highest of the five by some margin',
            'Critical illness rider covers 34 conditions against 60–64 elsewhere',
            'Feature depth is thinner than Axis Max or HDFC Life',
            'Settlement ratio of 99.30% is good but trails the top two'
          ],
          verdict: 'A well-priced plan from a large insurer, and the Smart Exit option is genuinely rare. Where it slips is servicing — 8 complaints per 10,000 claims is roughly eight times HDFC Life. That will not matter for most people, but it is the one number we would want you to see before choosing this over the top two. Good pick if price is the deciding factor and you want a household-name insurer.'
        },
        {
          id: 'term-bajaj-etouch-2',
          category: 'term',
          insurer: 'Bajaj Life',
          insurerShort: 'Bajaj Life',
          name: 'eTouch II',
          monogram: 'BL',
          accent: '#0891B2',
          icon: 'shield',
          tagline: 'Cheapest cover',
          subtitle: 'The lowest premium of the five and a 3.52x solvency ratio — the strongest balance sheet in the market.',
          score: 4.2,
          scoreBreakdown: { features: 3.4, insurer: 4.7, premium: 5.0 },
          metrics: { csr: 99.32, complaints: 2.77, solvency: 3.52, businessCr: 12791 },
          entryAge: '18–65 yrs',
          coverRange: '₹25 L – ₹10 Cr',
          tenure: 'To age 85 / whole life',
          criticalIllness: 'Rider',
          premiumBreak: true,
          lifeStageBoost: false,
          smartExit: true,
          premiums: { m25: 15474, f25: 14482, m30: 20132, f30: 16234, m35: 25311, f35: 21675 },
          bestFor: ['genz', 'newparent'],
          tags: ['Lowest premium', 'Best solvency', 'NRI friendly'],
          features: [
            'Three variants — Life Shield, Life Shield Plus and Life Shield ROP',
            'Terminal illness payout of up to ₹2 crore released early on diagnosis',
            'Waiver of premium on accidental disability or terminal illness',
            'Premium Holiday add-on lets you skip payments without losing cover',
            'Early exit value available at defined ages and tenures',
            'Health management services — teleconsults, annual checks, pharmacy discounts'
          ],
          covered: [
            'Death from any cause during the policy term',
            'Terminal illness — early benefit of up to ₹2 crore',
            'Accidental death with enhanced cover (rider)',
            'Premiums waived on accidental disability'
          ],
          notCovered: [
            'Suicide within 12 months of policy start or revival',
            'Death traced to an undisclosed medical condition',
            'Fraudulent claims or material misrepresentation',
            'War, military action or nuclear events'
          ],
          riders: ['Accidental Death', 'Waiver of Premium', 'Premium Holiday', 'Income Payout'],
          pros: [
            'The cheapest of the five at almost every age and gender',
            'Solvency of 3.52x is more than double the regulatory minimum',
            '2.77 complaints per 10,000 claims — better than ICICI and Axis Max',
            'Onboarding is unusually smooth for NRI applicants and for smokers',
            'Stays competitive even once you add the useful riders'
          ],
          cons: [
            'The thinnest built-in feature set of the five',
            'No life stage boost — you cannot raise cover without fresh underwriting',
            'Smaller on-ground presence outside metros',
            'Lower brand recall, which matters if your family will handle the claim'
          ],
          verdict: 'If budget is the binding constraint, start here. You get the strongest solvency in the industry, a settlement ratio inside the top five, and a premium that undercuts HDFC Life by roughly 20%. What you give up is feature depth — there is no life stage boost, and the rider menu is short. For a 25-year-old buying a first cover, that trade is usually worth making.'
        },
        {
          id: 'term-absl-super-term',
          category: 'term',
          insurer: 'Aditya Birla Sun Life',
          insurerShort: 'ABSL',
          name: 'Super Term Plan',
          monogram: 'AB',
          accent: '#DC2626',
          icon: 'shield',
          tagline: 'Critical illness built in',
          subtitle: 'Covers 42 critical illnesses inside the base plan — most insurers charge extra for that as a rider.',
          score: 4.0,
          scoreBreakdown: { features: 4.2, insurer: 3.7, premium: 5.0 },
          metrics: { csr: 98.70, complaints: 1.33, solvency: 1.82, businessCr: null },
          entryAge: '18–65 yrs',
          coverRange: '₹25 L – ₹10 Cr',
          tenure: 'To age 85',
          criticalIllness: 'Built in — 42 illnesses',
          premiumBreak: true,
          lifeStageBoost: true,
          smartExit: true,
          premiums: { m25: 18607, f25: 16343, m30: 21767, f30: 18235, m35: 23400, f35: 19890 },
          bestFor: ['newparent', 'sandwich'],
          tags: ['CI included', 'Inflation-linked cover'],
          features: [
            'Three variants — Level Cover, Increasing Cover (5% a year to 200%) and ROP',
            'Accelerated critical illness built in — 42 illnesses, up to 50% of cover, capped at ₹50 lakh',
            'Terminal illness payout of up to ₹1 crore included',
            'Accidental total and permanent disability waives all future premiums',
            'Life stage flexibility to raise cover at marriage, childbirth or a home purchase',
            'Cover Continuance allows premium deferral under defined conditions'
          ],
          covered: [
            'Death from any cause during the policy term',
            'Critical illness across 42 conditions — built in, no rider needed',
            'Terminal illness — early payout of up to ₹1 crore',
            'Accidental disability — premium waiver'
          ],
          notCovered: [
            'Suicide within 12 months of policy start or revival',
            'Death traced to an undisclosed medical condition',
            'Fraudulent claims or material misrepresentation',
            'Self-inflicted injury within the exclusion period'
          ],
          riders: ['Accidental Death', 'Waiver of Premium', 'Accelerated Critical Illness (built in)'],
          pros: [
            'Built-in critical illness cover usually works out cheaper than a standalone rider',
            'Only 1.33 complaints per 10,000 claims — second best of the five',
            'The Increasing Cover variant grows 5% a year, which fights inflation over a 30-year term',
            'The cheapest option at age 35 for both men and women',
            'Early exit value available at certain ages and tenures'
          ],
          cons: [
            'At 98.70%, the lowest settlement ratio of the five',
            'Solvency of 1.82x is the thinnest here, though still above the 1.5x minimum',
            'The critical illness payout is capped at 50% of cover or ₹50 lakh, whichever is lower',
            'Smaller distribution footprint in some states'
          ],
          verdict: 'The built-in critical illness cover is the whole argument for this plan, and it is a good one — bundling 42 conditions into the base premium usually beats buying a rider separately. The counterweight is that Aditya Birla Sun Life has the weakest insurer metrics of the five. If you want term and critical illness in a single policy and are comfortable with a 98.70% settlement ratio, this makes sense. If you would rather maximise claim certainty, take Axis Max Life and buy the rider.'
        }
      ]
    },

    /* ───────────────────────── HEALTH ───────────────────────── */
    health: {
      key: 'health',
      label: 'Health Insurance',
      short: 'Health',
      icon: 'heart-pulse',
      blurb: 'Pays your hospital bills. The single most important policy for anyone with dependants.',
      csrLabel: 'Health claims settled (3-yr avg)',

      plans: [
        {
          id: 'health-hdfcergo-optima-secure-plus',
          category: 'health',
          insurer: 'HDFC ERGO',
          insurerShort: 'HDFC ERGO',
          name: 'Optima Secure+',
          monogram: 'HE',
          accent: '#DC2626',
          icon: 'heart-pulse',
          tagline: 'Our top pick',
          subtitle: 'The most reliable claims desk in health insurance, on a plan whose cover grows every single year.',
          score: 4.6,
          scoreBreakdown: { features: 4.5, insurer: 5.0, premium: 3.5 },
          metrics: { csr: 97.61, complaints: 8.87, network: 16000, businessCr: 6596.53 },
          entryAge: '18–65 yrs',
          coverRange: '₹10 L – ₹2 Cr',
          tenure: '1–5 years',
          restoration: 'Unlimited, built in',
          bonus: 'Infinity Benefit — 100% of base cover added every year, no cap',
          roomRent: 'No limit — any room category',
          consumables: 'Covered in base plan',
          waiting: { ped: 3, specific: 2, maternity: 'Parenthood rider' },
          premiums: { ind25: 13459, couple: 21128, family: 26017, seniors: 75608 },
          bestFor: ['newparent', 'sandwich'],
          tags: ['Best claims record', 'Cover doubles day 1', 'Consumables included'],
          features: [
            'Secure Benefit doubles your cover from day one — buy ₹10 lakh, hold ₹20 lakh',
            'Infinity Benefit adds 100% of the base cover every year with no upper limit and regardless of claims',
            'Consumables — gloves, masks, syringes, PPE — are covered, which typically saves ₹5,000–15,000 a hospitalisation',
            'Pre-hospitalisation for 60 days and post-hospitalisation for 180 days',
            'Home healthcare, daycare, organ donor and AYUSH treatment all included',
            'Riders available for serious illness, chronic care (ABCD), maternity (Parenthood) and limitless cover'
          ],
          covered: [
            'In-patient hospitalisation in any room category',
            'Pre-hospitalisation expenses for 60 days before admission',
            'Post-hospitalisation expenses for 180 days after discharge',
            'Daycare procedures',
            'Home healthcare and domiciliary treatment',
            'Organ donor expenses',
            'AYUSH treatment up to the full sum insured',
            'Consumables and non-payable items'
          ],
          notCovered: [
            'Pre-existing conditions for the first 3 years (reducible to 1 or 2 years with an add-on)',
            'A named list of illnesses for the first 2 years — cataract, hernia, joint replacement and others',
            'Maternity and newborn expenses unless you add the Parenthood rider',
            'Routine dental and vision care',
            'Cosmetic procedures and weight-management treatment',
            'Any claim in the first 30 days except accidents'
          ],
          riders: ['Serious Illness Booster', 'Limitless', 'Parenthood (maternity)', 'ABCD Chronic Care', 'PED Waiting Period Modification'],
          pros: [
            '97.61% settlement ratio — the highest of any major health insurer',
            '8.87 complaints per 10,000 claims, against 42.67 for Care Health',
            '16,000+ cashless hospitals, the widest network here',
            'Cover compounds every year through Infinity Benefit, so a ₹10 lakh policy is worth far more by year five',
            'Consumables are in the base plan rather than a paid add-on'
          ],
          cons: [
            'The most expensive of the five for a young individual buyer',
            'The 3-year pre-existing disease wait is standard, not market-leading',
            'The senior couple premium of ₹75,608 is steep',
            'Ambulance cover is limited compared with SBI General'
          ],
          verdict: 'This is the plan we put in front of most families, and the reason is the claims record rather than the feature list. A 97.61% settlement ratio with 8.87 complaints per 10,000 claims means that when you are standing at a hospital billing desk, this insurer is the one most likely to just pay. The Infinity Benefit is the other reason — cover that adds 100% of the base every year with no ceiling quietly solves the medical-inflation problem that catches most people out a decade in. It costs more than Activ One MAX. We think it is worth it.'
        },
        {
          id: 'health-care-supreme',
          category: 'health',
          insurer: 'Care Health',
          insurerShort: 'Care',
          name: 'Care Supreme',
          monogram: 'CH',
          accent: '#16A34A',
          icon: 'heart-pulse',
          tagline: 'Widest network',
          subtitle: 'Unlimited restoration and 22,000+ cashless hospitals — but the highest complaint volume of the five.',
          score: 4.5,
          scoreBreakdown: { features: 4.8, insurer: 3.9, premium: 4.5 },
          metrics: { csr: 95.45, complaints: 42.67, network: 22100, businessCr: 8404.67 },
          entryAge: '18–65 yrs',
          coverRange: '₹5 L – ₹1 Cr',
          tenure: '1–3 years',
          restoration: 'Unlimited automatic recharge',
          bonus: 'Up to 100%, extendable to 500% or unlimited via add-on',
          roomRent: 'No limit on ₹10 L and above',
          consumables: 'Claim Shield Plus add-on — 146 items',
          waiting: { ped: 3, specific: 2, maternity: 'Not covered' },
          premiums: { ind25: 15111, couple: 21528, family: 27161, seniors: 78923 },
          bestFor: ['genz', 'newparent'],
          tags: ['22,100+ hospitals', 'Unlimited recharge', 'Wellness discounts'],
          features: [
            'Unlimited automatic recharge — your cover resets for both related and unrelated illnesses',
            'Cumulative bonus of up to 100%, extendable to 500% or unlimited with an add-on',
            'Claim Shield Plus add-on covers 146 items hospitals normally bill you separately for',
            'Instant Cover add-on can cut the pre-existing disease wait from 3 years to 30 days',
            'Wellness tracking earns up to 30% off your renewal premium',
            'Pre-hospitalisation 60 days, post-hospitalisation 180 days, 400+ daycare procedures'
          ],
          covered: [
            'In-patient hospitalisation in any room category',
            'Pre-hospitalisation for 60 days and post-hospitalisation for 180 days',
            '400+ daycare procedures',
            'Modern treatments including robotic surgery and balloon sinuplasty',
            'Organ donor expenses in full',
            'Second medical opinion from an expert panel',
            'Emergency treatment overseas'
          ],
          notCovered: [
            'Pre-existing conditions for the first 3 years, unless you add Instant Cover',
            'A list of 13 named conditions for the first 2 years',
            'Maternity and childcare expenses entirely',
            'Dental treatment unless it follows an accident',
            'Congenital conditions until year 10',
            'Experimental or unproven treatment'
          ],
          riders: ['Claim Shield / Claim Shield Plus', 'Instant Cover (PED wait reduction)', 'Cumulative Bonus Extension', 'OPD Cover', 'Air Ambulance', 'Gym Membership'],
          pros: [
            '22,100+ cashless hospitals — the widest reach, and it shows in tier-2 and tier-3 cities',
            'Unlimited automatic recharge is genuinely rare and matters in a bad year',
            'Instant Cover can cut the pre-existing disease wait to 30 days, which no one else here offers',
            'Cheaper than HDFC ERGO for families',
            'The add-on menu is the most flexible of the five'
          ],
          cons: [
            '42.67 complaints per 10,000 claims — nearly five times HDFC ERGO. This is the headline problem',
            '95.45% settlement ratio is respectable but trails HDFC ERGO by two full points',
            'No complimentary annual health check-up',
            'Consumables need the paid Claim Shield add-on rather than being built in',
            'Room rent is capped on the ₹5 lakh variant'
          ],
          verdict: 'Care Supreme has the better feature sheet and HDFC ERGO has the better claims desk, and which of those you weight more heavily should decide it. The unlimited recharge, the 22,100-hospital network and the Instant Cover add-on are all real advantages, especially if you live outside a metro or have a pre-existing condition you want covered quickly. But 42.67 complaints per 10,000 claims is a number we will not talk you past — it means roughly one in every 234 claims ends up escalated. Buy this for the network and features, with your eyes open about servicing.'
        },
        {
          id: 'health-abhi-activ-one-max',
          category: 'health',
          insurer: 'Aditya Birla Health',
          insurerShort: 'Aditya Birla',
          name: 'Activ One MAX',
          monogram: 'AB',
          accent: '#DB2777',
          icon: 'heart-pulse',
          tagline: 'Best value',
          subtitle: 'The cheapest of the five with the biggest no-claim bonus, and it pays you back for staying fit.',
          score: 4.4,
          scoreBreakdown: { features: 4.6, insurer: 4.2, premium: 5.0 },
          metrics: { csr: 96.25, complaints: 18.67, network: 16500, businessCr: 4920.43 },
          entryAge: '18–65 yrs',
          coverRange: '₹5 L – ₹2 Cr',
          tenure: '1–3 years',
          restoration: 'Unlimited, from the 2nd claim onward',
          bonus: '100% a year, up to 500% — capped at ₹3 Cr',
          roomRent: 'No limit — any room category',
          consumables: 'Via add-on',
          waiting: { ped: 3, specific: 2, maternity: 'Separate product' },
          premiums: { ind25: 10149, couple: 16299, family: 21478, seniors: 66505 },
          bestFor: ['genz', 'newparent'],
          tags: ['Cheapest', 'Fitness rewards', '500% bonus'],
          features: [
            'Cumulative bonus of 100% a year up to 500% of your base cover, whether or not you claim',
            'Unlimited restoration from the second claim of the policy lifetime, related or unrelated',
            'HealthReturns pays you back up to 100% of your premium for hitting fitness targets',
            'Modern treatments including robotic surgery and gene therapy are covered',
            'Add-ons to cut the pre-existing disease wait and to manage chronic conditions',
            'Pre-hospitalisation 60 days, post-hospitalisation 180 days'
          ],
          covered: [
            'In-patient hospitalisation in any room category',
            'Pre-hospitalisation for 60 days and post-hospitalisation for 180 days',
            'A comprehensive daycare procedure list',
            'Modern treatments — robotic surgery, gene therapy and similar',
            'Organ donor expenses',
            'AYUSH treatment',
            'Mental health treatment as required under the Mental Healthcare Act 2017'
          ],
          notCovered: [
            'Pre-existing conditions for the first 3 years, unless reduced by add-on',
            'A named list of illnesses for the first 2 years',
            'Maternity — you need Aditya Birla\'s separate maternity product',
            'Dental treatment unless it follows an accident',
            'Cosmetic and plastic surgery',
            'Self-inflicted injury and treatment related to substance abuse'
          ],
          riders: ['PED Waiting Period Reduction', 'Chronic Care', 'OPD Cover', 'Personal Accident'],
          pros: [
            'The cheapest of the five at every profile — ₹10,149 for a 25-year-old against ₹15,111 for Care Supreme',
            'A 500% cumulative bonus is the largest here; a ₹10 lakh cover can reach ₹60 lakh',
            '96.25% settlement ratio, second only to HDFC ERGO',
            'HealthReturns is not marketing fluff — 10–50% back is realistically achievable',
            'A strong fit for buyers in their twenties and thirties who will actually use the wellness app'
          ],
          cons: [
            '18.67 complaints per 10,000 claims — twice HDFC ERGO, though far better than Care Health',
            'Restoration only kicks in from the second claim, not the first',
            'Hitting the full 100% HealthReturns discount is very hard in practice',
            'Maternity requires an entirely separate policy',
            'A younger health insurer, so the servicing track record is shorter'
          ],
          verdict: 'The best value on this list, and by a clear margin. It undercuts every other plan at every profile while holding a 96.25% settlement ratio, and the 500% cumulative bonus means the cover you buy at 28 is worth several times as much by 40. The caveats are that restoration starts from your second claim rather than your first, and that maternity is not available at all. If you are young, reasonably healthy and not planning a pregnancy in the next few years, this is where your money goes furthest.'
        },
        {
          id: 'health-nivabupa-reassure-2-platinum',
          category: 'health',
          insurer: 'Niva Bupa',
          insurerShort: 'Niva Bupa',
          name: 'ReAssure 2.0 Platinum+',
          monogram: 'NB',
          accent: '#2563EB',
          icon: 'heart-pulse',
          tagline: 'Smartest design',
          subtitle: 'Locks your premium at your entry age until you claim, and carries unused cover forward up to 5×.',
          score: 4.3,
          scoreBreakdown: { features: 4.9, insurer: 3.6, premium: 4.5 },
          metrics: { csr: 92.92, complaints: 37.13, network: 10000, businessCr: 6985.24 },
          entryAge: '18–65 yrs',
          coverRange: 'Up to ₹1 Cr',
          tenure: '1–3 years',
          restoration: 'ReAssure+ — unlimited, every claim up to full cover',
          bonus: 'Booster+ — unused cover carried forward up to 5×',
          roomRent: 'No limit — any room category',
          consumables: 'Safeguard / Safeguard+ add-on',
          waiting: { ped: 3, specific: 2, maternity: 'Not covered' },
          premiums: { ind25: 11271, couple: 19176, family: 25026, seniors: 68239 },
          bestFor: ['genz', 'newparent'],
          tags: ['Age-lock premium', 'Booster+ carry forward', 'Unlimited restore'],
          features: [
            'Age-lock holds your premium at your entry age until your first claim — nobody else offers this',
            'ReAssure+ restores your full cover an unlimited number of times, on every claim',
            'Booster+ carries unused cover forward up to 5× on Platinum+ and 10× on Titanium+',
            'Safeguard+ covers non-payable items and raises your cover in line with inflation',
            'Annual health check-ups from day one and unlimited e-consultations',
            'Pre-hospitalisation 60 days, post-hospitalisation 180 days, 580+ daycare treatments'
          ],
          covered: [
            'In-patient hospitalisation in any room category',
            'Pre-hospitalisation for 60 days and post-hospitalisation for 180 days',
            '580+ daycare procedures',
            'Organ donor expenses',
            'Modern treatments — robotic surgery, stem cell therapy',
            'Mental health treatment as required under the Mental Healthcare Act 2017',
            'Annual preventive health check-up from year one'
          ],
          notCovered: [
            'Pre-existing conditions for the first 3 years',
            'A named list of illnesses for the first 2 years',
            'Maternity and childbirth expenses',
            'Dental treatment unless it follows an accident',
            'Cosmetic and plastic surgery',
            'Infertility treatment and assisted reproduction'
          ],
          riders: ['Safeguard / Safeguard+', 'Personal Accident', 'Hospital Cash', 'Critical Illness'],
          pros: [
            'The age-lock is unique — buy at 28 and you keep 28-year-old pricing until you claim',
            'Booster+ grows your cover passively just by not claiming, up to 5× the base',
            'Unlimited restoration on every claim, not from the second claim',
            'Annual health check-ups from day one rather than after a claim-free year',
            'Arguably the best-designed product on this list on paper'
          ],
          cons: [
            '92.92% settlement ratio — the lowest of the five',
            '37.13 complaints per 10,000 claims, four times HDFC ERGO',
            'The age-lock resets once you claim, so the benefit is finite',
            'A ~10,000 hospital network, the smallest here',
            'No maternity cover, and a co-payment applies if you join after 60'
          ],
          verdict: 'On paper this is the cleverest product here. The age-lock, Booster+ and unlimited restoration together form a design nobody else has matched. The problem is the gap between design and delivery: a 92.92% settlement ratio and 37 complaints per 10,000 claims are the weakest insurer metrics of the five. We recommend it to buyers in their twenties and thirties who will hold it for a long time without claiming, because that is exactly the scenario the age-lock and Booster+ are built for. If you expect to claim early or often, take HDFC ERGO instead.'
        },
        {
          id: 'health-sbi-super-health-platinum-infinite',
          category: 'health',
          insurer: 'SBI General',
          insurerShort: 'SBI General',
          name: 'Super Health Platinum Infinite',
          monogram: 'SB',
          accent: '#7C3AED',
          icon: 'heart-pulse',
          tagline: 'Most comprehensive',
          subtitle: 'The shortest waiting periods on the market, global cover and OPD built in — at a price to match.',
          score: 4.1,
          scoreBreakdown: { features: 5.0, insurer: 4.0, premium: 1.5 },
          metrics: { csr: 95.94, complaints: 14.04, network: 18000, businessCr: 4974.56 },
          entryAge: '18–65 yrs',
          coverRange: '₹50 L – ₹2 Cr',
          tenure: '1–3 years',
          restoration: 'Unlimited from the 1st claim, up to 200% of cover per claim',
          bonus: 'Health Multiplier — up to 3× cover for 37 serious illnesses',
          roomRent: 'No limit — any room category',
          consumables: 'Built into the base plan',
          waiting: { ped: 2, specific: 1, maternity: 'Not covered' },
          premiums: { ind25: 45944, couple: 61568, family: 62758, seniors: 113250 },
          bestFor: ['sandwich'],
          tags: ['2-yr PED wait', 'Global cover', 'OPD built in'],
          features: [
            'Pre-existing disease wait of just 2 years and specific illness wait of 1 year — the shortest here',
            'ReInsure Benefit restores cover from the very first claim, up to 200% of the sum insured per claim',
            'Health Multiplier raises your cover up to 3× for 37 listed serious illnesses',
            'Global cover for 16 listed conditions plus a ₹10 lakh air ambulance benefit',
            'OPD and consumables are built into the base plan, not sold as add-ons',
            'Wellness package — AI fitness coaching, dietitian access and unlimited gym membership'
          ],
          covered: [
            'In-patient hospitalisation in any room category',
            'Pre-hospitalisation and post-hospitalisation expenses',
            'A comprehensive daycare procedure list',
            'Treatment abroad for 16 listed conditions',
            'Air ambulance up to ₹10 lakh',
            'OPD consultations and pharmacy, built in',
            'Organ donor expenses'
          ],
          notCovered: [
            'Pre-existing conditions for the first 2 years',
            'Named illnesses for the first year',
            'Global cover and the Health Multiplier apply only to the listed conditions',
            'Maternity expenses',
            'Dental treatment unless it follows an accident',
            'Cosmetic and plastic surgery',
            'War and nuclear events'
          ],
          riders: ['Claim Shield', 'Hospital Cash', 'Personal Accident', 'Critical Illness'],
          pros: [
            'A 2-year pre-existing disease wait against 3 years everywhere else — a full year of exposure removed',
            'Restoration from the first claim, not the second',
            '18,000+ cashless hospitals, second only to Care Health',
            'OPD and consumables included rather than bolted on',
            'Global cover for 16 conditions is unusual at this price point'
          ],
          cons: [
            'By far the most expensive — ₹45,944 for a 25-year-old, over four times Activ One MAX',
            'The ₹50 lakh minimum base cover forces you into a large policy whether you want one or not',
            'Global cover and the Health Multiplier are restricted to listed conditions only',
            'Renewal discounts are tied to step counts, which will not suit everyone',
            'Note that the premiums shown are at ₹50 lakh cover, not the ₹15 lakh used for the others'
          ],
          verdict: 'The most feature-complete plan on this list and, unavoidably, the most expensive. The two features worth paying for are the 2-year pre-existing disease wait and restoration from the first claim — both directly reduce the odds of a claim being declined in the early years. That combination makes it worth a serious look if you are covering parents with existing conditions, where the third waiting year is a genuine risk. For a healthy 25-year-old it is dramatic overkill; Activ One MAX does the job for a quarter of the price.'
        }
      ]
    }
  }
};

/* ═══════════════════════════════════════════════════════
   DERIVED INDEXES
   Built once at load so the UI never has to re-scan.
   ═══════════════════════════════════════════════════════ */
(function buildIndexes(data) {
  data.allPlans = [];

  Object.keys(data.products).forEach(function (key) {
    var product = data.products[key];

    // Flat list across categories, for compare + search.
    product.plans.forEach(function (plan) { data.allPlans.push(plan); });

    // Grouped by insurer, for the cascading dropdowns.
    product.insurers = product.plans.reduce(function (acc, plan) {
      (acc[plan.insurer] = acc[plan.insurer] || []).push(plan);
      return acc;
    }, {});

    // Category shortcut: policyData.term, policyData.health
    data[key] = product;
  });

  data.planById = data.allPlans.reduce(function (acc, plan) {
    acc[plan.id] = plan;
    return acc;
  }, {});

  /* ── Brand lookup ─────────────────────────────────────────────
     Case- and punctuation-insensitive, because the same insurer is
     written "HDFC ERGO" in the dataset and "HDFC Ergo" in the FAQ copy.
     Always returns something renderable: an insurer we hold no logo for
     falls back to a coloured monogram, never a broken image. */
  var byKey = {};
  Object.keys(data.brands).forEach(function (name) {
    byKey[name.toLowerCase().replace(/[^a-z0-9]/g, '')] = data.brands[name];
  });

  data.brandFor = function (name) {
    var brand = byKey[String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '')];
    if (brand) return brand;
    return {
      logo: null,
      accent: '#475569',
      initials: String(name || '?').replace(/[^A-Za-z ]/g, '')
        .split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join('')
    };
  };

  /* The registry is the single source of truth for insurer branding, so
     reconcile the per-plan values against it. Without this an insurer can
     drift between the plan card and the league table — SBI actually had,
     sharing Axis Max Life's violet. */
  data.allPlans.forEach(function (plan) {
    var brand = data.brandFor(plan.insurer);
    plan.accent = brand.accent;
    plan.monogram = brand.initials;
    plan.logo = brand.logo;
  });
})(policyData);
