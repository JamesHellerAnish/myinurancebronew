# `data-raw/` — primary-source harvest

Raw material for the plan dataset, gathered from **insurer policy wordings and IRDAI** — never from
comparator sites. Extracted text lands here so the dev session can parse it into
`src/content/plans/` with **no network access required**.

See `SEO_ASTRO_PLAN.md` §16.7 for the tested pipeline and §16.6 for the plan roster.

## Layout

```
data-raw/
  README.md          this file
  manifest.json      every target plan + harvest status  ← the source of truth
  wordings/          *.pdf   (gitignored — large, re-downloadable)
  extracted/         *.txt   (committed — this is the deliverable)
  irdai/             annual report extracts
```

## The pipeline (tested 2026-08-14)

```bash
# 1. WebFetch the PDF URL. It reports "not readable" but SAVES the file and prints its path.
#    curl does NOT work — hdfcergo.com returns 406 and careinsurance.com / starhealth.in return 403.
#    Do not spoof a User-Agent to get around that.

# 2. Extract (pdftotext ships with Git Bash at /mingw64/bin/pdftotext)
pdftotext -layout "<saved-pdf>" data-raw/extracted/<insurer>-<plan>.txt

# 3. Update manifest.json: status → "extracted", record sourceUrl + fetchedAt
```

`pdftoppm` is **not** installed, so the Read tool's PDF mode fails. Use `pdftotext`, not Read.

## What to pull out of each extract

Per §5.2 and §16.4. The wording is authoritative; the product page is a cross-check.

| Field | Where it lives in a wording |
|---|---|
| Waiting periods | `Section C.1` — initial / specific illness / PED, plus buy-down options |
| Exclusions | `Section C.2 Standard Exclusions` — **IRDAI codes `Excl01`–`Excl18`**, so these normalise across insurers |
| Definitions | `Section A.1.1 Standard Definitions` — ~73 per document, IRDAI-standard → feeds the glossary |
| Room rent / ICU | `Def. 41 Room Rent` + the capping clause |
| Co-payment | `Def. 8 Co-Payment` + the plan-specific percentage |
| Restoration, NCB, pre/post | Section B coverages |

## Status values in `manifest.json`

- `pending` — not started
- `url-found` — PDF URL located, not yet fetched
- `fetched` — PDF downloaded
- `extracted` — text in `extracted/`, ready to parse
- `parsed` — a record exists in `src/content/plans/`
- `verified` — a human has signed it off (**required before publish**, see §11)
- `blocked` — insurer bot-blocks; needs manual download

## Rules

1. **Never source plan facts from a comparator.** Wording first, insurer product page as cross-check.
2. **Every record needs `sources[]` and `lastVerified`.** Non-negotiable — see §11.
3. **Don't publish `verified: false`.** These pages carry an IRDAI-licensed advisor's name.
4. Where the product page and the wording disagree, **the wording governs.**
