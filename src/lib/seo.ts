/**
 * Shared SEO helpers.
 *
 * The project has no public domain yet, so canonical and og:url use relative
 * paths — crawlers resolve them against the serving host at request time.
 */

export const SITE_NAME = "WedList Ireland";

/** Current year, used in "Top 10 ... (2026)" style titles. */
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
    { property: "og:url", content: path },
    { name: "twitter:card", content: "summary_large_image" },
  ];
  if (image && image.startsWith("https://")) {
    meta.push({ property: "og:image", content: image });
    meta.push({ name: "twitter:image", content: image });
  }
  if (noindex) meta.push({ name: "robots", content: "noindex, follow" });
  return meta;
}

/** Self-referencing canonical for a leaf route. */
export function canonical(path: string) {
  return [{ rel: "canonical", href: path }];
}

/** Truncates copy to a safe meta-description length. */
export const clamp = (text: string, max = 155) =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

/** AggregateRating node, or undefined when there is no real rating to show. */
export function aggregateRating(rating?: number | null, count?: number | null) {
  if (!rating || !count || count < 1) return undefined;
  return {
    "@type": "AggregateRating",
    ratingValue: Number(rating.toFixed(1)),
    reviewCount: count,
    bestRating: 5,
    worstRating: 1,
  };
}

export type ReviewRow = {
  id: string;
  author_name: string | null;
  rating: number | null;
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

/** Average of stored review ratings. */
export function averageRating(reviews: ReviewRow[]) {
  const scored = reviews.filter((r) => typeof r.rating === "number");
  if (!scored.length) return null;
  return scored.reduce((sum, r) => sum + (r.rating ?? 0), 0) / scored.length;
}
