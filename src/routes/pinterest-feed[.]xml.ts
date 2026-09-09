import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { publicImageUrl } from "@/lib/media";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { CATEGORY_BY_KEY } from "@/lib/taxonomy";

type FeedItem = {
  id: string;
  kind: "venue" | "supplier";
  slug: string;
  name: string;
  country: string | null;
  county: string | null;
  overview: string | null;
  rating: string | number | null;
  review_count: string | number | null;
  image: string | null;
  category: string | null;
  updated_at: string | null;
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const stripControlChars = (value: string) =>
  value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, " ");

const plainText = (value: string | null | undefined) =>
  stripControlChars(value ?? "")
    .replace(/\s+/g, " ")
    .trim();

const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

function absoluteImageUrl(image: string | null) {
  if (!image) return null;
  const publicUrl = publicImageUrl(image);
  if (publicUrl.startsWith("/")) return absoluteUrl(publicUrl);
  if (/^https?:\/\//i.test(publicUrl)) return publicUrl;
  return null;
}

function itemUrl(item: FeedItem) {
  return absoluteUrl(`/${item.kind}/${item.slug}`);
}

function itemTitle(item: FeedItem) {
  const location = [item.county, item.country].filter(Boolean).join(", ");
  if (item.kind === "venue") {
    return location ? `${item.name} wedding venue in ${location}` : `${item.name} wedding venue`;
  }
  const category = item.category ? CATEGORY_BY_KEY.get(item.category)?.plural : null;
  const label = category ?? "Wedding supplier";
  return location ? `${item.name} - ${label} in ${location}` : `${item.name} - ${label}`;
}

function itemDescription(item: FeedItem) {
  const location = [item.county, item.country].filter(Boolean).join(", ");
  const reviews = Number(item.review_count ?? 0);
  const rating = Number(item.rating ?? 0);
  const reviewCopy =
    reviews > 0 && rating > 0 ? ` Rated ${rating.toFixed(1)} from ${reviews} reviews.` : "";
  const overview = plainText(item.overview);
  const base =
    overview ||
    (item.kind === "venue"
      ? `Explore ${item.name}, a wedding venue${location ? ` in ${location}` : ""}.`
      : `Explore ${item.name}, a wedding supplier${location ? ` in ${location}` : ""}.`);
  return `${base}${reviewCopy} View photos, details and enquiry options on ${SITE_NAME}.`;
}

function rssItem(item: FeedItem) {
  const link = itemUrl(item);
  const image = absoluteImageUrl(item.image);
  const pubDate = item.updated_at ? new Date(item.updated_at) : new Date();
  const date = Number.isNaN(pubDate.getTime()) ? new Date() : pubDate;
  const media = image
    ? [
        `      <media:content url="${escapeXml(image)}" medium="image" />`,
        `      <media:thumbnail url="${escapeXml(image)}" />`,
      ]
    : [];

  return [
    "    <item>",
    `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
    `      <title>${escapeXml(itemTitle(item))}</title>`,
    `      <link>${escapeXml(link)}</link>`,
    `      <description>${escapeXml(itemDescription(item))}</description>`,
    `      <pubDate>${date.toUTCString()}</pubDate>`,
    ...media,
    "    </item>",
  ].join("\n");
}

export const Route = createFileRoute("/pinterest-feed.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const requestedLimit = Number(url.searchParams.get("limit") ?? 200);
        const limit = Number.isFinite(requestedLimit)
          ? Math.min(Math.max(Math.trunc(requestedLimit), 1), 200)
          : 200;

        let items: FeedItem[] = [];

        try {
          const { sql: getSql } = await import("@/lib/postgres.server");
          const sql = getSql();

          items = await sql<FeedItem[]>`
            WITH directory_items AS (
              SELECT
                id::text,
                'venue'::text AS kind,
                slug,
                name,
                country,
                county,
                overview,
                rating::text,
                review_count::text,
                COALESCE(logo_image, gallery_images[1]) AS image,
                NULL::text AS category,
                COALESCE(updated_at, created_at)::text AS updated_at
              FROM venues
              WHERE COALESCE(source_url, '') <> 'wedhq-demo'
                AND COALESCE(logo_image, gallery_images[1]) IS NOT NULL
              UNION ALL
              SELECT
                id::text,
                'supplier'::text AS kind,
                slug,
                name,
                country,
                county,
                overview,
                rating::text,
                review_count::text,
                COALESCE(banner_image, logo_image, gallery_images[1]) AS image,
                categories[1] AS category,
                COALESCE(updated_at, created_at)::text AS updated_at
              FROM suppliers
              WHERE COALESCE(source_url, '') <> 'wedhq-demo'
                AND COALESCE(banner_image, logo_image, gallery_images[1]) IS NOT NULL
            )
            SELECT *
            FROM directory_items
            ORDER BY
              COALESCE(NULLIF(review_count, '')::integer, 0) DESC,
              COALESCE(NULLIF(rating, '')::numeric, 0) DESC,
              name ASC
            LIMIT ${limit}
          `;
        } catch (error) {
          console.error("[Pinterest RSS] Database-backed feed unavailable", error);
        }

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">',
          "  <channel>",
          `    <title>${escapeXml(`${SITE_NAME} Wedding Directory`)}</title>`,
          `    <link>${escapeXml(SITE_URL)}</link>`,
          `    <description>${escapeXml("Wedding venues and suppliers across the UK and Ireland, with photos and direct WedHQ profile links.")}</description>`,
          `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
          ...items.map(rssItem),
          "  </channel>",
          "</rss>",
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
          },
        });
      },
    },
  },
});
