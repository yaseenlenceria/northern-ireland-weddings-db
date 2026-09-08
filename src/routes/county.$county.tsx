import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { SupplierCard, VenueCard } from "@/components/site/Cards";
import { Breadcrumbs, breadcrumbSchema } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/site/JsonLd";
import { getCountyStats, listSuppliers, listVenues } from "@/lib/directory.functions";
import {
  CATEGORIES,
  VENUE_SLUG,
  countyFromSlug,
  countySlug,
  listingLocationLabel,
  locationCountry,
} from "@/lib/taxonomy";
import { SEO_YEAR, canonical, clamp, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/county/$county")({
  loader: async ({ params }) => {
    const county = countyFromSlug(params.county);
    if (!county) throw notFound();
    const country = locationCountry(county);
    const [stats, venues, suppliers] = await Promise.all([
      getCountyStats({ data: { county, country } }),
      listVenues({ data: { county, country, perPage: 6 } }),
      listSuppliers({ data: { county, country, perPage: 6 } }),
    ]);
    return { county, country, stats, venues: venues.rows, suppliers: suppliers.rows };
  },
  head: ({ params, loaderData }) => {
    const county = loaderData?.county ?? countyFromSlug(params.county);
    if (!county || !loaderData) {
      return { meta: [{ title: "County not found" }, { name: "robots", content: "noindex" }] };
    }
    const { stats } = loaderData;
    const location = listingLocationLabel(county, loaderData.country);
    const title = `Wedding Venues & Suppliers in ${location} (${SEO_YEAR}) | WedHQ`;
    const description = clamp(
      `${stats.venues} wedding venues and ${stats.suppliers} suppliers listed in ${location}. Compare capacity, prices and reviews, then enquire free.`,
    );
    const path = `/county/${params.county}`;
    return {
      meta: pageMeta({
        title,
        description,
        path,
        image: loaderData.venues[0]?.logo_image ?? null,
      }),
      links: canonical(path),
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
  const { county, country, stats, venues, suppliers } = Route.useLoaderData();
  const slug = countySlug(county);
  const location = listingLocationLabel(county, country);

  const topVenue = venues[0];

  return (
    <SiteLayout>
      <JsonLd
        data={breadcrumbSchema("", [
          { name: "Home", path: "/" },
          { name: location, path: `/county/${slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `Weddings in ${location}`,
          about: { "@type": "AdministrativeArea", name: location },
          description: `Wedding venues and suppliers listed in ${location}.`,
        }}
      />

      <PageHeader
        eyebrow="County guide"
        title={`Getting married in ${location}`}
        description={`${stats.venues.toLocaleString()} venues and ${stats.suppliers.toLocaleString()} suppliers listed in ${location}, from ceremony music to the morning-after brunch.`}
      >
        <Breadcrumbs items={[{ label: location }]} />
      </PageHeader>

      <div className="border-b border-border bg-card">
        <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-6 sm:grid-cols-3 sm:px-6">
          <div>
            <p className="eyebrow text-primary">Venues</p>
            <p className="mt-1 font-serif text-xl">{stats.venues.toLocaleString()}</p>
          </div>
          <div>
            <p className="eyebrow text-primary">Suppliers</p>
            <p className="mt-1 font-serif text-xl">{stats.suppliers.toLocaleString()}</p>
          </div>
          <div>
            <p className="eyebrow text-primary">Highest rated venue</p>
            <p className="mt-1 font-serif text-xl">
              {topVenue?.rating ? `${topVenue.name} · ${topVenue.rating}/5` : "—"}
            </p>
          </div>
        </div>
      </div>

      <Section
        title={`Wedding venues in ${location}`}
        action={
          <Button asChild variant="outline">
            <Link to="/$directorySlug" params={{ directorySlug: `${VENUE_SLUG}-${slug}` }}>
              All {location} venues
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
          <p className="text-muted-foreground">No venues listed in this location yet.</p>
        )}
      </Section>

      <Section
        tone="ivory"
        title={`Suppliers in ${location}`}
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
          <p className="text-muted-foreground">No suppliers listed in this location yet.</p>
        )}
      </Section>

      <Section
        title={`Browse ${location} by category`}
        description="Each category page lists only businesses working in this location."
      >
        <div className="flex flex-wrap gap-2">
          <Link
            to="/$directorySlug"
            params={{ directorySlug: `${VENUE_SLUG}-${slug}` }}
            className="rounded-full border border-border px-4 py-2 text-sm hover:border-primary/50 hover:text-primary"
          >
            Wedding Venues in {location}
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/$directorySlug"
              params={{ directorySlug: `${c.slug}-${slug}` }}
              className="rounded-full border border-border px-4 py-2 text-sm hover:border-primary/50 hover:text-primary"
            >
              {c.plural} in {location}
            </Link>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
