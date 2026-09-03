import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs, breadcrumbSchema } from "@/components/site/Breadcrumbs";
import { SupplierCard, VenueCard } from "@/components/site/Cards";
import { JsonLd } from "@/components/site/JsonLd";
import { listSuppliers, listVenues } from "@/lib/directory.functions";
import {
  CATEGORIES,
  COUNTIES,
  VENUE_SLUG,
  countySlug,
  parseDirectorySlug,
} from "@/lib/taxonomy";

const searchSchema = z.object({
  page: fallback(z.number().int(), 1).default(1),
  date: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/$directorySlug")({
  validateSearch: zodValidator(searchSchema),
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: async ({ params, deps }) => {
    const target = parseDirectorySlug(params.directorySlug);
    if (!target) throw notFound();
    const page = Math.max(1, Math.min(deps.page, 200));

    if (target.kind === "venues") {
      const result = await listVenues({
        data: { ...(target.county ? { county: target.county } : {}), page, perPage: 24 },
      });
      return { target, venues: result, suppliers: null };
    }
    const result = await listSuppliers({
      data: {
        ...(target.category ? { category: target.category.key } : {}),
        ...(target.county ? { county: target.county } : {}),
        page,
        perPage: 24,
      },
    });
    return { target, suppliers: result, venues: null };
  },
  head: ({ params, loaderData }) => {
    const target = loaderData?.target ?? parseDirectorySlug(params.directorySlug);
    if (!target) {
      return { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${target.heading} | WedList Ireland`;
    const description = `Browse ${target.heading.toLowerCase()} on WedList Ireland. Compare listings, read details and send a direct enquiry.`;
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
  component: DirectoryPage,
  notFoundComponent: () => (
    <SiteLayout>
      <PageHeader
        title="We couldn't find that page"
        description="The category or county in this address isn't one we list. Try a search instead."
      />
      <Section>
        <Button asChild>
          <Link to="/find-suppliers">Browse all suppliers</Link>
        </Button>
      </Section>
    </SiteLayout>
  ),
  errorComponent: () => (
    <SiteLayout>
      <PageHeader title="This page didn't load" description="Please refresh and try again." />
    </SiteLayout>
  ),
});

function DirectoryPage() {
  const { target, suppliers, venues } = Route.useLoaderData();
  const { page } = Route.useSearch();
  const { directorySlug } = Route.useParams();

  const total = suppliers?.count ?? venues?.count ?? 0;
  const rows = suppliers?.rows ?? [];
  const venueRows = venues?.rows ?? [];
  const perPage = suppliers?.perPage ?? venues?.perPage ?? 24;
  const hasNext = (suppliers?.rows.length ?? venues?.rows.length ?? 0) === perPage;

  const baseSlug = target.category ? target.category.slug : VENUE_SLUG;

  return (
    <SiteLayout>
      <JsonLd
        data={breadcrumbSchema("", [
          { name: "Home", path: "/" },
          { name: target.heading, path: `/${directorySlug}` },
        ])}
      />

      <PageHeader eyebrow="Directory" title={target.heading} description={target.blurb}>
        <Breadcrumbs items={[{ label: target.heading }]} />
      </PageHeader>

      <Section>
        <p className="mb-6 text-sm text-muted-foreground">
          {total.toLocaleString()} listing{total === 1 ? "" : "s"} found
          {target.county ? ` in Co. ${target.county}` : " across Ireland"}.
        </p>

        {rows.length === 0 && venueRows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-10 text-center">
            <h2 className="font-serif text-xl">Nothing listed here yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a neighbouring county, or browse the whole of Ireland.
            </p>
            <Button asChild className="mt-5">
              <Link to="/$directorySlug" params={{ directorySlug: `${baseSlug}-ireland` }}>
                View all of Ireland
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {venueRows.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
            {rows.map((supplier) => (
              <SupplierCard key={supplier.id} supplier={supplier} />
            ))}
          </div>
        )}

        {(page > 1 || hasNext) && (
          <div className="mt-10 flex justify-center gap-3">
            <Button
              asChild
              variant="outline"
              disabled={page <= 1}
              className={page <= 1 ? "pointer-events-none opacity-50" : ""}
            >
              <Link to="/$directorySlug" params={{ directorySlug }} search={{ page: page - 1 }}>
                Previous
              </Link>
            </Button>
            <span className="self-center text-sm text-muted-foreground">Page {page}</span>
            <Button
              asChild
              variant="outline"
              className={hasNext ? "" : "pointer-events-none opacity-50"}
            >
              <Link to="/$directorySlug" params={{ directorySlug }} search={{ page: page + 1 }}>
                Next
              </Link>
            </Button>
          </div>
        )}
      </Section>

      {/* Internal linking blocks */}
      <Section tone="ivory" title={`${target.category?.plural ?? "Wedding Venues"} by county`}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {COUNTIES.map((county) => (
            <Link
              key={county}
              to="/$directorySlug"
              params={{ directorySlug: `${baseSlug}-${countySlug(county)}` }}
              className="rounded-lg border border-border bg-card px-3 py-3 text-center text-sm shadow-soft hover:border-primary/40 hover:text-primary"
            >
              {county}
            </Link>
          ))}
        </div>
      </Section>

      <Section
        title={target.county ? `More suppliers in Co. ${target.county}` : "Other categories"}
        description="Keep building your supplier list from the same area."
      >
        <div className="flex flex-wrap gap-2">
          <Link
            to="/$directorySlug"
            params={{
              directorySlug: `${VENUE_SLUG}-${target.county ? countySlug(target.county) : "ireland"}`,
            }}
            className="rounded-full border border-border px-4 py-2 text-sm hover:border-primary/50 hover:text-primary"
          >
            Wedding Venues
          </Link>
          {CATEGORIES.filter((c) => c.slug !== target.category?.slug).map((c) => (
            <Link
              key={c.slug}
              to="/$directorySlug"
              params={{
                directorySlug: `${c.slug}-${target.county ? countySlug(target.county) : "ireland"}`,
              }}
              className="rounded-full border border-border px-4 py-2 text-sm hover:border-primary/50 hover:text-primary"
            >
              {c.plural}
            </Link>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
