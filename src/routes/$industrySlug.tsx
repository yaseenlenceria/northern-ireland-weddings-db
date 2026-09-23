import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CtaBand, PageHeader, Section, SiteLayout } from "@/components/site/Layout";
import { FaqSection } from "@/components/site/FaqSection";
import { JsonLd } from "@/components/site/JsonLd";
import { INDUSTRY_DATA } from "@/lib/industries";
import { INDUSTRIES } from "@/lib/site";
import { breadcrumbSchema, canonical, faqSchema, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/$industrySlug")({
  beforeLoad: ({ params }) => {
    if (!INDUSTRY_DATA[params.industrySlug]) throw notFound();
  },
  head: ({ params }) => {
    const industry = INDUSTRY_DATA[params.industrySlug];
    return {
      meta: [
        ...pageMeta({
          title: industry.metaTitle,
          description: industry.metaDescription,
          path: `/${industry.slug}`,
        }),
        ...canonical(`/${industry.slug}`),
      ],
    };
  },
  component: IndustryPage,
});

function IndustryPage() {
  const { industrySlug } = Route.useParams();
  const industry = INDUSTRY_DATA[industrySlug];
  const path = `/${industry.slug}`;
  const otherIndustries = INDUSTRIES.filter((item) => item.slug !== industry.slug).slice(0, 5);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow={`SEO for ${industry.name}`}
        title={industry.h1}
        description={industry.intro}
      >
        <Breadcrumbs items={[{ name: `SEO for ${industry.name}` }]} />
      </PageHeader>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-14">
            {/* Problems */}
            <div>
              <h2 className="text-2xl leading-snug sm:text-3xl">
                The SEO problems we see for {industry.name.toLowerCase()}
              </h2>
              <ul className="mt-5 space-y-4">
                {industry.problems.map((problem) => (
                  <li key={problem} className="flex gap-3">
                    <XCircle
                      className="mt-0.5 h-5 w-5 shrink-0 text-destructive/70"
                      aria-hidden="true"
                    />
                    <span className="leading-relaxed text-muted-foreground">{problem}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Keywords */}
            <div>
              <h2 className="text-2xl leading-snug sm:text-3xl">{industry.keywordsTitle}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{industry.keywordsIntro}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {industry.keywords.map((keyword) => (
                  <li
                    key={keyword}
                    className="rounded-full border border-border bg-card px-4 py-1.5 text-sm"
                  >
                    {keyword}
                  </li>
                ))}
              </ul>
            </div>

            {/* Page structure */}
            <div>
              <h2 className="text-2xl leading-snug sm:text-3xl">{industry.structureTitle}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {industry.structureIntro}
              </p>
              <ol className="mt-5 space-y-3">
                {industry.structure.map((page, index) => (
                  <li
                    key={page}
                    className="flex items-start gap-4 rounded-lg border border-border bg-card px-5 py-4"
                  >
                    <span className="font-display text-lg text-gold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="leading-relaxed text-muted-foreground">{page}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Local SEO */}
            <div>
              <h2 className="text-2xl leading-snug sm:text-3xl">Local SEO opportunities</h2>
              <ul className="mt-5 space-y-4">
                {industry.local.map((point) => (
                  <li key={point} className="flex gap-3">
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-gold"
                      aria-hidden="true"
                    />
                    <span className="leading-relaxed text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Content ideas */}
            <div>
              <h2 className="text-2xl leading-snug sm:text-3xl">Content that wins this market</h2>
              <ul className="mt-5 space-y-2.5">
                {industry.contentIdeas.map((idea) => (
                  <li key={idea} className="flex gap-3">
                    <span
                      className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                      aria-hidden="true"
                    />
                    <span className="leading-relaxed text-muted-foreground">{idea}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mistakes */}
            <div>
              <h2 className="text-2xl leading-snug sm:text-3xl">
                Common mistakes that cost bookings
              </h2>
              <ul className="mt-5 space-y-4">
                {industry.mistakes.map((mistake) => (
                  <li key={mistake} className="flex gap-3">
                    <XCircle
                      className="mt-0.5 h-5 w-5 shrink-0 text-destructive/70"
                      aria-hidden="true"
                    />
                    <span className="leading-relaxed text-muted-foreground">{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-soft sm:p-8">
              <h2 className="text-xl sm:text-2xl">Want this done for your business?</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Request a free SEO audit and we'll map these opportunities to your website — what's
                missing, what to fix first, and where the realistic wins are in your counties.
              </p>
              <Link
                to="/free-seo-audit"
                className="mt-5 inline-flex items-center gap-2 rounded-md bg-gold px-5 py-2.5 text-sm font-medium text-gold-foreground shadow-soft transition-colors hover:bg-gold/90"
              >
                Request My Free SEO Audit <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg">SEO for other wedding businesses</h2>
              <ul className="mt-4 space-y-2.5">
                {otherIndustries.map((item) => (
                  <li key={item.slug}>
                    <Link
                      to="/$industrySlug"
                      params={{ industrySlug: item.slug }}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.plural} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg">Useful guides</h2>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link
                    to="/wedding-seo-checklist"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    The Wedding Website SEO Checklist
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources/local-seo-for-wedding-suppliers"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Local SEO for wedding suppliers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources/how-to-use-real-weddings-for-seo"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    How to use real weddings for SEO
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources/google-business-profile-for-wedding-businesses"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Google Business Profile basics
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="ivory">
        <FaqSection faqs={industry.faqs} title={`${industry.name} — SEO questions`} />
      </Section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: `SEO for ${industry.name}`, path },
            ]),
            faqSchema(industry.faqs),
          ],
        }}
      />
      <CtaBand
        title={`Ready to win more ${industry.name.toLowerCase()} searches?`}
        description="Get a free, honest review of where your business stands on Google today — and the fixes we'd make first."
        primaryLabel="Get a Free SEO Audit"
        primaryTo="/free-seo-audit"
        secondaryLabel="Get the Wedding SEO Checklist"
        secondaryTo="/wedding-seo-checklist"
      />
    </SiteLayout>
  );
}
