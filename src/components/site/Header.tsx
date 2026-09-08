import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ChevronDown, LogIn, Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { BrandLink } from "@/components/site/BrandMark";
import { getHeaderHighlights } from "@/lib/directory.functions";
import {
  CATEGORIES,
  CATEGORY_BY_KEY,
  IRELAND_COUNTIES,
  UK_REGIONS,
  VENUE_SLUG,
  countySlug,
  listingLocationLabel,
} from "@/lib/taxonomy";

const NAV = [
  { to: "/find-suppliers", label: "Suppliers" },
  { to: "/venues", label: "Venues" },
  { to: "/planning-tools", label: "Planning Tools" },
  { to: "/wedding-guides", label: "Wedding Guides" },
] as const;

const QUICK_CATEGORIES = [
  "wedding-photographers",
  "wedding-venues",
  "wedding-florists",
  "wedding-bands",
  "wedding-djs",
  "wedding-makeup-artists",
  "wedding-planners",
] as const;

const FEATURED_IRISH_LOCATIONS = IRELAND_COUNTIES.slice(0, 8);
const FEATURED_UK_LOCATIONS = [
  "London",
  "West London",
  "Berkshire",
  "Cheshire",
  "Essex",
  "Kent",
  "Surrey",
  "West Sussex",
].filter((location) => UK_REGIONS.some((item) => item === location));

export function Header() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const fetchHighlights = useServerFn(getHeaderHighlights);
  const highlights = useQuery({
    queryKey: ["header-highlights"],
    queryFn: () => fetchHighlights(),
    staleTime: 1000 * 60 * 10,
  });
  const supplierHighlights = highlights.data?.suppliers ?? [];
  const venueHighlights = highlights.data?.venues ?? [];
  const highlightItems = [
    ...venueHighlights.map((item) => ({ ...item, kind: "venue" as const })),
    ...supplierHighlights.map((item) => ({ ...item, kind: "supplier" as const })),
  ].slice(0, 3);

  return (
    <header className="sticky top-0 z-50 border-b border-gold/25 bg-background/92 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-4 sm:px-6">
        <BrandLink onClick={() => setOpen(false)} />

        <nav aria-label="Main" className="hidden flex-1 items-center gap-1 lg:flex">
          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Explore <ChevronDown className="size-3.5" aria-hidden="true" />
            </button>
            <div className="invisible absolute left-0 top-full w-[760px] translate-y-2 pt-3 opacity-0 transition-all group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="grid grid-cols-[1fr_1fr_1.1fr] gap-6 rounded-xl border border-border bg-card p-5 shadow-lift">
                <div>
                  <p className="eyebrow text-muted-foreground">Popular searches</p>
                  <div className="mt-3 grid gap-2">
                    {QUICK_CATEGORIES.map((slug) => {
                      const isVenue = slug === VENUE_SLUG;
                      const category = isVenue
                        ? null
                        : CATEGORIES.find((item) => item.slug === slug);
                      return (
                        <Link
                          key={slug}
                          to="/$directorySlug"
                          params={{ directorySlug: `${slug}-uk-and-ireland` }}
                          className="rounded-md px-2 py-1.5 text-sm text-foreground/80 hover:bg-primary-soft hover:text-primary"
                        >
                          {isVenue ? "Wedding Venues" : category?.plural}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="eyebrow text-muted-foreground">Locations</p>
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <p className="text-xs font-medium text-foreground">Ireland</p>
                      {FEATURED_IRISH_LOCATIONS.slice(0, 6).map((county) => (
                        <Link
                          key={county}
                          to="/county/$county"
                          params={{ county: countySlug(county) }}
                          className="rounded-md px-2 py-1.5 text-sm text-foreground/80 hover:bg-primary-soft hover:text-primary"
                        >
                          {listingLocationLabel(county, "Ireland")}
                        </Link>
                      ))}
                    </div>
                    <div className="grid gap-2">
                      <p className="text-xs font-medium text-foreground">United Kingdom</p>
                      {FEATURED_UK_LOCATIONS.slice(0, 6).map((location) => (
                        <Link
                          key={location}
                          to="/$directorySlug"
                          params={{ directorySlug: `${VENUE_SLUG}-${countySlug(location)}` }}
                          className="rounded-md px-2 py-1.5 text-sm text-foreground/80 hover:bg-primary-soft hover:text-primary"
                        >
                          {listingLocationLabel(location, "United Kingdom")}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="eyebrow text-muted-foreground">Featured listings</p>
                  <div className="mt-3 grid gap-3">
                    {highlightItems.map((item) => (
                      <Link
                        key={`${item.kind}-${item.slug}`}
                        to={item.kind === "venue" ? "/venue/$slug" : "/supplier/$slug"}
                        params={{ slug: item.slug }}
                        className="grid grid-cols-[56px_1fr] gap-3 rounded-lg p-2 hover:bg-primary-soft"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt=""
                            className="size-14 rounded-md object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <span className="flex size-14 items-center justify-center rounded-md bg-primary-soft text-primary">
                            <Search className="size-4" aria-hidden="true" />
                          </span>
                        )}
                        <span>
                          <span className="line-clamp-1 block text-sm font-medium">
                            {item.name}
                          </span>
                          <span className="line-clamp-1 block text-xs text-muted-foreground">
                            {item.kind === "venue"
                              ? `Venue in ${listingLocationLabel(item.county, item.country)}`
                              : `${CATEGORY_BY_KEY.get(item.category ?? "")?.label ?? "Supplier"} in ${listingLocationLabel(item.county, item.country)}`}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              aria-current={pathname === item.to ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                pathname === item.to ? "font-medium text-primary" : "text-foreground/80"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Button asChild variant="outline" size="sm">
            <Link to="/list-your-business">List Your Business</Link>
          </Button>
          {user ? (
            <Button asChild size="sm">
              <Link to="/dashboard">My Account</Link>
            </Button>
          ) : (
            <Button asChild size="sm">
              <Link to="/auth">
                <LogIn className="size-4" /> Login
              </Link>
            </Button>
          )}
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto inline-flex size-11 items-center justify-center rounded-md border border-border lg:hidden"
        >
          {open ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-border bg-background lg:hidden">
          <nav
            aria-label="Mobile"
            className="mx-auto flex w-full max-w-7xl flex-col px-4 py-3 sm:px-6"
          >
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                aria-current={pathname === item.to ? "page" : undefined}
                className="rounded-md px-2 py-3 text-base text-foreground/85 hover:bg-accent"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              aria-current={pathname === "/contact" ? "page" : undefined}
              className="rounded-md px-2 py-3 text-base text-foreground/85 hover:bg-accent"
            >
              Contact
            </Link>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3">
              {QUICK_CATEGORIES.slice(0, 6).map((slug) => {
                const isVenue = slug === VENUE_SLUG;
                const category = isVenue ? null : CATEGORIES.find((item) => item.slug === slug);
                return (
                  <Link
                    key={slug}
                    to="/$directorySlug"
                    params={{ directorySlug: `${slug}-uk-and-ireland` }}
                    onClick={() => setOpen(false)}
                    className="rounded-md bg-primary-soft px-3 py-2 text-sm text-accent-foreground"
                  >
                    {isVenue ? "Venues" : category?.label}
                  </Link>
                );
              })}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                to="/$directorySlug"
                params={{ directorySlug: `${VENUE_SLUG}-ireland` }}
                onClick={() => setOpen(false)}
                className="rounded-md border border-border px-3 py-2 text-sm text-foreground/85"
              >
                Ireland venues
              </Link>
              <Link
                to="/$directorySlug"
                params={{ directorySlug: `${VENUE_SLUG}-uk` }}
                onClick={() => setOpen(false)}
                className="rounded-md border border-border px-3 py-2 text-sm text-foreground/85"
              >
                UK venues
              </Link>
            </div>
            <div className="mt-3 flex gap-2">
              <Button asChild variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                <Link to="/list-your-business">List Your Business</Link>
              </Button>
              <Button asChild className="flex-1" onClick={() => setOpen(false)}>
                <Link to={user ? "/dashboard" : "/auth"}>{user ? "My Account" : "Login"}</Link>
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
