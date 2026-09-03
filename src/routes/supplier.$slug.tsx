import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
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
import { SupplierCard } from "@/components/site/Cards";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { JsonLd } from "@/components/site/JsonLd";
import { SaveButton } from "@/components/site/SaveButton";
import { Stars } from "@/components/site/Stars";
import { getSupplier } from "@/lib/directory.functions";
import { CATEGORY_BY_KEY, countySlug } from "@/lib/taxonomy";
import {
  aggregateRating,
  averageRating,
  canonical,
  clamp,
  pageMeta,
  reviewSchema,
  sourcedReviewSchema,
} from "@/lib/seo";

export const Route = createFileRoute("/supplier/$slug")({
  loader: async ({ params }) => {
    const result = await getSupplier({ data: { slug: params.slug } });
    if (!result) throw notFound();
    return result;
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Supplier not found" }, { name: "robots", content: "noindex" }] };
    }
    const s = loaderData.supplier;
    const category = CATEGORY_BY_KEY.get(s.categories?.[0] ?? "")?.label ?? "Wedding supplier";
    const place = s.county ? `Co. ${s.county}` : "Ireland";
    const avg = averageRating(loaderData.reviews);
    const title = `${s.name} — ${category}, ${place} | Wedora Ireland`;
    const ratingBit = avg
      ? `Rated ${avg.toFixed(1)}/5 from ${loaderData.reviews.length} reviews. `
      : "";
    const description = clamp(
      `${ratingBit}${s.overview ?? s.description ?? `${s.name} is a ${category.toLowerCase()} working in ${place}.`}`,
    );
    const path = `/supplier/${params.slug}`;
    return {
      meta: pageMeta({
        title,
        description,
        path,
        type: "profile",
        image: s.logo_image ?? s.gallery_images?.[0] ?? null,
      }),
      links: canonical(path),
    };
  },
  component: SupplierProfile,
  notFoundComponent: () => (
    <SiteLayout>
      <Section>
        <h1 className="text-3xl">Supplier not found</h1>
        <p className="mt-2 text-muted-foreground">This listing may have been removed.</p>
        <Button asChild className="mt-6">
          <Link to="/find-suppliers">Browse suppliers</Link>
        </Button>
      </Section>
    </SiteLayout>
  ),
  errorComponent: () => (
    <SiteLayout>
      <Section>
        <h1 className="text-3xl">This profile didn't load</h1>
      </Section>
    </SiteLayout>
  ),
});

const FAQS = (name: string) => [
  {
    q: `How do I check availability with ${name}?`,
    a: `Send an enquiry through the form on this page with your wedding date and rough guest numbers. ${name} replies to you directly by email — Wedora Ireland does not sit in the middle or charge a booking fee.`,
  },
  {
    q: "How far in advance should I book?",
    a: "Most Irish couples book their key suppliers 9 to 18 months before the wedding, and sooner for peak Saturdays between May and September. If your date is inside six months it is still worth asking.",
  },
  {
    q: "Is pricing on this page final?",
    a: "Any price shown is a guide supplied for the listing. Final quotes depend on your date, location, hours of coverage and what you include, so always confirm in writing.",
  },
  {
    q: "Do they travel outside their county?",
    a: "Many suppliers travel nationwide, sometimes with a travel charge. Service areas are listed on this page where the supplier has provided them — otherwise just ask in your enquiry.",
  },
];

function SupplierProfile() {
  const { supplier, reviews, sourcedReviews, similar } = Route.useLoaderData();
  const category = CATEGORY_BY_KEY.get(supplier.categories?.[0] ?? "");
  const gallery = (supplier.gallery_images ?? []).slice(0, 9);
  const hero = supplier.logo_image ?? gallery[0] ?? null;
  const faqs = FAQS(supplier.name);
  const allScored = [
    ...reviews.filter((r) => typeof r.rating === "number").map((r) => r.rating as number),
    ...sourcedReviews.filter((r) => typeof r.rating === "number").map((r) => r.rating as number),
  ];
  const avg = allScored.length
    ? allScored.reduce((s, r) => s + r, 0) / allScored.length
    : averageRating(reviews);
  const ratingNode = aggregateRating(avg, allScored.length);

  return (
    <SiteLayout>
      <JsonLd
        data={breadcrumbSchema("", [
          { name: "Home", path: "/" },
          { name: "Find Suppliers", path: "/find-suppliers" },
          ...(category
            ? [{ name: category.plural, path: `/${category.slug}-ireland` }]
            : []),
          { name: supplier.name, path: `/supplier/${supplier.slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: supplier.name,
          description: supplier.overview ?? supplier.description ?? undefined,
          image: hero ?? undefined,
          telephone: supplier.phone ?? undefined,
          url: supplier.website ?? undefined,
          address: {
            "@type": "PostalAddress",
            streetAddress: supplier.address ?? undefined,
            addressRegion: supplier.county ?? undefined,
            addressCountry: "IE",
          },
          ...(supplier.latitude && supplier.longitude
            ? {
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: supplier.latitude,
                  longitude: supplier.longitude,
                },
              }
            : {}),
          ...(ratingNode ? { aggregateRating: ratingNode } : {}),
          ...(reviews.length || sourcedReviews.length
            ? {
                review: [...reviewSchema(reviews), ...sourcedReviewSchema(sourcedReviews)].slice(
                  0,
                  10,
                ),
              }
            : {}),
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

      {/* Hero */}
      <div className="border-b border-border bg-ivory">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
          <Breadcrumbs
            items={[
              { label: "Find Suppliers", to: "/find-suppliers" },
              ...(category
                ? [
                    {
                      label: category.plural,
                      to: "/$directorySlug",
                      params: { directorySlug: `${category.slug}-ireland` },
                    },
                  ]
                : []),
              { label: supplier.name },
            ]}
          />

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <ListingImage
                src={hero}
                alt={`${supplier.name}${category ? ` — ${category.label.toLowerCase()}` : ""}${
                  supplier.county ? ` in Co. ${supplier.county}` : ""
                }`}
                className="aspect-16/10 w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap gap-2">
                {supplier.categories?.map((key) => {
                  const c = CATEGORY_BY_KEY.get(key);
                  return c ? (
                    <Badge key={key} variant="secondary" className="bg-accent text-accent-foreground">
                      {c.label}
                    </Badge>
                  ) : null;
                })}
              </div>
              <h1 className="mt-3 text-4xl leading-tight">{supplier.name}</h1>
              {avg ? (
                <div className="mt-2">
                  <Stars rating={avg} count={reviews.length} />
                </div>
              ) : null}
              {supplier.county ? (
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-4" />
                  {supplier.address ? `${supplier.address}, ` : ""}Co. {supplier.county}
                </p>
              ) : null}

              <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="eyebrow text-muted-foreground">Price guide</dt>
                  <dd className="mt-1">{supplier.avg_price ?? "Request pricing"}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-muted-foreground">Photos</dt>
                  <dd className="mt-1">{supplier.image_count ?? gallery.length}</dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <a href="#enquire">Enquire now</a>
                </Button>
                <SaveButton supplierId={supplier.id} />
                {supplier.website ? (
                  <Button asChild size="lg" variant="outline">
                    <a href={supplier.website} target="_blank" rel="noopener noreferrer nofollow">
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
            <h2 className="text-3xl">About {supplier.name}</h2>
            <div className="mt-4 space-y-4 text-muted-foreground">
              {(supplier.description ?? supplier.overview ?? "No description provided yet.")
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
                    alt={`${supplier.name} photo ${i + 1}`}
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            </section>
          ) : null}

          {supplier.service_areas?.length ? (
            <section>
              <h2 className="text-3xl">Service areas</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {supplier.service_areas.map((area: string) => (
                  <Badge key={area} variant="outline">
                    {area}
                  </Badge>
                ))}
              </div>
            </section>
          ) : null}

          <section id="reviews" className="scroll-mt-24">
            <h2 className="text-3xl">Reviews</h2>
            {reviews.length === 0 && sourcedReviews.length === 0 ? (
              <p className="mt-3 text-muted-foreground">
                No reviews yet. If you booked {supplier.name}, sign in and be the first to write one.
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
                {sourcedReviews.map((review) => (
                  <li key={review.id} className="rounded-xl border border-border bg-card p-5">
                    <p className="font-medium">{review.title ?? "Review"}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{review.author_name || "Verified couple"}</span>
                      {review.rating ? <span>· {review.rating}/5</span> : null}
                      {review.review_date ? (
                        <span>
                          ·{" "}
                          {new Date(review.review_date).toLocaleDateString("en-IE", {
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      ) : null}
                      {review.source_name ? <span>· via {review.source_name}</span> : null}
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
            <EnquiryForm supplierId={supplier.id} listingName={supplier.name} />
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-serif text-xl">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {supplier.phone ? (
                <li className="flex items-center gap-2">
                  <Phone className="size-4 text-primary" />
                  <a href={`tel:${supplier.phone}`} className="hover:text-primary">
                    {supplier.phone}
                  </a>
                </li>
              ) : null}
              {supplier.website ? (
                <li className="flex items-center gap-2">
                  <Globe className="size-4 text-primary" />
                  <a
                    href={supplier.website}
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
            {supplier.county ? (
              <Button asChild variant="outline" className="mt-5 w-full">
                <Link to="/county/$county" params={{ county: countySlug(supplier.county) }}>
                  More in Co. {supplier.county}
                </Link>
              </Button>
            ) : null}
          </div>
        </aside>
      </div>

      {similar.length ? (
        <Section tone="ivory" title="Similar suppliers nearby">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((s) => (
              <SupplierCard key={s.id} supplier={s} />
            ))}
          </div>
        </Section>
      ) : null}
    </SiteLayout>
  );
}
