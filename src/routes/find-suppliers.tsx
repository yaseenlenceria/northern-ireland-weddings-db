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
import { SupplierCard } from "@/components/site/Cards";
import { listSuppliers } from "@/lib/directory.functions";
import { CATEGORIES, COUNTIES } from "@/lib/taxonomy";

const TITLE = "Find Wedding Suppliers in Ireland | WedList Ireland";
const DESCRIPTION =
  "Search every wedding supplier on WedList Ireland by category, county and name — photographers, bands, florists, planners, celebrants and more.";

export const Route = createFileRoute("/find-suppliers")({
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
  component: FindSuppliersPage,
});

function FindSuppliersPage() {
  const fetchSuppliers = useServerFn(listSuppliers);
  const [category, setCategory] = useState("all");
  const [county, setCounty] = useState("all");
  const [q, setQ] = useState("");
  const [term, setTerm] = useState("");
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["suppliers", category, county, term, page],
    queryFn: () =>
      fetchSuppliers({
        data: {
          ...(category !== "all" ? { category } : {}),
          ...(county !== "all" ? { county } : {}),
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
        eyebrow="Directory"
        title="Find wedding suppliers in Ireland"
        description="Filter the full directory by what you need and where your wedding is happening."
      >
        <Breadcrumbs items={[{ label: "Find Suppliers" }]} />
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
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => reset(() => setCategory(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                <SelectItem value="all">All categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.key} value={c.key}>
                    {c.plural}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
            <Label htmlFor="supplier-search">Business name</Label>
            <Input
              id="supplier-search"
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
            : `${(query.data?.count ?? 0).toLocaleString()} suppliers match your filters.`}
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {query.isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-96 w-full rounded-xl" />
              ))
            : query.data?.rows.map((supplier) => (
                <SupplierCard key={supplier.id} supplier={supplier} />
              ))}
        </div>

        {!query.isLoading && (query.data?.rows.length ?? 0) === 0 ? (
          <p className="mt-10 text-center text-muted-foreground">
            No suppliers match those filters. Try widening the county or category.
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
