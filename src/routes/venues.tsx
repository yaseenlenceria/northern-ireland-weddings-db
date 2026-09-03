import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
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

const TITLE = "Wedding Venues Ireland — Search Every County | WedList Ireland";
const DESCRIPTION =
  "Browse Irish wedding venues by county, guest capacity and style. Compare per-person pricing, read details and enquire directly with the venue.";

const CAPACITIES = [
  { value: "all", label: "Any capacity" },
  { value: "80", label: "80+ guests" },
  { value: "120", label: "120+ guests" },
  { value: "180", label: "180+ guests" },
  { value: "250", label: "250+ guests" },
];

export const Route = createFileRoute("/venues")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VenuesPage,
});

function VenuesPage() {
  const fetchVenues = useServerFn(listVenues);
  const [county, setCounty] = useState("all");
  const [capacity, setCapacity] = useState("all");
  const [q, setQ] = useState("");
  const [term, setTerm] = useState("");
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["venues", county, capacity, term, page],
    queryFn: () =>
      fetchVenues({
        data: {
          ...(county !== "all" ? { county } : {}),
          ...(capacity !== "all" ? { minCapacity: Number(capacity) } : {}),
          ...(term ? { q: term } : {}),
          page,
          perPage: 24,
        },
      }),
  });

  const reset = (fn: () => void) => {
    fn();
    setPage(1);
  };

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
            reset(() => setTerm(q));
          }}
          className="grid gap-4 rounded-xl border border-border bg-card p-5 shadow-soft lg:grid-cols-[1fr_1fr_1.2fr_auto]"
        >
          <div className="grid gap-1.5">
            <Label>County</Label>
            <Select value={county} onValueChange={(v) => reset(() => setCounty(v))}>
              <SelectTrigger>
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
            <Label>Guest capacity</Label>
            <Select value={capacity} onValueChange={(v) => reset(() => setCapacity(v))}>
              <SelectTrigger>
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
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name"
            />
          </div>

          <Button type="submit" className="self-end">
            <Search className="size-4" /> Search
          </Button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground">
          {query.isLoading
            ? "Searching…"
            : `${(query.data?.count ?? 0).toLocaleString()} venues match your filters.`}
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {query.isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[26rem] w-full rounded-xl" />
              ))
            : query.data?.rows.map((venue) => <VenueCard key={venue.id} venue={venue} />)}
        </div>

        {!query.isLoading && (query.data?.rows.length ?? 0) === 0 ? (
          <p className="mt-10 text-center text-muted-foreground">
            No venues match those filters yet. Try a lower capacity or a nearby county.
          </p>
        ) : null}

        <div className="mt-10 flex justify-center gap-3">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="self-center text-sm text-muted-foreground">Page {page}</span>
          <Button
            variant="outline"
            disabled={(query.data?.rows.length ?? 0) < 24}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </Section>
    </SiteLayout>
  );
}
