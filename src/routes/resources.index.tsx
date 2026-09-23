import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CtaBand, PageHeader, Section, SiteLayout } from "@/components/site/Layout";
import { JsonLd } from "@/components/site/JsonLd";
import { ARTICLES } from "@/lib/articles";
import { absoluteUrl, canonical, pageMeta } from "@/lib/seo";

const PATH = "/resources";

export const Route = createFileRoute("/resources/")({
  head: () => ({
    meta: [
      ...pageMeta({
        title: "Wedding Marketing & SEO Resources | Free Guides | Vow Visibility",
        description:
          "Free SEO and marketing guides for Irish wedding businesses: local SEO, Google Business Profile, real wedding content, keyword research and more.",
        path: PATH,
      }),
      ...canonical(PATH),
    ],
  }),
  component: ResourcesIndex,
});

function ResourcesIndex() {
  const [featured, ...rest] = ARTICLES;

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Resource Hub"
        title="Practical guides for wedding businesses"
        description="Free, plain-English resources on wedding SEO, local visibility, content and conversion — written for Irish wedding businesses, not SEO professionals."
      >
        <Breadcrumbs items={[{ name: "Resources" }]} />
      </PageHeader>

      <Section>
        <Link
          to="/resources/$slug"
          params={{ slug: featured.slug }}
          className="card-lift block rounded-xl border border-border bg-card p-7 sm:p-9"
        >
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow text-gold">{featured.category}</p>
            <p className="text-xs text-muted-foreground">{featured.readMinutes} min read</p>
          </div>
          <h2 className="mt-3 max-w-3xl text-2xl leading-snug sm:text-3xl">{featured.title}</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{featured.excerpt}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold">
            Read the guide <ArrowRight className="h-4 w-4" />
          </span>
        </Link>

        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((article) => (
            <Link
              key={article.slug}
              to="/resources/$slug"
              params={{ slug: article.slug }}
              className="card-lift flex flex-col rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-3">
                <p className="eyebrow text-gold">{article.category}</p>
                <p className="text-xs text-muted-foreground">{article.readMinutes} min</p>
              </div>
              <h2 className="mt-3 text-lg leading-snug">{article.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {article.excerpt}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold">
                Read more <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Vow Visibility Resource Hub",
          url: absoluteUrl(PATH),
          description: "SEO and marketing guides for Irish wedding businesses.",
          blogPost: ARTICLES.map((article) => ({
            "@type": "BlogPosting",
            headline: article.title,
            url: absoluteUrl(`/resources/${article.slug}`),
            datePublished: article.datePublished,
          })),
        }}
      />
      <CtaBand
        title="Reading is step one. Knowing where you stand is step two."
        description="Get a free SEO audit and find out exactly what's stopping your wedding business from ranking."
        primaryLabel="Get a Free SEO Audit"
        primaryTo="/free-seo-audit"
        secondaryLabel="Get the Wedding SEO Checklist"
        secondaryTo="/wedding-seo-checklist"
      />
    </SiteLayout>
  );
}
