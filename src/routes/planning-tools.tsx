import { createFileRoute, Link } from "@tanstack/react-router";
import { Calculator, CalendarCheck, ClipboardList, Heart, Users } from "lucide-react";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { canonical, pageMeta } from "@/lib/seo";

const TITLE = "Free Wedding Planning Tools for Irish Couples | WedList Ireland";
const DESCRIPTION =
  "Checklist, budget calculator, guest list planner, supplier shortlist and running order — free planning tools that save as you go.";

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
    to: "/dashboard" as const,
    icon: Heart,
    title: "Supplier Shortlist",
    copy: "Everything you've saved from the directory, in one place to compare.",
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
      <PageHeader
        eyebrow="Planning"
        title="Wedding planning tools"
        description="Free with a couple account. Everything saves to your account so you can pick it back up on any device."
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
