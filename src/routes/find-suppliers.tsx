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
import { SupplierCard } from "@/components/site/Cards";
import { listSuppliers } from "@/lib/directory.functions";
import { CATEGORIES, COUNTIES } from "@/lib/taxonomy";
import { canonical, pageMeta } from "@/lib/seo";

const TITLE = "Find Wedding Suppliers in Ireland | Wedora Ireland";
const DESCRIPTION =
  "Search every wedding supplier on Wedora Ireland by category, county and name — photographers, bands, florists, planners, celebrants and more.";

const PER_PAGE = 24;

/** Filters live in the URL so results are shareable and the sitewide search action works. */
const searchSchema = z.object({
  q: fallback(z.string(), "").optional(),
  category: fallback(z.string(), "all").optional(),
  county: fallback(z.string(), "all").optional(),
  page: fallback(z.number().int(), 1).optional(),
});

export const Route = createFileRoute("/find-suppliers")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, path: "/find-suppliers" }),
    // Filtered variants canonicalise back to the clean URL.
    links: canonical("/find-suppliers"),
  }),
  component: FindSuppliersPage,
});

function FindSuppliersPage() {
  const fetchSuppliers = useServerFn(listSuppliers);
  const navigate = Route.useNavigate();
  const search = Route.useSearch();

  const term = search.q ?? "";
  const category = search.category ?? "all";
  const county = search.county ?? "all";
  const page = Math.max(1, search.page ?? 1);

  const [draft, setDraft] = useState(term);
  useEffect(() => setDraft(term), [term]);

  const update = (next: Partial<{ q: string; category: string; county: string; page: number }>) =>
    navigate({
      to: ".",
      search: (prev) => ({ ...prev, page: 1, ...next }),
      resetScroll: false,
    });

  const query = useQuery({
    queryKey: ["suppliers", category, county, term, page],
    queryFn: () =>
      fetchSuppliers({
        data: {
          ...(category !== "all" ? { category } : {}),
          ...(county !== "all" ? { county } : {}),
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
            update({ q: draft });
          }}
          className="grid gap-4 rounded-xl border border-border bg-card p-4 shadow-soft sm:p-5 lg:grid-cols-[1fr_1fr_1.2fr_auto]"
          aria-label="Supplier filters"
        >
          <div className="grid gap-1.5">
            <Label htmlFor="supplier-category">Category</Label>
            <Select value={category} onValueChange={(v) => update({ category: v })}>
              <SelectTrigger id="supplier-category" className="h-11">
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
            <Label htmlFor="supplier-county">County</Label>
            <Select value={county} onValueChange={(v) => update({ county: v })}>
              <SelectTrigger id="supplier-county" className="h-11">
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
              ? "We couldn't load suppliers just now."
              : `${total.toLocaleString()} suppliers match your filters.`}
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
                    <Skeleton key={i} className="h-96 w-full rounded-2xl" />
                  ))
                : rows.map((supplier) => <SupplierCard key={supplier.id} supplier={supplier} />)}
            </div>

            {!query.isPending && rows.length === 0 ? (
              <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center">
                <h2 className="text-xl">No suppliers match those filters</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try widening the county or category, or clear the name search.
                </p>
                <Button
                  variant="outline"
                  className="mt-5"
                  onClick={() => update({ q: "", category: "all", county: "all" })}
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
