/**
 * Shared SEO helpers.
 *
 * Canonical and og:url are absolute, built from the project's public domain,
 * so crawlers and social scrapers resolve one authoritative URL per page.
 */

export const SITE_NAME = "Vow Visibility";

/** Public origin used for canonical, og:url and sitemap entries. */
export const SITE_URL = (import.meta.env["VITE_SITE_URL"] ?? "https://vowvisibility.com").replace(
  /\/+$/,
  "",
);

/** Site-wide fallback for pages that do not have a dedicated social image. */
export const DEFAULT_OG_IMAGE = "/og-default.png";

/** Absolute URL for a site-relative path. */
export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`.replace(/\/$/, "") || SITE_URL;

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
  const resolvedImage = image || DEFAULT_OG_IMAGE;
  const imageUrl = resolvedImage.startsWith("/") ? absoluteUrl(resolvedImage) : resolvedImage;
  if (imageUrl.startsWith("https://")) {
    meta.push({ property: "og:image", content: imageUrl });
    meta.push({ name: "twitter:image", content: imageUrl });
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

export type FaqInput = { question: string; answer: string };

/** FAQPage node — only use where the questions are visibly rendered on the page. */
export function faqSchema(faqs: FaqInput[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export type ServiceSchemaInput = {
  name: string;
  description: string;
  path: string;
};

/** Service node for pages that visibly describe one of our services. */
export function serviceSchema({ name, description, path }: ServiceSchemaInput) {
  return {
    "@type": "Service",
    name,
    description,
    url: absoluteUrl(path),
    serviceType: name,
    areaServed: { "@type": "Country", name: "Ireland" },
    provider: { "@id": absoluteUrl("/#organization") },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${absoluteUrl("/#organization")}`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/logo.png"),
    description:
      "SEO and digital marketing for Irish wedding businesses. Vow Visibility helps wedding venues, photographers, planners and suppliers improve their Google visibility and turn search traffic into enquiries.",
    areaServed: { "@type": "Country", name: "Ireland" },
    founder: { "@type": "Person", name: "Yasin" },
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
