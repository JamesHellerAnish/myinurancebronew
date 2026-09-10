# Manual download list

Things I could not fetch. Everything here needs a human with a browser.

**Where to put them:** save into `data-raw/wordings/` using the filename in the table
(that folder is gitignored, so the PDFs won't bloat the repo). I extract the text with
`pdftotext -layout` and commit only the `.txt`.

**Don't rename** — `manifest.json` keys off these filenames.

---

## 1. IRDAI — required before Phase 1b

The source for every CSR, complaint and solvency figure on the site.

| What | Size | Filename to save as | URL |
|---|---|---|---|
| **IRDAI Annual Report 2024-25** ← the one you need | 12.2 MB | `irdai/annual-report-2024-25.pdf` | [link](https://irdai.gov.in/documents/37343/366637/%E0%A4%86%E0%A4%88%E0%A4%86%E0%A4%B0%E0%A4%A1%E0%A5%80%E0%A4%8F%E0%A4%86%E0%A4%88+%E0%A4%B5%E0%A4%BE%E0%A4%B0%E0%A5%8D%E0%A4%B7%E0%A4%BF%E0%A4%95+%E0%A4%B0%E0%A4%BF%E0%A4%AA%E0%A5%8B%E0%A4%B0%E0%A5%8D%E0%A4%9F+_+IRDAI+Annual+Report+2024-25.pdf/06f02832-66a3-6308-a16f-f46a6640fc93?version=2.0&t=1767598639163&download=true) |
| IRDAI Annual Report 2023-24 (for the 3-yr average) | 15.1 MB | `irdai/annual-report-2023-24.pdf` | [link](https://irdai.gov.in/documents/37343/366637/%E0%A4%B5%E0%A4%BE%E0%A4%B0%E0%A5%8D%E0%A4%B7%E0%A4%BF%E0%A4%95+%E0%A4%B0%E0%A4%BF%E0%A4%AA%E0%A5%8B%E0%A4%B0%E0%A5%8D%E0%A4%9F+2023-24+_+Annual+Report+2023-24.pdf/22950192-b116-35ed-a3a9-d2cfdb660206?version=1.0&t=1734934358396&download=true) |
| Handbook on Indian Insurance Statistics | ? | `irdai/handbook-latest.pdf` | Linked from https://irdai.gov.in — Handbooks section |

**Why manual:** WebFetch caps at **10 MB**; these are 12.2 and 15.1 MB. Nothing else blocks them.

> 🔴 **Also please confirm:** IRDAI's newest annual report is **FY2024-25** (published 30 Dec 2025).
> There is **no FY2025-26 report yet**. The site currently shows `FY 2024–26 (3-year average)`
> credited to the *IRDAI Annual Report*. FY2026 figures must have come from somewhere else —
> most likely insurer public disclosures (Form NL-*). Please confirm the real source so the
> attribution line can be corrected. This number appears on every page under your IRDAI licence.

---

## 2. Policy wordings still needed — status as of 2026-09-10

**Seven of fifteen are done.** Extracted and committed as .txt: HDFC ERGO Optima Secure+,
Aditya Birla Activ One, SBI Super Health Platinum Infinite, SBI Super Top-Up, Axis Max Smart
Term Plus, Bajaj eTouch II, HDFC Click2Protect.

Everything below is what I could **not** get. Save each into `data-raw/wordings/` using the
exact filename in the table — `manifest.json` keys off it, and the folder is gitignored so the
PDFs never bloat the repo.

### 2a. Refused an automated fetch (HTTP 403 / 406)

The URL is known and correct — the host simply refuses non-browser requests. **Opening these in
your browser and saving should just work.** I did not spoof a User-Agent to get around the
block, per the README rule.

| Plan | Insurer | Save as | URL |
|---|---|---|---|
| Care Supreme | Care Health | `health-care-supreme.pdf` | https://cms.careinsurance.com/cms/public/uploads/download_center/care-supreme---policy-terms-and-conditions.pdf |
| Supreme Enhance (super top-up) | Care Health | `supertopup-care-supreme-enhance.pdf` | https://cms.careinsurance.com/cms/public/uploads/download_center/supreme-enhance---policy-terms-and-conditions.pdf |
| ReAssure 2.0 Platinum+ | Niva Bupa | `health-nivabupa-reassure-2-platinum.pdf` | https://www.nivabupa.com/content/dam/nivabupa/PDF/reassure-2-0/ReAssure%202.0%20-%20Policy%20Wording.pdf |
| Senior First | Niva Bupa | `senior-nivabupa-senior-first.pdf` | https://transactions.nivabupa.com/pages/doc/policy_wording/Senior-First-Policy-Wording.pdf |
| Optima Restore | HDFC ERGO | `health-hdfcergo-optima-restore.pdf` | https://www.hdfcergo.com/docs/default-source/downloads/policy-wordings/health/optima-restore-revision.pdf |
| iProtect Smart Plus | ICICI Prudential | `term-icici-iprotect-smart-plus.pdf` | https://www.iciciprulife.com/content/dam/icicipru/brochures/ICICI-Pru-iProtect-Smart-Illustrated-Brochure.pdf |

> ⚠ The ICICI URL is a **brochure**, not a policy wording. If you can find the specimen policy
> document instead, that is worth more — brochures omit exactly the clauses that matter.
> Try `iciciprulife.com/content/dam/icicipru/download-centre/specimenpolicy/`.

### 2b. No URL found — needs a human to locate

| Plan | Insurer | Save as | Where to look |
|---|---|---|---|
| **Super Term Plan** | Aditya Birla Sun Life | `term-absl-super-term.pdf` | `lifeinsurance.adityabirlacapital.com` → Downloads. **This plan is live in your dataset with no source at all.** |
| Senior Citizens Red Carpet | Star Health | `senior-star-red-carpet.pdf` | https://www.starhealth.in — Downloads. Whole domain refuses automated fetches. |

### 2c. Naming mismatch to resolve — not a missing file

Your dataset says **HDFC Life Click2Protect Supreme Plus**. HDFC Life's own site lists
**Click2Protect Super**. I downloaded what the manifest URL pointed at, which is the
Click2Protect *Super* retail brochure. Please confirm which product you actually recommend —
the plan page currently publishes a name that may not exist.

---

## 3. What each missing document unblocks

So you can prioritise rather than fetch all eight.

| Document | Unblocks |
|---|---|
| Care Supreme, Niva Bupa ReAssure | **Verifying 2 of the 5 health plans already published.** Highest value — these are live pages. |
| ABSL Super Term | **Verifying a term plan that currently cites no source whatsoever.** |
| ICICI specimen policy | Verifying the 5th term plan properly rather than from a brochure. |
| Optima Restore, Supreme Enhance, Senior First, Star Red Carpet | **Phase 1b** — the Tier A categories (super top-up, senior health). Not needed for Phase 1a. |
| **Any additional wording, any insurer** | **The glossary.** All 61 harvested definitions currently come from a single Aditya Birla document. More wordings means more terms and cross-insurer comparison — see §0e. |

---

## 4. Also useful, lower priority

Wordings for plans **not** in the dataset yet. §5 needs the health roster at ~30 plans before
Phase 3, and each new wording also feeds the glossary.

| Insurer | Plans worth having |
|---|---|
| Star Health | Comprehensive, Super Surplus, Assure |
| Care Health | Care Senior, Care Advantage |
| Manipal Cigna | ProHealth Prime |
| Tata AIG | Medicare Premier |

---

## 5. Format notes

- **PDF is ideal** — I extract with `pdftotext -layout` and commit only the `.txt`.
- A **scanned** PDF is much less useful: no text layer, and `pdftoppm` is not installed so OCR
  is not available here. If a download looks like scanned images, say so.
- **Policy wording beats brochure**, always. Brochures omit exclusions, waiting periods and the
  suicide/revival clauses on term plans.
- Filenames must match the tables above exactly.
