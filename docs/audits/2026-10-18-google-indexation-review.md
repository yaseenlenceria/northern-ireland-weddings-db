# Google Indexation Review — wedhq.co.uk

**Date:** 2026-10-18 (evidence captured live on this date)
**Scope:** How much of the site Google can and does see: crawl access, indexability markup, sitemap coverage, and sampled index presence.
**Exact indexed counts require Google Search Console** (Pages report). Third-party `site:` sampling below is directional, not a count.

---

## 1. What Google has to work with

| Item | Status | Evidence |
|---|---|---|
| robots.txt | ✅ Fully open — `Allow: /` for Googlebot, Bingbot and all agents; sitemap declared | `https://wedhq.co.uk/robots.txt` |
| Sitemap | ✅ Live, 200 OK, **5,989 URLs** | `https://wedhq.co.uk/sitemap.xml` |
| Homepage meta | ✅ `index, follow, max-image-preview:large`, canonical `https://wedhq.co.uk`, unique title + description | raw HTML, 2026-10-18 |
| Venue detail pages | ✅ `index, follow`, self-referencing canonical, unique title (e.g. "The Buttery and Glasshouse — Wedding Venue in Kent, UK \| Prices & Capacity") | raw HTML, 2026-10-18 |
| Server-side rendering | ✅ Listing and detail pages ship full HTML (venue page ≈ 390 KB / ~10k words raw; county page ≈ 937 visible words; tool pages ≈ 300–400 words) | curl of raw HTML, scripts stripped |
| Schema | ✅ Homepage: Organization, WebSite, SearchAction, Country. Collection pages: ItemList, CollectionPage, BreadcrumbList. Fairs: Event | crawl readiness, 25 pages |

No technical blocker found: nothing is noindexed, canonicals are correct, robots is open, sitemap is healthy. Google *can* see everything.

## 2. Sitemap inventory (what we're asking Google to index)

| Pattern | URLs |
|---|---|
| `/supplier/*` detail pages | 3,056 |
| `/venue/*` detail pages | 1,934 |
| `/county/*` pages | 75 |
| Category/hub pages (`wedding-djs-uk-and-ireland`, `wedding-videographers-*`, guides, tools, `/seo` section, etc.) | ~924 |
| **Total** | **5,989** |

## 3. What search engines actually show (sampled 2026-10-18)

Confirmed returning from `site:wedhq.co.uk` sampling (via an independent third-party index — not Google's own count):

- Homepage, `/find-suppliers`, `/venues`
- County pages: `/county/galway`, `/county/berkshire`
- Category hubs: `/wedding-venues-uk-and-ireland`, `/wedding-djs-uk-and-ireland`, `/wedding-planners-uk-and-ireland`, `/wedding-content-creators-uk-and-ireland`, `/wedding-florists-north-london`
- At least one venue detail page: `/venue/the-buttery-and-glasshouse-kent-uk`
- **No supplier detail pages appeared in the sample** — either not yet indexed or under-represented in this index. Verify in GSC before acting.

## 4. Risks to indexation

1. **Volume vs. site age.** 4,990 listing detail pages (supplier + venue) is a lot of pages for Google to trust quickly. Expect slow, uneven indexation; GSC will show a ramp, not a switch.
2. **Thin supplier pages.** `/supplier/*` pages carry only ~263 visible words in raw HTML. Thin pages get crawled but skipped ("Crawled – currently not indexed"). This is the biggest lever.
3. **Tool pages are light.** `/guest-list`, `/budget-calculator`, `/wedding-checklist` ship ~300–400 words. Enough to index, not enough to rank.
4. **Internal linking depth.** 3,056 supplier pages need every one reachable within a few clicks of the hubs/county pages (they are linked via county + category ItemLists — keep that intact as the DB grows).

## 5. How to get the real number (15 minutes)

1. Google Search Console → **Indexing → Pages** → "Indexed / Not indexed" counts for `https://wedhq.co.uk/`.
2. Compare the indexed count to 5,989; the gap tells the true story.
3. GSC URL Inspection on 5–10 random `/supplier/*` slugs — if the pattern is "Crawled – currently not indexed", action 6 below applies.
4. Check **Sitemaps** report: "Discovered URLs" vs indexed URLs from `sitemap.xml`.

## 6. Recommended next actions (priority order)

| # | Action | Priority | Acceptance check |
|---|---|---|---|
| 1 | Read GSC Pages report; record indexed count as the baseline for this audit | P1 | Baseline number recorded in this doc |
| 2 | Enrich supplier detail pages with unique content (services offered, areas covered, pricing indicators, FAQs, review snippets where real) — target 500+ unique words | P1 | Re-sampled supplier page ≥ 500 words; GSC "not indexed" share falls over 4–6 weeks |
| 3 | Add unique intro/FAQ copy blocks to planning tool pages | P2 | Each tool page ≥ 600 words with an answerable question block |
| 4 | Ensure every new supplier/venue row gets an internal link from a county or category hub on publish day, and the sitemap updates immediately | P2 | New listing appears in sitemap.xml within 24h |
| 5 | Re-run this review in 30 days with GSC numbers | P3 | Dated follow-up doc in `docs/audits/` |

---

### Evidence & method notes

- Crawl: BeyondSEO native crawler, HTTP representation, 25 pages, 2026-10-18, robots respected. 0 failed URLs; sitemap fetch OK. Full crawl output archived separately (not committed).
- Content word counts measured from raw server HTML with scripts stripped — confirms SSR output, not client-only rendering.
- Index sampling used a third-party web index (Z.ai), whose coverage differs from Google's. Treat section 3 as directional only; do not cite it as Google's indexed count.
