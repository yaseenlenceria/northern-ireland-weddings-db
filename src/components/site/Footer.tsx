import { Link } from "@tanstack/react-router";
import { INDUSTRIES, SERVICES } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-primary text-primary-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo className="[&_span]:text-primary-foreground" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
              Marketing &amp; SEO for Irish wedding businesses. Get found by couples searching on
              Google — and turn that visibility into enquiries.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <Link
                to="/free-seo-audit"
                className="text-sm font-medium text-gold transition-colors hover:text-gold/80"
              >
                Get a Free SEO Audit →
              </Link>
              <Link
                to="/wedding-seo-checklist"
                className="text-sm font-medium text-gold transition-colors hover:text-gold/80"
              >
                Get the Wedding SEO Checklist →
              </Link>
            </div>
          </div>

          <nav aria-label="Services">
            <h2 className="eyebrow text-primary-foreground/60">Services</h2>
            <ul className="mt-4 space-y-2.5">
              {SERVICES.map((service) => (
                <li key={service.slug}>
                  <Link
                    to="/services/$slug"
                    params={{ slug: service.slug }}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/services"
                  className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  All services
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Who we help">
            <h2 className="eyebrow text-primary-foreground/60">Who We Help</h2>
            <ul className="mt-4 space-y-2.5">
              {INDUSTRIES.slice(0, 8).map((industry) => (
                <li key={industry.slug}>
                  <Link
                    to="/$industrySlug"
                    params={{ industrySlug: industry.slug }}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    SEO for {industry.plural}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resources and company">
            <h2 className="eyebrow text-primary-foreground/60">Resources</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  to="/resources"
                  className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  Resource Hub
                </Link>
              </li>
              <li>
                <Link
                  to="/wedding-seo-checklist"
                  className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  Wedding SEO Checklist
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  About Vow Visibility
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Vow Visibility. All rights reserved.</p>
          <p>Specialist SEO &amp; marketing for the Irish wedding industry.</p>
        </div>
      </div>
    </footer>
  );
}
