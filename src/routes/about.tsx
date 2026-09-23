import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CtaBand, PageHeader, Section, SiteLayout } from "@/components/site/Layout";
import { JsonLd } from "@/components/site/JsonLd";
import { INDUSTRIES } from "@/lib/site";
import { absoluteUrl, breadcrumbSchema, canonical, pageMeta } from "@/lib/seo";

const PATH = "/about";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      ...pageMeta({
        title: "About Vow Visibility | SEO for the Irish Wedding Industry",
        description:
          "Vow Visibility is a specialist SEO and marketing agency for Irish wedding businesses, founded by Yasin. Honest advice, specialist focus, no guaranteed-ranking nonsense.",
        path: PATH,
      }),
      ...canonical(PATH),
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="About"
        title="A specialist SEO agency for the wedding industry — not a generalist pretending"
        description="Vow Visibility exists for one reason: wedding businesses deserve marketing that understands how couples actually find and choose suppliers."
      >
        <Breadcrumbs items={[{ name: "About" }]} />
      </PageHeader>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl leading-snug sm:text-3xl">Hi, I'm Yasin</h2>
              <p className="mt-4 text-lg leading-relaxed text-foreground">
                I'm the founder of Vow Visibility. I specialise in helping wedding businesses
                improve their organic search visibility and turn their websites into stronger
                sources of enquiries.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                I've spent years in SEO — keyword research, technical audits, content strategy,
                local search — and I kept noticing the same gap: the wedding industry, more than
                almost any other, runs on beautiful work and word of mouth, while the single biggest
                booking channel (Google) is left to chance. Meanwhile, generalist SEO agencies treat
                a wedding venue like a plumber's website. They miss everything that makes wedding
                marketing different: the seasonality, the county-by-county search behaviour, the
                venues, the trust couples need before they'll enquire.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Vow Visibility is the agency I wished existed for this industry: specialist, honest,
                and measured on enquiries — not vanity reports.
              </p>
            </div>

            <div>
              <h2 className="text-2xl leading-snug sm:text-3xl">How we work</h2>
              <ul className="mt-5 space-y-4">
                {[
                  {
                    title: "Specialist, not generalist",
                    body: "We only work with wedding businesses. Every strategy is built around how couples search for your specific service in your specific counties.",
                  },
                  {
                    title: "Honest, always",
                    body: "No guaranteed rankings, no inflated promises, no jargon-heavy reports designed to confuse. If something won't work, we'll tell you.",
                  },
                  {
                    title: "Focused on enquiries",
                    body: "Traffic is a means, not an end. Every recommendation traces back to the same question: will this help the right couples find you and get in touch?",
                  },
                  {
                    title: "Practical and realistic",
                    body: "Recommendations fit real businesses with real workloads and busy seasons. We prioritise what moves the needle rather than handing you an endless task list.",
                  },
                ].map((value) => (
                  <li key={value.title} className="flex gap-3">
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-gold"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-medium">{value.title}</p>
                      <p className="mt-1 leading-relaxed text-muted-foreground">{value.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl leading-snug sm:text-3xl">Who we work with</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Wedding businesses serving couples getting married in Ireland — venues,
                photographers, videographers, planners, florists, bands, DJs, celebrants, bridal
                boutiques, hair and makeup artists, cake makers, transport companies, stationery
                designers, décor and event hire, content creators and more.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                The company specialises in the Irish wedding market. Wherever you're based, if your
                couples are getting married in Dublin, Cork, Galway, Kerry or anywhere on the
                island, the strategies we build are made for your market.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {INDUSTRIES.slice(0, 10).map((industry) => (
                  <Link
                    key={industry.slug}
                    to="/$industrySlug"
                    params={{ industrySlug: industry.slug }}
                    className="rounded-full border border-border bg-card px-4 py-1.5 text-sm transition-colors hover:border-gold/50"
                  >
                    {industry.plural}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-lg">Work with us</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Start with a free SEO audit — a clear, honest review of where your website stands
                and what we'd fix first.
              </p>
              <Link
                to="/free-seo-audit"
                className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-gold px-4 py-2.5 text-sm font-medium text-gold-foreground shadow-soft transition-colors hover:bg-gold/90"
              >
                Get a Free SEO Audit
              </Link>
              <Link
                to="/contact"
                className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
              >
                Ask a question first
              </Link>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg">Start learning</h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link
                    to="/wedding-seo-checklist"
                    className="font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    The 21-Point Wedding SEO Checklist
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources/how-wedding-businesses-can-rank-on-google"
                    className="font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    How wedding businesses rank on Google
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources/instagram-vs-google-for-wedding-businesses"
                    className="font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Instagram vs Google for wedding businesses
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </Section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: PATH },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About Vow Visibility",
          url: absoluteUrl(PATH),
          mainEntity: { "@id": absoluteUrl("/#organization") },
        }}
      />
      <CtaBand
        title="Let's find out what your website is capable of"
        description="Free audit, honest findings, clear next steps. No obligation and no hard sell."
        primaryLabel="Get a Free SEO Audit"
        primaryTo="/free-seo-audit"
        secondaryLabel="Get the Wedding SEO Checklist"
        secondaryTo="/wedding-seo-checklist"
      />
    </SiteLayout>
  );
}
