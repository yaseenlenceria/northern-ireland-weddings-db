import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, Pencil, Trash2, Package, Ban, ShieldCheck } from "lucide-react";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { pageMeta, canonical } from "@/lib/seo";

const TITLE = "Your Privacy Choices | WedHQ";
const DESCRIPTION =
  "Exercise your UK and EU data rights on WedHQ: access, correct, delete or export your personal data, object to processing, and manage cookie settings. Last updated 8 September 2026.";

export const Route = createFileRoute("/information/your-privacy-choices")({
  head: () => ({
    meta: pageMeta({
      title: TITLE,
      description: DESCRIPTION,
      path: "/information/your-privacy-choices",
    }),
    links: canonical("/information/your-privacy-choices"),
  }),
  component: PrivacyChoicesPage,
});

const CHOICES = [
  {
    icon: Eye,
    title: "Access your data",
    body: "Ask for a copy of the personal data we hold about you — account details, enquiries you've sent, saved listings and planning-tool entries.",
  },
  {
    icon: Pencil,
    title: "Correct your data",
    body: "Tell us if something is wrong and we'll fix it. You can also update most account details yourself at any time.",
  },
  {
    icon: Trash2,
    title: "Delete your data",
    body: "Ask us to delete your account and the data attached to it. Enquiries already passed to businesses are their records too, and we'll explain what we can and can't remove.",
  },
  {
    icon: Package,
    title: "Export your data",
    body: "Receive a portable copy of your data — for example your guest list or budget — in a structured, commonly used format.",
  },
  {
    icon: Ban,
    title: "Object or restrict",
    body: "Object to processing based on legitimate interests, or ask us to restrict processing while a question about your data is resolved.",
  },
  {
    icon: ShieldCheck,
    title: "Withdraw consent",
    body: "Where we ever rely on consent, you can withdraw it at any time. This doesn't affect anything processed before you withdrew.",
  },
];

function PrivacyChoicesPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Privacy"
        title="Your privacy choices"
        description="The data rights available to you on WedHQ and exactly how to use them. Last updated 8 September 2026."
      >
        <Breadcrumbs
          items={[
            { label: "Legal hub", to: "/information/legal-hub" },
            { label: "Your privacy choices" },
          ]}
        />
      </PageHeader>

      <Section>
        <div className="max-w-3xl space-y-5 text-muted-foreground">
          <p>
            Under UK GDPR and the EU GDPR you have a set of rights over your personal data. This
            page explains each one in plain language and how to exercise it on WedHQ. It forms part
            of our Privacy notice.
          </p>
        </div>
      </Section>

      <Section tone="ivory" title="Your rights">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CHOICES.map((choice) => (
            <li key={choice.title} className="rounded-xl border border-border bg-card p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary-soft text-primary">
                <choice.icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-serif text-lg">{choice.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{choice.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="How to make a request">
        <div className="max-w-3xl space-y-5 text-muted-foreground">
          <p>
            Send your request through the contact page, using the subject \"Privacy request\", and
            tell us which right you want to exercise. To protect your account we may ask you to
            confirm the email address associated with it before we act.
          </p>
          <p>
            We respond within one month. If a request is complex or numerous, we may extend that by
            up to two further months and we'll tell you why within the first month.
          </p>
          <p>
            If you're not happy with how we handle your request, you can complain to the UK
            Information Commissioner's Office at ico.org.uk or the Irish Data Protection Commission
            at dataprotection.ie. We'd appreciate the chance to put things right first.
          </p>
          <p>
            For cookie settings, see the Cookie notice — the Site sets no advertising or tracking
            cookies, so there is no tracking preference to manage.
          </p>
        </div>
      </Section>

      <Section tone="ivory">
        <div className="flex flex-col items-start gap-4 rounded-xl border border-border bg-card p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-xl">Ready to make a request?</h2>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Use the contact form with the subject \"Privacy request\" and we'll handle it from
              there.
            </p>
          </div>
          <Button asChild>
            <Link to="/contact">Make a privacy request</Link>
          </Button>
        </div>
      </Section>
    </SiteLayout>
  );
}
