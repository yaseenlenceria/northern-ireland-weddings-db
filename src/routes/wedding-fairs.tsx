import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, CalendarDays, Clock, MapPin, Mail, Phone } from "lucide-react";
import { SiteLayout, PageHeader, Section } from "@/components/site/Layout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ListingImage } from "@/components/site/ListingImage";
import { JsonLd } from "@/components/site/JsonLd";
import { listFairs } from "@/lib/directory.functions";
import { pageMeta, canonical } from "@/lib/seo";

const TITLE = "Wedding Fairs & Showcases in Ireland | WedList Ireland";
const DESCRIPTION =
  "Wedding fairs, open days and showcases across Ireland — see venues dressed, meet suppliers in person and book on the day.";

export const Route = createFileRoute("/wedding-fairs")({
  loader: () => listFairs(),
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, path: "/wedding-fairs" }),
    links: canonical("/wedding-fairs"),
  }),
  component: FairsPage,
});

function FairsPage() {
  const fairs = Route.useLoaderData();

  return (
    <SiteLayout>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Wedding fairs in Ireland",
          numberOfItems: fairs.length,
          itemListElement: fairs.map((fair, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Event",
              name: fair.name,
              ...(fair.description ? { description: fair.description } : {}),
              ...(fair.venue_name
                ? { location: { "@type": "Place", name: fair.venue_name } }
                : {}),
              ...(fair.website ? { url: fair.website } : {}),
            },
          })),
        }}
      />

      <PageHeader
        eyebrow="Events"
        title="Wedding fairs and showcases in Ireland"
        description={`${fairs.length} fairs and venue open days listed. Fairs are the fastest way to see a room dressed, taste the food and meet several suppliers in one afternoon.`}
      >
        <Breadcrumbs items={[{ label: "Wedding Fairs" }]} />
      </PageHeader>

      <Section>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fairs.map((fair) => (
            <li
              key={fair.id}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-soft"
            >
              <div className="aspect-16/9 bg-muted">
                <ListingImage src={fair.image} alt={fair.name} className="size-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="font-serif text-lg leading-snug">{fair.name}</h2>

                <dl className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  {fair.date_text ? (
                    <div className="flex items-center gap-2">
                      <CalendarDays className="size-3.5" />
                      <dt className="sr-only">Date</dt>
                      <dd>{fair.date_text}</dd>
                    </div>
                  ) : null}
                  {fair.time_text ? (
                    <div className="flex items-center gap-2">
                      <Clock className="size-3.5" />
                      <dt className="sr-only">Time</dt>
                      <dd>{fair.time_text}</dd>
                    </div>
                  ) : null}
                  {fair.venue_name ? (
                    <div className="flex items-center gap-2">
                      <MapPin className="size-3.5" />
                      <dt className="sr-only">Venue</dt>
                      <dd>{fair.venue_name}</dd>
                    </div>
                  ) : null}
                </dl>

                {fair.description ? (
                  <p className="mt-3 line-clamp-4 text-sm text-muted-foreground">
                    {fair.description}
                  </p>
                ) : null}

                <div className="mt-auto flex flex-wrap gap-3 pt-4 text-xs">
                  {fair.website ? (
                    <a
                      href={fair.website}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <ExternalLink className="size-3.5" /> Event details
                    </a>
                  ) : null}
                  {fair.email ? (
                    <a
                      href={`mailto:${fair.email}`}
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <Mail className="size-3.5" /> Email
                    </a>
                  ) : null}
                  {fair.phone ? (
                    <a
                      href={`tel:${fair.phone.replace(/\s+/g, "")}`}
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <Phone className="size-3.5" /> {fair.phone}
                    </a>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </SiteLayout>
  );
}
