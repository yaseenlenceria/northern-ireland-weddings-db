import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { SITE_URL } from "@/lib/seo";
import { cleanImageUrl, publicImageUrl } from "@/lib/media";
import {
  CATEGORIES,
  LOCATIONS,
  VENUE_SLUG,
  countySlug,
  normalizeLocationName,
} from "@/lib/taxonomy";
import { GUIDES } from "@/lib/guides";

interface SitemapImage {
  loc: string;
  title?: string;
}

interface SitemapEntry {
  path: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
  priority?: string | undefined;
  lastmod?: string | undefined;
  images?: SitemapImage[] | undefined;
}

/** Bump when static copy or guides change so crawlers see a fresh lastmod. */
const STATIC_LASTMOD = "2026-09-22";

/**
 * Mirrors the $directorySlug robots rule: UK-country hubs with fewer listings
 * than this are noindexed and must stay out of the sitemap.
 */
const UK_MIN_LISTINGS = 3;

/** Images per listing emitted with the Google image-sitemap extension. */
const IMAGES_PER_LISTING = 4;

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toDateOnly = (value: string | Date | null | undefined) => {
  if (!value) return undefined;
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
};

const maxDate = (a: string | undefined, b: string | undefined) => (!a ? b : !b ? a : a > b ? a : b);

/** Tracks the newest member date per bucket so hub URLs get honest lastmods. */
class BucketCounter {
  counts = new Map<string, number>();
  lastmod = new Map<string, string>();

  add(key: string, lastmod: string | undefined) {
    this.counts.set(key, (this.counts.get(key) ?? 0) + 1);
    const previous = this.lastmod.get(key);
    const resolved = lastmod ?? STATIC_LASTMOD;
    this.lastmod.set(key, !previous || resolved > previous ? resolved : previous);
  }

  count(key: string) {
    return this.counts.get(key) ?? 0;
  }

  date(key: string) {
    return this.lastmod.get(key) ?? STATIC_LASTMOD;
  }
}

/** Static, publicly indexable routes. Auth-only and noindex routes are excluded. */
const STATIC_PATHS: SitemapEntry[] = (
  [
    { path: "/", changefreq: "weekly", priority: "1.0" },
    { path: "/find-suppliers", changefreq: "weekly", priority: "0.9" },
    { path: "/venues", changefreq: "weekly", priority: "0.9" },
    { path: "/wedding-fairs", changefreq: "weekly", priority: "0.7" },
    { path: "/wedding-guides", changefreq: "monthly", priority: "0.7" },
    { path: "/planning-tools", changefreq: "monthly", priority: "0.6" },
    { path: "/budget-calculator", changefreq: "monthly", priority: "0.6" },
    { path: "/guest-list", changefreq: "monthly", priority: "0.6" },
    { path: "/wedding-checklist", changefreq: "monthly", priority: "0.6" },
    { path: "/wedding-timeline", changefreq: "monthly", priority: "0.6" },
    { path: "/list-your-business", changefreq: "monthly", priority: "0.6" },
    { path: "/contact", changefreq: "yearly", priority: "0.4" },
    { path: "/information/about", changefreq: "yearly", priority: "0.3" },
    { path: "/information/editorial-team", changefreq: "yearly", priority: "0.3" },
    { path: "/information/careers", changefreq: "yearly", priority: "0.2" },
    { path: "/information/legal-hub", changefreq: "yearly", priority: "0.3" },
    { path: "/information/transparency-hub", changefreq: "yearly", priority: "0.3" },
    { path: "/information/terms-of-use", changefreq: "yearly", priority: "0.3" },
    { path: "/information/terms-of-purchase", changefreq: "yearly", priority: "0.3" },
    { path: "/information/privacy", changefreq: "yearly", priority: "0.3" },
    { path: "/information/cookies", changefreq: "yearly", priority: "0.3" },
    { path: "/information/your-privacy-choices", changefreq: "yearly", priority: "0.3" },
  ] as SitemapEntry[]
).map((entry) => ({ ...entry, lastmod: STATIC_LASTMOD }));

type ListingImageRow = {
  logo_image: string | null;
  banner_image?: string | null;
  gallery_images: string[] | null;
};

const listingImages = (row: ListingImageRow, title: string): SitemapImage[] =>
  [row.banner_image, row.logo_image, ...(row.gallery_images ?? [])]
    .map((image) => cleanImageUrl(image ?? null))
    .filter((image): image is string => Boolean(image))
    .slice(0, IMAGES_PER_LISTING)
    .map((image) => {
      const src = publicImageUrl(image);
      return { loc: src.startsWith("/") ? `${SITE_URL}${src}` : src, title };
    });

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [...STATIC_PATHS];

        for (const guide of GUIDES) {
          entries.push({
            path: `/wedding-guides/${guide.slug}`,
            changefreq: "monthly",
            priority: "0.6",
            lastmod: STATIC_LASTMOD,
          });
        }

        // Counters use the same grouping keys the directory routes filter on,
        // so every advertised hub URL meets the page's own indexability rule.
        const venueCounty = new BucketCounter();
        const venueCountry = new BucketCounter();
        const supplierCounty = new BucketCounter();
        const supplierCountry = new BucketCounter();
        const supplierCategory = new BucketCounter();
        const supplierCategoryCountry = new BucketCounter();
        const supplierCategoryCounty = new BucketCounter();
        let venueCount = 0;
        let venueLastmod: string | undefined;

        try {
          const { sql: getSql } = await import("@/lib/postgres.server");
          const sql = getSql();

          const suppliers = await sql<
            {
              slug: string;
              name: string;
              country: string | null;
              county: string | null;
              categories: string[] | null;
              updated_at: string | null;
              logo_image: string | null;
              banner_image: string | null;
              gallery_images: string[] | null;
            }[]
          >`
            SELECT slug, name, country, county, categories, updated_at,
                   logo_image, banner_image, gallery_images
            FROM suppliers
            WHERE COALESCE(source_url, '') <> 'wedhq-demo'
            ORDER BY slug ASC
          `;
          for (const row of suppliers) {
            const updated = toDateOnly(row.updated_at);
            entries.push({
              path: `/supplier/${row.slug}`,
              changefreq: "monthly",
              priority: "0.7",
              lastmod: updated,
              images: listingImages(row, row.name),
            });
            if (row.country) supplierCountry.add(row.country, updated);
            const county = row.county ? normalizeLocationName(row.county) : null;
            if (county) supplierCounty.add(county, updated);
            for (const key of row.categories ?? []) {
              supplierCategory.add(key, updated);
              if (row.country) supplierCategoryCountry.add(`${key}|${row.country}`, updated);
              if (county) supplierCategoryCounty.add(`${key}|${county}`, updated);
            }
          }

          const venues = await sql<
            {
              slug: string;
              name: string;
              country: string | null;
              county: string | null;
              updated_at: string | null;
              logo_image: string | null;
              gallery_images: string[] | null;
            }[]
          >`
            SELECT slug, name, country, county, updated_at, logo_image, gallery_images
            FROM venues
            WHERE COALESCE(source_url, '') <> 'wedhq-demo'
            ORDER BY slug ASC
          `;
          venueCount = venues.length;
          for (const row of venues) {
            const updated = toDateOnly(row.updated_at);
            venueLastmod = maxDate(venueLastmod, updated);
            entries.push({
              path: `/venue/${row.slug}`,
              changefreq: "monthly",
              priority: "0.7",
              lastmod: updated,
              images: listingImages(row, row.name),
            });
            if (row.country) venueCountry.add(row.country, updated);
            if (row.county) venueCounty.add(normalizeLocationName(row.county), updated);
          }
        } catch (error) {
          console.error("[Sitemap] Database-backed sitemap entries unavailable", error);
        }

        const indexable = (count: number) => count >= 1;
        const indexableUk = (count: number) => count >= UK_MIN_LISTINGS;

        // County hubs — only counties that actually have listings.
        const liveCounties = new Set<string>([
          ...venueCounty.counts.keys(),
          ...supplierCounty.counts.keys(),
        ]);
        for (const county of LOCATIONS) {
          if (liveCounties.has(county)) {
            entries.push({
              path: `/county/${countySlug(county)}`,
              changefreq: "weekly",
              priority: "0.7",
              lastmod: maxDate(venueCounty.date(county), supplierCounty.date(county)),
            });
          }
        }

        const venueHub = (suffix: string, ok: boolean, lastmod: string) => {
          if (!ok) return;
          entries.push({
            path: `/${VENUE_SLUG}${suffix}`,
            changefreq: "weekly",
            priority: "0.8",
            lastmod,
          });
        };
        venueHub("-uk-and-ireland", indexable(venueCount), venueLastmod ?? STATIC_LASTMOD);
        venueHub(
          "-ireland",
          indexable(venueCountry.count("Ireland")),
          venueCountry.date("Ireland"),
        );
        venueHub(
          "-uk",
          indexableUk(venueCountry.count("United Kingdom")),
          venueCountry.date("United Kingdom"),
        );
        for (const county of venueCounty.counts.keys()) {
          if (!LOCATIONS.includes(county as (typeof LOCATIONS)[number])) continue;
          venueHub(
            `-${countySlug(county)}`,
            indexable(venueCounty.count(county)),
            venueCounty.date(county),
          );
        }

        const supplierHub = (slug: string, suffix: string, ok: boolean, lastmod: string) => {
          if (!ok) return;
          entries.push({
            path: `/${slug}${suffix}`,
            changefreq: "weekly",
            priority: "0.8",
            lastmod,
          });
        };
        for (const category of CATEGORIES) {
          const total = supplierCategory.count(category.key);
          supplierHub(
            category.slug,
            "-uk-and-ireland",
            indexable(total),
            supplierCategory.date(category.key),
          );
          supplierHub(
            category.slug,
            "-ireland",
            indexable(supplierCategoryCountry.count(`${category.key}|Ireland`)),
            supplierCategoryCountry.date(`${category.key}|Ireland`),
          );
          supplierHub(
            category.slug,
            "-uk",
            indexableUk(supplierCategoryCountry.count(`${category.key}|United Kingdom`)),
            supplierCategoryCountry.date(`${category.key}|United Kingdom`),
          );
          for (const [key, date] of supplierCategoryCounty.lastmod) {
            if (!key.startsWith(`${category.key}|`)) continue;
            const county = key.slice(category.key.length + 1);
            if (!LOCATIONS.includes(county as (typeof LOCATIONS)[number])) continue;
            supplierHub(
              category.slug,
              `-${countySlug(county)}`,
              indexable(supplierCategoryCounty.count(key)),
              date,
            );
          }
        }

        const seen = new Set<string>();
        const urls = entries
          .filter((e) => (seen.has(e.path) ? false : (seen.add(e.path), true)))
          .map((e) =>
            [
              "  <url>",
              `    <loc>${escapeXml(`${SITE_URL}${e.path === "/" ? "/" : e.path}`)}</loc>`,
              e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
              e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
              e.priority ? `    <priority>${e.priority}</priority>` : null,
              ...(e.images ?? []).map((image) =>
                [
                  "    <image:image>",
                  `      <image:loc>${escapeXml(image.loc)}</image:loc>`,
                  image.title ? `      <image:title>${escapeXml(image.title)}</image:title>` : null,
                  "    </image:image>",
                ]
                  .filter(Boolean)
                  .join("\n"),
              ),
              "  </url>",
            ]
              .flat()
              .filter((line): line is string => Boolean(line))
              .join("\n"),
          );

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
          ...urls,
          "</urlset>",
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
          },
        });
      },
    },
  },
});
