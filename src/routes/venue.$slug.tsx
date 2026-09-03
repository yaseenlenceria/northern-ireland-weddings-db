import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Globe, Mail, MapPin, Phone, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteLayout, Section } from "@/components/site/Layout";
import { Breadcrumbs, breadcrumbSchema } from "@/components/site/Breadcrumbs";
import { ListingImage } from "@/components/site/ListingImage";
import { Stars } from "@/components/site/Stars";
import { VenueCard } from "@/components/site/Cards";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { JsonLd } from "@/components/site/JsonLd";
import { SaveButton } from "@/components/site/SaveButton";
import { getVenue } from "@/lib/directory.functions";
import { VENUE_SLUG, countySlug } from "@/lib/taxonomy";
import { canonical, clamp, pageMeta, reviewSchema } from "@/lib/seo";

export const Route = createFileRoute("/venue/$slug")({
  loader: async ({ params }) => {
    const result = await getVenue({ data: { slug: params.slug } });
    if (!result) throw notFound();
    return result;
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Venue not found" }, { name: "robots", content: "noindex" }] };
    }
    const v = loaderData.venue;
    const place = v.county ? `Co. ${v.county}` : "Ireland";
    const title = `${v.name} — Wedding Venue in ${place} | Prices & Capacity`;
    const bits = [
      v.rating && v.review_count ? `Rated ${v.rating}/5 from ${v.review_count} reviews.` : "",
      v.guest_capacity ? `Capacity ${v.guest_capacity}.` : "",
      v.per_person_price ? `From ${v.per_person_price} per person.` : "",
      v.overview ?? v.description ?? "",
    ].filter(Boolean);
    const path = `/venue/${params.slug}`;
    return {
      meta: pageMeta({
        title,
        description: clamp(bits.join(" ")),
        path,
        image: v.logo_image ?? v.gallery_images?.[0] ?? null,
      }),
      links: canonical(path),
    };
  },
  component: VenueProfile,
  notFoundComponent: () => (
    <SiteLayout>
      <Section>
        <h1 className="text-3xl">Venue not found</h1>
        <Button asChild className="mt-6">
          <Link to="/venues">Browse venues</Link>
        </Button>
      </Section>
    </SiteLayout>
  ),
  errorComponent: () => (
    <SiteLayout>
      <Section>
        <h1 className="text-3xl">This venue page didn't load</h1>
      </Section>
    </SiteLayout>
  ),
});

const FAQS = (name: string, capacity: string | null) => [
  {
    q: `How many guests can ${name} hold?`,
    a: capacity
      ? `${name} lists a guest capacity of ${capacity}. Capacity can change with room layout, band size and whether you need a dance floor, so confirm the exact seated number for your date.`
      : `Capacity depends on the room and layout you choose. Send an enquiry with your guest number and the venue will confirm what works.`,
  },
  {
    q: "How do I check date availability?",
    a: `Use the enquiry form on this page. ${name} receives your date and details directly and replies to you by email.`,
  },
  {
    q: "Is there a minimum number or minimum spend?",
    a: "Many Irish venues apply minimum numbers or a minimum spend on peak Saturdays. Always ask for this in writing before you pay a deposit.",
  },
  {
    q: "What is the wet-weather plan?",
    a: "Ask to see the indoor space used for drinks reception and photographs if the weather turns. It is the single most useful question on any Irish venue viewing.",
  },
];

function VenueProfile() {
  const { venue, reviews, similar } = Route.useLoaderData();
  const gallery = (venue.gallery_images ?? []).slice(0, 12);
  const hero = venue.logo_image ?? gallery[0] ?? null;
  const faqs = FAQS(venue.name, venue.guest_capacity);

  return (
    <SiteLayout>
      <JsonLd
        data={breadcrumbSchema("", [
          { name: "Home", path: "/" },
          { name: "Venues", path: "/venues" },
          ...(venue.county
            ? [
                {
                  name: `Co. ${venue.county}`,
                  path: `/${VENUE_SLUG}-${countySlug(venue.county)}`,
                },
              ]
            : []),
          { name: venue.name, path: `/venue/${venue.slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "EventVenue",
          name: venue.name,
          description: venue.overview ?? venue.description ?? undefined,
          image: hero ?? undefined,
          telephone: venue.phone ?? undefined,
          url: venue.website ?? undefined,
          maximumAttendeeCapacity: venue.capacity_max ?? undefined,
          address: {
            "@type": "PostalAddress",
            streetAddress: venue.address ?? undefined,
            addressRegion: venue.county ?? undefined,
            postalCode: venue.postcode ?? undefined,
            addressCountry: "IE",
          },
          ...(venue.rating && venue.review_count
            ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: venue.rating,
                  reviewCount: venue.review_count,
                },
              }
            : {}),
          ...(venue.latitude && venue.longitude
            ? {
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: venue.latitude,
                  longitude: venue.longitude,
                },
              }
            : {}),
          ...(reviews.length ? { review: reviewSchema(reviews) } : {}),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />

      <div className="border-b border-border bg-ivory">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
          <Breadcrumbs
            items={[
              { label: "Venues", to: "/venues" },
              ...(venue.county
                ? [
                    {
                      label: `Co. ${venue.county}`,
                      to: "/$directorySlug",
                      params: { directorySlug: `${VENUE_SLUG}-${countySlug(venue.county)}` },
                    },
                  ]
                : []),
              { label: venue.name },
            ]}
          />

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <ListingImage
                src={hero}
                alt={`${venue.name}, wedding venue${venue.county ? ` in Co. ${venue.county}` : " in Ireland"}`}
                className="aspect-16/10 w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="bg-accent text-accent-foreground">
                  Wedding Venue
                </Badge>
                {venue.badge ? <Badge variant="outline">{venue.badge}</Badge> : null}
                <Stars rating={venue.rating} count={venue.review_count} />
              </div>
              <h1 className="mt-3 text-4xl leading-tight">{venue.name}</h1>
              {venue.county ? (
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-4" />
                  {venue.address ? `${venue.address}, ` : ""}Co. {venue.county}
                </p>
              ) : null}

              <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="eyebrow text-muted-foreground">Guest capacity</dt>
                  <dd className="mt-1 inline-flex items-center gap-1">
                    <Users className="size-4 text-primary" />
                    {venue.guest_capacity ?? "On request"}
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-muted-foreground">Per person from</dt>
                  <dd className="mt-1">{venue.per_person_price ?? "Request pricing"}</dd>
                </div>
                {venue.venue_hire_price ? (
                  <div className="col-span-2">
                    <dt className="eyebrow text-muted-foreground">Venue hire</dt>
                    <dd className="mt-1">{venue.venue_hire_price}</dd>
                  </div>
                ) : null}
              </dl>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <a href="#enquire">Enquire now</a>
                </Button>
                <SaveButton venueId={venue.id} />
                {venue.website ? (
                  <Button asChild size="lg" variant="outline">
                    <a href={venue.website} target="_blank" rel="noopener noreferrer nofollow">
                      <Globe className="size-4" /> Website
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-12">
          <section>
            <h2 className="text-3xl">About {venue.name}</h2>
            <div className="mt-4 space-y-4 text-muted-foreground">
              {(venue.description ?? venue.overview ?? "No description provided yet.")
                .split(/\n+/)
                .filter(Boolean)
                .map((para: string, i: number) => (
                  <p key={i}>{para}</p>
                ))}
            </div>
          </section>

          {gallery.length > 1 ? (
            <section>
              <h2 className="text-3xl">Gallery</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {gallery.map((src: string, i: number) => (
                  <ListingImage
                    key={`${src}-${i}`}
                    src={src}
                    alt={`${venue.name} photo ${i + 1}`}
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            </section>
          ) : null}

          {venue.facilities?.length || venue.styles?.length || venue.venue_types?.length ? (
            <section>
              <h2 className="text-3xl">Styles &amp; facilities</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  ...(venue.venue_types ?? []),
                  ...(venue.styles ?? []),
                  ...(venue.facilities ?? []),
                ].map((item: string, i: number) => (
                  <Badge key={`${item}-${i}`} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
            </section>
          ) : null}

          <section>
            <h2 className="text-3xl">Reviews</h2>
            {reviews.length === 0 ? (
              <p className="mt-3 text-muted-foreground">
                No written reviews on Wedora yet
                {venue.rating ? `, though this venue holds a ${venue.rating}/5 rating.` : "."}
              </p>
            ) : (
              <ul className="mt-4 space-y-4">
                {reviews.map((review) => (
                  <li key={review.id} className="rounded-xl border border-border bg-card p-5">
                    <p className="font-medium">{review.title ?? "Review"}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {review.author_name} · {review.rating}/5
                    </p>
                    <p className="mt-3 text-sm text-muted-foreground">{review.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-3xl">Frequently asked questions</h2>
            <Accordion type="single" collapsible className="mt-4">
              {faqs.map((faq) => (
                <AccordionItem key={faq.q} value={faq.q}>
                  <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section id="enquire" className="scroll-mt-24">
            <EnquiryForm venueId={venue.id} listingName={venue.name} />
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-serif text-xl">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {venue.contact_person ? (
                <li className="text-muted-foreground">
                  {venue.contact_person}
                  {venue.contact_role ? `, ${venue.contact_role}` : ""}
                </li>
              ) : null}
              {venue.phone ? (
                <li className="flex items-center gap-2">
                  <Phone className="size-4 text-primary" />
                  <a href={`tel:${venue.phone}`} className="hover:text-primary">
                    {venue.phone}
                  </a>
                </li>
              ) : null}
              {venue.website ? (
                <li className="flex items-center gap-2">
                  <Globe className="size-4 text-primary" />
                  <a
                    href={venue.website}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="truncate hover:text-primary"
                  >
                    Visit website
                  </a>
                </li>
              ) : null}
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-primary" />
                <a href="#enquire" className="hover:text-primary">
                  Send an enquiry
                </a>
              </li>
            </ul>
            {venue.county ? (
              <Button asChild variant="outline" className="mt-5 w-full">
                <Link to="/county/$county" params={{ county: countySlug(venue.county) }}>
                  More in Co. {venue.county}
                </Link>
              </Button>
            ) : null}
          </div>
        </aside>
      </div>

      {similar.length ? (
        <Section tone="ivory" title="Similar venues nearby">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((v) => (
              <VenueCard key={v.id} venue={v} />
            ))}
          </div>
        </Section>
      ) : null}
    </SiteLayout>
  );
}
