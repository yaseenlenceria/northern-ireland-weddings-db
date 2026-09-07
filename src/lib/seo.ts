/**
 * Shared SEO helpers.
 *
 * Canonical and og:url are absolute, built from the project's public domain,
 * so crawlers and social scrapers resolve one authoritative URL per page.
 */

export const SITE_NAME = "WedHQ";

/** Public origin used for canonical, og:url and sitemap entries. */
export const SITE_URL = import.meta.env["VITE_SITE_URL"] ?? "https://wedhq.co.uk";

/** Absolute URL for a site-relative path. */
export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`.replace(/\/$/, "") || SITE_URL;

/** Current year, used in directory titles and guide pages. */
export const SEO_YEAR = new Date().getFullYear();

export type MetaInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article" | "profile";
  image?: string | null;
  noindex?: boolean;
};

/** Builds a complete per-route meta array. Title is a meta entry, by design. */
export function pageMeta({
  title,
  description,
  path,
  type = "website",
  image,
  noindex,
}: MetaInput) {
  const desc = description.length > 158 ? `${description.slice(0, 155).trimEnd()}…` : description;
  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: desc },
    { property: "og:title", content: title },
    { property: "og:description", content: desc },
    { property: "og:type", content: type },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:url", content: absoluteUrl(path) },
    { name: "twitter:card", content: "summary_large_image" },
  ];
  if (image && image.startsWith("https://")) {
    meta.push({ property: "og:image", content: image });
    meta.push({ name: "twitter:image", content: image });
  }
  meta.push({
    name: "robots",
    content: noindex ? "noindex, follow" : "index, follow, max-image-preview:large",
  });
  return meta;
}

/** Self-referencing canonical for a leaf route. */
export function canonical(path: string) {
  return [{ rel: "canonical", href: absoluteUrl(path) }];
}

/** Truncates copy to a safe meta-description length. */
export const clamp = (text: string, max = 155) =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

/** AggregateRating node, or undefined when there is no real rating to show. */
export function aggregateRating(rating?: number | string | null, count?: number | string | null) {
  const numericRating = typeof rating === "string" ? Number(rating) : rating;
  const numericCount = typeof count === "string" ? Number(count) : count;
  if (!numericRating || !numericCount || numericCount < 1) return undefined;
  return {
    "@type": "AggregateRating",
    ratingValue: Number(numericRating.toFixed(1)),
    reviewCount: numericCount,
    bestRating: 5,
    worstRating: 1,
  };
}

export type ReviewRow = {
  id: string;
  author_name: string | null;
  rating: number | string | null;
  title: string | null;
  body: string | null;
  created_at: string;
};

/** Review nodes for rich results, built only from stored review rows. */
export function reviewSchema(reviews: ReviewRow[]) {
  return reviews
    .filter((r) => r.rating)
    .slice(0, 10)
    .map((r) => ({
      "@type": "Review",
      ...(r.title ? { name: r.title } : {}),
      reviewBody: r.body ?? undefined,
      datePublished: r.created_at.slice(0, 10),
      author: { "@type": "Person", name: r.author_name || "Verified couple" },
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
    }));
}

export type SourcedReviewRow = {
  id: string;
  author_name: string | null;
  rating: number | string | null;
  title: string | null;
  body: string;
  review_date: string | null;
  source_name: string | null;
  source_url: string | null;
};

/** Review nodes for imported third-party reviews, attributed to their source. */
export function sourcedReviewSchema(reviews: SourcedReviewRow[]) {
  return reviews
    .filter((r) => r.rating)
    .slice(0, 10)
    .map((r) => ({
      "@type": "Review",
      ...(r.title ? { name: r.title } : {}),
      reviewBody: r.body,
      ...(r.review_date ? { datePublished: r.review_date } : {}),
      author: { "@type": "Person", name: r.author_name || "Verified couple" },
      ...(r.source_name ? { publisher: { "@type": "Organization", name: r.source_name } } : {}),
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
    }));
}

/** Average of stored review ratings. */
export function averageRating(reviews: ReviewRow[]) {
  const scored = reviews
    .map((r) => (typeof r.rating === "string" ? Number(r.rating) : r.rating))
    .filter((rating): rating is number => typeof rating === "number" && Number.isFinite(rating));
  if (!scored.length) return null;
  return scored.reduce((sum, rating) => sum + rating, 0) / scored.length;
}
