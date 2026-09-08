import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { pageMeta, canonical } from "@/lib/seo";

const TITLE = "Privacy Notice | WedHQ";
const DESCRIPTION =
  "How WedHQ collects, uses and protects personal data: what we hold, why we hold it, how long we keep it, and the rights you have under UK and EU data protection law. Last updated 8 September 2026.";

export const Route = createFileRoute("/information/privacy")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, path: "/information/privacy" }),
    links: canonical("/information/privacy"),
  }),
  component: PrivacyPage,
});

const SECTIONS = [
  {
    heading: "1. Who is responsible for your data",
    body: [
      "WedHQ (\"we\", \"us\") is the data controller for personal data processed through the Site at wedhq.co.uk. You can reach us about privacy matters through the contact page.",
      "This notice explains what we collect, why, the legal bases we rely on, how long we keep it, who we share it with, and the rights you have.",
    ],
  },
  {
    heading: "2. What we collect",
    body: [
      "Account data: if you register, your name, email address and authentication identifiers held by our sign-in provider.",
      "Enquiry data: when you contact a venue or supplier through a profile, we process your name, email address, wedding date and message so the business can reply.",
      "Planning data: the checklist, budget, guest list and timeline you enter are stored so you can pick up where you left off.",
      "Saved listings: the venues and suppliers you save to a shortlist, linked to your account.",
      "Contact messages: anything you send us through the contact page.",
      "Technical data: standard server logs (IP address, browser type, pages visited) used for security and performance.",
    ],
  },
  {
    heading: "3. Why we process it and our legal bases",
    body: [
      "Providing the directory and tools — performance of the contract with you when you have an account, and our legitimate interest in running a useful directory otherwise.",
      "Passing your enquiry to a venue or supplier — your request to us to pass it on (steps taken at your request before a contract with the business).",
      "Keeping the Site secure and preventing abuse — our legitimate interest in security and fraud prevention.",
      "Complying with legal obligations — for example, tax and accounting rules where they apply.",
    ],
  },
  {
    heading: "4. How long we keep data",
    body: [
      "Enquiries are kept for as long as needed for the business to respond and for a limited period afterwards for dispute handling, then deleted.",
      "Account data is kept until you delete your account. Planning tool data is kept until you clear it or delete your account.",
      "Server logs are kept for a short operational period and then rotated.",
    ],
  },
  {
    heading: "5. Who we share data with",
    body: [
      "Listed businesses: when you send an enquiry, the details you enter are passed to that business so they can reply.",
      "Service providers: hosting (Vercel), database (Neon), authentication (Neon Auth) and analytics or error-monitoring providers that process data on our instructions under data-processing agreements.",
      "Legal and safety: where required by law, or to protect the rights, property or safety of WedHQ, its users or the public.",
      "We do not sell personal data.",
    ],
  },
  {
    heading: "6. Where data is processed",
    body: [
      "Data may be processed in the UK, the EU and the United States by our service providers. Where data leaves the UK/EEA, we rely on appropriate safeguards such as adequacy regulations or standard contractual clauses.",
    ],
  },
  {
    heading: "7. Cookies",
    body: [
      "We use a small number of cookies to keep you signed in and to keep the Site secure. See our Cookie notice for the full list and how to control them.",
    ],
  },
  {
    heading: "8. Your rights",
    body: [
      "Under UK GDPR and the EU GDPR you have the right to: access your data; have it corrected; have it erased; restrict or object to processing; receive a portable copy; and withdraw consent where processing is based on consent (without affecting earlier processing).",
      "You can also complain to a supervisory authority — in the UK, the Information Commissioner's Office (ICO) at ico.org.uk, or in Ireland, the Data Protection Commission at dataprotection.ie.",
      "See Your privacy choices for how to exercise these rights, or use the contact page for any privacy request.",
    ],
  },
  {
    heading: "9. Children's privacy",
    body: [
      "The Site is intended for adults planning a wedding. We do not knowingly collect personal data from children under 16.",
    ],
  },
  {
    heading: "10. Changes to this notice",
    body: [
      "We may update this notice from time to time. The date at the top shows when it was last revised, and material changes will be flagged on the Site.",
    ],
  },
];

function PrivacyPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Legal"
        title="Privacy notice"
        description="What personal data WedHQ collects, why, how long we keep it, and the rights you have over it. Last updated 8 September 2026."
      >
        <Breadcrumbs
          items={[{ label: "Legal hub", to: "/information/legal-hub" }, { label: "Privacy notice" }]}
        />
      </PageHeader>

      <Section>
        <article className="max-w-3xl">
          {SECTIONS.map((section) => (
            <div key={section.heading} className="mb-10 last:mb-0">
              <h2 className="font-serif text-xl">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
          <p className="mt-10 rounded-xl border border-border bg-ivory p-6 text-sm text-muted-foreground">
            Related documents:{" "}
            <Link to="/information/cookies" className="text-primary underline">
              Cookie notice
            </Link>
            ,{" "}
            <Link to="/information/your-privacy-choices" className="text-primary underline">
              Your privacy choices
            </Link>{" "}
            and{" "}
            <Link to="/information/terms-of-use" className="text-primary underline">
              Terms of use
            </Link>
            .
          </p>
        </article>
      </Section>
    </SiteLayout>
  );
}
