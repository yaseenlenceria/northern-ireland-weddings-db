import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { VenueCard } from "@/components/site/Cards";
import { listVenues } from "@/lib/directory.functions";
import { COUNTIES } from "@/lib/taxonomy";
import { canonical, pageMeta } from "@/lib/seo";

const TITLE = "Wedding Venues Ireland — Search Every County | Shortlist.ie";
const DESCRIPTION =
  "Browse Irish wedding venues by county, guest capacity and style. Compare per-person pricing, read details and enquire directly with the venue.";

const PER_PAGE = 24;

/** Non-numeric values keep the URL readable (?capacity=min120, not ?capacity="120"). */
const CAPACITIES = [
  { value: "all", label: "Any capacity" },
  { value: "min80", label: "80+ guests" },
  { value: "min120", label: "120+ guests" },
  { value: "min180", label: "180+ guests" },
  { value: "min250", label: "250+ guests" },
];

/**
 * Search params are JSON-parsed by the router, so "120" arrives as a number.
 * z.coerce.string() keeps numeric-looking filters valid instead of dropping them.
 */
const searchSchema = z.object({
  q: fallback(z.coerce.string(), "").optional(),
  county: fallback(z.coerce.string(), "all").optional(),
  capacity: fallback(z.coerce.string(), "all").optional(),
  page: fallback(z.coerce.number().int(), 1).optional(),
});

export const Route = createFileRoute("/venues")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, path: "/venues" }),
    links: canonical("/venues"),
  }),
  component: VenuesPage,
});

/** Drops default-valued params so /venues stays /venues. */
function cleanSearch(s: {
  q?: string | undefined;
  county?: string | undefined;
  capacity?: string | undefined;
  page?: number | undefined;
}) {
  return {
    ...(s.q ? { q: s.q } : {}),
    ...(s.county && s.county !== "all" ? { county: s.county } : {}),
    ...(s.capacity && s.capacity !== "all" ? { capacity: s.capacity } : {}),
    ...(s.page && s.page > 1 ? { page: s.page } : {}),
  };
}

function VenuesPage() {
  const fetchVenues = useServerFn(listVenues);
  const navigate = Route.useNavigate();
  const search = Route.useSearch();

  const term = search.q ?? "";
  const county = search.county ?? "all";
  const capacity = search.capacity ?? "all";
  const page = Math.max(1, search.page ?? 1);

  const [draft, setDraft] = useState(term);
  useEffect(() => setDraft(term), [term]);

  const update = (next: Partial<{ q: string; county: string; capacity: string; page: number }>) =>
    navigate({
      to: ".",
      // Defaults are stripped so shared URLs stay clean.
      search: (prev) =>
        cleanSearch({ ...prev, page: 1, ...next }),
      resetScroll: false,
    });

  const query = useQuery({
    queryKey: ["venues", county, capacity, term, page],
    queryFn: () =>
      fetchVenues({
        data: {
          ...(county !== "all" ? { county } : {}),
          ...(capacity !== "all" ? { minCapacity: Number(capacity.replace("min", "")) } : {}),
          ...(term ? { q: term } : {}),
          page,
          perPage: PER_PAGE,
        },
      }),
  });

  const total = query.data?.count ?? 0;
  const rows = query.data?.rows ?? [];
  const lastPage = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Venues"
        title="Wedding venues in Ireland"
        description="Hotels, country estates, barns, castles and city rooms — filtered by county and the number of guests you need to seat."
      >
        <Breadcrumbs items={[{ label: "Venues" }]} />
      </PageHeader>

      <Section>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            update({ q: draft });
          }}
          className="grid gap-4 rounded-xl border border-border bg-card p-4 shadow-soft sm:p-5 lg:grid-cols-[1fr_1fr_1.2fr_auto]"
          aria-label="Venue filters"
        >
          <div className="grid gap-1.5">
            <Label htmlFor="venue-county">County</Label>
            <Select value={county} onValueChange={(v) => update({ county: v })}>
              <SelectTrigger id="venue-county" className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                <SelectItem value="all">All counties</SelectItem>
                {COUNTIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    Co. {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="venue-capacity">Guest capacity</Label>
            <Select value={capacity} onValueChange={(v) => update({ capacity: v })}>
              <SelectTrigger id="venue-capacity" className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CAPACITIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="venue-search">Venue name</Label>
            <Input
              id="venue-search"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Search by name"
              className="h-11"
            />
          </div>

          <Button type="submit" className="h-11 self-end">
            <Search className="size-4" aria-hidden="true" /> Search
          </Button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground" role="status" aria-live="polite">
          {query.isPending
            ? "Searching…"
            : query.isError
              ? "We couldn't load venues just now."
              : `${total.toLocaleString()} venues match your filters.`}
        </p>

        {query.isError ? (
          <div className="mt-6 rounded-xl border border-destructive/40 bg-card p-8 text-center">
            <h2 className="text-xl">Results didn't load</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This is usually a temporary connection issue. Try again in a moment.
            </p>
            <Button className="mt-5" onClick={() => query.refetch()}>
              Try again
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {query.isPending
                ? Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-[26rem] w-full rounded-2xl" />
                  ))
                : rows.map((venue) => <VenueCard key={venue.id} venue={venue} />)}
            </div>

            {!query.isPending && rows.length === 0 ? (
              <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center">
                <h2 className="text-xl">No venues match those filters</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try a lower capacity, a nearby county, or clear the name search.
                </p>
                <Button
                  variant="outline"
                  className="mt-5"
                  onClick={() => update({ q: "", county: "all", capacity: "all" })}
                >
                  Clear filters
                </Button>
              </div>
            ) : null}

            {total > PER_PAGE ? (
              <nav
                className="mt-10 flex flex-wrap items-center justify-center gap-3"
                aria-label="Pagination"
              >
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => update({ page: page - 1 })}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {lastPage}
                </span>
                <Button
                  variant="outline"
                  disabled={page >= lastPage}
                  onClick={() => update({ page: page + 1 })}
                >
                  Next
                </Button>
              </nav>
            ) : null}
          </>
        )}
      </Section>
    </SiteLayout>
  );
}
