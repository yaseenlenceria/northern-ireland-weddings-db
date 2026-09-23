import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Mail, HelpCircle, Building2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/site/JsonLd";
import { submitEnquiry } from "@/lib/enquiries.functions";
import { pageMeta, canonical } from "@/lib/seo";

const TITLE = "Contact WedHQ | Wedding Directory Help & Listing Support";
const DESCRIPTION =
  "Contact the WedHQ team for help with the UK and Ireland wedding directory — listing claims, profile corrections, supplier enquiries or the free wedding planning tools.";

const FAQS = [
  {
    q: "How do I claim or correct my listing?",
    a: "Send your business name and the change you need through the form below. Listings were compiled from public directory data, so corrections are welcome and free.",
  },
  {
    q: "Does it cost anything to be listed?",
    a: "No. Listing your wedding business and receiving enquiries through WedHQ is free.",
  },
  {
    q: "How do enquiries reach suppliers?",
    a: "Every profile has an enquiry form. Submissions are stored against that listing and passed to the supplier's contact address.",
  },
  {
    q: "Can I remove my business?",
    a: "Yes. Ask through the form and we'll remove the listing.",
  },
  {
    q: "Where does WedHQ cover?",
    a: "The directory covers the whole of Ireland and the United Kingdom — venues and suppliers across all counties, regions and postcodes.",
  },
  {
    q: "How do I ask about my personal data?",
    a: "Send a message with the subject \"Privacy request\" and we'll handle access, correction or deletion under our privacy notice, usually within one month.",
  },
];

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, path: "/contact" }),
    links: canonical("/contact"),
  }),
  component: ContactPage,
});

function ContactPage() {
  const sendEnquiry = useServerFn(submitEnquiry);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSending(true);
    try {
      await sendEnquiry({
        data: {
          kind: "contact",
          name: String(form.get("name") ?? ""),
          email: String(form.get("email") ?? ""),
          message: String(form.get("message") ?? ""),
          metadata: { subject: String(form.get("subject") ?? "General") },
        },
      });
    } catch {
      setSending(false);
      toast.error("That didn't send. Please try again.");
      return;
    }

    setSending(false);
    setSent(true);
    toast.success("Message sent — thanks.");
  };

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
        eyebrow="Contact"
        title="Talk to WedHQ"
        description="Listing questions, corrections, profile claims, privacy requests or help with the planning tools — this reaches the team directly. For supplier availability and pricing, use the enquiry form on the supplier's profile."
      >
        <Breadcrumbs items={[{ label: "Contact" }]} />
      </PageHeader>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-6">
            <div className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Building2 className="size-5" />
              </span>
              <div>
                <h2 className="font-serif text-lg">Suppliers</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Want to be listed?{" "}
                  <Link to="/list-your-business" className="text-primary underline">
                    Request a listing
                  </Link>{" "}
                  — it's free and takes two minutes.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                <HelpCircle className="size-5" />
              </span>
              <div>
                <h2 className="font-serif text-lg">Couples</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  For supplier availability and pricing, use the enquiry form on their profile — it
                  goes straight to them and gets a faster answer.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-ivory p-6">
              <h2 className="font-serif text-xl">Common questions</h2>
              <dl className="mt-4 space-y-4">
                {FAQS.map((f) => (
                  <div key={f.q}>
                    <dt className="text-sm font-medium">{f.q}</dt>
                    <dd className="mt-1 text-sm text-muted-foreground">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {sent ? (
            <div className="self-start rounded-xl border border-primary/30 bg-primary-soft p-8 text-center">
              <h2 className="font-serif text-2xl">Message sent</h2>
              <p className="mt-2 text-sm text-accent-foreground">
                We read everything that comes in and reply by email.
              </p>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="grid gap-4 self-start rounded-xl border border-border bg-card p-6 shadow-soft"
            >
              <h2 className="flex items-center gap-2 font-serif text-xl">
                <Mail className="size-5 text-primary" /> Send a message
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="c-name">Your name</Label>
                  <Input id="c-name" name="name" required autoComplete="name" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="c-email">Email</Label>
                  <Input id="c-email" name="email" type="email" required autoComplete="email" />
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="c-subject">Subject</Label>
                <Input id="c-subject" name="subject" placeholder="Listing correction, help, …" />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="c-message">Message</Label>
                <Textarea id="c-message" name="message" rows={6} required />
              </div>

              <Button type="submit" size="lg" disabled={sending}>
                {sending ? "Sending…" : "Send message"}
              </Button>
            </form>
          )}
        </div>
      </Section>
    </SiteLayout>
  );
}
