import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, ListChecks } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CtaBand, PageHeader, Section, SiteLayout } from "@/components/site/Layout";
import { LeadForm } from "@/components/site/LeadForm";
import { JsonLd } from "@/components/site/JsonLd";
import { canonical, pageMeta } from "@/lib/seo";

const PATH = "/wedding-seo-checklist";

const CHECKLIST_GROUPS: Array<{ title: string; items: string[] }> = [
  {
    title: "Visibility foundations",
    items: [
      "Google indexing — confirm your key pages are actually in Google's index",
      "Search visibility — search your services plus your county and see who appears (and whether you do)",
      "Search Console — verified and set up, with no critical errors or missing pages",
      "Analytics — a working analytics setup so you can see what traffic you get and where it goes",
      "Technical SEO — clean URLs, working redirects, no broken links or duplicate pages",
    ],
  },
  {
    title: "Local signals",
    items: [
      "Local SEO — your counties and service areas are clearly stated on your key pages",
      "Google Business Profile — claimed, correctly categorised, with wedding photos and service details",
      "Location targeting — a dedicated, substantive page for each county or area you serve",
      "Reviews — recent Google reviews from real couples, with replies",
      "Trust signals — testimonials, real photos and consistent business details across the web",
    ],
  },
  {
    title: "Pages & content",
    items: [
      "Service pages — one clear page per service, written around what couples ask",
      "Page titles — unique titles that read like real searches, not “Home” or “Welcome”",
      "Headings — one H1 per page, logical H2/H3 structure beneath it",
      "Internal links — your services, locations, blog and contact pages link to each other sensibly",
      "Content quality — enough genuine, useful copy on each page for Google to understand it",
      "Real wedding content — published examples of your work with venues and counties named",
      "FAQs — the questions couples actually ask, answered on your site",
    ],
  },
  {
    title: "Performance & conversion",
    items: [
      "Image optimisation — compressed images with descriptive alt text",
      "Mobile performance — the site is genuinely comfortable to use on a phone",
      "Website speed — pages load in a couple of seconds on mobile",
      "Conversion CTAs — every page has one obvious, low-pressure next step",
    ],
  },
];

const TOTAL_CHECKS = CHECKLIST_GROUPS.reduce((sum, group) => sum + group.items.length, 0);

export const Route = createFileRoute("/wedding-seo-checklist")({
  head: () => ({
    meta: [
      ...pageMeta({
        title: "The 21-Point Wedding Website SEO Checklist — Ireland Edition | Vow Visibility",
        description:
          "Find out whether couples can actually find your wedding business on Google. A free 21-point checklist covering indexing, local SEO, pages, speed and conversion.",
        path: PATH,
      }),
      ...canonical(PATH),
    ],
  }),
  component: ChecklistPage,
});

function ChecklistPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Free Resource"
        title={`The ${TOTAL_CHECKS}-Point Wedding Website SEO Checklist — Ireland Edition`}
        description="Find out whether couples can actually find your wedding business on Google. Twenty-one practical checks — no jargon, no tools expertise needed."
      >
        <Breadcrumbs items={[{ name: "Wedding SEO Checklist" }]} />
      </PageHeader>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex items-center gap-3 rounded-xl border border-gold/40 bg-accent/40 px-5 py-4">
              <ListChecks className="h-6 w-6 shrink-0 text-gold" aria-hidden="true" />
              <p className="text-sm leading-relaxed">
                <span className="font-medium">Work through it in an afternoon.</span> Each point is
                a quick check with a clear pass or fail — and a fix you can act on.
              </p>
            </div>
            {CHECKLIST_GROUPS.map((group) => (
              <div key={group.title} className="mt-10">
                <h2 className="text-2xl leading-snug">{group.title}</h2>
                <ul className="mt-5 space-y-3">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 rounded-lg border border-border bg-card px-4 py-3.5"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 text-gold"
                        aria-hidden="true"
                      />
                      <span className="leading-relaxed text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border bg-card p-6 shadow-soft sm:p-8">
              <h2 className="text-xl">Get the free checklist</h2>
              <LeadForm variant="checklist" />
            </div>
          </div>
        </div>
      </Section>

      <CtaBand
        title="Scored a few fails? That's exactly what the audit is for."
        description="Request a free SEO audit and we'll prioritise the fixes for your website, your counties and your competition."
        primaryLabel="Get a Free SEO Audit"
        primaryTo="/free-seo-audit"
        secondaryLabel="Read the SEO Guides"
        secondaryTo="/resources"
      />
    </SiteLayout>
  );
}
