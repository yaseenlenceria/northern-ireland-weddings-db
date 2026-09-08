import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, ShoppingBag, Eye, Lock, Cookie, SlidersHorizontal, Scale } from "lucide-react";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { pageMeta, canonical } from "@/lib/seo";

const TITLE = "Legal Hub | WedHQ";
const DESCRIPTION =
  "All WedHQ legal documents in one place: terms of use, terms of purchase, privacy notice, cookie notice and your privacy choices for the UK and Ireland wedding directory.";

export const Route = createFileRoute("/information/legal-hub")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, path: "/information/legal-hub" }),
    links: canonical("/information/legal-hub"),
  }),
  component: LegalHubPage,
});

const DOCUMENTS = [
  {
    icon: FileText,
    title: "Terms of use",
    path: "/information/terms-of-use",
    body: "The agreement that governs browsing and using WedHQ, including accounts, content and acceptable use.",
  },
  {
    icon: ShoppingBag,
    title: "Terms of purchase",
    path: "/information/terms-of-purchase",
    body: "The terms for any paid services bought from WedHQ, including billing, refunds and cancellations.",
  },
  {
    icon: Lock,
    title: "Privacy notice",
    path: "/information/privacy",
    body: "What personal data we collect, why, how long we keep it and the rights you have over it.",
  },
  {
    icon: Cookie,
    title: "Cookie notice",
    path: "/information/cookies",
    body: "The cookies WedHQ sets, what each one is for, and how to control them in your browser.",
  },
  {
    icon: SlidersHorizontal,
    title: "Your privacy choices",
    path: "/information/your-privacy-choices",
    body: "How to exercise your data rights — access, correction, deletion, portability and objection.",
  },
  {
    icon: Eye,
    title: "Transparency hub",
    path: "/information/transparency-hub",
    body: "Where our listing data comes from, how reviews work and how corrections are handled.",
  },
];

function LegalHubPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Legal"
        title="Legal hub"
        description="Every WedHQ legal and policy document, collected on one page so you can find what applies to you quickly."
      >
        <Breadcrumbs items={[{ label: "Legal hub" }]} />
      </PageHeader>

      <Section>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DOCUMENTS.map((doc) => (
            <li key={doc.path} className="rounded-xl border border-border bg-ivory p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary-soft text-primary">
                <doc.icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-serif text-lg">
                <Link to={doc.path} className="hover:text-primary">
                  {doc.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{doc.body}</p>
              <Link
                to={doc.path}
                className="mt-3 inline-block text-sm font-medium text-primary underline"
              >
                Read document
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="ivory">
        <div className="flex flex-col items-start gap-4 rounded-xl border border-border bg-card p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 font-serif text-xl">
              <Scale className="size-5 text-primary" aria-hidden="true" /> Questions about a
              document?
            </h2>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              If anything in our legal documents is unclear, contact us and we'll explain it in
              plain language.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/contact">Contact us</Link>
          </Button>
        </div>
      </Section>
    </SiteLayout>
  );
}
