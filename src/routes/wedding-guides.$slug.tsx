import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/site/JsonLd";
import { ListingImage } from "@/components/site/ListingImage";
import { getGuideHighlights } from "@/lib/directory.functions";
import { GUIDES, GUIDE_BY_SLUG } from "@/lib/guides";
import { canonical, clamp, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/wedding-guides/$slug")({
  loader: ({ params }) => {
    const guide = GUIDE_BY_SLUG.get(params.slug);
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Guide not found" }, { name: "robots", content: "noindex" }] };
    }
    const { guide } = loaderData;
    const title = `${guide.title} | Wedora Ireland`;
    const path = `/wedding-guides/${params.slug}`;
    return {
      meta: pageMeta({
        title,
        description: clamp(guide.excerpt),
        path,
        type: "article",
      }),
      links: canonical(path),
    };
  },
  component: GuidePage,
  notFoundComponent: () => (
    <SiteLayout>
      <PageHeader title="Guide not found" />
      <Section>
        <Button asChild>
          <Link to="/wedding-guides">All guides</Link>
        </Button>
      </Section>
    </SiteLayout>
  ),
  errorComponent: () => (
    <SiteLayout>
      <PageHeader title="This guide didn't load" />
    </SiteLayout>
  ),
});

function GuidePage() {
  const { guide } = Route.useLoaderData();
  const fetchHighlights = useServerFn(getGuideHighlights);
  const highlights = useQuery({
    queryKey: ["guide-highlights"],
    queryFn: () => fetchHighlights(),
  });
  const others = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 3);

  return (
    <SiteLayout>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.excerpt,
          articleSection: guide.topic,
          author: { "@type": "Organization", name: "Wedora Ireland" },
          publisher: { "@type": "Organization", name: "Wedora Ireland" },
        }}
      />

      <PageHeader eyebrow={guide.topic} title={guide.title} description={guide.excerpt}>
        <Breadcrumbs
          items={[{ label: "Wedding Guides", to: "/wedding-guides" }, { label: guide.title }]}
        />
      </PageHeader>

      <Section>
        <article className="mx-auto max-w-3xl space-y-10">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl">{section.heading}</h2>
              <div className="mt-3 space-y-4 text-muted-foreground">
                {section.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>
          ))}

          <section>
            <h2 className="text-2xl">Real listings to compare next</h2>
            <p className="mt-3 text-muted-foreground">
              These examples come from the live directory database, so couples can move from advice
              into actual Irish venues and suppliers.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[...(highlights.data?.venues ?? []), ...(highlights.data?.suppliers ?? [])]
                .slice(0, 4)
                .map((item, index) => {
                  const isVenue = index < (highlights.data?.venues.length ?? 0);
                  return (
                    <Link
                      key={`${isVenue ? "venue" : "supplier"}-${item.slug}`}
                      to={isVenue ? "/venue/$slug" : "/supplier/$slug"}
                      params={{ slug: item.slug }}
                      className="group overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-shadow hover:shadow-lift"
                    >
                      <ListingImage
                        src={item.image}
                        alt={item.name}
                        className="aspect-16/10 w-full object-cover"
                      />
                      <div className="p-4">
                        <p className="eyebrow text-primary">{isVenue ? "Venue" : "Supplier"}</p>
                        <h3 className="mt-1 font-serif text-xl group-hover:text-primary">
                          {item.name}
                        </h3>
                        {item.county ? (
                          <p className="mt-1 text-sm text-muted-foreground">Co. {item.county}</p>
                        ) : null}
                      </div>
                    </Link>
                  );
                })}
            </div>
          </section>

          <div className="rounded-xl border border-primary/25 bg-primary-soft p-6 text-center">
            <h2 className="font-serif text-2xl">Ready to start enquiring?</h2>
            <p className="mt-2 text-sm text-accent-foreground">
              Search venues and suppliers by county and send your date straight to them.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link to="/venues">Browse venues</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/find-suppliers">Browse suppliers</Link>
              </Button>
            </div>
          </div>
        </article>
      </Section>

      <Section tone="ivory" title="Keep reading">
        <div className="grid gap-6 sm:grid-cols-3">
          {others.map((other) => (
            <Link
              key={other.slug}
              to="/wedding-guides/$slug"
              params={{ slug: other.slug }}
              className="rounded-xl border border-border bg-card p-6 shadow-soft hover:shadow-lift"
            >
              <p className="eyebrow text-primary">{other.topic}</p>
              <h3 className="mt-2 font-serif text-xl">{other.title}</h3>
            </Link>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
