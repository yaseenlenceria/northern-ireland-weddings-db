import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
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
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        {children}
        {eyebrow ? <p className="eyebrow mt-4 text-primary">{eyebrow}</p> : null}
        <h1 className="mt-2 max-w-3xl text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">{title}</h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

export function Section({
  title,
  description,
  action,
  children,
  tone = "default",
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  tone?: "default" | "ivory";
}) {
  return (
    <section className={tone === "ivory" ? "surface-ivory border-y border-border/60" : ""}>
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        {title ? (
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl leading-tight sm:text-4xl">{title}</h2>
              {description ? (
                <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
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
