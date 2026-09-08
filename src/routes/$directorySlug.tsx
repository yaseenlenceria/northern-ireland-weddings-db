import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Award, Camera, Euro, ListChecks, MapPin, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs, breadcrumbSchema } from "@/components/site/Breadcrumbs";
import { SupplierCard, VenueCard } from "@/components/site/Cards";
import { JsonLd } from "@/components/site/JsonLd";
import { getDirectoryStats, listSuppliers, listVenues } from "@/lib/directory.functions";
import {
  CATEGORIES,
  IRELAND_COUNTIES,
  UK_REGIONS,
  VENUE_SLUG,
  countySlug,
  listingLocationLabel,
  locationCountry,
  parseDirectorySlug,
} from "@/lib/taxonomy";
import { euro, priceGuide, weightedRating } from "@/lib/stats";
import { SEO_YEAR, absoluteUrl, canonical, clamp, pageMeta } from "@/lib/seo";

const PER_PAGE = 24;
const TOP_N = 10;
const SINGULAR_DIRECTORY_LABELS: Record<string, string> = {
  "Wedding Photographers": "Wedding Photographer",
  "Wedding Cakes": "Wedding Cake Supplier",
  "Wedding Florists": "Wedding Florist",
  "Wedding Bands": "Wedding Band",
  "Wedding Singers": "Wedding Singer",
  "Wedding Videographers": "Wedding Videographer",
  "Wedding Content Creators": "Wedding Content Creator",
  "Wedding Makeup Artists": "Wedding Makeup Artist",
  "Wedding Beauty & Skincare": "Wedding Beauty Supplier",
  "Wedding Hair Stylists": "Wedding Hair Stylist",
  "Wedding DJs": "Wedding DJ",
  "Wedding Celebrants": "Wedding Celebrant",
  "Wedding Planners": "Wedding Planner",
  "Wedding Transport": "Wedding Transport Supplier",
  "Wedding Decor & Styling": "Wedding Decor Supplier",
  "Wedding Entertainment": "Wedding Entertainment Supplier",
  "Bridal Shops": "Bridal Shop",
  "Bridesmaid Dresses": "Bridesmaid Dress Supplier",
  Groomswear: "Groomswear Supplier",
  "Wedding Stationery": "Wedding Stationery Supplier",
  "Wedding Catering": "Wedding Caterer",
  "Wedding Jewellers": "Wedding Jeweller",
  "Wedding Gifts & Favours": "Wedding Gift Supplier",
  "Marquee Hire": "Marquee Hire Supplier",
  "Hen & Stag Suppliers": "Hen & Stag Supplier",
  "Honeymoon Specialists": "Honeymoon Specialist",
  "Wedding Health & Fitness": "Wedding Health & Fitness Supplier",
  "Wedding Childcare": "Wedding Childcare Supplier",
  "Other Wedding Services": "Wedding Service",
  "Wedding Venues": "Wedding Venue",
};

function countLabel(plural: string, count: number) {
  return count === 1 ? (SINGULAR_DIRECTORY_LABELS[plural] ?? plural) : plural;
}

const searchSchema = z.object({
  page: fallback(z.number().int(), 1).optional(),
  date: fallback(z.string(), "").optional(),
});

const BALANCED_LOCATIONS = [
  "Dublin",
  "Cork",
  "Galway",
  "Kerry",
  "Limerick",
  "Wicklow",
  "London",
  "Essex",
  "Kent",
  "Surrey",
  "Berkshire",
  "Cheshire",
];

const CATEGORY_SEO: Record<string, { compare: string; ask: string; timing: string }> = {
  "wedding-photographers": {
    compare:
      "Compare full galleries, editing style, backup plans, second-shooter options and delivery timelines before choosing a photographer.",
    ask: "Ask to see a complete wedding gallery in similar light and weather, not only a short portfolio selection.",
    timing: "Book early for peak-season Saturdays because experienced photographers are usually one of the first suppliers couples reserve.",
  },
  "wedding-venues": {
    compare:
      "Compare ceremony rooms, reception flow, food options, accommodation, accessibility, parking and wet-weather photo locations.",
    ask: "Ask for a full quote with minimum numbers, corkage, late bar, setup time, supplier restrictions and every extra charge shown.",
    timing:
      "Popular venues can book twelve to eighteen months ahead, especially for summer Saturdays and bank-holiday weekends.",
  },
  "wedding-djs": {
    compare:
      "Compare setup quality, music planning, MC style, lighting, insurance, backup equipment and how requests are handled on the night.",
    ask: "Ask whether the named DJ attends personally and what happens if equipment or illness causes a last-minute problem.",
    timing: "Book once your venue confirms access, finish time and sound-limit rules.",
  },
  "wedding-bands": {
    compare:
      "Compare live videos, set length, first-dance options, DJ add-ons, travel costs and the amount of space the band needs.",
    ask: "Ask for a live performance video from a real wedding or event, plus a written list of what is included.",
    timing: "Strong live bands often book well ahead for Friday and Saturday dates.",
  },
  "wedding-florists": {
    compare:
      "Compare bouquet style, ceremony installations, table florals, delivery times, repurposing options and seasonal flower advice.",
    ask: "Ask what can be reused from ceremony to reception and what flowers are realistic for your wedding month.",
    timing: "Book after the venue and colour direction are clear, then finalise exact stems closer to the wedding.",
  },
  "make-up-artists": {
    compare:
      "Compare trial availability, morning schedule, skin preparation, bridal-party numbers, travel fees and product style.",
    ask: "Ask how long each person takes on the wedding morning and whether touch-up kits or second artists are available.",
    timing: "Book early for peak mornings, especially when hair and makeup teams need to coordinate.",
  },
  "wedding-videographers": {
    compare:
      "Compare highlight length, full-film options, audio capture, drone rules, delivery times and how the videographer works with your photographer.",
    ask: "Ask to watch a full wedding film so you can judge sound, pacing and ceremony coverage.",
    timing: "Book alongside photography when possible so the two teams can work smoothly together.",
  },
  "wedding-planners": {
    compare:
      "Compare full planning, partial planning, styling, supplier sourcing, budget management and on-the-day coordination separately.",
    ask: "Ask what decisions remain with you and how supplier payments, contracts and timelines are tracked.",
    timing: "Book at the start for full planning or at least several months out for coordination.",
  },
};

function seoAdvice(categoryKey: string | undefined, plural: string, singular: string, place: string) {
  const fallback = CATEGORY_SEO[categoryKey ?? ""] ?? {
    compare: `Compare portfolios, availability, travel terms, review quality and exactly what is included before choosing ${plural.toLowerCase()} in ${place}.`,
    ask: "Ask for a written quote, clear payment terms, setup requirements and recent examples from weddings similar to yours.",
    timing:
      "Book key suppliers as soon as your date and venue are confirmed, especially for peak-season weekends.",
  };
  return [
    {
      title: `How to compare ${plural.toLowerCase()} in ${place}`,
      body: fallback.compare,
    },
    {
      title: `Questions to ask each ${singular.toLowerCase()}`,
      body: fallback.ask,
    },
    {
      title: `When to enquire in ${place}`,
      body: fallback.timing,
    },
  ];
}

function locationGroupsFor(target: ReturnType<typeof parseDirectorySlug>) {
  if (!target) return [];
  if (target.country === "United Kingdom") {
    return [{ label: "United Kingdom", country: "United Kingdom" as const, locations: UK_REGIONS }];
  }
  if (target.country === "Ireland") {
    return [{ label: "Ireland", country: "Ireland" as const, locations: IRELAND_COUNTIES }];
  }
  return [
    {
      label: "Ireland",
      country: "Ireland" as const,
      locations: BALANCED_LOCATIONS.filter((location) => locationCountry(location) === "Ireland"),
    },
    {
      label: "United Kingdom",
      country: "United Kingdom" as const,
      locations: BALANCED_LOCATIONS.filter(
        (location) => locationCountry(location) === "United Kingdom",
      ),
    },
  ];
}

function joinList(items: string[]) {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function lowerFirst(value: string) {
  return value ? `${value[0].toLowerCase()}${value.slice(1)}` : value;
}

/** Copy for the page title / H1 / meta, driven by the real listing count. */
function buildCopy(opts: {
  plural: string;
  place: string;
  count: number;
  page: number;
  priced: ReturnType<typeof priceGuide>;
  kind: "suppliers" | "venues";
}) {
  const { plural, place, count, page, priced, kind } = opts;
  const ranked = count > 0;
  const listingCount = count.toLocaleString();
  const label = countLabel(plural, count);
  const heading = ranked
    ? `${listingCount} ${label} in ${place} (${SEO_YEAR})`
    : `${plural} in ${place}`;

  const title = ranked
    ? `${listingCount} ${label} in ${place} ${SEO_YEAR} - Prices & Reviews`
    : `${plural} in ${place} — ${count} Listed | WedHQ`;

  const priceBit = priced
    ? kind === "venues"
      ? ` Published per-person venue guides are around ${euro(priced.median)} where shown.`
      : ` Published guide prices are around ${euro(priced.median)} where shown.`
    : "";
  const description = clamp(
    `Compare ${count.toLocaleString()} ${plural.toLowerCase()} in ${place}, ranked with live reviews, images, prices and enquiry links.${priceBit}`,
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
    let target = parseDirectorySlug(params.directorySlug);
    if (!target && /-co-[a-z0-9-]+$/.test(params.directorySlug)) {
      const cleanSlug = params.directorySlug.replace(/-co-([a-z0-9-]+)$/, "-$1");
      target = parseDirectorySlug(cleanSlug);
      if (target) {
        throw redirect({
          to: "/$directorySlug",
          params: { directorySlug: cleanSlug },
          statusCode: 301,
        });
      }
    }
    if (!target) throw notFound();
    const page = Math.max(1, Math.min(deps.page ?? 1, 200));
    const place =
      target.scope === "all"
        ? "the UK and Ireland"
        : target.country === "United Kingdom" && !target.county
          ? "the UK"
          : target.county
            ? listingLocationLabel(target.county, target.country)
            : "Ireland";

    const statsInput = {
      kind: target.kind,
      ...(target.category ? { category: target.category.key } : {}),
      ...(target.country ? { country: target.country } : {}),
      ...(target.county ? { county: target.county } : {}),
    } as const;

    if (target.kind === "venues") {
      const [result, stats] = await Promise.all([
        listVenues({
          data: {
            ...(target.country ? { country: target.country } : {}),
            ...(target.county ? { county: target.county } : {}),
            page,
            perPage: PER_PAGE,
          },
        }),
        getDirectoryStats({ data: statsInput }),
      ]);
      return { target, place, page, venues: result, suppliers: null, stats };
    }

    const [result, stats] = await Promise.all([
      listSuppliers({
        data: {
          ...(target.category ? { category: target.category.key } : {}),
          ...(target.country ? { country: target.country } : {}),
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
      kind: target.kind,
    });
    const hero =
      loaderData.venues?.rows[0]?.logo_image ?? loaderData.suppliers?.rows[0]?.logo_image ?? null;

    return {
      meta: pageMeta({
        title: copy.title,
        description: copy.description,
        path,
        image: hero,
        noindex:
          loaderData.page > 1 ||
          count === 0 ||
          (target.country === "United Kingdom" && count <= 2),
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
  const scopeSlug = target.county
    ? countySlug(target.county)
    : target.country === "United Kingdom"
      ? "uk"
      : target.country === "Ireland"
        ? "ireland"
        : "uk-and-ireland";
  const plural = target.category?.plural ?? "Wedding Venues";
  const singular = countLabel(plural, 1);

  const priced = priceGuide(stats.prices);
  const rating = weightedRating(stats.rated);
  const copy = buildCopy({ plural, place, count: total, page, priced, kind: target.kind });
  const advice = seoAdvice(
    target.category?.key ?? (target.kind === "venues" ? VENUE_SLUG : undefined),
    plural,
    singular,
    place,
  );
  const locationGroups = locationGroupsFor(target);
  const topLocations = stats.topLocations ?? [];
  const popularTerms = stats.popularTerms ?? [];
  const imageCount = stats.imageCount ?? 0;
  const topLocationLabels = topLocations
    .slice(0, 4)
    .map((item) => listingLocationLabel(item.county, item.country));
  const popularTermLabels = popularTerms.slice(0, 5).map((item) => lowerFirst(item.label));

  const rankedSuppliers = page === 1 ? supplierRows.slice(0, TOP_N) : [];
  const rankedVenues = page === 1 ? venueRows.slice(0, TOP_N) : [];
  const restSuppliers = page === 1 ? supplierRows.slice(TOP_N) : supplierRows;
  const restVenues = page === 1 ? venueRows.slice(TOP_N) : venueRows;

  const rankedItems = [
    ...rankedVenues.map((v) => ({ name: v.name, path: `/venue/${v.slug}` })),
    ...rankedSuppliers.map((s) => ({ name: s.name, path: `/supplier/${s.slug}` })),
  ];
  const exampleNames = rankedItems.slice(0, 3).map((item) => item.name);
  const reviewCount = rating?.reviews ?? 0;
  const pageIntro = [
    copy.description,
    topLocationLabels.length > 1
      ? `Coverage is strongest around ${joinList(topLocationLabels)}.`
      : null,
    imageCount
      ? `${imageCount.toLocaleString()} listings include real profile imagery for faster shortlisting.`
      : null,
  ]
    .filter(Boolean)
    .join(" ");

  const faqs: { q: string; a: string }[] = [];
  if (priced) {
    faqs.push({
      q: `How much does a ${singular.toLowerCase()} cost in ${place}?`,
      a: `Of the ${total.toLocaleString()} listings in ${place}, ${priced.count} publish a price guide. The middle of that range is ${euro(priced.median)}, with published guides running from ${euro(priced.low)} to ${euro(priced.high)}. Anything outside that range is usually down to season, guest numbers and how many hours you need.`,
    });
  }
  faqs.push({
    q: `How many ${plural.toLowerCase()} are listed in ${place}?`,
    a: `${total.toLocaleString()} ${plural.toLowerCase()} are listed in ${place} on WedHQ. Listings are ordered by portfolio depth, published reviews, image coverage and how complete the listing is.`,
  });
  if (topLocationLabels.length > 1) {
    faqs.push({
      q: `Which areas have the most ${plural.toLowerCase()}?`,
      a: `The strongest coverage for this search includes ${joinList(topLocationLabels)}. Each listing still shows its own location, service area and enquiry route so couples can compare nearby options quickly.`,
    });
  }
  if (popularTermLabels.length > 1) {
    faqs.push({
      q: `What types of ${plural.toLowerCase()} can we compare?`,
      a: `Common terms in this set include ${joinList(popularTermLabels)}. Use those signals alongside photos, reviews and pricing notes rather than choosing on category name alone.`,
    });
  }
  faqs.push({
    q: `When should we book ${plural.toLowerCase()} in ${place}?`,
    a: `For a Saturday in peak season, ${plural.toLowerCase()} in ${place} are commonly booked twelve to eighteen months out. Off-season and midweek dates are far easier, so enquire with three or four options and compare what's actually available for your date.`,
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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: copy.h1,
          description: copy.description,
          url: absoluteUrl(`/${directorySlug}`),
          keywords: [plural, place, ...topLocationLabels, ...popularTermLabels, ...exampleNames],
          isPartOf: {
            "@type": "WebSite",
            name: "WedHQ",
            url: absoluteUrl("/"),
          },
          about: target.category?.plural ?? "Wedding Venues",
          areaServed:
            target.scope === "all"
              ? ["Ireland", "United Kingdom"]
              : target.country === "United Kingdom"
                ? "United Kingdom"
                : target.country === "Ireland"
                  ? "Ireland"
                  : place,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: total,
            itemListElement: rankedItems.map((item, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: item.name,
              url: absoluteUrl(item.path),
            })),
          },
        }}
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

      <PageHeader eyebrow="Directory" title={copy.h1} description={pageIntro || target.blurb}>
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
            value={
              target.scope === "all"
                ? "UK & Ireland"
                : target.county
                  ? listingLocationLabel(target.county, target.country)
                  : place
            }
            detail={target.county ? "plus suppliers who travel" : "live database coverage"}
          />
        </div>
      </div>

      <Section
        title={`Why this ${plural.toLowerCase()} page is useful`}
        description={pageIntro}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <EvidenceCard
            icon={<MapPin className="size-4" />}
            title="Local coverage"
            body={
              topLocationLabels.length
                ? `Strong coverage around ${joinList(topLocationLabels.slice(0, 3))}.`
                : `Focused on ${place} with every matching listing pulled live.`
            }
          />
          <EvidenceCard
            icon={<Camera className="size-4" />}
            title="Image-led shortlists"
            body={
              imageCount
                ? `${imageCount.toLocaleString()} matching listings include images, so couples can judge style before enquiring.`
                : "Image coverage is added as suppliers update their profiles."
            }
          />
          <EvidenceCard
            icon={<Star className="size-4" />}
            title="Review signals"
            body={
              reviewCount
                ? `${reviewCount.toLocaleString()} reviews help separate proven options from thin profiles.`
                : "Reviews appear only when a listing has real review data."
            }
          />
          <EvidenceCard
            icon={<ListChecks className="size-4" />}
            title="Useful filters"
            body={
              popularTermLabels.length
                ? `Common signals include ${joinList(popularTermLabels.slice(0, 3))}.`
                : "Compare price, location, portfolio depth and enquiry options in one place."
            }
          />
        </div>
      </Section>

      {listed === 0 ? (
        <Section>
          <div className="rounded-xl border border-dashed border-border p-10 text-center">
            <h2 className="font-serif text-xl">Nothing listed here yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a nearby location, or browse the full UK and Ireland directory.
            </p>
            <Button asChild className="mt-5">
              <Link to="/$directorySlug" params={{ directorySlug: `${baseSlug}-uk-and-ireland` }}>
                View all locations
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
                      categoryKey={target.category?.key}
                    />
                  </li>
                ))}
              </ol>
            </Section>
          ) : null}

          {restSuppliers.length || restVenues.length ? (
            <Section
              tone="ivory"
              title={
                page > 1 ? `${plural} in ${place}` : `More ${plural.toLowerCase()} in ${place}`
              }
              description="Every remaining listing that matches, in the same ranking order."
            >
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {restVenues.map((venue) => (
                  <VenueCard key={venue.id} venue={venue} />
                ))}
                {restSuppliers.map((supplier) => (
                  <SupplierCard
                    key={supplier.id}
                    supplier={supplier}
                    categoryKey={target.category?.key}
                  />
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

      <Section
        title={`Choosing ${plural.toLowerCase()} in ${place}`}
        description={`Use this page to compare live listings in ${place} by photos, review signals, pricing notes, capacity and direct enquiry options.`}
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {advice.map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-serif text-lg">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
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

      <Section tone="ivory" title={`${plural} by location`}>
        <div className="grid gap-8 lg:grid-cols-2">
          {locationGroups.map((group) => (
            <div key={group.label}>
              <h3 className="font-serif text-xl">{group.label}</h3>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {group.locations.map((county) => (
                  <Link
                    key={county}
                    to="/$directorySlug"
                    params={{ directorySlug: `${baseSlug}-${countySlug(county)}` }}
                    className="rounded-lg border border-border bg-card px-3 py-3 text-center text-sm shadow-soft hover:border-primary/40 hover:text-primary"
                  >
                    {listingLocationLabel(county, group.country)}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title={
          target.county
            ? `Related searches in ${listingLocationLabel(target.county, target.country)}`
            : "Related searches"
        }
        description="Switch category while keeping the same location."
      >
        <div className="flex flex-wrap gap-2">
          <Link
            to="/$directorySlug"
            params={{
              directorySlug: `${VENUE_SLUG}-${scopeSlug}`,
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
                directorySlug: `${c.slug}-${scopeSlug}`,
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

function EvidenceCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
    </div>
  );
}
