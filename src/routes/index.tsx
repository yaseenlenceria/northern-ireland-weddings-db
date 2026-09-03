import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  Calculator,
  ClipboardList,
  Heart,
  MapPin,
  MessagesSquare,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout, Section } from "@/components/site/Layout";
import { SearchBar } from "@/components/site/SearchBar";
import { SupplierCard, VenueCard } from "@/components/site/Cards";
import { JsonLd } from "@/components/site/JsonLd";
import { getHomeData } from "@/lib/directory.functions";
import { CATEGORIES, FEATURED_COUNTIES, VENUE_SLUG, countySlug } from "@/lib/taxonomy";
import { GUIDES } from "@/lib/guides";
import { SEO_YEAR, absoluteUrl, canonical, pageMeta } from "@/lib/seo";
import heroImage from "@/assets/hero-wedding-ireland.jpg";

const TITLE = "Wedding Suppliers & Venues in Ireland | Wedora Ireland";
const DESCRIPTION =
  "Compare Irish wedding suppliers and venues across every county. Ranked top 10 lists, real prices, reviews and free direct enquiries.";

export const Route = createFileRoute("/")({
  loader: () => getHomeData(),
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, path: "/" }),
    links: canonical("/"),
  }),
  component: HomePage,
});

const POPULAR = [
  VENUE_SLUG,
  "wedding-planners",
  "wedding-beauty-skincare",
  "wedding-singers",
  "wedding-photographers",
  "wedding-videographers",
  "wedding-florists",
  "wedding-makeup-artists",
  "wedding-djs",
  "wedding-celebrants",
  "wedding-cakes",
];

const TOOLS = [
  {
    to: "/wedding-checklist" as const,
    icon: ClipboardList,
    title: "Wedding Checklist",
    copy: "A month-by-month task list you can tick off as you go.",
  },
  {
    to: "/budget-calculator" as const,
    icon: Calculator,
    title: "Budget Calculator",
    copy: "Set a total, split it by category and track what you've actually paid.",
  },
  {
    to: "/guest-list" as const,
    icon: Users,
    title: "Guest List Planner",
    copy: "Track invites, sides, party sizes and RSVPs in one table.",
  },
  {
    to: "/dashboard" as const,
    icon: Heart,
    title: "Supplier Shortlist",
    copy: "Save the venues and suppliers you love and compare them later.",
  },
  {
    to: "/wedding-timeline" as const,
    icon: CalendarCheck,
    title: "Wedding Timeline",
    copy: "Build a running order for the day, from morning prep to last dance.",
  },
];

/** Ranked city pages used for the "Top 10 by city" hub. */
const TOP_CITIES = ["Dublin", "Cork", "Galway", "Kerry", "Limerick", "Mayo"];
const TOP_CITY_CATEGORIES = [
  VENUE_SLUG,
  "wedding-photographers",
  "wedding-bands",
  "wedding-florists",
  "wedding-singers",
];

const REASONS = [
  {
    icon: Search,
    title: "Search that makes sense",
    copy: "Pick what you need and where, and get a page of real listings — not adverts.",
  },
  {
    icon: MapPin,
    title: "Ireland-focused listings",
    copy: "Every venue and supplier is based here, with county and service areas shown up front.",
  },
  {
    icon: MessagesSquare,
    title: "Direct enquiries",
    copy: "Message a supplier straight from their profile. No middlemen, no booking fees.",
  },
  {
    icon: ShieldCheck,
    title: "Reviews you can read",
    copy: "Couple reviews sit on the profile beside pricing and capacity, not behind a signup.",
  },
  {
    icon: Sparkles,
    title: "Planning tools included",
    copy: "Checklist, budget, guest list and timeline work free in your browser.",
  },
];

function HomePage() {
  const { suppliers, venues, counts } = Route.useLoaderData();
  // Keep the homepage showcase on the categories couples shop first, so the
  // featured strip reads as a curated edit rather than a random sample.
  const showcaseCategories = new Set([
    "Photographers",
    "Videographers",
    "Bands",
    "Singers",
    "Florists",
    "Wedding Planners",
    "Cakes",
    "Hair & Makeup",
    "DJs",
    "Celebrants",
  ]);
  // Hen/stag entertainment is in the directory but is not the right first
  // impression for a wedding homepage, so it is kept out of the showcase.
  const excludedCategories = new Set(["Hens & Stags", "Hen & Stag"]);
  const preferred = suppliers.filter(
    (s) =>
      (s.categories ?? []).some((c) => showcaseCategories.has(c)) &&
      !(s.categories ?? []).some((c) => excludedCategories.has(c)),
  );

  const wedding = suppliers.filter(
    (s) => !(s.categories ?? []).some((c) => excludedCategories.has(c)),
  );
  const featuredSuppliers = (preferred.length >= 8 ? preferred : wedding).slice(0, 8);


  return (
    <SiteLayout>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": absoluteUrl("/") + "#website",
              url: absoluteUrl("/"),
              name: "Wedora Ireland",
              description: DESCRIPTION,
              inLanguage: "en-IE",
              publisher: { "@id": absoluteUrl("/") + "#organization" },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${absoluteUrl("/find-suppliers")}?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            },
            {
              "@type": "Organization",
              "@id": absoluteUrl("/") + "#organization",
              url: absoluteUrl("/"),
              name: "Wedora Ireland",
              description:
                "Directory of wedding venues and suppliers across the Republic of Ireland.",
              areaServed: { "@type": "Country", name: "Ireland" },
            },
          ],
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-ivory">
        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          <div>
            <p className="eyebrow text-primary">Ireland's wedding directory</p>
            <h1 className="mt-3 text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              Wedding suppliers and venues across Ireland
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              {counts.suppliers.toLocaleString()} suppliers and {counts.venues.toLocaleString()}{" "}
              venues, county by county — with real price guides, published reviews and enquiries
              that go straight to the supplier.
            </p>

            <div className="mt-8">
              <SearchBar />
            </div>

            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-sm">
              <div>
                <dt className="eyebrow text-muted-foreground">Suppliers listed</dt>
                <dd className="font-serif text-2xl">{counts.suppliers.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="eyebrow text-muted-foreground">Venues listed</dt>
                <dd className="font-serif text-2xl">{counts.venues.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="eyebrow text-muted-foreground">Wedding fairs</dt>
                <dd className="font-serif text-2xl">{counts.fairs.toLocaleString()}</dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              alt="Bride and groom walking through the gardens of an Irish country house wedding venue"
              width={1600}
              height={1104}
              className="aspect-4/5 w-full rounded-2xl object-cover shadow-lift sm:aspect-16/12 lg:aspect-4/5"
            />
            <div className="absolute -bottom-5 left-5 right-5 rounded-xl border border-border bg-card/95 p-4 shadow-lift backdrop-blur sm:left-8 sm:right-auto sm:max-w-xs">
              <p className="eyebrow text-primary">Ranked lists</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Top 10 pages for every category in every county, ranked on portfolios and real
                review scores.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular categories */}
      <Section
        title="Popular categories"
        description="Start with the parts of the day most couples book first."
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {POPULAR.map((slug) => {
            const category = CATEGORIES.find((c) => c.slug === slug);
            const label = category ? category.plural : "Wedding Venues";
            const blurb = category
              ? category.blurb
              : "Ceremony and reception venues across Ireland.";
            return (
              <Link
                key={slug}
                to="/$directorySlug"
                params={{ directorySlug: `${slug}-ireland` }}
                className="group rounded-xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift"
              >
                <h3 className="font-serif text-lg leading-snug group-hover:text-primary">
                  {label}
                </h3>
                <p className="line-clamp-2 mt-2 text-xs text-muted-foreground">{blurb}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs text-primary">
                  Browse <ArrowRight className="size-3" />
                </span>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* Featured suppliers */}
      <Section
        tone="ivory"
        title="Featured suppliers"
        description="A cross-section of the businesses listed on Wedora Ireland right now."
        action={
          <Button asChild variant="outline">
            <Link to="/find-suppliers">
              See all suppliers <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredSuppliers.map((supplier) => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))}
        </div>
      </Section>

      {/* Featured venues */}
      <Section
        title="Venues couples are viewing"
        description="Hotels, country houses, barns and city spaces with capacity and pricing shown."
        action={
          <Button asChild variant="outline">
            <Link to="/venues">
              See all venues <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </Section>

      {/* Top 10 by city */}
      <Section
        tone="ivory"
        title={`Top 10 lists by county (${SEO_YEAR})`}
        description="Every category is ranked county by county on portfolio depth and published review scores. Start where you're getting married."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOP_CITIES.map((county) => (
            <div key={county} className="rounded-xl border border-border bg-card p-5 shadow-soft">
              <h3 className="font-serif text-lg">
                <Link
                  to="/county/$county"
                  params={{ county: countySlug(county) }}
                  className="hover:text-primary"
                >
                  Co. {county}
                </Link>
              </h3>
              <ul className="mt-3 space-y-1.5 text-sm">
                {TOP_CITY_CATEGORIES.map((slug) => {
                  const category = CATEGORIES.find((c) => c.slug === slug);
                  const label = category ? category.plural : "Wedding Venues";
                  return (
                    <li key={slug}>
                      <Link
                        to="/$directorySlug"
                        params={{ directorySlug: `${slug}-${countySlug(county)}` }}
                        className="text-muted-foreground hover:text-primary"
                      >
                        Top 10 {label.toLowerCase()} in {county}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Counties */}
      <Section
        tone="ivory"
        title="Browse by county"
        description="Jump straight to the venues and suppliers working in your area."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {FEATURED_COUNTIES.map((county) => (
            <Link
              key={county}
              to="/county/$county"
              params={{ county: countySlug(county) }}
              className="rounded-lg border border-border bg-card px-4 py-4 text-center text-sm shadow-soft transition-colors hover:border-primary/40 hover:text-primary"
            >
              Co. {county}
            </Link>
          ))}
        </div>
      </Section>

      {/* Planning tools */}
      <Section
        title="Wedding planning tools"
        description="Free tools that work straight away and save in this browser."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {TOOLS.map((tool) => (
            <Link
              key={tool.title}
              to={tool.to}
              className="group rounded-xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-primary-soft text-accent-foreground">
                <tool.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-serif text-lg group-hover:text-primary">{tool.title}</h3>
              <p className="mt-2 text-xs text-muted-foreground">{tool.copy}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* Why */}
      <Section
        tone="ivory"
        title="Why couples use Wedora Ireland"
        description="A directory built to be read, not clicked through."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {REASONS.map((reason) => (
            <div key={reason.title} className="rounded-xl border border-border bg-card p-5">
              <reason.icon className="size-5 text-primary" />
              <h3 className="mt-3 font-serif text-lg">{reason.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{reason.copy}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Supplier CTA */}
      <section>
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-2xl border border-primary/25 bg-primary-soft px-6 py-14 text-center sm:px-12">
            <h2 className="text-3xl sm:text-4xl">Are you a wedding supplier?</h2>
            <p className="mx-auto mt-3 max-w-xl text-accent-foreground">
              List your business and get discovered by couples across Ireland.
            </p>
            <Button asChild size="lg" className="mt-7">
              <Link to="/list-your-business">List Your Business</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Guides */}
      <Section
        title="Latest wedding guides"
        description="Practical reading on budgets, timings and booking order in Ireland."
        action={
          <Button asChild variant="outline">
            <Link to="/wedding-guides">
              All guides <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.slice(0, 3).map((guide) => (
            <Link
              key={guide.slug}
              to="/wedding-guides/$slug"
              params={{ slug: guide.slug }}
              className="group rounded-xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-lift"
            >
              <p className="eyebrow text-primary">{guide.topic}</p>
              <h3 className="mt-2 font-serif text-xl group-hover:text-primary">{guide.title}</h3>
              <p className="line-clamp-3 mt-2 text-sm text-muted-foreground">{guide.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs text-primary">
                Read guide <ArrowRight className="size-3" />
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
