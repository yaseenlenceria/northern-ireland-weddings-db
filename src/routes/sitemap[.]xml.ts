import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/seo";
import { ARTICLES } from "@/lib/articles";
import { SERVICES, INDUSTRIES } from "@/lib/site";

/** Bump when static copy or articles change so crawlers see a fresh lastmod. */
const STATIC_LASTMOD = "2026-09-23";

type SitemapEntry = {
  path: string;
  changefreq: "weekly" | "monthly" | "yearly";
  priority: string;
  lastmod?: string;
};

const STATIC_PATHS: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/services", changefreq: "monthly", priority: "0.9" },
  { path: "/free-seo-audit", changefreq: "monthly", priority: "0.9" },
  { path: "/wedding-seo-checklist", changefreq: "monthly", priority: "0.8" },
  { path: "/resources", changefreq: "weekly", priority: "0.8" },
  { path: "/about", changefreq: "yearly", priority: "0.5" },
  { path: "/contact", changefreq: "yearly", priority: "0.4" },
  ...SERVICES.map((service): SitemapEntry => ({
    path: `/services/${service.slug}`,
    changefreq: "monthly",
    priority: "0.8",
  })),
  ...INDUSTRIES.map((industry): SitemapEntry => ({
    path: `/${industry.slug}`,
    changefreq: "monthly",
    priority: "0.8",
  })),
];

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const urls = [
          ...STATIC_PATHS.map((entry) => ({ ...entry, lastmod: STATIC_LASTMOD })),
          ...ARTICLES.map((article): SitemapEntry => ({
            path: `/resources/${article.slug}`,
            changefreq: "monthly" as const,
            priority: "0.7",
            lastmod: article.datePublished,
          })),
        ];

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(`${SITE_URL}${entry.path}`)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

        return new Response(body, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
          },
        });
      },
    },
  },
});
