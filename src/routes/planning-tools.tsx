import { createFileRoute, Link } from "@tanstack/react-router";
import { Calculator, CalendarCheck, ClipboardList, Heart, Users } from "lucide-react";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs, breadcrumbSchema } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/site/JsonLd";
import { SITE_NAME, absoluteUrl, canonical, pageMeta } from "@/lib/seo";

const TITLE = "Free Wedding Planning Tools for Irish Couples | Shortlist.ie";
const DESCRIPTION =
  "Checklist, budget calculator, guest list planner and running order — free wedding planning tools that work in your browser.";

const TOOLS = [
  {
    to: "/wedding-checklist" as const,
    icon: ClipboardList,
    title: "Wedding Checklist",
    copy: "Work through the tasks in order, from booking the venue to confirming timings the week of.",
  },
  {
    to: "/budget-calculator" as const,
    icon: Calculator,
    title: "Budget Calculator",
    copy: "Enter estimates by category, log what you've actually paid and see the gap in real time.",
  },
  {
    to: "/guest-list" as const,
    icon: Users,
    title: "Guest List Planner",
    copy: "Track names, sides, party sizes and RSVPs, with a live headcount for your caterer.",
  },
  {
    to: "/find-suppliers" as const,
    icon: Heart,
    title: "Supplier Finder",
    copy: "Browse venues and suppliers, then use enquiry forms to contact the best matches.",
  },
  {
    to: "/wedding-timeline" as const,
    icon: CalendarCheck,
    title: "Wedding Timeline",
    copy: "A running order template for the day itself, ready to share with every supplier.",
  },
];

export const Route = createFileRoute("/planning-tools")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, path: "/planning-tools" }),
    links: canonical("/planning-tools"),
  }),
  component: PlanningToolsPage,
});

function PlanningToolsPage() {
  return (
    <SiteLayout>
      <JsonLd
        data={breadcrumbSchema("", [
          { name: "Home", path: "/" },
          { name: "Planning Tools", path: "/planning-tools" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Free wedding planning tools for Irish couples",
          description: DESCRIPTION,
          url: absoluteUrl("/planning-tools"),
          isPartOf: {
            "@type": "WebSite",
            name: SITE_NAME,
            url: absoluteUrl("/"),
          },
          itemListElement: TOOLS.map((tool, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(tool.to),
            name: tool.title,
            description: tool.copy,
          })),
        }}
      />

      <PageHeader
        eyebrow="Planning"
        title="Wedding planning tools"
        description="Free tools that work straight away. Checklist, budget and guest list changes save in this browser."
      >
        <Breadcrumbs items={[{ label: "Planning Tools" }]} />
      </PageHeader>

      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.title}
              to={tool.to}
              className="group rounded-xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-primary-soft text-accent-foreground">
                <tool.icon className="size-5" />
              </span>
              <h2 className="mt-4 font-serif text-2xl group-hover:text-primary">{tool.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{tool.copy}</p>
            </Link>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
