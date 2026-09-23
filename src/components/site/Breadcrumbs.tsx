import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";

export type Crumb = { label: string; to?: string; params?: Record<string, string> };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const lastIndex = items.length - 1;

  return (
    <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link to="/" className="rounded hover:text-primary">
            Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1">
            <ChevronRight className="size-3 shrink-0" aria-hidden="true" />
            {item.to ? (
              <Link
                to={item.to}
                params={item.params as never}
                className="rounded hover:text-primary"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground/80" aria-current={i === lastIndex ? "page" : undefined}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * BreadcrumbList JSON-LD for search engines.
 * `item` must be an absolute URL, so paths are resolved against the site origin.
 */
export function breadcrumbSchema(_origin: string, trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: absoluteUrl(t.path),
    })),
  };
}
