// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import mdx from '@astrojs/mdx'
import { readFileSync, existsSync } from 'node:fs'

// URL → lastVerified, written by scripts/build-lastmod.mjs in the prebuild hook. Absent
// before that hook has ever run, which just means no lastmod is emitted.
const LASTMOD = existsSync('./src/data/lastmod.json')
  ? JSON.parse(readFileSync('./src/data/lastmod.json', 'utf8'))
  : {}

// SEO_ASTRO_PLAN.md §4.1. `site` is mandatory or @astrojs/sitemap emits nothing (§16.2).
// `trailingSlash: 'always'` + `format: 'directory'` gives /path/index.html, which Apache
// serves for /path/ with no rewrite rules — the Hostinger constraint in §4.3.
export default defineConfig({
  site: 'https://myinsurancebro.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      // changefreq and priority are ignored by Google (§16.2). lastmod is the one
      // that matters and comes from each record's lastVerified.
      serialize(item) {
        if (/\/view-leads/.test(item.url)) return undefined
        if (/\/glossary\//.test(item.url)) item.priority = 0.4

        // lastmod comes from the record's own lastVerified, never the build clock — a
        // rebuild that changed nothing must not tell Search Console the page is new.
        // Pages with no meaningful date get no lastmod rather than a fabricated one.
        const path = new URL(item.url).pathname
        if (LASTMOD[path]) item.lastmod = LASTMOD[path]

        return item
      },
    }),
    mdx(),
  ],
})
