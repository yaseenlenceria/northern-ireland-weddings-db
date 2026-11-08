import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/site/JsonLd";
import { pageMeta, canonical } from "@/lib/seo";

const TITLE = "Cookie Notice | WedHQ";
const DESCRIPTION =
  "The cookies and similar technologies WedHQ uses, what each one is for, and how to manage or disable them in your browser. Last updated 8 November 2026.";

const COOKIES = [
  {
    name: "Microsoft Clarity (_clck, _clsk)",
    type: "Optional analytics",
    purpose:
      "Heatmaps and session recordings help us understand site use. Clarity loads only after you accept analytics. Microsoft manages its cookie lifetimes.",
    duration: "See Microsoft Clarity documentation for current lifetimes.",
  },
  {
    name: "wedhq-analytics-consent",
    type: "Preference (local storage)",
    purpose: "Remembers whether you accepted or rejected optional analytics.",
    duration: "Until you change your choice or clear browser storage.",
  },
  {
    name: "Sign-in session",
    type: "Strictly necessary",
    purpose:
      "Keeps you signed in to your WedHQ account and protects account actions from forgery. Set by our authentication provider when you log in.",
    duration: "While you are signed in, plus a short period afterwards.",
  },
  {
    name: "Security and load balancing",
    type: "Strictly necessary",
    purpose:
      "Set by our hosting platform to route your requests correctly and protect the Site from abuse.",
    duration: "Session only (deleted when you close your browser).",
  },
];

const FAQS = [
  {
    q: "Does WedHQ use advertising or tracking cookies?",
    a: "We use Microsoft Clarity for optional analytics, including heatmaps and session recordings, only after you accept analytics. Advertising storage consent is not granted. You can change your choice using Cookie settings.",
  },
  {
    q: "How do planning tools store my data?",
    a: "Checklist, budget, guest list and timeline entries are stored in your browser's local storage and, when you're signed in, against your account. This storage is not a cookie and is not shared with advertisers.",
  },
  {
    q: "How do I disable cookies?",
    a: "You can block or delete cookies in your browser settings. The Site will still work for browsing and search, but you won't be able to stay signed in.",
  },
];

export const Route = createFileRoute("/information/cookies")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, path: "/information/cookies" }),
    links: canonical("/information/cookies"),
  }),
  component: CookiesPage,
});

function CookiesPage() {
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
        eyebrow="Legal"
        title="Cookie notice"
        description="The cookies WedHQ sets, what each one does, and how to control them. Last updated 8 November 2026."
      >
        <Breadcrumbs items={[{ label: "Legal hub", to: "/legal" }, { label: "Cookie notice" }]} />
      </PageHeader>

      <Section>
        <div className="max-w-3xl space-y-5 text-muted-foreground">
          <p>
            This notice explains how WedHQ uses cookies and similar technologies on wedhq.co.uk (the
            "Site"). It should be read alongside our Privacy notice.
          </p>
          <p>
            Cookies are small text files a website stores on your device. We keep our use of them
            limited to essential functions and optional Microsoft Clarity analytics. Analytics stays
            off until you accept it. Use Cookie settings to accept, reject or withdraw your choice.
          </p>
        </div>
      </Section>

      <Section tone="ivory" title="Cookies we use">
        <div className="max-w-3xl overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th scope="col" className="py-3 pr-4 font-medium">
                  Cookie
                </th>
                <th scope="col" className="py-3 pr-4 font-medium">
                  Type
                </th>
                <th scope="col" className="py-3 pr-4 font-medium">
                  Purpose
                </th>
                <th scope="col" className="py-3 font-medium">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody>
              {COOKIES.map((cookie) => (
                <tr key={cookie.name} className="border-b border-border/60 align-top">
                  <td className="py-3 pr-4 font-medium">{cookie.name}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{cookie.type}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{cookie.purpose}</td>
                  <td className="py-3 text-muted-foreground">{cookie.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Managing cookies">
        <div className="max-w-3xl space-y-5 text-muted-foreground">
          <p>
            Strictly necessary cookies can't be switched off through our Site because the Site
            wouldn't function without them, but you can block or delete all cookies through your
            browser settings — usually under "Privacy" or "Site settings". Blocking them means you
            can still browse, search and read profiles, but you'll need to sign in again each visit.
          </p>
          <p>
            Use Cookie settings to change your analytics preference. Rejecting analytics does not
            prevent you from browsing, searching or using the planning tools.
          </p>
        </div>
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
          <p className="mt-8 text-sm text-muted-foreground">
            Questions about cookies?{" "}
            <Link to="/contact" className="text-primary underline">
              Contact us
            </Link>
            . Related:{" "}
            <Link to="/information/privacy" className="text-primary underline">
              Privacy notice
            </Link>{" "}
            and{" "}
            <Link to="/information/your-privacy-choices" className="text-primary underline">
              Your privacy choices
            </Link>
            .
          </p>
        </div>
      </Section>
    </SiteLayout>
  );
}
