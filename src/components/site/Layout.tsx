import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="surface-ivory border-b border-border">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        {children}
        {eyebrow ? <p className="eyebrow mt-4 text-gold">{eyebrow}</p> : null}
        <h1 className="mt-2 max-w-3xl text-3xl leading-[1.15] sm:text-4xl lg:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function Section({
  title,
  description,
  eyebrow,
  action,
  children,
  tone = "default",
  id,
}: {
  title?: string;
  description?: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  tone?: "default" | "ivory" | "dark";
  id?: string;
}) {
  const toneClasses =
    tone === "ivory"
      ? "surface-ivory border-y border-border/60"
      : tone === "dark"
        ? "bg-primary text-primary-foreground"
        : "";
  return (
    <section className={toneClasses} id={id}>
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        {title ? (
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              {eyebrow ? <p className="eyebrow text-gold">{eyebrow}</p> : null}
              <h2 className="mt-2 text-2xl leading-tight sm:text-3xl lg:text-4xl">{title}</h2>
              {description ? (
                <p className="mt-3 leading-relaxed text-muted-foreground">{description}</p>
              ) : null}
            </div>
            {action}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}

export function CtaBand({
  title,
  description,
  primaryLabel = "Get a Free SEO Audit",
  primaryTo = "/free-seo-audit",
  secondaryLabel,
  secondaryTo,
}: {
  title: string;
  description: string;
  primaryLabel?: string;
  primaryTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
}) {
  return (
    <section className="rule-gold bg-primary text-primary-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-16">
        <div className="max-w-2xl">
          <h2 className="text-2xl leading-tight text-primary-foreground sm:text-3xl">{title}</h2>
          <p className="mt-3 leading-relaxed text-primary-foreground/75">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="lg" variant="gold">
            <Link to={primaryTo}>{primaryLabel}</Link>
          </Button>
          {secondaryLabel && secondaryTo ? (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link to={secondaryTo}>{secondaryLabel}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="[&_h2]:mt-12 [&_h2]:text-2xl [&_h3]:mt-8 [&_h3]:text-xl [&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:leading-relaxed [&_ul]:text-muted-foreground [&_li]:mt-2">
      {children}
    </div>
  );
}
