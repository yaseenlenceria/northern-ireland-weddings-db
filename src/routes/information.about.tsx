import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, MapPin, MessageSquare, Calculator, Star } from "lucide-react";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/site/JsonLd";
import { pageMeta, canonical, SITE_NAME } from "@/lib/seo";

const TITLE = "About WedHQ | UK & Ireland Wedding Directory";
const DESCRIPTION =
  "WedHQ is a free wedding directory for Ireland and the UK: real venues, real suppliers, couple reviews and planning tools in one place, with direct enquiries and no booking fees.";

export const Route = createFileRoute("/information/about")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, path: "/information/about" }),
    links: canonical("/information/about"),
  }),
  component: AboutPage,
});

const PILLARS = [
  {
    icon: Search,
    title: "Search that makes sense",
    body: "Pick what you need and where, and get a page of real listings — not adverts. Every category and county page shows the actual number of matching venues and suppliers.",
  },
  {
    icon: MapPin,
    title: "Location-first listings",
    body: "Every profile shows where the business is based, the areas it serves, and — for venues — capacity and per-person pricing where the business has provided it.",
  },
  {
    icon: MessageSquare,
    title: "Direct enquiries",
    body: "Message a supplier or venue straight from its profile. There are no middlemen and no booking fees, and the enquiry goes to the business itself.",
  },
  {
    icon: Star,
    title: "Reviews you can read",
    body: "Couple reviews sit on the profile beside pricing and capacity, so you can read what real weddings were like before you enquire.",
  },
  {
    icon: Calculator,
    title: "Free planning tools",
    body: "A wedding checklist, budget calculator, guest list planner and wedding timeline run free in your browser and save as you go.",
  },
];

function AboutPage() {
  return (
    <SiteLayout>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About WedHQ",
          url: "https://wedhq.co.uk/information/about",
          mainEntity: {
            "@type": "Organization",
            name: SITE_NAME,
            url: "https://wedhq.co.uk/",
            description: DESCRIPTION,
          },
        }}
      />

      <PageHeader
        eyebrow="About"
        title="The wedding directory built to be read, not clicked through"
        description="WedHQ brings wedding venues, suppliers, reviews and planning tools together for couples getting married anywhere in Ireland or the UK."
      >
        <Breadcrumbs items={[{ label: "About WedHQ" }]} />
      </PageHeader>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="max-w-2xl space-y-5 text-muted-foreground">
            <p>
              Planning a wedding means juggling dozens of bookings — venue, photographer, florist,
              band, celebrant, cake — usually for the first time, usually alongside a full-time job.
              WedHQ exists to make that research faster and more honest.
            </p>
            <p>
              We list wedding venues and suppliers across all of Ireland and the United Kingdom,
              from Co. Donegal to Kent. Each profile brings together the details couples actually
              compare on: location and areas served, pricing where it's available, capacity for
              venues, real couple reviews, photos, and a direct enquiry form.
            </p>
            <p>
              Listing a business is free, and enquiries go directly to the supplier — we don't sit
              in the middle of the conversation and we don't take a cut. Our planning tools
              (checklist, budget calculator, guest list and timeline) are free too, and they run
              straight in your browser.
            </p>
            <p>
              Directory data is compiled from public business information and kept current through
              corrections from the businesses themselves. If something on a profile is wrong, the
              business can claim or fix its listing free of charge.
            </p>
          </div>

          <div className="grid gap-4 self-start">
            <div className="rounded-xl border border-border bg-ivory p-6">
              <h2 className="font-serif text-xl">What you'll find</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/venues" className="text-primary underline">
                    Wedding venues
                  </Link>{" "}
                  — hotels, country houses, barns and private venues with capacity and pricing shown.
                </li>
                <li>
                  <Link to="/find-suppliers" className="text-primary underline">
                    Wedding suppliers
                  </Link>{" "}
                  — photographers, florists, bands, DJs, celebrants and more, searchable by category
                  and location.
                </li>
                <li>
                  <Link to="/wedding-fairs" className="text-primary underline">
                    Wedding fairs
                  </Link>{" "}
                  — upcoming fairs, showcases and venue open days.
                </li>
                <li>
                  <Link to="/wedding-guides" className="text-primary underline">
                    Wedding guides
                  </Link>{" "}
                  — practical reading on budgets, booking order and venue viewings.
                </li>
                <li>
                  <Link to="/planning-tools" className="text-primary underline">
                    Planning tools
                  </Link>{" "}
                  — free checklist, budget, guest list and timeline.
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-ivory p-6">
              <h2 className="font-serif text-xl">Get in touch</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Questions, corrections or partnership ideas —{" "}
                <Link to="/contact" className="text-primary underline">
                  contact the WedHQ team
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="ivory" title="What makes WedHQ different">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((pillar) => (
            <li key={pillar.title} className="rounded-xl border border-border bg-card p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary-soft text-primary">
                <pillar.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-serif text-lg">{pillar.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{pillar.body}</p>
            </li>
          ))}
        </ul>
      </Section>
    </SiteLayout>
  );
}
