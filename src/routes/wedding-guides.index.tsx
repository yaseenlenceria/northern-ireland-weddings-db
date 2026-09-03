import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { GUIDES } from "@/lib/guides";
import { ArrowRight } from "lucide-react";
import { canonical, pageMeta } from "@/lib/seo";

const TITLE = "Wedding Guides for Irish Couples | Wedora Ireland";
const DESCRIPTION =
  "Practical wedding planning guides written for Ireland: real costs, booking order, venue questions, music, photography styles and seasonal flowers.";

export const Route = createFileRoute("/wedding-guides/")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, path: "/wedding-guides" }),
    links: canonical("/wedding-guides"),
  }),
  component: GuidesIndex,
});

function GuidesIndex() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Reading"
        title="Wedding guides"
        description="No filler. Each guide answers one question couples planning an Irish wedding actually ask."
      >
        <Breadcrumbs items={[{ label: "Wedding Guides" }]} />
      </PageHeader>

      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              to="/wedding-guides/$slug"
              params={{ slug: guide.slug }}
              className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-lift"
            >
              <p className="eyebrow text-primary">{guide.topic}</p>
              <h2 className="mt-2 font-serif text-2xl leading-snug group-hover:text-primary">
                {guide.title}
              </h2>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{guide.excerpt}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-xs text-primary">
                {guide.readMinutes} min read <ArrowRight className="size-3" />
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
