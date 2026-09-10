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

## 2. Bot-blocked insurers

These return **403 Forbidden** to any automated fetch. I did not attempt to bypass that.

| Insurer | What to get | Filename | Start here |
|---|---|---|---|
| **Star Health** | Senior Citizens Red Carpet — policy wording | `star-red-carpet.pdf` | https://www.starhealth.in/health-insurance/senior-citizens-red-carpet-health-insurance-policy |
| **Star Health** | Comprehensive, Super Surplus, Assure — wordings | `star-<plan>.pdf` | https://www.starhealth.in — Downloads |
| **Care Health** *(maybe)* | If `cms.careinsurance.com` also blocks, grab Care Supreme, Supreme Enhance, Care Senior, Care Advantage | `care-<plan>.pdf` | https://www.careinsurance.com/other-downloads.html |

**Note on Care:** the product pages on `www.careinsurance.com` are 403, but the PDFs sit on
`cms.careinsurance.com` — a **different host that may not be blocked**. Two URLs are already in
`manifest.json`; worth testing before you download by hand.

---

## 3. Not found — need a human to locate

I couldn't find a URL for these.

| Plan | Insurer | Note |
|---|---|---|
| **Super Term Plan** | Aditya Birla Sun Life | In your current dataset. Try `lifeinsurance.adityabirlacapital.com` downloads. |
| Whatever the real HDFC Life term plan is | HDFC Life | ⚠ Your dataset says **Click2Protect Supreme Plus**; HDFC Life's site only shows **Click2Protect Super**. Please confirm which product you actually recommend — this is a naming mismatch, not a missing file. |

---

## 4. Term-life: brochures found, wordings not

For term plans I mostly found **marketing brochures**, not policy wordings. Brochures omit exactly
the clauses that matter — exclusions, suicide clause, revival terms. If you can get the specimen
policy documents, do:

| Insurer | Where the real wordings live |
|---|---|
| ICICI Prudential | `iciciprulife.com/content/dam/icicipru/download-centre/specimenpolicy/` |
| Bajaj Life | Only found the eTouch **I** policy doc; need **eTouch II** |
| HDFC Life | Brochure only so far |

**Exception:** Axis Max Life Smart Term Plan Plus — I found the genuine policy document
(UIN 104N127V02). That one's fine.

---

## 5. Bulk-discovery pages (I'll retry these; listed in case they block me too)

These index pages each list many PDFs at once — the efficient route to the remaining ~75 plans.
`hdfcergo.com/customer-care/downloads/...` already returned 503 on a guessed URL.

- https://www.hdfcergo.com/download/policy-wordings
- https://transactions.nivabupa.com/pages/downloads.aspx
- https://www.sbigeneral.in/downloads
- https://www.adityabirlacapital.com/healthinsurance/downloads
- https://www.careinsurance.com/other-downloads.html

---

## Not needed — don't waste time

- **Live premium quotes.** Per-profile and volatile. The site correctly shows illustrations, not
  quotes, so these are generated from your own assumptions, not scraped.
- **Comparator pages** (PolicyBazaar, PolicyX, Ditto, Scribd). Several search results pointed at
  mirrored copies of insurer PDFs on comparator S3 buckets. **Don't use them** — the point of this
  exercise is that every figure traces to the insurer's own document. A mirror may be outdated and
  you cannot cite it in `sources[]`.
