import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CtaBand, PageHeader, Section, SiteLayout } from "@/components/site/Layout";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/site/JsonLd";
import { SERVICES_DATA } from "@/lib/services";
import { SERVICES } from "@/lib/site";
import {
  SITE_URL,
  absoluteUrl,
  breadcrumbSchema,
  canonical,
  pageMeta,
  serviceSchema,
} from "@/lib/seo";

function getService(slug: string) {
  const service = SERVICES_DATA[slug];
  if (!service) throw notFound();
  return service;
}

export const Route = createFileRoute("/seo/services/$slug")({
  beforeLoad: ({ params }) => {
    if (!SERVICES_DATA[params.slug]) throw notFound();
  },
  head: ({ params }) => {
    const service = getService(params.slug);
    return {
      links: canonical(`/seo/services/${service.slug}`),
      meta: [
        ...pageMeta({
          title: service.metaTitle,
          description: service.metaDescription,
          path: `/seo/services/${service.slug}`,
        }),
      ],
    };
  },
  component: ServicePage,
});

function ServicePage() {
  const { slug } = Route.useParams();
  const service = getService(slug);
  const path = `/seo/services/${service.slug}`;
  const others = SERVICES.filter((item) => item.slug !== service.slug).slice(0, 3);

  return (
    <SiteLayout>
      <PageHeader eyebrow="Service" title={service.h1} description={service.intro}>
        <Breadcrumbs items={[{ label: "SEO", to: "/seo" }, { label: service.name }]} />
      </PageHeader>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {service.introBullets.map((point) => (
                <li key={point} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
                  <span className="leading-relaxed text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-12 space-y-12">
              {service.sections.map((section) => (
                <div key={section.heading}>
                  <h2 className="text-2xl leading-snug sm:text-3xl">{section.heading}</h2>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{section.body}</p>
                  {section.points ? (
                    <ul className="mt-4 space-y-2.5">
                      {section.points.map((point) => (
                        <li key={point} className="flex gap-3">
                          <span
                            className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                            aria-hidden="true"
                          />
                          <span className="leading-relaxed text-muted-foreground">{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-8">
            <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-lg">This is for you if…</h2>
              <ul className="mt-4 space-y-3">
                {service.forYouIf.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link
                  to="/seo/free-audit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gold px-4 py-2.5 text-sm font-medium text-gold-foreground shadow-soft transition-colors hover:bg-gold/90"
                >
                  See What Is Stopping Your Website From Ranking
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg">Other services</h2>
              <ul className="mt-4 space-y-2.5">
                {others.map((item) => (
                  <li key={item.slug}>
                    <Link
                      to="/seo/services/$slug"
                      params={{ slug: item.slug }}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.name} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="ivory">
        <FaqSection faqs={service.faqs} title={`${service.name} — common questions`} />
      </Section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbSchema(SITE_URL, [
              { name: "Home", path: "/" },
              { name: "Services", path: "/seo/services" },
              { name: service.name, path },
            ]),
            serviceSchema({
              name: service.name,
              description: service.metaDescription,
              path,
            }),
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: service.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            },
          ],
        }}
      />
      <CtaBand
        title="Find out what your website could be doing for you"
        description="Request the free SEO audit and get a clear, honest picture of your current visibility and opportunities."
        primaryLabel="Get a Free SEO Audit"
        primaryTo="/seo/free-audit"
        secondaryLabel="Get the Wedding SEO Checklist"
        secondaryTo="/seo/checklist"
      />
    </SiteLayout>
  );
}
