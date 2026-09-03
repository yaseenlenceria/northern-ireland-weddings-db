import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { SITE_URL } from "@/lib/seo";
import { CATEGORIES, COUNTIES, VENUE_SLUG, countySlug } from "@/lib/taxonomy";
import { GUIDES } from "@/lib/guides";

interface SitemapEntry {
  path: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: string;
}

/** Static, publicly indexable routes. Auth-only and noindex routes are excluded. */
const STATIC_PATHS: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/find-suppliers", changefreq: "weekly", priority: "0.9" },
  { path: "/venues", changefreq: "weekly", priority: "0.9" },
  { path: "/wedding-fairs", changefreq: "weekly", priority: "0.7" },
  { path: "/wedding-guides", changefreq: "monthly", priority: "0.7" },
  { path: "/planning-tools", changefreq: "monthly", priority: "0.6" },
  { path: "/wedding-checklist", changefreq: "monthly", priority: "0.6" },
  { path: "/wedding-timeline", changefreq: "monthly", priority: "0.6" },
  { path: "/list-your-business", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "yearly", priority: "0.4" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [...STATIC_PATHS];

        for (const guide of GUIDES) {
          entries.push({ path: `/wedding-guides/${guide.slug}`, changefreq: "monthly", priority: "0.6" });
        }

        const supplierCounties = new Map<string, Set<string>>();
        const venueCounties = new Set<string>();

        try {
          const { sql: getSql } = await import("@/lib/postgres.server");
          const sql = getSql();

          const suppliers = await sql<{ slug: string; county: string | null; categories: string[] | null }[]>`
            SELECT slug, county, categories
            FROM suppliers
            ORDER BY slug ASC
          `;
          for (const row of suppliers) {
            entries.push({ path: `/supplier/${row.slug}`, changefreq: "monthly", priority: "0.7" });
            for (const cat of row.categories ?? []) {
              if (!row.county) continue;
              const set = supplierCounties.get(cat) ?? new Set<string>();
              set.add(row.county);
              supplierCounties.set(cat, set);
            }
          }

          const venues = await sql<{ slug: string; county: string | null }[]>`
            SELECT slug, county
            FROM venues
            ORDER BY slug ASC
          `;
          for (const row of venues) {
            entries.push({ path: `/venue/${row.slug}`, changefreq: "monthly", priority: "0.7" });
            if (row.county) venueCounties.add(row.county);
          }
        } catch (error) {
          console.error("[Sitemap] Database-backed sitemap entries unavailable", error);
        }

        // County hubs — only counties that actually have listings.
        const liveCounties = new Set<string>(venueCounties);
        for (const set of supplierCounties.values()) for (const c of set) liveCounties.add(c);
        for (const county of COUNTIES) {
          if (liveCounties.has(county)) {
            entries.push({ path: `/county/${countySlug(county)}`, changefreq: "weekly", priority: "0.7" });
          }
        }

        // National category pages plus the county pages that have listings.
        entries.push({ path: `/${VENUE_SLUG}-ireland`, changefreq: "weekly", priority: "0.8" });
        for (const county of venueCounties) {
          entries.push({ path: `/${VENUE_SLUG}-${countySlug(county)}`, changefreq: "weekly", priority: "0.8" });
        }
        for (const category of CATEGORIES) {
          const counties = supplierCounties.get(category.key);
          if (!counties?.size) continue;
          entries.push({ path: `/${category.slug}-ireland`, changefreq: "weekly", priority: "0.8" });
          for (const county of counties) {
            entries.push({ path: `/${category.slug}-${countySlug(county)}`, changefreq: "weekly", priority: "0.8" });
          }
        }

        const seen = new Set<string>();
        const urls = entries
          .filter((e) => (seen.has(e.path) ? false : (seen.add(e.path), true)))
          .map((e) =>
            [
              "  <url>",
              `    <loc>${SITE_URL}${e.path === "/" ? "/" : e.path}</loc>`,
              e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
              e.priority ? `    <priority>${e.priority}</priority>` : null,
              "  </url>",
            ]
              .filter(Boolean)
              .join("\n"),
          );

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls,
          "</urlset>",
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
