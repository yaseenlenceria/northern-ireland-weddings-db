# WedList Ireland — Wedding Supplier Directory

## Important: WordPress is not the stack here

Lovable builds modern React web applications (TanStack Start + Tailwind), not WordPress themes or plugins. I cannot produce a `wedlist-ireland` theme or a `wedlist-core` plugin.

Everything you asked for is still deliverable — custom post types become database tables, taxonomies become filterable columns, Rank Math metadata becomes built-in per-page SEO tags, and the plugin/theme split becomes a clean server/UI separation. The result is faster and easier to manage than WordPress, with the same scalable directory structure. If WordPress specifically is a hard requirement, say so and we'll stop here.

## Your data (verified from the upload)

| Sheet | Rows | Notable columns |
| --- | --- | --- |
| Venues | 206 | Name, county, address, capacity, per-person price, rating, review count, phone, website, venue types, styles, facilities, description, lat/long, logo, gallery, brochures |
| Suppliers | 785 | Name, categories, county, address, avg price, phone, website, overview, description, lat/long, logo, gallery |
| Wedding Fairs | 19 | Event name, date, time, venue, contact, image, description |

**26 supplier categories** present, led by photographers (136), cakes (67), florists (64), bands (60), entertainment (54), decor (46), videographers (42), makeup (34), celebrants (32), church singers (30), DJs (21), planners (16).

**27 counties** covered — Dublin (226), Cork (154), Galway (45), Kerry (40), Mayo (33), Meath (32), Donegal (28), and so on. Note: your data is Republic-of-Ireland focused (only 1 Northern Ireland row, Tyrone), so the site is scoped to Ireland as your brief says.

No dummy data anywhere — every listing comes from this file.

## Backend (Lovable Cloud)

Tables, all seeded from your Excel via migration:
- `venues` (206 rows) — all 28 columns
- `suppliers` (785 rows) — all 16 columns
- `wedding_fairs` (19 rows)
- `supplier_categories` and `counties` — lookup tables for filters and SEO pages
- `enquiries` — leads from couples to suppliers/venues
- `reviews` — couple-submitted reviews
- `saved_suppliers` — couple shortlists
- `profiles` + `user_roles` (couple / supplier / admin)
- `checklist_items`, `budget_items`, `guest_list` — planning tools

Public read access for listings; enquiries, saves, and dashboards are auth-scoped.

## Pages

**Core**
- `/` Home — hero with three-field search (what / where / date), popular category cards, featured suppliers, browse-by-county grid, planning tools, "why couples use WedList", supplier CTA, latest guides
- `/find-suppliers` — full search with category, county, price, rating filters; URL-driven so results are shareable
- `/venues` — venue search with capacity, price-per-person, venue type, style, facilities filters
- `/planning-tools`, `/wedding-guides`, `/real-weddings`, `/wedding-fairs`, `/contact`, `/auth`

**Category pages** (one per real category in your data)
`/wedding-photographers-ireland`, `/wedding-planners-ireland`, `/wedding-singers-ireland`, `/wedding-videographers-ireland`, `/wedding-florists-ireland`, `/wedding-makeup-artists-ireland`, `/wedding-djs-ireland`, `/wedding-celebrants-ireland`, `/wedding-cakes-ireland`, `/wedding-transport-ireland`, plus the rest.

**SEO landing pages — dynamic templates, not hand-written files**
- `/$category-$county` e.g. `/wedding-venues-dublin`, `/wedding-planners-cork`, `/wedding-photographers-galway`
- Generated for every category × county combination that actually has listings — hundreds of pages from two route templates, each with its own title, meta description, H1, intro copy, and listing grid.

**Detail pages**
- `/supplier/$slug` — hero image, gallery, about, services, county and service areas, price guide or "request pricing", reviews, FAQs, website and social links, enquiry form, similar suppliers nearby (by county + category)
- `/venue/$slug` — same plus capacity, per-person price, facilities, styles, brochures, map from your lat/long

**Dashboards**
- Supplier: edit profile, upload images, set service areas and pricing, view enquiries
- Couple: saved suppliers, sent enquiries, shortlist, checklist, budget calculator, guest list

**Tools**
- `/tools/checklist`, `/tools/budget-calculator`, `/tools/guest-list`, `/tools/timeline`

## Design

Soft white and ivory backgrounds, sage green primary, muted gold accents, charcoal text. An elegant serif for headings paired with a clean sans for body — deliberately not the generic default look. Mobile-first, generous whitespace, no clutter. Supplier cards carry image, name, category, county, short description, rating, price indicator, "View Profile" and "Enquire".

## SEO

- Unique title, description, and OG tags on every route including each generated county page
- LocalBusiness schema on supplier and venue profiles, using your real address, phone, and coordinates
- FAQPage schema on profile FAQ sections
- Breadcrumbs with schema
- Clean URLs, single H1 per page, semantic HTML, alt text, canonical tags, lazy-loaded images
- Internal linking between category pages, county pages, and profiles

## Build order

1. Enable Lovable Cloud
2. Create schema and import all 1,010 records from your Excel
3. Design system (colours, typography, cards, badges)
4. Home + global nav and footer
5. Search, category, county, and venue pages
6. Supplier and venue profile pages with enquiry forms and schema
7. Auth, supplier dashboard, couple dashboard
8. Planning tools
9. Guides, real weddings, wedding fairs
10. SEO pass across every route

## Open questions

- WordPress: confirm you're happy with a modern web app instead of a WP theme/plugin.
- Your gallery images are hosted on WeddingDates' S3 bucket. Hotlinking them is fragile and legally risky. I'd recommend copying them into Lovable Cloud storage during import, or showing tasteful placeholders until suppliers upload their own. Tell me which you prefer.
