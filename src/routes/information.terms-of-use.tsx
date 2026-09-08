import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { pageMeta, canonical } from "@/lib/seo";

const TITLE = "Terms of Use | WedHQ";
const DESCRIPTION =
  "The terms that govern your use of WedHQ, the UK and Ireland wedding directory, including accounts, listings, content and acceptable use. Last updated 8 September 2026.";

export const Route = createFileRoute("/information/terms-of-use")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, path: "/information/terms-of-use" }),
    links: canonical("/information/terms-of-use"),
  }),
  component: TermsPage,
});

const SECTIONS = [
  {
    heading: "1. About these terms",
    body: [
      "These terms of use (\"Terms\") are a legal agreement between you and WedHQ (\"we\", \"us\") governing your use of the website at wedhq.co.uk (the \"Site\"). By accessing or using the Site you accept these Terms. If you do not accept them, please do not use the Site.",
      "The Site is operated in Ireland and the United Kingdom. These Terms are governed by the laws of Northern Ireland, and the courts of Northern Ireland have exclusive jurisdiction over any dispute, unless mandatory consumer law gives you different rights.",
    ],
  },
  {
    heading: "2. What WedHQ provides",
    body: [
      "WedHQ is a wedding directory. We publish profiles of wedding venues and suppliers across Ireland and the United Kingdom, along with reviews, wedding fairs, planning guides and free planning tools (checklist, budget calculator, guest list and timeline).",
      "Enquiries you send through a profile go directly to the listed business. WedHQ is not a party to any contract between you and a venue or supplier, and we are not an agent of any listed business.",
    ],
  },
  {
    heading: "3. Accounts",
    body: [
      "Some features — saving listings and shortlists — require an account. You must provide accurate information when registering, keep your login credentials secure, and tell us promptly if you suspect unauthorised use of your account.",
      "We may suspend or close an account that breaches these Terms, that is used to send abusive or fraudulent enquiries, or that misrepresents a business.",
    ],
  },
  {
    heading: "4. Directory listings and content",
    body: [
      "Directory profiles are compiled from public business information and updated by the businesses themselves. While we work hard to keep the directory accurate and current, we do not guarantee that any listing, price, capacity, availability or review is complete, current or error-free. Always confirm details directly with the venue or supplier before booking.",
      "The content on the Site (text, design, software and compiled directory data) belongs to WedHQ or its licensors and is protected by copyright and database rights. You may browse and share links to pages for personal, non-commercial use. You may not scrape, bulk-download, reproduce or republish directory data without our written permission.",
    ],
  },
  {
    heading: "5. Acceptable use",
    body: [
      "You agree not to: send false, misleading or abusive enquiries; submit fake reviews or manipulate ratings; attempt to disrupt or probe the Site's security; scrape or harvest data automatically; use the Site for any unlawful purpose; or misrepresent your identity or affiliation with a business.",
      "We may remove content or restrict access where we reasonably believe these rules have been broken.",
    ],
  },
  {
    heading: "6. Reviews",
    body: [
      "Reviews reflect the opinions of the couples who wrote them, not WedHQ. By submitting a review you confirm it is your genuine experience, that it is accurate to the best of your knowledge, and that you grant us a non-exclusive licence to publish it on the Site.",
      "We moderate reviews under our editorial policies and may remove reviews that contain abuse, spam, personal data or fake content. Businesses cannot pay to remove reviews.",
    ],
  },
  {
    heading: "7. Planning tools",
    body: [
      "The checklist, budget calculator, guest list planner and timeline are provided free for personal planning use. They are estimates and organisational aids only — they are not financial, legal or event-planning advice, and figures such as budget percentages are illustrative.",
    ],
  },
  {
    heading: "8. Intellectual property complaints",
    body: [
      "If you believe content on the Site infringes your rights, contact us with enough detail to identify the material and your claim. We will review and, where appropriate, remove or amend the content.",
    ],
  },
  {
    heading: "9. Liability",
    body: [
      "Nothing in these Terms limits liability that cannot be limited by law, including liability for death or personal injury caused by negligence, or liability under consumer protection law.",
      "Subject to that, the Site is provided \"as is\". We are not liable for: the acts, omissions, availability or quality of any listed venue or supplier; losses arising from decisions made using directory information; or indirect or consequential losses. To the extent permitted by law, our total liability relating to the Site is limited to £100.",
    ],
  },
  {
    heading: "10. Changes",
    body: [
      "We may update these Terms from time to time. The date at the top shows when they were last revised. Material changes will be flagged on the Site. Continuing to use the Site after changes take effect means you accept the updated Terms.",
    ],
  },
  {
    heading: "11. Contact",
    body: [
      "Questions about these Terms can be sent through the contact page.",
    ],
  },
];

function TermsPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Legal"
        title="Terms of use"
        description="The agreement that governs browsing and using WedHQ. Last updated 8 September 2026."
      >
        <Breadcrumbs
          items={[{ label: "Legal hub", to: "/information/legal-hub" }, { label: "Terms of use" }]}
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
            <Link to="/information/terms-of-purchase" className="text-primary underline">
              Terms of purchase
            </Link>
            ,{" "}
            <Link to="/information/privacy" className="text-primary underline">
              Privacy notice
            </Link>{" "}
            and{" "}
            <Link to="/information/cookies" className="text-primary underline">
              Cookie notice
            </Link>
            .
          </p>
        </article>
      </Section>
    </SiteLayout>
  );
}
