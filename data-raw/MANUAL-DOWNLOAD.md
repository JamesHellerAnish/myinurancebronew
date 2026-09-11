# Manual download list

Things I could not fetch. Everything here needs a human with a browser.

**Where to put them:** save into `data-raw/wordings/` (gitignored, so the PDFs never bloat the
repo). I extract the text with `pdftotext -layout` and commit only the `.txt`. Filenames don't
have to match anything — just tell me what landed.

**Last updated: 2026-09-11.** Everything previously listed here that has since been obtained has
been removed from this list — see `manifest.json` for the per-plan record of what was checked.

---

## 0. Read this first — the prospectus is usually the document you want

A repeated finding across this dataset: the **policy wording** often does *not* carry the
eligibility table, the sum-insured ladder, or variant-specific benefits. The **prospectus** does.

This wasn't obvious until the HDFC ERGO Optima Secure+ case, where three separate official
documents appeared to contradict the site's own claim — and the prospectus then confirmed the
claim outright and corrected two other fields at the same time. **Most of the remaining
"unconfirmed" fields below are probably answerable from a prospectus**, not a wording.

So where a plan offers both, the prospectus is the higher-value download.

---

## 1. 🔴 IRDAI — received, and it does NOT contain what we need

**Both annual reports were supplied on 2026-09-11 and extracted.** Reading them produced a
finding that matters more than the download did:

> **The IRDAI Annual Report does not publish per-insurer claim settlement ratios.**
> Table I.11 (Death Claims of Life Insurers) gives **industry aggregates only** — 97.82% of
> individual death claims settled across all life insurers in FY2024-25. Insurer names appear
> barely a dozen times each in the whole 16,536-line document, almost all of them footnotes
> about the Sahara/SBI Life portfolio transfer. There is no table of "HDFC Life 99.66%,
> Axis Max 99.71%, …" anywhere in it.

**So every per-insurer CSR, complaint and solvency figure on this site is still unverified, and
the source line that credits them to the "IRDAI Annual Report" is wrong** — they cannot have
come from there. This is the §11 / §16.7 attribution concern, now confirmed rather than
suspected. It appears on every plan page, every comparison page and the league table, under an
IRDAI-licensed advisor's name.

### What would actually carry these figures

| What | Why | Where |
|---|---|---|
| **IRDAI Handbook on Indian Insurance Statistics** | This is the statistical companion to the annual report and is where insurer-wise tables normally live | irdai.gov.in → Reports → Handbook of Indian Insurance Statistics |
| **Insurer public disclosures (Form NL-\* / L-\*)** | Quarterly/annual per-insurer filings — the most likely real source of the current figures, and the only place FY2026 data could exist | each insurer's website → Investor Relations / Public Disclosures |

> 🔴 **Still unanswered, and it needs you, not a document:** the site shows
> `FY 2024–26 (3-year average)` credited to the *IRDAI Annual Report*. FY2026 figures cannot
> have come from a report that does not exist (the newest is FY2024-25), and per-insurer figures
> cannot have come from the annual report at all. Where did these numbers actually come from?
> Until that is answered the attribution line on every page is unsupportable.

---

## 2. ✅ Closed by the 2026-09-11 delivery — nothing needed here

These arrived, were read, and settled their open fields. Left here as a record so nobody
re-fetches them. Per-field detail is in each record's `verificationNote`.

| Plan | Document | Outcome |
|---|---|---|
| **HDFC ERGO Optima Secure+** | my:Optima Secure prospectus | Confirmed the plan and its uncapped Infinite Benefit; corrected the benefit's name and entry age |
| **Aditya Birla Activ One MAX** | Activ One prospectus | "Plan: MAX" is a named variant and entry age is stated "For all Variants" — the family-wording caveat is gone. Corrected entry age and cover range |
| **SBI Super Health Platinum Infinite** | Super Health prospectus | Corrected entry age ("No Limit") |
| **Niva Bupa ReAssure 2.0 Platinum+** | ReAssure 2.0 prospectus | Booster+ mapping pinned down (Platinum+ = 5×). No corrections needed — record was already right |
| **Axis Max Smart Term Plan Plus** | STPP prospectus + CI rider prospectus | Entry age confirmed; corrected cover-range ceiling and the rider's illness count/term qualifiers |
| **ABSL Super Term Plan** | policy contract (UIN 109N153V02), fetched directly | Upgraded off brochure-only |
| **Care Supreme** | its own prospectus (UIN CHIHLIP27061V032627) | Entry age corrected — "Adult: Lifelong", so no maximum |
| **SBI Super Health Platinum Infinite** | Super Health brochure | Specific-illness wait resolved to **1 year** for this variant, from the brochure's variant table — the record was right |
| **ICICI iProtect Smart Plus** | full brochure with eligibility table | Cover floor **₹50 L confirmed**; entry age 18/65 confirmed |
| **Bajaj eTouch II** | policy document (UIN 116N198V09) | Source upgraded, but it carries no eligibility table — see below |

---

## 3. Still open — documents

**Almost everything here closed in the second delivery.** What remains:

| Plan | Want | Where / note |
|---|---|---|
| **Bajaj eTouch II** | a document with a **readable eligibility table** | The real policy document (UIN `116N198V09`) arrived and is a contract template — definitions, benefit clauses, blank schedule — with no eligibility table. The sales literature *has* the table but it is column-scrambled beyond safe reading. Two open fields ride on it: tenure (a "Cover up to Age 99" option exists that the record doesn't mention) and cover range (₹25 L – ₹10 Cr). **Every other term plan has now been confirmed to have no maximum cover limit, so the ₹10 Cr here is very likely wrong too — but "likely" is not a source.** A brochure with a clean table, or simply reading the sales literature PDF by eye and telling me the four numbers, would close it |
| **Care Supreme** | the **sum-insured ladder** | The correct prospectus arrived and settled entry age, but states no SI ladder. Also unresolved: the room-rent cap the record claims on the ₹5 L variant |
| **SBI Super Health** | cover range (₹50 L – ₹2 Cr) | Not restated in the wording, prospectus or brochure |
| **HDFC ERGO Optima Secure+** | a **filed** per-variant SI table | Cover range is now corroborated by HDFC ERGO's own article (`₹10 / 15 / 20 / 25 / 50 / 100 / 200 lakhs` — matches the record exactly) but that is marketing copy; the prospectus publishes the ladder per family only |

---

## 4. Not a document problem — these need **your** decision

| Item | What's needed |
|---|---|
| **HDFC Life Click2Protect Supreme Plus — which plan option?** | The wording gives max entry age 85 for the *Life* and *Life Plus* options but **65** for *Life Goal*. The record doesn't say which it describes. Also: the record says CSR 99.66% while the plan's own brochure cover says **99.72%** (FY 2026, by policy count) — different measurement bases, needs a call on which to publish. |
| **IRDAI Corporate Agent number** | The footer publishes `License No. CA0001 · Valid till 2027` sitewide. `CA0001` looks like a placeholder. Either it's real — in which case it should go into `organizationSchema()` too — or a placeholder licence number is live on a regulated site. (Separate from the Chief Advisor's individual licence `MBHNOC5128059`, which is now in place.) |
| **Sign-off** | No record can move to `verificationStatus: 'verified'` without a licensed human approving it (§16.8). That's what the status means; it is no longer what decides whether a page exists. |

---

## 5. Lower priority — dataset expansion, not verification

Wordings for plans **not in the dataset yet**. §5 wants ~30 health plans before Phase 3, and each
new wording also feeds the glossary.

| Insurer | Plans worth having |
|---|---|
| Star Health | Comprehensive, Super Surplus, Assure, Senior Citizens Red Carpet (whole domain 403s) |
| Care Health | Care Senior, Care Advantage, Supreme Enhance (super top-up — already downloaded, not yet parsed) |
| Manipal Cigna | ProHealth Prime |
| Tata AIG | Medicare Premier |
| HDFC ERGO | Optima Restore |
| Niva Bupa | Senior First |

---

## 6. Format notes

- **PDF is ideal** — I extract with `pdftotext -layout` and commit only the `.txt`.
- A **scanned** PDF is much less useful: no text layer, and no OCR tooling is available here.
  A print-to-PDF of a web page is usually image-only and therefore useless — one was supplied on
  2026-09-11 and had **zero** extractable characters across all 8 pages. **Send a screenshot
  instead if it's a web page** — images I can read directly.
- **Policy wording / prospectus beats brochure**, always. Brochures omit exclusions, waiting
  periods and the suicide/revival clauses.
- If a download gives you a different revision than expected (a "V02" where we have "V01", or a
  newer effective date), send it anyway — that's useful, not a problem.
