import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CtaBand, PageHeader, Section, SiteLayout } from "@/components/site/Layout";
import { JsonLd } from "@/components/site/JsonLd";
import { ARTICLES, getArticle } from "@/lib/articles";
import { SITE_URL, absoluteUrl, breadcrumbSchema, canonical, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/seo/resources/$slug")({
  beforeLoad: ({ params }) => {
    if (!getArticle(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const article = getArticle(params.slug)!;
    return {
      links: canonical(`/seo/resources/${article.slug}`),
      meta: [
        ...pageMeta({
          title: article.metaTitle,
          description: article.metaDescription,
          path: `/seo/resources/${article.slug}`,
          type: "article",
        }),
      ],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const article = getArticle(slug)!;
  const path = `/seo/resources/${article.slug}`;
  const related = getRelated(slug);

  return (
    <SiteLayout>
      <PageHeader eyebrow={article.category} title={article.title} description={article.excerpt}>
        <Breadcrumbs items={[{ label: "SEO", to: "/seo" }, { label: article.category }]} />
        <p className="mt-4 text-sm text-muted-foreground">{article.readMinutes} min read</p>
      </PageHeader>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <article>
            <p className="text-lg leading-relaxed text-foreground">{article.intro}</p>
            {article.sections.map((section) => (
              <section key={section.heading} className="mt-10">
                <h2 className="text-2xl leading-snug">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="mt-4 leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.list ? (
                  <ul className="mt-4 space-y-2.5">
                    {section.list.map((item) => (
                      <li key={item} className="flex gap-3 leading-relaxed text-muted-foreground">
                        <span
                          className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </article>

          <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-lg">Get the free checklist</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                The 21-Point Wedding Website SEO Checklist — Ireland Edition. Find out whether
                couples can actually find your business on Google.
              </p>
              <Link
                to="/seo/checklist"
                className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-gold px-4 py-2.5 text-sm font-medium text-gold-foreground shadow-soft transition-colors hover:bg-gold/90"
              >
                Get the Free Checklist
              </Link>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg">Keep reading</h2>
              <ul className="mt-4 space-y-3">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      to="/seo/resources/$slug"
                      params={{ slug: item.slug }}
                      className="inline-flex items-start gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbSchema(SITE_URL, [
              { name: "Home", path: "/" },
              { name: "Resources", path: "/seo/resources" },
              { name: article.title, path },
            ]),
            {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: article.title,
              description: article.metaDescription,
              url: absoluteUrl(path),
              datePublished: article.datePublished,
              dateModified: article.datePublished,
              author: { "@type": "Person", name: "Yasin" },
              publisher: { "@type": "Organization", name: "WedHQ", url: absoluteUrl("/") },
              mainEntityOfPage: absoluteUrl(path),
            },
          ],
        }}
      />
      <CtaBand
        title="Turn what you've just read into rankings"
        description="Request a free SEO audit and we'll show you exactly which of these fixes your website needs most."
        primaryLabel="Get a Free SEO Audit"
        primaryTo="/seo/free-audit"
        secondaryLabel="Request a Website Review"
        secondaryTo="/seo/contact"
      />
    </SiteLayout>
  );
}

function getRelated(slug: string) {
  return ARTICLES.filter((article) => article.slug !== slug).slice(0, 4);
}
