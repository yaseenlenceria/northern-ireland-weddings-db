import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CtaBand, PageHeader, Section, SiteLayout } from "@/components/site/Layout";
import { JsonLd } from "@/components/site/JsonLd";
import { SERVICES } from "@/lib/site";
import { absoluteUrl, breadcrumbSchema, canonical, pageMeta } from "@/lib/seo";

const PATH = "/services";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      ...pageMeta({
        title: "SEO Services for Wedding Businesses in Ireland | Vow Visibility",
        description:
          "Wedding SEO, local SEO, technical SEO, content strategy, audits and website optimisation — specialist services for Irish wedding businesses.",
        path: PATH,
      }),
      ...canonical(PATH),
    ],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Services"
        title="SEO services built for the wedding industry"
        description="Every service below exists for one reason: to help Irish wedding businesses get found by couples on Google and turn that visibility into enquiries."
      >
        <Breadcrumbs items={[{ name: "Services" }]} />
      </PageHeader>

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          {SERVICES.map((service) => (
            <Link
              key={service.slug}
              to="/services/$slug"
              params={{ slug: service.slug }}
              className="card-lift flex flex-col rounded-xl border border-border bg-card p-7"
            >
              <h2 className="text-xl sm:text-2xl">{service.name}</h2>
              <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">{service.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold">
                Explore {service.short} <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Services", item: absoluteUrl(PATH) },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Vow Visibility SEO services",
          itemListElement: SERVICES.map((service, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: service.name,
            url: absoluteUrl(`${PATH}/${service.slug}`),
          })),
        }}
      />
      <CtaBand
        title="Not sure which service you need?"
        description="Start with the free SEO audit. We'll tell you what's holding your website back and which work would make the biggest difference first."
        primaryLabel="Get a Free SEO Audit"
        primaryTo="/free-seo-audit"
        secondaryLabel="Read the FAQ"
        secondaryTo="/#audit"
      />
    </SiteLayout>
  );
}
