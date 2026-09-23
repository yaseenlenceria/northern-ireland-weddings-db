import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { pageMeta, canonical } from "@/lib/seo";

const TITLE = "Terms of Purchase | WedHQ";
const DESCRIPTION =
  "The terms for any paid WedHQ services, including billing, renewal, refunds and cancellation. Standard directory listings are free. Last updated 8 September 2026.";

export const Route = createFileRoute("/information/terms-of-purchase")({
  head: () => ({
    meta: pageMeta({
      title: TITLE,
      description: DESCRIPTION,
      path: "/information/terms-of-purchase",
    }),
    links: canonical("/information/terms-of-purchase"),
  }),
  component: TermsOfPurchasePage,
});

const SECTIONS = [
  {
    heading: "1. Scope",
    body: [
      "These terms of purchase (\"Purchase Terms\") apply when you buy a paid service from WedHQ — for example a featured or enhanced supplier listing, or any other product we label as paid (each a \"Paid Service\"). They supplement, and form part of, our Terms of Use.",
      "Standard directory listings, couple accounts and planning tools are free. Where a feature is free, these Purchase Terms do not apply to it.",
    ],
  },
  {
    heading: "2. The contract",
    body: [
      "When you order a Paid Service, your order is an offer to buy. The contract is formed when we confirm acceptance — by confirming the order on screen or by email, or by activating the Paid Service.",
      "We may decline an order, for example where a listing breaches our content rules. If payment has been taken, it will be refunded in full.",
    ],
  },
  {
    heading: "3. Prices and payment",
    body: [
      "Prices are shown on the Site or in a written quote and are exclusive of VAT unless stated. VAT and any other applicable taxes are added at the current rate.",
      "Payment is due at the time of order unless a written quote says otherwise. Paid Services are supplied in advance for the period stated at purchase (the \"Term\").",
    ],
  },
  {
    heading: "4. Renewal and cancellation",
    body: [
      "Paid Services run for the Term and do not renew automatically unless clearly stated at the point of purchase. If a Paid Service does renew automatically, you can turn off renewal at any time before the renewal date in your account or by contacting us.",
      "Cancelling renewal stops future charges; it does not refund the current Term.",
    ],
  },
  {
    heading: "5. Cooling-off and refunds",
    body: [
      "If you are a consumer in the UK or EU, you normally have 14 days from the day the contract is formed to change your mind, unless the Paid Service has been fully supplied with your express agreement during that period.",
      "Outside the cooling-off period, Fees are non-refundable except where: (a) we materially fail to supply the Paid Service and cannot fix it within a reasonable time; or (b) the law requires a refund. If a refund is due, we refund the unused portion of the Term.",
    ],
  },
  {
    heading: "6. What we promise",
    body: [
      "We supply Paid Services with reasonable skill and care and materially as described on the Site. Beyond that, Paid Services are provided as described at the point of sale — for example, a featured listing is shown in the placements described, not a guaranteed number of enquiries or bookings.",
      "We do not guarantee any level of enquiries, views or bookings from any Paid Service.",
    ],
  },
  {
    heading: "7. Your content and listing standards",
    body: [
      "Paid placement never buys exemption from our content rules. Listings, images and text must be accurate, lawful and relevant to your real wedding business. We may edit or remove content that breaches these rules, or suspend a Paid Service that does, without a refund where the breach is yours.",
      "Ranking in directory search results is not for sale. Paid Services affect placement or visibility only in the specific ways described at the point of purchase.",
    ],
  },
  {
    heading: "8. Complaints",
    body: [
      "If something goes wrong, contact us through the contact page first and we will try to put it right. Nothing in these terms affects your statutory rights as a consumer.",
    ],
  },
  {
    heading: "9. Changes",
    body: [
      "We may update these Purchase Terms from time to time. The version in force when you order applies to that order.",
    ],
  },
];

function TermsOfPurchasePage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Legal"
        title="Terms of purchase"
        description="Billing, renewal, refunds and cancellation for paid WedHQ services. Standard listings are free. Last updated 8 September 2026."
      >
        <Breadcrumbs
          items={[
            { label: "Legal hub", to: "/information/legal-hub" },
            { label: "Terms of purchase" },
          ]}
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
            <Link to="/information/terms-of-use" className="text-primary underline">
              Terms of use
            </Link>
            ,{" "}
            <Link to="/information/privacy" className="text-primary underline">
              Privacy notice
            </Link>{" "}
            and{" "}
            <Link to="/information/your-privacy-choices" className="text-primary underline">
              Your privacy choices
            </Link>
            .
          </p>
        </article>
      </Section>
    </SiteLayout>
  );
}
