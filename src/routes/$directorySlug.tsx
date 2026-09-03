import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Award, Euro, MapPin, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs, breadcrumbSchema } from "@/components/site/Breadcrumbs";
import { SupplierCard, VenueCard } from "@/components/site/Cards";
import { JsonLd } from "@/components/site/JsonLd";
import { getDirectoryStats, listSuppliers, listVenues } from "@/lib/directory.functions";
import {
  CATEGORIES,
  COUNTIES,
  VENUE_SLUG,
  countySlug,
  parseDirectorySlug,
} from "@/lib/taxonomy";
import { euro, priceGuide, weightedRating } from "@/lib/stats";
import { SEO_YEAR, absoluteUrl, canonical, clamp, pageMeta } from "@/lib/seo";

const PER_PAGE = 24;
const TOP_N = 10;

const searchSchema = z.object({
  page: fallback(z.number().int(), 1).optional(),
  date: fallback(z.string(), "").optional(),
});

/** Copy for the page title / H1 / meta, driven by the real listing count. */
function buildCopy(opts: {
  plural: string;
  place: string;
  count: number;
  page: number;
  priced: ReturnType<typeof priceGuide>;
}) {
  const { plural, place, count, page, priced } = opts;
  const ranked = count > 0;
  const listingCount = count.toLocaleString();
  const heading = ranked
    ? `${listingCount} ${plural} in ${place} (${SEO_YEAR})`
    : `${plural} in ${place}`;

  const title = ranked
    ? `${listingCount} ${plural} in ${place} ${SEO_YEAR} - Prices & Reviews`
    : `${plural} in ${place} — ${count} Listed | Wedora Ireland`;

  const priceBit = priced ? ` Typical spend around ${euro(priced.median)}.` : "";
  const description = clamp(
    `Compare ${count.toLocaleString()} ${plural.toLowerCase()} in ${place}, ranked and reviewed.${priceBit} See galleries, real details and enquire directly — free.`,
  );

  return {
    heading: page > 1 ? `${heading} — page ${page}` : heading,
    h1: heading,
    title: page > 1 ? `${title} — Page ${page}` : title,
    description,
    ranked,
  };
}

export const Route = createFileRoute("/$directorySlug")({
  validateSearch: zodValidator(searchSchema),
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: async ({ params, deps }) => {
    const target = parseDirectorySlug(params.directorySlug);
    if (!target) throw notFound();
    const page = Math.max(1, Math.min(deps.page ?? 1, 200));
    const place = target.county ?? "Ireland";

    const statsInput = {
      kind: target.kind,
      ...(target.category ? { category: target.category.key } : {}),
      ...(target.county ? { county: target.county } : {}),
    } as const;

    if (target.kind === "venues") {
      const [result, stats] = await Promise.all([
        listVenues({
          data: { ...(target.county ? { county: target.county } : {}), page, perPage: PER_PAGE },
        }),
        getDirectoryStats({ data: statsInput }),
      ]);
      return { target, place, page, venues: result, suppliers: null, stats };
    }

    const [result, stats] = await Promise.all([
      listSuppliers({
        data: {
          ...(target.category ? { category: target.category.key } : {}),
          ...(target.county ? { county: target.county } : {}),
          page,
          perPage: PER_PAGE,
        },
      }),
      getDirectoryStats({ data: statsInput }),
    ]);
    return { target, place, page, suppliers: result, venues: null, stats };
  },
  head: ({ params, loaderData }) => {
    const target = loaderData?.target ?? parseDirectorySlug(params.directorySlug);
    if (!target || !loaderData) {
      return { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] };
    }
    const path = `/${params.directorySlug}`;
    const count = loaderData.suppliers?.count ?? loaderData.venues?.count ?? 0;
    const copy = buildCopy({
      plural: target.category?.plural ?? "Wedding Venues",
      place: loaderData.place,
      count,
      page: loaderData.page,
      priced: priceGuide(loaderData.stats.prices),
    });
    const hero =
      loaderData.venues?.rows[0]?.logo_image ?? loaderData.suppliers?.rows[0]?.logo_image ?? null;

    return {
      meta: pageMeta({
        title: copy.title,
        description: copy.description,
        path,
        image: hero,
        noindex: loaderData.page > 1 || count === 0,
      }),
      links: canonical(path),
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
  const { target, place, suppliers, venues, stats } = Route.useLoaderData();
  const { page: pageParam } = Route.useSearch();
  const page = pageParam ?? 1;
  const { directorySlug } = Route.useParams();

  const total = suppliers?.count ?? venues?.count ?? 0;
  const supplierRows = suppliers?.rows ?? [];
  const venueRows = venues?.rows ?? [];
  const listed = supplierRows.length + venueRows.length;
  const lastPage = Math.max(1, Math.ceil(total / PER_PAGE));
  const hasNext = page < lastPage;
  const baseSlug = target.category ? target.category.slug : VENUE_SLUG;
  const plural = target.category?.plural ?? "Wedding Venues";
  const singular = target.category?.label ?? "venue";

  const priced = priceGuide(stats.prices);
  const rating = weightedRating(stats.rated);
  const copy = buildCopy({ plural, place, count: total, page, priced });

  const rankedSuppliers = page === 1 ? supplierRows.slice(0, TOP_N) : [];
  const rankedVenues = page === 1 ? venueRows.slice(0, TOP_N) : [];
  const restSuppliers = page === 1 ? supplierRows.slice(TOP_N) : supplierRows;
  const restVenues = page === 1 ? venueRows.slice(TOP_N) : venueRows;

  const rankedItems = [
    ...rankedVenues.map((v) => ({ name: v.name, path: `/venue/${v.slug}` })),
    ...rankedSuppliers.map((s) => ({ name: s.name, path: `/supplier/${s.slug}` })),
  ];

  const faqs: { q: string; a: string }[] = [];
  if (priced) {
    faqs.push({
      q: `How much does a ${singular.toLowerCase()} cost in ${place}?`,
      a: `Of the ${total.toLocaleString()} listings in ${place}, ${priced.count} publish a price guide. The middle of that range is ${euro(priced.median)}, with published guides running from ${euro(priced.low)} to ${euro(priced.high)}. Anything outside that range is usually down to season, guest numbers and how many hours you need.`,
    });
  }
  faqs.push({
    q: `How many ${plural.toLowerCase()} are listed in ${place}?`,
    a: `${total.toLocaleString()} ${plural.toLowerCase()} are listed in ${place} on Wedora Ireland. Listings are ordered by portfolio depth, published reviews and how complete the listing is.`,
  });
  faqs.push({
    q: `When should we book ${plural.toLowerCase()} in ${place}?`,
    a: `For a Saturday in peak season, ${place} suppliers are commonly booked twelve to eighteen months out. Off-season and midweek dates are far easier — enquire with three or four options and compare what's actually available for your date.`,
  });
  if (rating) {
    faqs.push({
      q: `Are reviews on these listings real?`,
      a: `Yes. Ratings shown come from ${rating.reviews.toLocaleString()} published reviews across ${rating.listings} rated listings in ${place}, averaging ${rating.value.toFixed(1)} out of 5. We never generate or estimate a rating.`,
    });
  }

  return (
    <SiteLayout>
      <JsonLd
        data={breadcrumbSchema("", [
          { name: "Home", path: "/" },
          { name: copy.h1, path: `/${directorySlug}` },
        ])}
      />
      {rankedItems.length ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: copy.h1,
            description: copy.description,
            numberOfItems: rankedItems.length,
            itemListOrder: "https://schema.org/ItemListOrderDescending",
            itemListElement: rankedItems.map((item, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: item.name,
              url: absoluteUrl(item.path),
            })),
          }}
        />
      ) : null}
      {faqs.length ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }}
        />
      ) : null}

      <PageHeader eyebrow="Directory" title={copy.h1} description={target.blurb}>
        <Breadcrumbs items={[{ label: copy.h1 }]} />
      </PageHeader>

      {/* Real, data-backed facts about this category + county */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          <Stat
            icon={<Users className="size-4" />}
            label="Listings"
            value={total.toLocaleString()}
            detail={place}
          />
          <Stat
            icon={<Euro className="size-4" />}
            label="Typical guide price"
            value={priced ? euro(priced.median) : "On request"}
            detail={priced ? `from ${priced.count} published guides` : "most quote per wedding"}
          />
          <Stat
            icon={<Star className="size-4" />}
            label="Average rating"
            value={rating ? `${rating.value.toFixed(1)} / 5` : "—"}
            detail={rating ? `${rating.reviews.toLocaleString()} reviews` : "reviews coming in"}
          />
          <Stat
            icon={<MapPin className="size-4" />}
            label="Area"
            value={target.county ?? "All Ireland"}
            detail={target.county ? "plus suppliers who travel" : "27 counties covered"}
          />
        </div>
      </div>

      {listed === 0 ? (
        <Section>
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
        </Section>
      ) : (
        <>
          {page === 1 && rankedItems.length ? (
            <Section
              title={`Ranked ${plural.toLowerCase()} in ${place}`}
              description={`Showing the first ${rankedItems.length.toLocaleString()} of ${total.toLocaleString()} live listings from Neon, ordered by portfolio depth, published review scores and how complete each listing is.`}
            >
              <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rankedVenues.map((venue, i) => (
                  <li key={venue.id}>
                    <VenueCard venue={venue} rank={i + 1} />
                  </li>
                ))}
                {rankedSuppliers.map((supplier, i) => (
                  <li key={supplier.id}>
                    <SupplierCard
                      supplier={supplier}
                      rank={rankedVenues.length + i + 1}
                    />
                  </li>
                ))}
              </ol>
            </Section>
          ) : null}

          {restSuppliers.length || restVenues.length ? (
            <Section
              tone="ivory"
              title={page > 1 ? `${plural} in ${place}` : `More ${plural.toLowerCase()} in ${place}`}
              description="Every remaining listing that matches, in the same ranking order."
            >
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {restVenues.map((venue) => (
                  <VenueCard key={venue.id} venue={venue} />
                ))}
                {restSuppliers.map((supplier) => (
                  <SupplierCard key={supplier.id} supplier={supplier} />
                ))}
              </div>

              {lastPage > 1 ? (
                <nav
                  className="mt-10 flex flex-wrap items-center justify-center gap-3"
                  aria-label="Pagination"
                >
                  {page > 1 ? (
                    <Button asChild variant="outline">
                      <Link
                        to="/$directorySlug"
                        params={{ directorySlug }}
                        search={page - 1 > 1 ? { page: page - 1 } : {}}
                        rel="prev"
                      >
                        Previous
                      </Link>
                    </Button>
                  ) : null}
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {lastPage}
                  </span>
                  {hasNext ? (
                    <Button asChild variant="outline">
                      <Link
                        to="/$directorySlug"
                        params={{ directorySlug }}
                        search={{ page: page + 1 }}
                        rel="next"
                      >
                        Next
                      </Link>
                    </Button>
                  ) : null}
                </nav>
              ) : null}
            </Section>
          ) : null}
        </>
      )}

      <Section title={`Choosing ${plural.toLowerCase()} in ${place}`}>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="flex items-center gap-2 font-serif text-lg">
              <Award className="size-4 text-primary" /> What to ask before you book
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Is our exact date free, and is the deposit refundable if it moves?</li>
              <li>Who will actually turn up on the day — you, or a second team?</li>
              <li>What's included in the quoted figure, and what's charged on top?</li>
              <li>Can we see one full wedding start to finish, not just highlights?</li>
              <li>How and when is the balance paid, and is there travel to add?</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-serif text-lg">Frequently asked</h3>
            <dl className="mt-3 space-y-4">
              {faqs.map((f) => (
                <div key={f.q}>
                  <dt className="text-sm font-medium">{f.q}</dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <Section tone="ivory" title={`${plural} by county`}>
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

function Stat({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div>
      <p className="eyebrow flex items-center gap-1.5 text-primary">
        {icon} {label}
      </p>
      <p className="mt-1 font-serif text-xl">{value}</p>
      <p className="text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}
