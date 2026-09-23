import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Search, TrendingUp, MapPin, FileText } from "lucide-react";
import heroImage from "@/assets/hero-wedding-ireland.jpg";
import { Button } from "@/components/ui/button";
import { CtaBand, Section, SiteLayout } from "@/components/site/Layout";
import { FaqSection } from "@/components/seo/FaqSection";
import { LeadForm } from "@/components/seo/LeadForm";
import { JsonLd } from "@/components/site/JsonLd";
import { ARTICLES } from "@/lib/articles";
import { HOME_FAQS, SERVICES, STEPS, WHO_WE_HELP } from "@/lib/site";
import { absoluteUrl, canonical, pageMeta } from "@/lib/seo";

const PATH = "/seo";

export const Route = createFileRoute("/seo/")({
  head: () => ({
    links: canonical(PATH),
    meta: [
      ...pageMeta({
        title: "WedHQ | Marketing & SEO for Irish Wedding Businesses",
        description:
          "Get found by couples searching on Google. We help wedding venues, photographers, planners and suppliers improve their search visibility and turn website traffic into real enquiries.",
        path: PATH,
      }),
    ],
  }),
  component: Home,
});

function ServiceIcon({ index }: { index: number }) {
  const icons = [Search, MapPin, TrendingUp, FileText, ArrowRight, CheckCircle2];
  const Icon = icons[index % icons.length];
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
      <Icon className="h-5 w-5 text-gold" aria-hidden="true" />
    </span>
  );
}

function Home() {
  const featuredArticles = ARTICLES.slice(0, 3);

  return (
    <SiteLayout>
      {/* 1. Hero */}
      <section className="surface-ivory border-b border-border">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <p className="eyebrow text-gold">Marketing &amp; SEO for Irish Wedding Businesses</p>
            <h1 className="mt-3 text-4xl leading-[1.1] sm:text-5xl lg:text-[3.4rem]">
              Get found by couples searching on Google
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              We help wedding venues, photographers, planners and suppliers improve their search
              visibility and turn website traffic into real enquiries.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" variant="gold">
                <Link to="/seo/free-audit">Get a Free SEO Audit</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/seo/checklist">Download the Wedding SEO Checklist</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Free, honest review of your website's Google visibility — no obligation.
            </p>
          </div>
          <div className="relative">
            <img
              src={heroImage}
              alt="A newly engaged couple walking through the walled gardens of an Irish country house wedding venue"
              className="aspect-[4/3] w-full rounded-2xl border border-border object-cover shadow-lift"
              width={1600}
              height={1200}
              fetchPriority="high"
            />
            <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-border bg-card px-5 py-4 shadow-soft sm:block">
              <p className="text-sm font-medium">Instagram fades. Google compounds.</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Build a channel that works while you work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Who we help */}
      <Section
        eyebrow="Who We Help"
        title="Built for every kind of Irish wedding business"
        description="From venues to videographers, we understand how couples search for each service — and what it takes to rank for it."
      >
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {WHO_WE_HELP.map((category) => (
            <li
              key={category}
              className="card-lift rounded-lg border border-border bg-card px-4 py-3.5 text-sm font-medium"
            >
              {category}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted-foreground">
          Specialist pages:{" "}
          {[
            ["wedding-venue-seo", "venues"],
            ["wedding-photographer-seo", "photographers"],
            ["wedding-planner-seo", "planners"],
            ["bridal-shop-seo", "bridal shops"],
          ].map(([slug, label], index) => (
            <span key={slug}>
              {index > 0 ? ", " : ""}
              <Link
                to="/seo/$industrySlug"
                params={{ industrySlug: slug }}
                className="text-gold underline-offset-4 hover:underline"
              >
                {label}
              </Link>
            </span>
          ))}{" "}
          — and{" "}
          <Link to="/seo/services" className="text-gold underline-offset-4 hover:underline">
            more here
          </Link>
          .
        </p>
      </Section>

      {/* 3. Core services */}
      <Section
        tone="ivory"
        eyebrow="Core Services"
        title="SEO services for the wedding industry"
        description="Everything is focused on one outcome: more of the right couples finding you on Google and getting in touch."
        action={
          <Button asChild variant="outline">
            <Link to="/seo/services">
              Explore services <ArrowRight />
            </Link>
          </Button>
        }
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => (
            <Link
              key={service.slug}
              to="/seo/services/$slug"
              params={{ slug: service.slug }}
              className="card-lift flex flex-col rounded-xl border border-border bg-card p-6"
            >
              <ServiceIcon index={index} />
              <h3 className="mt-4 text-lg">{service.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {service.summary}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold">
                Learn more <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* 4. Why wedding SEO matters */}
      <Section
        eyebrow="Why Wedding SEO"
        title="Instagram is where couples dream. Google is where they decide."
        description="Couples collect ideas on Instagram for months. But when they're ready to compare suppliers and check availability, they search Google — “wedding venues in Kerry”, “wedding photographer Dublin prices”, “wedding florist Galway”. If your business isn't in those results, you're invisible at the exact moment couples are choosing."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Your website should be a channel, not a brochure",
              body: "Most wedding websites are online brochures: pretty, static, quiet. SEO turns yours into an acquisition channel that attracts couples and brings in enquiries every week — whether or not you posted today.",
            },
            {
              title: "Rankings compound; posting doesn't",
              body: "A real wedding published today can bring enquiries for years. County pages, venue pages and guides keep working through your busiest season and your quietest month alike.",
            },
            {
              title: "Specialist beats generic",
              body: "Generic SEO agencies don't understand wedding search: the seasonality, the county targeting, the venues, the trust couples need before they enquire. We work only with this industry, so nothing gets learned on your budget.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-lg leading-snug">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 5. Process */}
      <Section tone="ivory" eyebrow="The Process" title="A clear path from invisible to booked">
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <li key={step.number} className="rounded-xl border border-border bg-card p-6">
              <p className="font-display text-3xl text-gold">{step.number}</p>
              <h3 className="mt-3 text-lg">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* 6. Free SEO audit */}
      <Section
        eyebrow="Free SEO Audit"
        title="See what's stopping your website from ranking"
        description="We'll review your website, its Google visibility, local signals and conversion opportunities — then email you a plain-English summary of what we'd fix first."
        id="audit"
      >
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <ul className="space-y-4">
              {[
                "Where you rank today for the searches that matter in your counties",
                "Technical issues that could be holding every page back",
                "Local SEO and Google Business Profile opportunities",
                "Service pages and content your competitors are winning with",
                "Quick conversion wins to get more from your existing traffic",
              ].map((point) => (
                <li key={point} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
                  <span className="leading-relaxed text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">
              Prefer to talk first? Use the{" "}
              <Link
                to="/seo/contact"
                className="font-medium text-gold underline-offset-4 hover:underline"
              >
                contact page
              </Link>{" "}
              and ask us anything.
            </p>
          </div>
          <LeadForm variant="audit" />
        </div>
      </Section>

      {/* 7. Lead magnet */}
      <CtaBand
        title="The 21-Point Wedding Website SEO Checklist — Ireland Edition"
        description="Find out whether couples can actually find your wedding business on Google. Twenty-one practical checks covering indexing, local SEO, page titles, speed, content and conversion."
        primaryLabel="Get the Free Checklist"
        primaryTo="/seo/checklist"
        secondaryLabel="Get a Free SEO Audit"
        secondaryTo="/seo/free-audit"
      />

      {/* 8. Resource hub preview */}
      <Section
        eyebrow="Resource Hub"
        title="Guides for wedding businesses that want to be found"
        action={
          <Button asChild variant="outline">
            <Link to="/seo/resources">
              All resources <ArrowRight />
            </Link>
          </Button>
        }
      >
        <div className="grid gap-5 md:grid-cols-3">
          {featuredArticles.map((article) => (
            <Link
              key={article.slug}
              to="/seo/resources/$slug"
              params={{ slug: article.slug }}
              className="card-lift flex flex-col rounded-xl border border-border bg-card p-6"
            >
              <p className="eyebrow text-gold">{article.category}</p>
              <h3 className="mt-3 text-lg leading-snug">{article.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {article.excerpt}
              </p>
              <span className="mt-4 text-xs text-muted-foreground">
                {article.readMinutes} min read
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* 9. Trust */}
      <Section
        tone="ivory"
        eyebrow="Proof"
        title="Case studies coming soon"
        description="Our SEO service is new, so instead of inventing results, we offer the next best thing."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg">Ask to see a sample SEO audit</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Want to judge the quality of the work before committing? Request the free audit and
              see exactly the kind of findings and recommendations you'd get.
            </p>
            <Button asChild variant="gold" className="mt-4">
              <Link to="/seo/free-audit">Request a Website Review</Link>
            </Button>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg">Honest expectations, always</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              We don't promise guaranteed rankings or overnight results — no one honestly can. What
              you get is a proven process, transparent reporting and recommendations we'd make for
              our own business.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/information/about">About WedHQ</Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* 10. FAQ */}
      <Section eyebrow="FAQ" title="Questions wedding business owners ask">
        <FaqSection faqs={[...HOME_FAQS]} withSchema />
      </Section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "WedHQ",
          url: absoluteUrl(PATH),
        }}
      />
      <CtaBand
        title="Ready to see where you stand on Google?"
        description="Get a free, honest review of your website's visibility — and a clear list of what to fix first."
        primaryLabel="Get a Free SEO Audit"
        primaryTo="/seo/free-audit"
        secondaryLabel="Get the Wedding SEO Checklist"
        secondaryTo="/seo/checklist"
      />
    </SiteLayout>
  );
}
