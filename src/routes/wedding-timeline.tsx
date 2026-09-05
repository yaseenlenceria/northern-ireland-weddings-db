import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs, breadcrumbSchema } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/site/JsonLd";
import { Button } from "@/components/ui/button";
import { pageMeta, canonical } from "@/lib/seo";

const TITLE = "Wedding Day Timeline Template (Ireland) | Wedlist.ie";
const DESCRIPTION =
  "A realistic Irish wedding day running order, from bridal prep to the last dance — with the timings photographers, bands and venues actually work to.";

type Block = { time: string; label: string; detail: string };

const MORNING: Block[] = [
  {
    time: "08:00",
    label: "Hair and makeup begins",
    detail: "Allow 45 minutes per person, bride last.",
  },
  {
    time: "10:30",
    label: "Photographer arrives",
    detail: "Details, dress, rings, stationery and prep coverage.",
  },
  {
    time: "12:00",
    label: "Into the dress",
    detail: "Leave a 30 minute buffer here — it always runs over.",
  },
  {
    time: "12:30",
    label: "Cars depart",
    detail: "Confirm travel time with your driver, not with a map app.",
  },
];

const CEREMONY: Block[] = [
  {
    time: "13:00",
    label: "Ceremony",
    detail: "Church weddings run 45–60 minutes; civil ceremonies 25–35.",
  },
  {
    time: "14:00",
    label: "Confetti and family photos",
    detail: "Group shots go faster with a named list and one wrangler.",
  },
  {
    time: "14:45",
    label: "Travel to reception",
    detail: "Guests need a clear direction and a rough arrival time.",
  },
];

const RECEPTION: Block[] = [
  {
    time: "15:30",
    label: "Drinks reception",
    detail: "90 minutes is plenty; two hours starts to drag.",
  },
  {
    time: "17:00",
    label: "Couple portraits",
    detail: "Golden hour beats a rushed slot straight after the ceremony.",
  },
  {
    time: "17:30",
    label: "Guests called for dinner",
    detail: "Venues need 20 minutes to seat a full room.",
  },
  {
    time: "18:00",
    label: "Meal service",
    detail: "Four courses take roughly two hours in an Irish hotel.",
  },
  {
    time: "20:00",
    label: "Speeches",
    detail: "Between courses or after dessert — decide with your MC.",
  },
  {
    time: "21:00",
    label: "Band on, first dance",
    detail: "Most bands play two sets to around 23:30.",
  },
  {
    time: "23:30",
    label: "DJ and afters",
    detail: "Late bar and food station keep the floor busy.",
  },
];

export const Route = createFileRoute("/wedding-timeline")({
  head: () => ({
    meta: pageMeta({
      title: TITLE,
      description: DESCRIPTION,
      path: "/wedding-timeline",
      type: "article",
    }),
    links: canonical("/wedding-timeline"),
  }),
  component: TimelinePage,
});

function Group({ title, blocks }: { title: string; blocks: Block[] }) {
  return (
    <div>
      <h2 className="text-2xl">{title}</h2>
      <ol className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
        {blocks.map((b) => (
          <li key={b.time + b.label} className="flex gap-4 p-4">
            <span className="w-16 shrink-0 font-serif text-lg text-primary">{b.time}</span>
            <div>
              <p className="font-medium">{b.label}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{b.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function TimelinePage() {
  const all = [...MORNING, ...CEREMONY, ...RECEPTION];

  return (
    <SiteLayout>
      <JsonLd
        data={breadcrumbSchema("", [
          { name: "Home", path: "/" },
          { name: "Planning Tools", path: "/planning-tools" },
          { name: "Timeline", path: "/wedding-timeline" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "Wedding day timeline for an Irish wedding",
          description: DESCRIPTION,
          step: all.map((b, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: `${b.time} — ${b.label}`,
            text: b.detail,
          })),
        }}
      />

      <PageHeader
        eyebrow="Planning tool"
        title="Wedding day timeline"
        description="A 13:00 ceremony is the most common start time in Ireland. This running order is built around it — shift every line by the same amount if yours is earlier or later."
      >
        <Breadcrumbs
          items={[{ label: "Planning Tools", to: "/planning-tools" }, { label: "Timeline" }]}
        />
      </PageHeader>

      <Section>
        <div className="mx-auto max-w-3xl space-y-10">
          <Group title="Morning" blocks={MORNING} />
          <Group title="Ceremony" blocks={CEREMONY} />
          <Group title="Reception and evening" blocks={RECEPTION} />

          <div className="rounded-xl border border-primary/30 bg-primary-soft p-6">
            <h2 className="font-serif text-xl">Three things that break a timeline</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-accent-foreground">
              <li>Under-booking hair and makeup. Count the heads, then add an hour.</li>
              <li>Group photos without a list. Ten named groups take about twenty minutes.</li>
              <li>Speeches with no cut-off. Give each speaker a time and tell your band.</li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/wedding-checklist">Open the checklist</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/find-suppliers">Find suppliers</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
