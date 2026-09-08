import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Award,
  BadgeCheck,
  Globe,
  Instagram,
  Mail,
  MapPin,
  Phone,
  PlayCircle,
} from "lucide-react";
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
import { ReviewList } from "@/components/site/Reviews";
import { getSupplier } from "@/lib/directory.functions";
import { firstImage, videoEmbed } from "@/lib/media";
import { CATEGORY_BY_KEY, countrySlug, countySlug, listingLocationLabel } from "@/lib/taxonomy";
import {
  absoluteUrl,
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
    const place = listingLocationLabel(s.county, s.country);
    const avg = averageRating(loaderData.reviews);
    const title = `${s.name} — ${category}, ${place} | WedHQ`;
    const isDemo = s.source_url === "wedhq-demo";
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
        image: firstImage(s.banner_image, s.logo_image, s.gallery_images),
        noindex: isDemo,
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
    a: `Send an enquiry through the form on this page with your wedding date and rough guest numbers. ${name} replies to you directly by email — WedHQ does not sit in the middle or charge a booking fee.`,
  },
  {
    q: "How far in advance should I book?",
    a: "Most couples book their key suppliers 9 to 18 months before the wedding, and sooner for peak Saturdays between May and September. If your date is inside six months it is still worth asking.",
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

function toNumber(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function priceLabel(price: string | null | undefined, numericPrice: unknown) {
  const parsed = toNumber(numericPrice);
  if (parsed !== null && parsed <= 0) return "Request pricing";
  if (!price || /^0(?:\.0+)?$/.test(price.trim())) return "Request pricing";
  if (/^\d+(?:\.\d+)?$/.test(price.trim())) {
    return `€${Math.round(Number(price)).toLocaleString("en-IE")}`;
  }
  return price;
}

function SupplierProfile() {
  const { supplier, reviews, sourcedReviews, similar } = Route.useLoaderData();
  const category = CATEGORY_BY_KEY.get(supplier.categories?.[0] ?? "");
  const gallery = (supplier.gallery_images ?? [])
    .filter((src: string) => firstImage(src))
    .slice(0, 9);
  const hero = firstImage(supplier.banner_image, supplier.logo_image, gallery);
  const faqs = FAQS(supplier.name);
  const allScored = [
    ...reviews.map((r) => toNumber(r.rating)).filter((r): r is number => r !== null),
    ...sourcedReviews.map((r) => toNumber(r.rating)).filter((r): r is number => r !== null),
  ];
  const supplierRating = toNumber(supplier.rating);
  const supplierReviewCount = toNumber(supplier.review_count);
  const supplierPrice = priceLabel(supplier.avg_price, supplier.avg_price_num);
  const location = listingLocationLabel(supplier.county, supplier.country);
  const scopeSlug = supplier.country ? countrySlug(supplier.country) : "uk-and-ireland";
  const avg = allScored.length
    ? allScored.reduce((s, r) => s + r, 0) / allScored.length
    : (supplierRating ?? averageRating(reviews));
  const displayReviewCount = supplierReviewCount ?? allScored.length;
  const ratingNode = aggregateRating(avg, displayReviewCount);
  const profileReviews = [...reviews, ...sourcedReviews];
  const socialLinks = [
    supplier.facebook_url ? { label: "Facebook", href: supplier.facebook_url, icon: Globe } : null,
    supplier.instagram_url
      ? { label: "Instagram", href: supplier.instagram_url, icon: Instagram }
      : null,
    supplier.tiktok_url ? { label: "TikTok", href: supplier.tiktok_url, icon: PlayCircle } : null,
    supplier.youtube_url
      ? { label: "YouTube", href: supplier.youtube_url, icon: PlayCircle }
      : null,
    supplier.twitter_url ? { label: "X", href: supplier.twitter_url, icon: Globe } : null,
  ].filter(Boolean) as { label: string; href: string; icon: typeof Globe }[];
  const videos = (supplier.video_urls ?? []).filter(Boolean) as string[];
  const embeddedVideos = Array.from(
    new Map(
      videos
        .map((href) => videoEmbed(href))
        .filter((video) => video !== null)
        .map((video) => [video.embedUrl, video]),
    ).values(),
  );

  return (
    <SiteLayout>
      <JsonLd
        data={breadcrumbSchema("", [
          { name: "Home", path: "/" },
          { name: "Find Suppliers", path: "/find-suppliers" },
          ...(category ? [{ name: category.plural, path: `/${category.slug}-${scopeSlug}` }] : []),
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
          email: supplier.email ?? undefined,
          url: supplier.website ?? undefined,
          sameAs: socialLinks.length ? socialLinks.map((link) => link.href) : undefined,
          address: {
            "@type": "PostalAddress",
            streetAddress: supplier.address ?? undefined,
            addressRegion: supplier.county ?? undefined,
            postalCode: supplier.postcode ?? undefined,
            addressCountry: supplier.country === "United Kingdom" ? "GB" : "IE",
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
      {embeddedVideos.length ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": embeddedVideos.slice(0, 6).map((video, index) => ({
              "@type": "VideoObject",
              name: `${supplier.name} wedding video ${index + 1}`,
              description:
                supplier.overview ??
                supplier.description ??
                `${supplier.name} wedding supplier video on WedHQ.`,
              thumbnailUrl: hero ? [hero] : undefined,
              contentUrl: video?.originalUrl,
              embedUrl: video?.embedUrl,
              publisher: {
                "@type": "Organization",
                name: "WedHQ",
                url: absoluteUrl("/"),
              },
            })),
          }}
        />
      ) : null}
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
                      params: { directorySlug: `${category.slug}-${scopeSlug}` },
                    },
                  ]
                : []),
              { label: supplier.name },
            ]}
          />

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <ListingImage
                src={[supplier.banner_image, supplier.logo_image, ...gallery]}
                alt={`${supplier.name}${category ? ` — ${category.label.toLowerCase()}` : ""} in ${location}`}
                className="aspect-16/10 w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap gap-2">
                {supplier.categories?.map((key) => {
                  const c = CATEGORY_BY_KEY.get(key);
                  return c ? (
                    <Badge
                      key={key}
                      variant="secondary"
                      className="bg-accent text-accent-foreground"
                    >
                      {c.label}
                    </Badge>
                  ) : null;
                })}
              </div>
              <h1 className="mt-3 text-4xl leading-tight">{supplier.name}</h1>
              {supplier.slogan ? (
                <p className="mt-3 max-w-2xl text-lg leading-7 text-muted-foreground">
                  {supplier.slogan}
                </p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                {supplier.award_winner ? (
                  <Badge className="bg-gold text-gold-foreground hover:bg-gold">
                    <Award className="size-3.5" /> Award winner
                  </Badge>
                ) : null}
                {supplier.package_plan ? (
                  <Badge variant="outline">
                    <BadgeCheck className="size-3.5" /> {supplier.package_plan}
                  </Badge>
                ) : null}
              </div>
              {avg ? (
                <div className="mt-2">
                  <Stars rating={avg} count={displayReviewCount || profileReviews.length} />
                </div>
              ) : null}
              {supplier.county ? (
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-4" />
                  {supplier.address ? `${supplier.address}, ` : ""}
                  {supplier.postcode ? `${supplier.postcode}, ` : ""}
                  {location}
                </p>
              ) : null}

              <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="eyebrow text-muted-foreground">Price guide</dt>
                  <dd className="mt-1">{supplierPrice}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-muted-foreground">Photos</dt>
                  <dd className="mt-1">{supplier.image_count ?? gallery.length}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-muted-foreground">Videos</dt>
                  <dd className="mt-1">{embeddedVideos.length || "Ask supplier"}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-muted-foreground">Reviews</dt>
                  <dd className="mt-1">
                    {displayReviewCount || profileReviews.length || "Coming in"}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <a href="#enquire">Enquire now</a>
                </Button>
                <SaveButton
                  id={supplier.id}
                  type="supplier"
                  name={supplier.name}
                  slug={supplier.slug}
                  county={supplier.county}
                  image={hero}
                />
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

          {embeddedVideos.length ? (
            <section>
              <h2 className="text-3xl">Videos and reels</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {embeddedVideos.slice(0, 12).map((video, index) => (
                  <div
                    key={video?.originalUrl ?? index}
                    className="overflow-hidden rounded-xl border border-border bg-card shadow-soft"
                  >
                    <div className="aspect-video bg-muted">
                      {video?.kind === "video" ? (
                        <video
                          src={video.embedUrl}
                          poster={hero ?? undefined}
                          controls
                          preload="metadata"
                          className="size-full object-cover"
                        />
                      ) : (
                        <iframe
                          src={video?.embedUrl}
                          title={`${supplier.name} ${video?.provider ?? "video"} ${index + 1}`}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="size-full border-0"
                        />
                      )}
                    </div>
                    <a
                      href={video?.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="flex items-center justify-between gap-3 px-4 py-3 text-sm transition-colors hover:text-primary"
                    >
                      <span className="inline-flex items-center gap-2">
                        <PlayCircle className="size-4" />
                        {video?.provider} {video?.provider === "Instagram" ? "reel" : "video"}{" "}
                        {index + 1}
                      </span>
                      <ExternalLink className="size-4" />
                    </a>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section id="reviews" className="scroll-mt-24">
            <h2 className="text-3xl">Reviews</h2>
            <ReviewList
              reviews={profileReviews}
              empty={`No written reviews are available yet for ${supplier.name}.`}
              summary={
                avg ? (
                  <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-ivory p-4">
                    <Stars rating={avg} count={profileReviews.length} />
                    <span className="text-sm text-muted-foreground">
                      {avg.toFixed(1)}/5 from {profileReviews.length.toLocaleString()} imported
                      written reviews
                    </span>
                  </div>
                ) : null
              }
            />
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
              {supplier.email ? (
                <li className="flex items-center gap-2">
                  <Mail className="size-4 text-primary" />
                  <a href={`mailto:${supplier.email}`} className="truncate hover:text-primary">
                    {supplier.email}
                  </a>
                </li>
              ) : null}
              {supplier.contact_person ? (
                <li className="flex items-center gap-2 text-muted-foreground">
                  <BadgeCheck className="size-4 text-primary" />
                  <span>{supplier.contact_person}</span>
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
                {supplier.country === "United Kingdom" ? (
                  <Link to="/find-suppliers" search={{ country: "United Kingdom" }}>
                    More in the UK
                  </Link>
                ) : (
                  <Link to="/county/$county" params={{ county: countySlug(supplier.county) }}>
                    More in {location}
                  </Link>
                )}
              </Button>
            ) : null}
          </div>

          {socialLinks.length ? (
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-serif text-xl">Online profiles</h3>
              <div className="mt-4 grid gap-2">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <Button key={href} asChild variant="outline" className="justify-start">
                    <a href={href} target="_blank" rel="noopener noreferrer nofollow">
                      <Icon className="size-4" /> {label}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          ) : null}
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
