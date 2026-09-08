import { Link } from "@tanstack/react-router";
import {
  CATEGORIES,
  IRELAND_COUNTIES,
  UK_REGIONS,
  VENUE_SLUG,
  countySlug,
  listingLocationLabel,
} from "@/lib/taxonomy";
import { BrandLogo } from "@/components/site/BrandMark";
import { SITE_NAME } from "@/lib/seo";

export function Footer() {
  const topCategories = CATEGORIES.slice(0, 8);
  const irishLocations = IRELAND_COUNTIES.slice(0, 6);
  const ukLocations = ["London", "Essex", "Kent", "Surrey", "Berkshire", "Cheshire"].filter(
    (location) => UK_REGIONS.some((item) => item === location),
  );

  return (
    <footer className="mt-24 border-t border-border bg-ivory">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1.35fr_1fr]">
        <div>
          <BrandLogo className="h-14 w-auto" />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            A UK and Ireland wedding directory: real venues, real suppliers, and free planning
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
                  params={{ directorySlug: `${c.slug}-uk-and-ireland` }}
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
            Venues by location
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-5 text-sm">
            <div>
              <p className="mb-2 font-medium text-foreground">Ireland</p>
              <ul className="space-y-2">
                {irishLocations.map((county) => (
                  <li key={county}>
                    <Link
                      to="/$directorySlug"
                      params={{ directorySlug: `${VENUE_SLUG}-${countySlug(county)}` }}
                      className="text-foreground/80 hover:text-primary"
                    >
                      {listingLocationLabel(county, "Ireland")}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 font-medium text-foreground">United Kingdom</p>
              <ul className="space-y-2">
                {ukLocations.map((location) => (
                  <li key={location}>
                    <Link
                      to="/$directorySlug"
                      params={{ directorySlug: `${VENUE_SLUG}-${countySlug(location)}` }}
                      className="text-foreground/80 hover:text-primary"
                    >
                      {listingLocationLabel(location, "United Kingdom")}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
            <li>
              <Link to="/information/about" className="text-foreground/80 hover:text-primary">
                About WedHQ
              </Link>
            </li>
            <li>
              <Link to="/information/editorial-team" className="text-foreground/80 hover:text-primary">
                Editorial team &amp; policies
              </Link>
            </li>
            <li>
              <Link to="/information/careers" className="text-foreground/80 hover:text-primary">
                Careers
              </Link>
            </li>
            <li>
              <Link to="/information/legal-hub" className="text-foreground/80 hover:text-primary">
                Legal hub
              </Link>
            </li>
            <li>
              <Link to="/information/transparency-hub" className="text-foreground/80 hover:text-primary">
                Transparency hub
              </Link>
            </li>
            <li>
              <Link to="/information/terms-of-use" className="text-foreground/80 hover:text-primary">
                Terms of use
              </Link>
            </li>
            <li>
              <Link to="/information/terms-of-purchase" className="text-foreground/80 hover:text-primary">
                Terms of purchase
              </Link>
            </li>
            <li>
              <Link to="/information/privacy" className="text-foreground/80 hover:text-primary">
                Privacy notice
              </Link>
            </li>
            <li>
              <Link to="/information/cookies" className="text-foreground/80 hover:text-primary">
                Cookie notice
              </Link>
            </li>
            <li>
              <Link to="/information/your-privacy-choices" className="text-foreground/80 hover:text-primary">
                Your Privacy Choices
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-border/70">
        <nav
          aria-label="Legal"
          className="mx-auto flex w-full max-w-7xl flex-wrap gap-x-6 gap-y-2 px-4 pt-6 text-xs text-muted-foreground sm:px-6"
        >
          <Link to="/information/about" className="hover:text-primary">
            About WedHQ
          </Link>
          <Link to="/information/editorial-team" className="hover:text-primary">
            Editorial team &amp; policies
          </Link>
          <Link to="/information/careers" className="hover:text-primary">
            Careers
          </Link>
          <Link to="/information/legal-hub" className="hover:text-primary">
            Legal hub
          </Link>
          <Link to="/information/transparency-hub" className="hover:text-primary">
            Transparency hub
          </Link>
          <Link to="/information/terms-of-use" className="hover:text-primary">
            Terms of use
          </Link>
          <Link to="/information/terms-of-purchase" className="hover:text-primary">
            Terms of purchase
          </Link>
          <Link to="/information/privacy" className="hover:text-primary">
            Privacy notice
          </Link>
          <Link to="/information/cookies" className="hover:text-primary">
            Cookie notice
          </Link>
          <Link to="/information/your-privacy-choices" className="hover:text-primary">
            Your Privacy Choices
          </Link>
        </nav>
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>{`© ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.`}</p>
          <p>Built for couples planning weddings across Ireland and the UK.</p>
        </div>
      </div>
    </footer>
  );
}
