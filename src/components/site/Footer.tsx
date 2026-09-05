import { Link } from "@tanstack/react-router";
import { CATEGORIES, FEATURED_COUNTIES, VENUE_SLUG, countySlug } from "@/lib/taxonomy";
import { BrandLogo } from "@/components/site/BrandMark";
import { SITE_NAME } from "@/lib/seo";

export function Footer() {
  const topCategories = CATEGORIES.slice(0, 8);

  return (
    <footer className="mt-24 border-t border-border bg-ivory">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <BrandLogo className="h-14 w-auto" />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            An Ireland-focused wedding directory: real venues, real suppliers, and free planning
            tools in one place.
          </p>
        </div>

        <nav aria-labelledby="footer-suppliers">
          <h3 id="footer-suppliers" className="eyebrow text-muted-foreground">
            Browse suppliers
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {topCategories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/$directorySlug"
                  params={{ directorySlug: `${c.slug}-ireland` }}
                  className="text-foreground/80 hover:text-primary"
                >
                  {c.plural}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-counties">
          <h3 id="footer-counties" className="eyebrow text-muted-foreground">
            Venues by county
          </h3>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {FEATURED_COUNTIES.slice(0, 10).map((county) => (
              <li key={county}>
                <Link
                  to="/$directorySlug"
                  params={{ directorySlug: `${VENUE_SLUG}-${countySlug(county)}` }}
                  className="text-foreground/80 hover:text-primary"
                >
                  {county}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-plan">
          <h3 id="footer-plan" className="eyebrow text-muted-foreground">
            Plan &amp; connect
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/wedding-checklist" className="text-foreground/80 hover:text-primary">
                Wedding Checklist
              </Link>
            </li>
            <li>
              <Link to="/budget-calculator" className="text-foreground/80 hover:text-primary">
                Budget Calculator
              </Link>
            </li>
            <li>
              <Link to="/guest-list" className="text-foreground/80 hover:text-primary">
                Guest List Planner
              </Link>
            </li>
            <li>
              <Link to="/wedding-timeline" className="text-foreground/80 hover:text-primary">
                Wedding Timeline
              </Link>
            </li>
            <li>
              <Link to="/wedding-fairs" className="text-foreground/80 hover:text-primary">
                Wedding Fairs
              </Link>
            </li>
            <li>
              <Link to="/list-your-business" className="text-foreground/80 hover:text-primary">
                List Your Business
              </Link>
            </li>
            <li>
              <Link to="/wedding-guides" className="text-foreground/80 hover:text-primary">
                Wedding Guides
              </Link>
            </li>
            <li>
              <Link to="/real-weddings" className="text-foreground/80 hover:text-primary">
                Real Weddings
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-foreground/80 hover:text-primary">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>{`© ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.`}</p>
          <p>Made in Ireland for couples getting married here.</p>
        </div>
      </div>
    </footer>
  );
}
