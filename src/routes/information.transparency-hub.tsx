import { createFileRoute, Link } from "@tanstack/react-router";
import { Database, Star, PencilLine, HandCoins, Search } from "lucide-react";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/site/JsonLd";
import { pageMeta, canonical } from "@/lib/seo";

const TITLE = "Transparency Hub | How WedHQ Works";
const DESCRIPTION =
  "How WedHQ sources its venue and supplier listings, how reviews and ratings work, why listings are free, and how corrections and ranking work across the directory.";

const FAQS = [
  {
    q: "Where does WedHQ listing data come from?",
    a: "Profiles are compiled from public business information and enriched by the businesses themselves. Businesses can claim their listing at any time to correct or complete it, free of charge.",
  },
  {
    q: "Are businesses paying to appear?",
    a: "No. Standard listings are free, and ranking in search results is not for sale. Every listing is ordered by the same relevance and quality signals.",
  },
  {
    q: "Where do reviews come from?",
    a: "Reviews are shown from stored review data and attributed where a source is known, or submitted directly by couples. Businesses cannot add, edit or remove reviews themselves.",
  },
  {
    q: "Does WedHQ take commission on bookings?",
    a: "No. Enquiries go directly from a couple to the business. We never sit in the transaction and never take a percentage of a booking.",
  },
  {
    q: "How do I correct wrong information?",
    a: "Use the contact page with the subject 'Listing correction'. Corrections are reviewed and applied free, typically within a few working days.",
  },
];

export const Route = createFileRoute("/information/transparency-hub")({
  head: () => ({
    meta: pageMeta({
      title: TITLE,
      description: DESCRIPTION,
      path: "/information/transparency-hub",
    }),
    links: canonical("/information/transparency-hub"),
  }),
  component: TransparencyPage,
});

const AREAS = [
  {
    icon: Database,
    title: "Listing data",
    body: "Directory profiles are built from public business information — name, category, location, contact details and descriptions — and kept current through business-submitted corrections. We don't invent profile fields, and a business can claim or remove its listing at any time.",
  },
  {
    icon: Star,
    title: "Reviews & ratings",
    body: "Star ratings and review counts on profiles reflect stored review data from attributed sources or submitted directly by couples. We moderate for abuse and fake reviews, but businesses can't edit the record.",
  },
  {
    icon: HandCoins,
    title: "Money & fees",
    body: "Listings are free, enquiries are free and planning tools are free. WedHQ does not take commission on bookings and does not charge couples. Where paid supplier options are introduced, they're always clearly labelled and never affect search ranking.",
  },
  {
    icon: Search,
    title: "Search & ranking",
    body: "Results are ordered by relevance to your search — what you asked for, where you asked for it and how complete the profile is. No business can pay to move up the results, and we don't run pay-per-click placements inside the directory.",
  },
  {
    icon: PencilLine,
    title: "Corrections & disputes",
    body: "Anyone can report an error through the contact page. Businesses can claim their listing to update it directly. Disputed reviews are investigated and removed only when they break our moderation rules, never simply because a business dislikes them.",
  },
];

function TransparencyPage() {
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
        eyebrow="Transparency"
        title="How WedHQ works"
        description="Where our data comes from, how reviews and search ranking work, and what we do — and don't — charge for."
      >
        <Breadcrumbs items={[{ label: "Transparency hub" }]} />
      </PageHeader>

      <Section>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map((area) => (
            <li key={area.title} className="rounded-xl border border-border bg-ivory p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary-soft text-primary">
                <area.icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-serif text-lg">{area.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{area.body}</p>
            </li>
          ))}
          <li className="rounded-xl border border-primary/30 bg-primary-soft p-6">
            <h2 className="font-serif text-lg">Related documents</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/information/editorial-team" className="text-primary underline">
                  Editorial team & policies
                </Link>
              </li>
              <li>
                <Link to="/information/privacy" className="text-primary underline">
                  Privacy notice
                </Link>
              </li>
              <li>
                <Link to="/information/terms-of-use" className="text-primary underline">
                  Terms of use
                </Link>
              </li>
              <li>
                <Link to="/information/legal-hub" className="text-primary underline">
                  Legal hub
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </Section>

      <Section tone="ivory" title="Common questions">
        <div className="max-w-3xl">
          <dl className="space-y-6">
            {FAQS.map((f) => (
              <div key={f.q} className="rounded-xl border border-border bg-card p-6">
                <dt className="font-medium">{f.q}</dt>
                <dd className="mt-2 text-sm text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>
    </SiteLayout>
  );
}
