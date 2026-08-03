/* ═══════════════════════════════════════════════════════
   POLICY DATA — sourced from Ditto Insurance (joinditto.in) 2026 listings
   Structure: { term: { insurers: { "Name": [plans] } }, health: { ... } }
   ═══════════════════════════════════════════════════════ */

var policyData = {
    term: {
        insurers: {
            'Axis Max Life': [
                {
                    name: 'Smart Term Plan Plus',
                    insurer: 'Axis Max Life',
                    icon: '🛡️',
                    subtitle: 'Ditto\'s #1 pick — excellent claim handling, competitive pricing, and the most versatile variant lineup.',
                    stats: { entryAge: '18–65 yrs', sumInsured: '₹25L – ₹10Cr', csr: '99.51%', premium: '₹700/mo*' },
                    features: [
                        'Six variants: Level Cover, Early ROP Plus, ROP, Smart Cover, Whole Life, Income Protection',
                        'Smart Cover offers 1.5× cover for the first 15 years',
                        'Critical Illness Cover — up to 64 illnesses for 20 years',
                        'Terminal Illness Benefit — accelerated payout up to ₹1 Crore',
                        'Cover Continuance — defer premium for a year without losing coverage',
                        'Instant Payout — advance of up to ₹2 Lakh at claim intimation'
                    ],
                    covered: [
                        'Death due to any cause (natural or accidental)',
                        'Terminal illness — accelerated payout on diagnosis',
                        'Critical illness — lump sum on diagnosis (rider)',
                        'Waiver of premium on listed illnesses or disabilities'
                    ],
                    notCovered: [
                        'Suicide within 12 months of policy start',
                        'Death due to undisclosed pre-existing conditions',
                        'Fraudulent or misrepresented claims',
                        'Participation in hazardous activities (unless disclosed)'
                    ],
                    pros: [
                        'Excellent claim handling and solid financial strength',
                        'Customer-friendly service and competitive pricing',
                        'Most versatile variant lineup in the market',
                        'Smooth digital workflows and responsive support',
                        'Waiver of Premium keeps policy active during hardship'
                    ],
                    cons: [
                        'Slightly lower brand recall compared to HDFC Life and SBI Life',
                        'Smaller network than some legacy players (though scaling fast)',
                        'ROP variant is significantly costlier',
                        'Medical tests can be strict for higher covers'
                    ],
                    riders: ['Critical Illness (64 conditions)', 'Accidental Death', 'Waiver of Premium', 'Comprehensive Accident Benefit'],
                    claimRatio: 99.51,
                    table: [
                        ['Feature', 'Max Life Smart Term Plus', 'Industry Average'],
                        ['Claim Settlement Ratio', '99.51%', '97.1%'],
                        ['Plan Variants', '6 options', '2–3 options'],
                        ['Critical Illness', '64 illnesses', '15–34 illnesses'],
                        ['Terminal Illness', 'Up to ₹1Cr', 'Varies'],
                        ['Cover Continuance', 'Yes ✓', 'Rare']
                    ],
                    verdict: 'Axis Max Life Smart Term Plan Plus is Ditto\'s #1 recommendation for term insurance. It may not be the loudest brand, but it\'s one of the most dependable — a balanced mix of affordability, service quality, and stability. The 6-variant lineup and 64-illness CI cover make it the most versatile option available.',
                    score: '9.5 / 10'
                }
            ],
            'HDFC Life': [
                {
                    name: 'Click 2 Protect Supreme',
                    insurer: 'HDFC Life',
                    icon: '🛡️',
                    subtitle: 'Strong claim metrics, extremely low complaints, and wide servicing network — the reliable choice.',
                    stats: { entryAge: '18–65 yrs', sumInsured: '₹25L – ₹10Cr', csr: '98.66%', premium: '₹750/mo*' },
                    features: [
                        'Three clear variants: Life, Life Plus, and Life Goal',
                        'Waiver of Premium for critical illness & disability',
                        'Life Stage Boosts — increase cover at marriage or childbirth',
                        'Income Payout Options — structured income instead of lump sum',
                        'Critical Illness Rider — covers 60 illnesses (up to 15 years)',
                        'Premium Break — pause premiums temporarily while keeping cover active'
                    ],
                    covered: [
                        'Death due to any cause during policy term',
                        'Terminal illness — full lump sum payout',
                        'Accidental death with enhanced payout (via rider)',
                        'Critical illness cover for 60 conditions (via rider)'
                    ],
                    notCovered: [
                        'Suicide within first 12 months',
                        'Death from undisclosed medical conditions',
                        'Fraudulent claims or material misrepresentation',
                        'Self-inflicted injuries (within exclusion period)'
                    ],
                    pros: [
                        'Consistently high CSR with low complaint volumes',
                        'Large scale and brand trust',
                        'Strong digital capabilities for buying and servicing',
                        'Life Stage Boosts let you increase cover without reapplication',
                        'Predictable claims handling process'
                    ],
                    cons: [
                        'Premiums are often higher than most competitors',
                        'Document requests can involve some back-and-forth',
                        'ROP variant costs significantly more',
                        'Rider costs can add up with multiple selections'
                    ],
                    riders: ['Critical Illness (60 conditions)', 'Accidental Death', 'Waiver of Premium', 'Income Benefit'],
                    claimRatio: 98.66,
                    table: [
                        ['Feature', 'HDFC C2P Supreme', 'Industry Average'],
                        ['Claim Settlement Ratio', '98.66%', '97.1%'],
                        ['Critical Illness', '60 illnesses', '15–34 illnesses'],
                        ['Life Stage Boost', 'Yes ✓', 'Rare'],
                        ['Premium Break', 'Yes ✓', 'Not available'],
                        ['Payout Options', 'Lump sum + Income', 'Lump sum only']
                    ],
                    verdict: 'If you\'re not going with Axis Max Life, HDFC Life Click 2 Protect Supreme is the next best option. Strong brand, low complaints, solid products, and dependable claims make it a safe choice. You\'re partially paying for HDFC\'s reliability and servicing infrastructure.',
                    score: '9.0 / 10'
                }
            ],
            'ICICI Prudential': [
                {
                    name: 'iProtect Smart Plus',
                    insurer: 'ICICI Prudential',
                    icon: '🛡️',
                    subtitle: 'Widely recognized insurer with strong scale, digital infrastructure, and flexible product structure.',
                    stats: { entryAge: '18–65 yrs', sumInsured: '₹50L – ₹10Cr', csr: '97.83%', premium: '₹720/mo*' },
                    features: [
                        'Straightforward variant lineup: Life, Life Plus, and Life Rebalance',
                        'Life Stage Protection — increase cover at marriage, childbirth, or home loan',
                        'Smart Exit — option to exit and receive premiums back after a defined period',
                        'Premium Break — pause premiums for up to a year after regular payments',
                        'Instant Partial Payout — ₹3 Lakh advance at claim intimation for higher covers',
                        'Flexible Payouts — lump sum or income-based formats for nominees'
                    ],
                    covered: [
                        'Death due to any cause during policy term',
                        'Terminal illness — full lump sum payout',
                        'Accidental death with enhanced payout (via rider)',
                        'Critical illness cover (via rider) for 34 conditions'
                    ],
                    notCovered: [
                        'Suicide within first 12 months',
                        'Death from undisclosed medical conditions',
                        'Fraudulent claims or material misrepresentation',
                        'Self-inflicted injuries (within exclusion period)'
                    ],
                    pros: [
                        'Reliable claim performance with strong scale',
                        'Product flexibility with 3 clear variants',
                        'Solid online buying experience',
                        'Life Stage Protection covers major milestones',
                        'Brand comfort of one of India\'s largest private insurers'
                    ],
                    cons: [
                        'Complaint volumes can be slightly higher than top peers',
                        'CSR is dependable but other insurers perform better',
                        'Mid-range pricing — not the cheapest option',
                        'Feature depth not as rich as HDFC or Axis Max in some areas'
                    ],
                    riders: ['Accidental Death', 'Accidental Disability', 'Critical Illness (34 conditions)', 'Waiver of Premium'],
                    claimRatio: 97.83,
                    table: [
                        ['Feature', 'ICICI iProtect Smart Plus', 'Industry Average'],
                        ['Claim Settlement Ratio', '97.83%', '97.1%'],
                        ['Smart Exit', 'Yes ✓', 'Rare'],
                        ['Life Stage Protection', 'Yes ✓', 'Limited'],
                        ['Premium Break', 'Up to 1 year', 'Not available'],
                        ['Instant Partial Payout', '₹3 Lakh ✓', 'Not available']
                    ],
                    verdict: 'A reliable, large-scale insurer with strong claims and good product options. Great if you prefer a big, established brand. The Smart Exit and Life Stage Protection features add nice flexibility. Complaint volumes bring the score down slightly.',
                    score: '8.5 / 10'
                }
            ],
            'Bajaj Life': [
                {
                    name: 'eTouch II',
                    insurer: 'Bajaj Life',
                    icon: '🛡️',
                    subtitle: 'Among the most affordable with smooth onboarding — especially strong for NRI profiles.',
                    stats: { entryAge: '18–65 yrs', sumInsured: '₹25L – ₹10Cr', csr: '98.41%', premium: '₹620/mo*' },
                    features: [
                        'Three simple variants: Life Shield, Life Shield Plus, and Life Shield ROP',
                        'Terminal Illness Payout — early benefit on diagnosis (up to ₹2 Crore)',
                        'Waiver of Premium for accidental disability or terminal illness',
                        'Income Payout Options for structured payments to nominees',
                        'Premium Holiday add-on — skip premiums temporarily without losing cover',
                        'Health Management Services — teleconsultations, health checkups, pharmacy discounts'
                    ],
                    covered: [
                        'Death due to any cause during policy term',
                        'Terminal illness — early benefit up to ₹2 Crore',
                        'Accidental death with enhanced cover (via rider)',
                        'Waiver of premium on accidental disability'
                    ],
                    notCovered: [
                        'Suicide within 12 months of policy start',
                        'Death from undisclosed medical conditions',
                        'Fraudulent or misrepresented claims',
                        'War, military action, or nuclear events'
                    ],
                    pros: [
                        'Among the most affordable for ₹1 Crore profile',
                        'Strong claim metrics and low complaint levels',
                        'Smooth onboarding, especially for NRI profiles',
                        'Even with add-ons, pricing remains competitive',
                        'Industry-best solvency ratio'
                    ],
                    cons: [
                        'Lower brand pull compared to HDFC/ICICI',
                        'Feature depth is simpler than top two picks',
                        'Smaller on-ground network',
                        'Limited rider ecosystem compared to Max Life'
                    ],
                    riders: ['Accidental Death', 'Waiver of Premium', 'Premium Holiday', 'Income Payout'],
                    claimRatio: 98.41,
                    table: [
                        ['Feature', 'Bajaj eTouch II', 'Industry Average'],
                        ['Claim Settlement Ratio', '98.41%', '97.1%'],
                        ['Starting Premium', '₹620/mo*', '₹700+/mo'],
                        ['Solvency Ratio', 'Industry Best ✓', '150% (required)'],
                        ['NRI Friendly', 'Yes ✓', 'Varies'],
                        ['Terminal Illness', 'Up to ₹2Cr ✓', 'Varies']
                    ],
                    verdict: 'If you want smooth onboarding and dependable servicing — especially as an NRI — Bajaj Life eTouch II is a great pick. Although smaller in scale, it is very consistent and has the best solvency numbers in the industry. Best value-for-money term plan available.',
                    score: '8.5 / 10'
                }
            ],
            'Aditya Birla Sun Life': [
                {
                    name: 'Super Term Plan',
                    insurer: 'Aditya Birla Sun Life',
                    icon: '🛡️',
                    subtitle: 'Built-in critical illness cover for 42 conditions at no extra cost — unique value proposition.',
                    stats: { entryAge: '18–65 yrs', sumInsured: '₹25L – ₹10Cr', csr: '97.2%', premium: '₹680/mo*' },
                    features: [
                        'Three variants: Level Cover, Increasing Cover (5% p.a. up to 200%), and ROP',
                        'Inbuilt Accelerated Critical Illness — 42 illnesses, up to 50% of SI (max ₹50L)',
                        'Terminal Illness Payout built in (up to ₹1 Crore)',
                        'Accidental Total & Permanent Disability — waives premiums',
                        'Life Stage Flexibility — boost cover at marriage, childbirth, or home purchase',
                        'Cover Continuance — defer premium under specific conditions'
                    ],
                    covered: [
                        'Death due to any cause during policy term',
                        'Critical illness — 42 conditions covered (built-in)',
                        'Terminal illness — early payout up to ₹1 Crore',
                        'Accidental disability — premium waiver (via rider)'
                    ],
                    notCovered: [
                        'Suicide within first 12 months',
                        'Death from undisclosed medical conditions',
                        'Fraudulent claims or material misrepresentation',
                        'Self-inflicted injuries'
                    ],
                    pros: [
                        'Inbuilt CI cover often cheaper than buying a standalone rider',
                        'Competitive pricing especially with embedded CI benefit',
                        'Increasing Cover variant fights inflation',
                        'Steady insurer with good claim metrics',
                        'Early Exit Value available at certain ages/tenures'
                    ],
                    cons: [
                        'Lower brand pull vs. HDFC/ICICI for retail buyers',
                        'Distribution footprint is smaller in some geographies',
                        'Slightly lower CSR than top peers',
                        'CI payout capped at 50% of SI (max ₹50 Lakh)'
                    ],
                    riders: ['Accidental Death', 'Waiver of Premium', 'Accelerated Critical Illness (built-in)'],
                    claimRatio: 97.2,
                    table: [
                        ['Feature', 'ABSL Super Term', 'Industry Average'],
                        ['Claim Settlement Ratio', '97.2%', '97.1%'],
                        ['Built-in CI Cover', '42 illnesses ✓', 'Paid rider only'],
                        ['Increasing Cover', '5% p.a. up to 200%', 'Rare'],
                        ['Terminal Illness', 'Up to ₹1Cr ✓', 'Varies'],
                        ['Life Stage Boost', 'Yes ✓', 'Limited']
                    ],
                    verdict: 'The standout feature is the inbuilt critical illness cover for 42 conditions — something most competitors charge extra for as a rider. If you want term + CI protection in one plan at an attractive price, this is a smart choice. The embedded CI benefit often makes it cheaper than buying a standalone rider separately.',
                    score: '8.0 / 10'
                }
            ]
        }
    },
    health: {
        insurers: {
            'HDFC ERGO': [
                {
                    name: 'Optima Secure',
                    insurer: 'HDFC ERGO',
                    icon: '🏥',
                    subtitle: 'Ditto\'s #1 pick — very reliable insurer and a product that strengthens your cover over time.',
                    stats: { entryAge: '18–65 yrs', sumInsured: '₹3L – ₹1Cr', csr: '96.71%', premium: '₹1,100/mo*' },
                    features: [
                        '2X cover from day one (Secure Benefit)',
                        'Cover doubles again in 2 years with bonus regardless of claims (Plus Benefit)',
                        'Consumables covered — gloves, masks, syringes, etc. (Protect Benefit)',
                        'Home healthcare, daycare, organ donor, and AYUSH treatments included',
                        'Annual health check-up from day 1',
                        'Unique riders for PED WP reduction, unlimited restoration, OPD, hospital cash, maternity'
                    ],
                    covered: [
                        'In-patient hospitalization (all room types)',
                        'Pre-hospitalization expenses (30 days before)',
                        'Post-hospitalization expenses (60 days after)',
                        'Day care procedures',
                        'Home healthcare and domiciliary treatment',
                        'Organ donor expenses',
                        'AYUSH treatments (Ayurveda, Yoga, Unani, Siddha, Homeopathy)'
                    ],
                    notCovered: [
                        'Pre-existing diseases — 4-year waiting period',
                        'Specific diseases — 2-year waiting period',
                        'Maternity and newborn baby expenses (rider available)',
                        'Dental and vision care',
                        'Cosmetic procedures and weight management',
                        'Self-inflicted injuries'
                    ],
                    pros: [
                        '96.71% CSR (3-yr avg) — among the highest in health insurance',
                        'Only 9.28 complaints per 10,000 claims — outstanding service',
                        '13,000+ hospital network',
                        'Cover multiplies automatically — great for long-term value',
                        'Consumables coverage saves ₹5K–15K per hospitalization'
                    ],
                    cons: [
                        'Premiums are higher than most peers',
                        '4-year PED waiting period (industry standard is 3 years)',
                        'Room rent capping in lower sum insured variants',
                        'Ambulance cover is limited'
                    ],
                    riders: ['PED Waiting Period Reduction', 'Unlimited Restoration', 'OPD (Optima Wellbeing)', 'Hospital Cash', 'Maternity', 'Unlimited Coverage (1x or 2x)'],
                    claimRatio: 96.71,
                    table: [
                        ['Feature', 'HDFC ERGO Optima Secure', 'Industry Average'],
                        ['3-yr Avg CSR', '96.71% ✓', '88–93%'],
                        ['Complaints/10K', '9.28 (low) ✓', '30–50'],
                        ['Auto Cover Increase', '2X from Day 1 ✓', 'Not available'],
                        ['Consumables', 'Covered ✓', 'Not covered'],
                        ['Hospital Network', '13,000+', '8,000–10,000'],
                        ['PED Waiting', '4 years', '3 years']
                    ],
                    verdict: 'HDFC ERGO Optima Secure builds confidence on two fronts — a very reliable insurer (96.71% CSR, just 9.28 complaints per 10K claims) and a product that multiplies your cover automatically. If you want the basics done really well with strong claim support, Optima Secure is hard to beat.',
                    score: '9.5 / 10'
                }
            ],
            'Care Health': [
                {
                    name: 'Care Supreme',
                    insurer: 'Care Health',
                    icon: '🏥',
                    subtitle: 'Unlimited automatic recharge, generous cumulative bonus, and affordable pricing for families.',
                    stats: { entryAge: '18–65 yrs', sumInsured: '₹5L – ₹6Cr', csr: '93.13%', premium: '₹1,000/mo*' },
                    features: [
                        'Unlimited Automatic Recharge for related & unrelated illnesses',
                        'Cumulative Bonus up to 100% (optional rider extends to 600% or unlimited)',
                        'Claim Shield add-on covering 60+ non-payable consumables (Regular & Plus)',
                        'Wellness discounts — earn up to 30% off renewals through fitness benefits',
                        'Unique add-ons for PED WP reduction, Gym Memberships, OPD Cover',
                        'Air Ambulance and Unlimited Coverage add-ons available'
                    ],
                    covered: [
                        'In-patient hospitalization (any room category)',
                        'Pre-hospitalization (60 days) & post-hospitalization (180 days)',
                        'Day care procedures — 400+ covered',
                        'Modern treatments (robotic surgery, balloon sinuplasty, etc.)',
                        'Organ donor — complete expenses',
                        'Second medical opinion from expert panel',
                        'Emergency overseas treatment'
                    ],
                    notCovered: [
                        'Pre-existing diseases — 3-year waiting period',
                        '13 named conditions — 2-year waiting period',
                        'Maternity and childcare expenses',
                        'Dental unless from accident',
                        'Congenital diseases (covered after 10 years)',
                        'Experimental or unproven treatments'
                    ],
                    pros: [
                        'Unlimited Automatic Recharge is rare and extremely valuable',
                        'More affordable than HDFC ERGO Optima Secure',
                        'Cumulative bonus can grow cover significantly over time',
                        'Wellness-linked renewal discounts incentivize healthy living',
                        'Versatile add-on ecosystem for customization'
                    ],
                    cons: [
                        'Servicing is uneven — complaint volumes higher than peers (42/10K)',
                        'Room rent capping in lower variants (₹5L–10L SI)',
                        'CSR (93.13%) is solid but not spotless',
                        'Waiting periods are standard — no fast-track option'
                    ],
                    riders: ['Claim Shield (Regular & Plus)', 'Cumulative Bonus Extension', 'PED WP Reduction', 'Gym Membership', 'OPD Cover', 'Unlimited Coverage', 'Air Ambulance'],
                    claimRatio: 93.13,
                    table: [
                        ['Feature', 'Care Supreme', 'Industry Average'],
                        ['Automatic Recharge', 'Unlimited ✓', '1x restore'],
                        ['Max Sum Insured', '₹6 Crore ✓', '₹1–2 Crore'],
                        ['Cumulative Bonus', 'Up to 100% (extendable)', '50–100%'],
                        ['Wellness Discounts', 'Up to 30% ✓', 'Rare'],
                        ['Consumables', 'Via Claim Shield add-on', 'Not covered'],
                        ['CSR (3-yr avg)', '93.13%', '88–93%']
                    ],
                    verdict: 'Care Supreme is attractive for its unlimited automatic recharge and affordable pricing compared to HDFC ERGO. The add-on ecosystem is versatile. However, servicing and complaint volumes are concerns — if claim experience matters most, HDFC ERGO edges ahead. Great for families balancing cost with robust coverage.',
                    score: '8.5 / 10'
                }
            ],
            'Aditya Birla Health': [
                {
                    name: 'Activ One MAX',
                    insurer: 'Aditya Birla Health',
                    icon: '🏥',
                    subtitle: 'Feature-rich with wellness rewards — earn up to 100% discount on renewals through fitness activities.',
                    stats: { entryAge: '18–65 yrs', sumInsured: '₹5L – ₹3Cr', csr: '91%', premium: '₹950/mo*' },
                    features: [
                        'Unlimited restoration from 2nd claim of policy lifetime (related & unrelated)',
                        'Cumulative bonus 100% p.a. up to 500% regardless of claims (MAX up to 3 Crore)',
                        'HealthReturns® — earn up to 100% off renewals through fitness/healthy living',
                        'Intuitive add-ons for PED waiting period reduction and chronic care',
                        'Modern treatments covered including robotic surgery and gene therapy',
                        'Day care treatments covered comprehensively'
                    ],
                    covered: [
                        'In-patient hospitalization (all types of rooms)',
                        'Pre-hospitalization (60 days) & post-hospitalization (180 days)',
                        'Day care procedures — comprehensive list',
                        'Modern treatments — robotic surgery, gene therapy, etc.',
                        'Organ donor expenses',
                        'AYUSH treatments',
                        'Mental health coverage (as per MHCA 2017)'
                    ],
                    notCovered: [
                        'Pre-existing diseases — 3-year waiting period',
                        'Specific diseases — 2-year waiting period',
                        'Maternity expenses (separate product available)',
                        'Dental unless caused by accident',
                        'Cosmetic or plastic surgery',
                        'Self-inflicted injuries and substance abuse'
                    ],
                    pros: [
                        'Massive cumulative bonus — up to 500% regardless of claims',
                        'HealthReturns® rewards genuinely save money (10–50% achievable)',
                        'Compelling price point for the features offered',
                        'Unlimited restoration from 2nd claim is strong',
                        'Ideal for young, health-conscious buyers'
                    ],
                    cons: [
                        'Insurer is newer — servicing not as clean as HDFC ERGO/Bajaj',
                        'Complaint volumes slightly higher than top peers',
                        'Achieving 100% wellness discount is challenging (10-50% realistic)',
                        'Restoration only from 2nd claim, not 1st'
                    ],
                    riders: ['PED Waiting Period Reduction', 'Chronic Care', 'OPD Cover', 'Personal Accident'],
                    claimRatio: 91,
                    table: [
                        ['Feature', 'Activ One MAX', 'Industry Average'],
                        ['Cumulative Bonus', 'Up to 500% ✓', '50–100%'],
                        ['Wellness Rewards', 'Up to 100% off ✓', 'Rare'],
                        ['Unlimited Restoration', 'From 2nd claim ✓', '1x restore'],
                        ['Modern Treatments', 'Covered ✓', 'Varies'],
                        ['Max Cover', '₹3 Crore', '₹1–2 Crore']
                    ],
                    verdict: 'If you\'re young, active, and want a feature-rich plan at a compelling price, Activ One MAX hits a sweet spot — modern benefits plus real incentives to stay healthy. The cumulative bonus growing to 500% is unmatched. Best for buyers who engage with wellness programs.',
                    score: '8.5 / 10'
                }
            ],
            'Niva Bupa': [
                {
                    name: 'Reassure 2.0 Platinum+',
                    insurer: 'Niva Bupa',
                    icon: '🏥',
                    subtitle: 'Unlimited restoration, age-lock on premiums, and Booster+ that carries forward unused SI up to 5×.',
                    stats: { entryAge: '18–65 yrs', sumInsured: '₹3L – ₹1Cr', csr: '93%', premium: '₹1,100/mo*' },
                    features: [
                        'ReAssure+ — unlimited restoration of cover, every claim up to SI',
                        'Age-lock on premium until first claim — unique feature',
                        'Booster+ — unused SI carried forward up to 5× (Platinum+) or 10× (Titanium+)',
                        'Safeguard/Safeguard+ — covers non-payables + inflation-linked SI hikes',
                        'Annual health check-ups from day 1',
                        'Unlimited e-consults included'
                    ],
                    covered: [
                        'In-patient hospitalization (all types of rooms)',
                        'Pre-hospitalization expenses (60 days before)',
                        'Post-hospitalization expenses (180 days after)',
                        'Day care procedures (580+ treatments)',
                        'Organ donor expenses',
                        'Modern treatments — robotic surgery, stem cell therapy',
                        'Mental health treatment (as per MHCA 2017)'
                    ],
                    notCovered: [
                        'Pre-existing diseases — 3-year waiting period',
                        'Specific diseases — 2-year wait',
                        'Maternity and childbirth expenses',
                        'Dental treatment unless caused by accident',
                        'Cosmetic or plastic surgery',
                        'Infertility treatments and assisted reproduction'
                    ],
                    pros: [
                        'Age-lock keeps you on entry-age premium until first claim',
                        'Booster+ carries forward unused SI — grows cover passively',
                        'Unlimited restoration is extremely valuable',
                        'Safeguard+ covers non-payable consumables + inflation hikes',
                        'One of the most feature-forward products available'
                    ],
                    cons: [
                        'Age-lock resets after a claim — premiums can still be repriced',
                        'Post-sales servicing and claims experience not as uniform as top players',
                        'No direct maternity cover',
                        'Co-payment applies for entries above age 60'
                    ],
                    riders: ['Safeguard / Safeguard+', 'Personal Accident', 'Hospital Cash', 'Critical Illness'],
                    claimRatio: 93,
                    table: [
                        ['Feature', 'Niva Bupa Reassure 2.0', 'Industry Average'],
                        ['Room Rent Limit', 'No Limit ✓', 'Capped at 1–2% of SI'],
                        ['Restore Benefit', 'Unlimited ✓', '1x restore'],
                        ['Age-Lock', 'Yes ✓', 'Not available'],
                        ['Booster+', 'Up to 5× SI', 'Not available'],
                        ['Consumables', 'Via Safeguard add-on', 'Not covered'],
                        ['PED Waiting', '3 years', '3–4 years']
                    ],
                    verdict: 'Niva Bupa Reassure 2.0 is one of the most feature-forward health insurance products in India. The age-lock, Booster+ that grows your cover passively, and unlimited restoration make it a compelling package. Servicing could be more uniform, but the product design is exceptional.',
                    score: '9.0 / 10'
                }
            ],
            'SBI General': [
                {
                    name: 'Super Health Platinum Infinite',
                    insurer: 'SBI General',
                    icon: '🏥',
                    subtitle: 'Unlimited reinstatement, 3× multiplier for serious illnesses, and global treatment cover — feature-loaded.',
                    stats: { entryAge: '18–65 yrs', sumInsured: '₹50L – ₹5Cr', csr: '92%', premium: '₹1,400/mo*' },
                    features: [
                        'Unlimited reinstatement from very first claim — up to 200% SI per claim',
                        'Health Multiplier — up to 3× cover for 37 listed serious illnesses',
                        'Global cover for 16 conditions + Air Ambulance ₹10 Lakh',
                        'OPD and Consumables cover built in',
                        'Shorter waiting periods — PED 2 years, specific diseases 1 year',
                        'Wellness add-ons — AI fitness coaching, dietician, unlimited gym membership'
                    ],
                    covered: [
                        'In-patient hospitalization (all types of rooms)',
                        'Pre-hospitalization and post-hospitalization expenses',
                        'Day care procedures — comprehensive list',
                        'Global treatment for 16 listed conditions',
                        'Air ambulance up to ₹10 Lakh',
                        'OPD expenses (built-in)',
                        'Organ donor expenses'
                    ],
                    notCovered: [
                        'Global cover and Health Multiplier apply only to listed conditions',
                        'Maternity expenses',
                        'Dental unless from accident',
                        'Cosmetic or plastic surgery',
                        'Self-inflicted injuries',
                        'War or nuclear events'
                    ],
                    pros: [
                        'Unlimited reinstatement from FIRST claim — rare feature',
                        '3× Health Multiplier for serious illnesses is powerful',
                        'Global treatment cover adds international protection',
                        'Shorter PED waiting (2 years vs. 3–4 industry standard)',
                        'OPD and consumables built in — no add-ons needed'
                    ],
                    cons: [
                        'Premiums are quite expensive due to over-indulgent nature',
                        'Higher base cover required (minimum ₹50L)',
                        'Global cover and multiplier limited to listed conditions only',
                        'Renewal discounts tied to step count may not suit everyone'
                    ],
                    riders: ['Claim Shield', 'Hospital Cash', 'Personal Accident', 'Critical Illness'],
                    claimRatio: 92,
                    table: [
                        ['Feature', 'SBI Super Health Platinum', 'Industry Average'],
                        ['Reinstatement', 'Unlimited (from 1st claim) ✓', '1x restore'],
                        ['Health Multiplier', '3× for serious illness ✓', 'Not available'],
                        ['Global Cover', '16 conditions ✓', 'Rare'],
                        ['PED Waiting', '2 years ✓', '3–4 years'],
                        ['OPD Cover', 'Built-in ✓', 'Add-on/Rider'],
                        ['Air Ambulance', '₹10 Lakh ✓', '₹2–5 Lakh']
                    ],
                    verdict: 'SBI General Super Health Platinum Infinite is one of the most feature-loaded policies on the market. The unlimited reinstatement from the first claim, 3× health multiplier, global cover, and shorter PED waiting are all premium-tier features. The high price tag reflects the comprehensive nature of this plan.',
                    score: '8.5 / 10'
                }
            ]
        }
    }
};
