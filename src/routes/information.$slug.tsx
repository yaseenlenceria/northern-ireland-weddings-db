import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { canonical, pageMeta } from "@/lib/seo";

type InformationPage = {
  title: string;
  eyebrow: string;
  description: string;
  intro: string;
  sections: Array<{ heading: string; body: string }>;
  source?: { label: string; href: string };
};

const PAGES: Record<string, InformationPage> = {
  "terms-of-use": {
    title: "Terms of Use",
    eyebrow: "Information",
    description: "The terms that apply when you browse and use WedHQ.",
    intro: "WedHQ is a free wedding directory and planning resource for couples and wedding businesses across Ireland and the UK.",
    sections: [
      { heading: "Using WedHQ", body: "You may browse listings, use planning tools and contact suppliers for personal wedding-planning purposes. Please use the site lawfully and do not attempt to disrupt, scrape or misuse its services." },
      { heading: "Directory information", body: "Listings are provided for information and discovery. Availability, pricing, services and business details can change, so confirm important details directly with the supplier before making a decision." },
      { heading: "Our content", body: "Site design, original editorial content, planning tools and branding belong to WedHQ or their respective licensors. You may not reproduce them commercially without permission." },
      { heading: "Changes", body: "We may update these terms as the service grows. The latest version will always be published on this page." },
    ],
  },
  "terms-of-purchase": {
    title: "Terms of Purchase",
    eyebrow: "Information",
    description: "Information about purchases and paid services on WedHQ.",
    intro: "WedHQ does not currently process purchases, bookings or payments through this website.",
    sections: [
      { heading: "No checkout on WedHQ", body: "When you contact a venue or supplier, any quote, contract, deposit or booking is arranged directly with that business. WedHQ is not a party to that supplier contract." },
      { heading: "Supplier responsibility", body: "Ask suppliers about their own terms, cancellation policies, insurance and payment arrangements before committing." },
      { heading: "Future paid services", body: "If WedHQ introduces paid services or checkout, we will publish clear terms before those services become available." },
    ],
  },
  privacy: {
    title: "Privacy Notice",
    eyebrow: "Information",
    description: "How WedHQ handles personal information when you use the wedding directory.",
    intro: "We aim to collect only the information needed to run the directory, respond to enquiries and improve the planning experience.",
    sections: [
      { heading: "Information you provide", body: "This may include your name, email address and message when you contact us or enquire about a listing. Supplier profile information is used to make the directory useful to couples." },
      { heading: "How we use it", body: "We use information to respond to requests, operate site features, protect the service and understand aggregate usage. We do not sell personal information." },
      { heading: "Supplier enquiries", body: "An enquiry submitted on a supplier profile is intended to reach that supplier. Please avoid including sensitive information in an enquiry." },
      { heading: "Your rights", body: "You can ask us to access, correct or remove personal information we hold about you. Start with our Contact page and include enough detail for us to find your request." },
    ],
  },
  cookies: {
    title: "Cookie Notice",
    eyebrow: "Information",
    description: "How WedHQ uses cookies and similar technologies.",
    intro: "WedHQ uses essential storage to keep the website working and may use limited analytics or security technologies where enabled.",
    sections: [
      { heading: "Essential technologies", body: "Some storage is required for authentication, security, preferences and core application behaviour. These technologies cannot be switched off through the site because the service would not work reliably without them." },
      { heading: "Planning tools", body: "Some planning tools save your entries in your browser so you can return to them on the same device. This information is not a substitute for a backup." },
      { heading: "Managing cookies", body: "You can manage cookies through your browser settings. Blocking essential storage may affect sign-in or other site functionality." },
    ],
  },
  "your-privacy-choices": {
    title: "Your Privacy Choices",
    eyebrow: "Information",
    description: "Choose how WedHQ should handle your personal information.",
    intro: "You are in control of the personal information you share with WedHQ.",
    sections: [
      { heading: "Choices available", body: "You can choose not to submit contact or enquiry forms, clear locally saved planning data through your browser, and ask us to correct or delete information we hold about you." },
      { heading: "Make a request", body: "Use the Contact page and choose a subject such as privacy request, data correction or deletion. We may need to verify the request before making changes." },
      { heading: "Marketing", body: "We do not currently require marketing consent to browse the directory, and we do not sell personal information." },
    ],
  },
  "transparency-hub": {
    title: "Transparency Hub",
    eyebrow: "Information",
    description: "How WedHQ builds and maintains a useful wedding directory.",
    intro: "A trustworthy directory should make it clear what it knows, what it does not know and how businesses can keep their information accurate.",
    sections: [
      { heading: "Listing sources", body: "Directory records may be compiled from publicly available business information and supplier-submitted details. We do not treat a listing as an endorsement or guarantee." },
      { heading: "Corrections and claims", body: "Businesses can ask us to correct, update or remove a profile through Contact. Couples should verify current availability and pricing directly with suppliers." },
      { heading: "Reviews and editorial", body: "We aim to label reviews, sourced information and editorial guidance clearly. We do not accept payment in exchange for changing an honest review." },
      { heading: "Accessibility and safety", body: "We continue to improve readability, keyboard access and clear explanations. If something is inaccessible or misleading, tell us so we can investigate." },
    ],
  },
  "legal-hub": {
    title: "Legal Hub",
    eyebrow: "Information",
    description: "A central place for WedHQ policies and legal information.",
    intro: "Use this hub to find the policies that explain how WedHQ works.",
    sections: [
      { heading: "Website use", body: "Read our Terms of Use for the rules that apply when browsing and using WedHQ." },
      { heading: "Privacy and cookies", body: "Our Privacy Notice explains data handling. Our Cookie Notice explains essential browser storage and similar technologies. Your Privacy Choices explains how to make a request." },
      { heading: "Purchases", body: "WedHQ does not currently process purchases or bookings. See Terms of Purchase for more detail." },
    ],
  },
  about: {
    title: "About WedHQ",
    eyebrow: "Information",
    description: "Learn about WedHQ, a wedding directory for Ireland and the UK.",
    intro: "WedHQ helps couples find venues and suppliers, compare the details that matter and keep planning organised.",
    sections: [
      { heading: "Built for real planning", body: "The directory brings together location-led search, supplier profiles, direct enquiries and practical browser-based tools such as checklists, budgets and guest lists." },
      { heading: "For couples and suppliers", body: "Couples get a clearer starting point. Wedding businesses get a place to explain what they do and be discovered by people planning nearby." },
      { heading: "Get in touch", body: "Have a correction, suggestion or partnership idea? Visit our Contact page and send us a message." },
    ],
  },
  "editorial-team": {
    title: "Editorial Team & Policies",
    eyebrow: "Information",
    description: "How WedHQ creates and reviews wedding planning content.",
    intro: "Our editorial approach is practical, location-aware and designed to help couples make informed decisions.",
    sections: [
      { heading: "Editorial principles", body: "We favour useful, specific guidance over filler. Advice should be clear about assumptions, relevant to Ireland or the UK where appropriate, and easy to act on." },
      { heading: "Commercial relationships", body: "A supplier listing or commercial relationship does not guarantee editorial coverage or a positive recommendation. Editorial decisions are kept separate from listing information." },
      { heading: "Corrections", body: "If you spot an error, outdated guidance or a missing attribution, contact us with the page URL and the correction you are proposing." },
    ],
  },
  careers: {
    title: "Careers",
    eyebrow: "Information",
    description: "Work with WedHQ on the future of wedding planning.",
    intro: "We are not currently advertising open roles.",
    sections: [
      { heading: "Keep in touch", body: "If you are interested in product, engineering, directory operations or wedding editorial, use the Contact page to introduce yourself and tell us what you could contribute." },
      { heading: "What we value", body: "We care about useful products, honest information, thoughtful design and making a complicated planning process feel calmer." },
    ],
  },
};

export const Route = createFileRoute("/information/$slug")({
  head: ({ params }) => {
    const page = PAGES[params.slug];
    const title = page ? `${page.title} | WedHQ` : "Information | WedHQ";
    const description = page?.description ?? "Information, policies and company details from WedHQ.";
    return { meta: pageMeta({ title, description, path: `/information/${params.slug}` }), links: canonical(`/information/${params.slug}`) };
  },
  component: InformationPage,
});

function InformationPage() {
  const { slug } = Route.useParams();
  const page = PAGES[slug];

  if (!page) {
    return (
      <SiteLayout>
        <PageHeader eyebrow="Information" title="Page not found" description="That information page does not exist.">
          <Breadcrumbs items={[{ label: "Information" }]} />
        </PageHeader>
        <Section><Link to="/" className="inline-flex items-center gap-2 text-primary underline"><ArrowLeft className="size-4" /> Back to home</Link></Section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHeader eyebrow={page.eyebrow} title={page.title} description={page.description}>
        <Breadcrumbs items={[{ label: "Information", to: "/information/terms-of-use" }, { label: page.title }]} />
      </PageHeader>
      <Section>
        <article className="mx-auto max-w-3xl">
          <p className="text-lg leading-8 text-foreground">{page.intro}</p>
          <div className="mt-10 space-y-8">
            {page.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl">{section.heading}</h2>
                <p className="mt-2 leading-7 text-muted-foreground">{section.body}</p>
              </section>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap gap-4 border-t border-border pt-6 text-sm">
            <Link to="/contact" className="text-primary underline">Contact WedHQ</Link>
            <Link to="/" className="text-primary underline">Back to home</Link>
            {page.source ? <a href={page.source.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary underline">{page.source.label}<ExternalLink className="size-3" /></a> : null}
          </div>
        </article>
      </Section>
    </SiteLayout>
  );
}
