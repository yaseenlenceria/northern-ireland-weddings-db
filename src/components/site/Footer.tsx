import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Facebook,
  HeartHandshake,
  Instagram,
  MapPin,
  Pin,
  Search,
  Youtube,
} from "lucide-react";
import {
  CATEGORIES,
  IRELAND_COUNTIES,
  UK_REGIONS,
  VENUE_SLUG,
  countySlug,
  listingLocationLabel,
} from "@/lib/taxonomy";
import { BrandLogo } from "@/components/site/BrandMark";
import { SITE_NAME, SOCIAL_PROFILES } from "@/lib/seo";

type FooterLink = {
  label: string;
  to: string;
};

const planningLinks: FooterLink[] = [
  { label: "Wedding Checklist", to: "/wedding-checklist" },
  { label: "Budget Calculator", to: "/budget-calculator" },
  { label: "Guest List Planner", to: "/guest-list" },
  { label: "Wedding Timeline", to: "/wedding-timeline" },
  { label: "Wedding Guides", to: "/wedding-guides" },
  { label: "Wedding Fairs", to: "/wedding-fairs" },
];

const companyLinks: FooterLink[] = [
  { label: "About WedHQ", to: "/information/about" },
  { label: "Editorial team & policies", to: "/information/editorial-team" },
  { label: "Transparency hub", to: "/information/transparency-hub" },
  { label: "Careers", to: "/information/careers" },
  { label: "Contact", to: "/contact" },
];

const legalLinks: FooterLink[] = [
  { label: "Legal hub", to: "/information/legal-hub" },
  { label: "Terms of use", to: "/information/terms-of-use" },
  { label: "Terms of purchase", to: "/information/terms-of-purchase" },
  { label: "Privacy notice", to: "/information/privacy" },
  { label: "Cookie notice", to: "/information/cookies" },
  { label: "Privacy choices", to: "/information/your-privacy-choices" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: SOCIAL_PROFILES[0],
    icon: Instagram,
  },
  {
    label: "Facebook",
    href: SOCIAL_PROFILES[1],
    icon: Facebook,
  },
  {
    label: "YouTube",
    href: SOCIAL_PROFILES[2],
    icon: Youtube,
  },
  {
    label: "Pinterest",
    href: SOCIAL_PROFILES[3],
    icon: Pin,
  },
];

function FooterNav({ id, title, links }: { id: string; title: string; links: FooterLink[] }) {
  return (
    <nav aria-labelledby={id}>
      <h3 id={id} className="eyebrow text-muted-foreground">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="text-foreground/80 transition-colors hover:text-primary">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  const supplierLinks = CATEGORIES.slice(0, 10).map((category) => ({
    label: category.plural,
    to: `/${category.slug}-uk-and-ireland`,
  }));
  const irelandVenueLinks = IRELAND_COUNTIES.slice(0, 7).map((county) => ({
    label: listingLocationLabel(county, "Ireland"),
    to: `/${VENUE_SLUG}-${countySlug(county)}`,
  }));
  const ukVenueLinks = [
    "London",
    "Essex",
    "Kent",
    "Surrey",
    "Berkshire",
    "Cheshire",
    "Scotland",
  ]
    .filter((region) => UK_REGIONS.some((item) => item === region))
    .map((region) => ({
      label: listingLocationLabel(region, "United Kingdom"),
      to: `/${VENUE_SLUG}-${countySlug(region)}`,
    }));

  return (
    <footer className="mt-24 border-t border-border bg-ivory">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-8 border-b border-border/70 pb-10 lg:grid-cols-[1.15fr_1.85fr] lg:items-end">
          <div>
            <BrandLogo className="h-14 w-auto" />
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
              Search wedding venues, suppliers, reviews and planning tools across Ireland and the
              UK from one calm, organised directory.
            </p>
            <div className="mt-5 flex items-center gap-2" aria-label="WedHQ social profiles">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer me"
                  aria-label={label}
                  title={label}
                  className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground/70 transition hover:border-gold/60 hover:text-primary"
                >
                  <Icon className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Link
              to="/find-suppliers"
              className="flex min-h-24 items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-soft transition hover:border-gold/60 hover:shadow-lift"
            >
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Search className="size-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-medium">Find suppliers</span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  Photographers, florists, music, beauty and more.
                </span>
              </span>
            </Link>
            <Link
              to="/venues"
              className="flex min-h-24 items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-soft transition hover:border-gold/60 hover:shadow-lift"
            >
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                <MapPin className="size-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-medium">Browse venues</span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  Hotels, estates, barns and private event spaces.
                </span>
              </span>
            </Link>
            <Link
              to="/list-your-business"
              className="flex min-h-24 items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-soft transition hover:border-gold/60 hover:shadow-lift"
            >
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Building2 className="size-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-medium">List your business</span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  Claim, correct or add a wedding listing.
                </span>
              </span>
            </Link>
          </div>
        </div>

        <div className="grid gap-10 py-10 md:grid-cols-2 lg:grid-cols-[1.05fr_1.05fr_1.25fr_0.85fr]">
          <FooterNav id="footer-suppliers" title="Popular suppliers" links={supplierLinks} />
          <FooterNav id="footer-planning" title="Planning tools" links={planningLinks} />

          <nav aria-labelledby="footer-venues">
            <h3 id="footer-venues" className="eyebrow text-muted-foreground">
              Venues by location
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="mb-2 font-medium text-foreground">Ireland</p>
                <ul className="space-y-2.5">
                  {irelandVenueLinks.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-foreground/80 transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 font-medium text-foreground">United Kingdom</p>
                <ul className="space-y-2.5">
                  {ukVenueLinks.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-foreground/80 transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </nav>

          <FooterNav id="footer-company" title="WedHQ" links={companyLinks} />
        </div>

        <div className="rounded-lg border border-border bg-card p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
              <CalendarDays className="size-4" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-sm font-medium">Planning a wedding in the UK or Ireland?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Start with a shortlist, compare profiles, then send direct enquiries when ready.
              </p>
            </div>
          </div>
          <Link
            to="/planning-tools"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline sm:mt-0"
          >
            Open planning tools <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 border-t border-border/70 pt-6">
          <nav
            aria-label="Legal"
            className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground"
          >
            {legalLinks.map((link) => (
              <Link key={link.to} to={link.to} className="hover:text-primary">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-5 flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>{`© ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.`}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="inline-flex items-center gap-1.5">
                <HeartHandshake className="size-3.5" aria-hidden="true" />
                Built for couples and wedding businesses across Ireland and the UK.
              </p>
              <div className="flex items-center gap-2" aria-label="Social profiles">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={label}
                    title={label}
                    className="text-foreground/60 transition hover:text-primary"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
