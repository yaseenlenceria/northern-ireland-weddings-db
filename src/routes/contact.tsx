import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PageHeader, Section, SiteLayout } from "@/components/site/Layout";
import { LeadForm } from "@/components/site/LeadForm";
import { JsonLd } from "@/components/site/JsonLd";
import { absoluteUrl, breadcrumbSchema, canonical, pageMeta } from "@/lib/seo";

const PATH = "/contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      ...pageMeta({
        title: "Contact Vow Visibility | Wedding SEO & Marketing",
        description:
          "Get in touch with Vow Visibility about SEO and digital marketing for your Irish wedding business. Ask a question or request a website review.",
        path: PATH,
      }),
      ...canonical(PATH),
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Contact"
        title="Talk to us about your website's visibility"
        description="Whether you have a question about SEO, want a second opinion, or you're ready for a review of your website — send a message and we'll come back to you."
      >
        <Breadcrumbs items={[{ name: "Contact" }]} />
      </PageHeader>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl">What happens next?</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                You'll hear back from a real person — usually within one or two working days. If
                you're asking about working together, we may ask for your website and main service
                area so we can give you a useful first answer, not a sales pitch.
              </p>
            </div>
            <div>
              <h2 className="text-xl">Prefer to skip the conversation?</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Request the{" "}
                <a
                  href="/free-seo-audit"
                  className="font-medium text-gold underline-offset-4 hover:underline"
                >
                  free SEO audit
                </a>{" "}
                instead. You'll get a written review of your website's visibility with clear,
                prioritised recommendations — no call required.
              </p>
            </div>
            <div>
              <h2 className="text-xl">Looking for something free to start with?</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                The{" "}
                <a
                  href="/wedding-seo-checklist"
                  className="font-medium text-gold underline-offset-4 hover:underline"
                >
                  21-Point Wedding Website SEO Checklist
                </a>{" "}
                takes an afternoon to work through and will tell you more about your website than
                most agencies' first proposals.
              </p>
            </div>
          </div>
          <LeadForm variant="contact" />
        </div>
      </Section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: PATH },
        ])}
      />
    </SiteLayout>
  );
}
