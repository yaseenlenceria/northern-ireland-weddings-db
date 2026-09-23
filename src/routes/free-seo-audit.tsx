import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PageHeader, Section, SiteLayout } from "@/components/site/Layout";
import { FaqSection } from "@/components/site/FaqSection";
import { LeadForm } from "@/components/site/LeadForm";
import { JsonLd } from "@/components/site/JsonLd";
import { canonical, faqSchema, pageMeta } from "@/lib/seo";
import type { Faq } from "@/lib/site";

const PATH = "/free-seo-audit";

const AUDIT_FAQS: Faq[] = [
  {
    question: "Is the audit really free?",
    answer:
      "Yes — genuinely. We review your website and send you the findings with no cost and no obligation. If you'd like help implementing the recommendations, that's a separate conversation, but the audit is yours either way.",
  },
  {
    question: "What do you actually look at?",
    answer:
      "Your website's visibility on Google, technical health, local SEO signals, Google Business Profile, page structure, content and conversion opportunities — plus what your main local competitors are doing better.",
  },
  {
    question: "How long does it take?",
    answer:
      "You'll usually receive your audit summary within a few working days, depending on demand. It's a written review, so there's no call required.",
  },
  {
    question: "Will you tell me what to do even if I never hire you?",
    answer:
      "Yes. The audit is written so you (or whoever maintains your website) can act on it yourselves. Many businesses do exactly that — and come back when they want help going further.",
  },
  {
    question: "Why do you need my website URL?",
    answer:
      "The audit is a real review of your actual website, not a generic checklist. Your URL lets us look at your pages, indexing, speed and visibility before we write a single recommendation.",
  },
];

export const Route = createFileRoute("/free-seo-audit")({
  head: () => ({
    meta: [
      ...pageMeta({
        title: "Free SEO Audit for Irish Wedding Businesses | Vow Visibility",
        description:
          "Get a free, honest SEO audit of your wedding business website: rankings, technical issues, local visibility and conversion opportunities. No obligation.",
        path: PATH,
      }),
      ...canonical(PATH),
    ],
  }),
  component: FreeSeoAudit,
});

function FreeSeoAudit() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Free SEO Audit"
        title="See What Is Stopping Your Website From Ranking"
        description="A free, honest review of your wedding business website — what's working, what's broken, and the opportunities your competitors are taking while you read this."
      >
        <Breadcrumbs items={[{ name: "Free SEO Audit" }]} />
      </PageHeader>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-2xl leading-snug">What your audit covers</h2>
            <ul className="mt-5 space-y-4">
              {[
                "Where your website ranks today for the searches that matter in your counties",
                "Technical issues — indexing, speed, mobile — that quietly cap your visibility",
                "Your Google Business Profile and local search presence",
                "Service and location pages: what's missing, what's underperforming",
                "Content opportunities competitors are winning with",
                "Conversion review: why visitors might be leaving without enquiring",
              ].map((point) => (
                <li key={point} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
                  <span className="leading-relaxed text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-xl border border-border bg-card p-6">
              <h3 className="text-lg">No pressure, no hard sell</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                You'll get the findings in writing, with the fixes prioritised. Use them however you
                like — implement them yourself, hand them to your web person, or talk to us about
                doing the work. The audit stands on its own.
              </p>
            </div>
          </div>
          <div id="request">
            <LeadForm variant="audit" />
          </div>
        </div>
      </Section>

      <Section tone="ivory">
        <FaqSection faqs={AUDIT_FAQS} title="Free audit — questions" />
      </Section>

      <JsonLd data={faqSchema(AUDIT_FAQS)} />
    </SiteLayout>
  );
}
