import { createFileRoute, Link } from "@tanstack/react-router";
import { PenLine, ShieldCheck, RefreshCcw, Flag, Ban } from "lucide-react";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/site/JsonLd";
import { pageMeta, canonical } from "@/lib/seo";

const TITLE = "Editorial Team & Policies | WedHQ";
const DESCRIPTION =
  "How the WedHQ wedding guides are written, reviewed and corrected, and how we moderate supplier and venue reviews on the directory.";

const FAQS = [
  {
    q: "Who writes the WedHQ wedding guides?",
    a: "Guides are researched and written in-house, drawing on published pricing from listed venues and suppliers, and checked against current practices in Ireland and the UK before publication.",
  },
  {
    q: "Do businesses pay to be featured in guides?",
    a: "No. Editorial coverage is independent of commercial relationships. A business cannot pay to be included in, or removed from, a guide.",
  },
  {
    q: "How are reviews moderated?",
    a: "Reviews are published from verified submission channels and attributed where a source is known. We remove reviews that contain abuse, spam or personal data, and businesses cannot edit or delete reviews.",
  },
  {
    q: "How do I report an error or request a correction?",
    a: "Use the contact form and choose a correction subject. We review every request and update the page with a fix, typically within a few working days.",
  },
];

export const Route = createFileRoute("/information/editorial-team")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, path: "/information/editorial-team" }),
    links: canonical("/information/editorial-team"),
  }),
  component: EditorialPage,
});

const POLICIES = [
  {
    icon: PenLine,
    title: "Independent writing",
    body: "Guides are written for readers, not advertisers. Recommendations are based on what helps couples compare venues and suppliers — capacity, timing, realistic costs — not on who pays us.",
  },
  {
    icon: ShieldCheck,
    title: "Accuracy checks",
    body: "Figures in guides (costs, booking lead times, typical capacities) are checked against published profile data before a guide goes live, and revisited when prices change materially.",
  },
  {
    icon: RefreshCcw,
    title: "Corrections",
    body: "When something is wrong, we fix it and say so. Businesses and couples can request a correction at any time through the contact page — it's free and there's no queue.",
  },
  {
    icon: Flag,
    title: "Review moderation",
    body: "We remove reviews containing hate speech, threats, spam or private personal details, and we investigate reports of fake reviews. Otherwise reviews stay up, including negative ones.",
  },
  {
    icon: Ban,
    title: "What we don't do",
    body: "We don't sell editorial placements, we don't let businesses cherry-pick reviews, and we don't rank listings higher in exchange for payment. Search ordering is the same for everyone.",
  },
];

function EditorialPage() {
  return (
    <SiteLayout>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />

      <PageHeader
        eyebrow="Editorial"
        title="Editorial team & policies"
        description="How WedHQ content is written, checked and corrected — and the rules that keep reviews honest across the directory."
      >
        <Breadcrumbs items={[{ label: "Editorial team & policies" }]} />
      </PageHeader>

      <Section>
        <div className="max-w-3xl space-y-5 text-muted-foreground">
          <p>
            WedHQ publishes wedding guides alongside its directory — practical reading on what
            weddings cost, when to book each supplier and how to compare venues. Because couples
            make real decisions from these pages, we hold them to the same standard as the
            directory itself: accurate, independent and fixable.
          </p>
          <p>
            The same standards apply to the reviews shown on venue and supplier profiles. Reviews
            belong to the couples who wrote them; businesses can respond through their profile
            information but cannot rewrite the record.
          </p>
        </div>
      </Section>

      <Section tone="ivory" title="Our editorial policies">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POLICIES.map((policy) => (
            <li key={policy.title} className="rounded-xl border border-border bg-card p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary-soft text-primary">
                <policy.icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-serif text-lg">{policy.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{policy.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Frequently asked questions">
        <div className="max-w-3xl">
          <dl className="space-y-6">
            {FAQS.map((f) => (
              <div key={f.q} className="rounded-xl border border-border bg-ivory p-6">
                <dt className="font-medium">{f.q}</dt>
                <dd className="mt-2 text-sm text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-sm text-muted-foreground">
            Want to report an error, dispute a review or suggest a guide topic?{" "}
            <Link to="/contact" className="text-primary underline">
              Contact the editorial team
            </Link>
            .
          </p>
        </div>
      </Section>
    </SiteLayout>
  );
}
