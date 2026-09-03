import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SupplierCard, VenueCard } from "@/components/site/Cards";
import { Breadcrumbs as _Breadcrumbs, breadcrumbSchema } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/site/JsonLd";
import { getCountyStats, listSuppliers, listVenues } from "@/lib/directory.functions";
import { CATEGORIES, VENUE_SLUG, countyFromSlug, countySlug } from "@/lib/taxonomy";
import { SEO_YEAR, canonical, clamp, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/county/$county")({
  loader: async ({ params }) => {
    const county = countyFromSlug(params.county);
    if (!county) throw notFound();
    const [stats, venues, suppliers] = await Promise.all([
      getCountyStats({ data: { county } }),
      listVenues({ data: { county, perPage: 6 } }),
      listSuppliers({ data: { county, perPage: 6 } }),
    ]);
    return { county, stats, venues: venues.rows, suppliers: suppliers.rows };
  },
  head: ({ params, loaderData }) => {
    const county = loaderData?.county ?? countyFromSlug(params.county);
    if (!county) {
      return { meta: [{ title: "County not found" }, { name: "robots", content: "noindex" }] };
    }
    const title = `Weddings in Co. ${county} — Venues & Suppliers | WedList Ireland`;
    const description = `Every wedding venue and supplier listed in Co. ${county} on WedList Ireland, with pricing guides, capacity and direct enquiry forms.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CountyPage,
  notFoundComponent: () => (
    <SiteLayout>
      <PageHeader title="County not found" description="We don't have a page for that county." />
    </SiteLayout>
  ),
  errorComponent: () => (
    <SiteLayout>
      <PageHeader title="This county page didn't load" />
    </SiteLayout>
  ),
});

function CountyPage() {
  const { county, stats, venues, suppliers } = Route.useLoaderData();
  const slug = countySlug(county);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="County guide"
        title={`Getting married in Co. ${county}`}
        description={`${stats.venues.toLocaleString()} venues and ${stats.suppliers.toLocaleString()} suppliers listed in Co. ${county}, from ceremony music to the morning-after brunch.`}
      >
        <Breadcrumbs items={[{ label: `Co. ${county}` }]} />
      </PageHeader>

      <Section
        title={`Wedding venues in Co. ${county}`}
        action={
          <Button asChild variant="outline">
            <Link to="/$directorySlug" params={{ directorySlug: `${VENUE_SLUG}-${slug}` }}>
              All {county} venues
            </Link>
          </Button>
        }
      >
        {venues.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No venues listed in this county yet.</p>
        )}
      </Section>

      <Section
        tone="ivory"
        title={`Suppliers in Co. ${county}`}
        action={
          <Button asChild variant="outline">
            <Link to="/find-suppliers">All suppliers</Link>
          </Button>
        }
      >
        {suppliers.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {suppliers.map((supplier) => (
              <SupplierCard key={supplier.id} supplier={supplier} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No suppliers listed in this county yet.</p>
        )}
      </Section>

      <Section
        title={`Browse ${county} by category`}
        description="Each category page lists only businesses working in this county."
      >
        <div className="flex flex-wrap gap-2">
          <Link
            to="/$directorySlug"
            params={{ directorySlug: `${VENUE_SLUG}-${slug}` }}
            className="rounded-full border border-border px-4 py-2 text-sm hover:border-primary/50 hover:text-primary"
          >
            Wedding Venues in {county}
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/$directorySlug"
              params={{ directorySlug: `${c.slug}-${slug}` }}
              className="rounded-full border border-border px-4 py-2 text-sm hover:border-primary/50 hover:text-primary"
            >
              {c.plural} in {county}
            </Link>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
