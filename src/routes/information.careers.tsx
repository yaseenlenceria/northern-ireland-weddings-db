import { createFileRoute, Link } from "@tanstack/react-router";
import { HeartHandshake, Compass, Wrench, Mail } from "lucide-react";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { pageMeta, canonical } from "@/lib/seo";

const TITLE = "Careers at WedHQ | Wedding Directory Jobs";
const DESCRIPTION =
  "Careers at WedHQ. We're a small team building a better wedding directory for Ireland and the UK — see how we work and how to get in touch.";

export const Route = createFileRoute("/information/careers")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, path: "/information/careers" }),
    links: canonical("/information/careers"),
  }),
  component: CareersPage,
});

const VALUES = [
  {
    icon: HeartHandshake,
    title: "Couples first",
    body: "Every feature starts with a couple trying to plan a wedding. If it doesn't make research, comparison or booking easier, it doesn't ship.",
  },
  {
    icon: Compass,
    title: "Small, honest directory",
    body: "We'd rather show 200 real, current listings than 2,000 stale ones. Accuracy beats volume in every decision we make.",
  },
  {
    icon: Wrench,
    title: "Build the plumbing",
    body: "Search, data quality, enquiries and page speed are the product. We invest in the unglamorous parts because that's what couples feel.",
  },
];

function CareersPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Careers"
        title="Careers at WedHQ"
        description="We're a small team building a wedding directory that couples actually trust — and a workplace to match."
      >
        <Breadcrumbs items={[{ label: "Careers" }]} />
      </PageHeader>

      <Section>
        <div className="max-w-3xl space-y-5 text-muted-foreground">
          <p>
            WedHQ is a small, independent team working on one problem: making it easier to plan a
            wedding in Ireland or the UK without wading through adverts, stale listings and
            pay-to-rank directories. We care about data quality, fast pages and straight answers.
          </p>
          <p>
            We don't currently have any open roles. When we hire, we post here first — usually
            engineering, data quality and editorial positions, all remote-friendly within Ireland
            and the UK.
          </p>
          <p>
            Prefer to get in touch before a role opens up? Tell us what you'd bring to the team
            through the contact page and we'll keep your note on file.
          </p>
        </div>
      </Section>

      <Section tone="ivory" title="How we work">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((value) => (
            <li key={value.title} className="rounded-xl border border-border bg-card p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary-soft text-primary">
                <value.icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-serif text-lg">{value.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{value.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="flex flex-col items-start gap-4 rounded-xl border border-border bg-ivory p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-xl">Introduce yourself</h2>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              No open role that fits? Send a short note about what you do and why WedHQ interests
              you. We read everything.
            </p>
          </div>
          <Button asChild>
            <Link to="/contact">
              <Mail className="size-4" aria-hidden="true" /> Contact us
            </Link>
          </Button>
        </div>
      </Section>
    </SiteLayout>
  );
}
