import { Link } from "@tanstack/react-router";
import { Award, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ListingImage } from "./ListingImage";
import { Stars } from "./Stars";
import { CATEGORY_BY_KEY } from "@/lib/taxonomy";
import type { SupplierCardRow, VenueCardRow } from "@/lib/directory.functions";

function cardImage(logo?: string | null, gallery?: string[] | null, banner?: string | null) {
  return banner || logo || gallery?.[0] || null;
}

function shortOverview(value: string | null | undefined, max = 180) {
  if (!value) return null;
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const sentence = clean
    .slice(0, max)
    .replace(/[.!?][^.!?]*$/, "")
    .trim();
  return `${(sentence.length > 80 ? sentence : clean.slice(0, max)).trim()}...`;
}

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

/** Numbered ranking badge used on ranked directory cards. */
function RankBadge({ rank }: { rank: number }) {
  return (
    <span className="absolute left-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-gold font-serif text-sm text-gold-foreground shadow-lift">
      {rank}
    </span>
  );
}

export function SupplierCard({ supplier, rank }: { supplier: SupplierCardRow; rank?: number }) {
  const primary = CATEGORY_BY_KEY.get(supplier.categories?.[0] ?? "");
  const overview = shortOverview(supplier.overview);
  const rating = toNumber(supplier.rating);
  const reviewCount = toNumber(supplier.review_count);
  return (
    <article className="card-lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      {rank ? <RankBadge rank={rank} /> : null}
      <Link
        to="/supplier/$slug"
        params={{ slug: supplier.slug }}
        className="block aspect-4/3 overflow-hidden bg-muted"
      >
        <ListingImage
          src={cardImage(supplier.logo_image, supplier.gallery_images, supplier.banner_image)}
          alt={`${supplier.name}${primary ? ` — ${primary.label.toLowerCase()}` : ""}${
            supplier.county ? ` in Co. ${supplier.county}` : ""
          }`}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-2">
          {primary ? (
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              {primary.label}
            </Badge>
          ) : null}
          {supplier.featured ? (
            <Badge className="bg-gold text-gold-foreground hover:bg-gold">Featured</Badge>
          ) : null}
          {supplier.award_winner ? (
            <Badge variant="outline" className="border-gold text-foreground">
              <Award className="size-3" /> Award winner
            </Badge>
          ) : null}
        </div>

        <h3 className="mt-2 font-serif text-lg font-semibold leading-snug tracking-tight">
          <Link
            to="/supplier/$slug"
            params={{ slug: supplier.slug }}
            className="hover:text-primary"
          >
            {supplier.name}
          </Link>
        </h3>

        {supplier.county ? (
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" /> Co. {supplier.county}
          </p>
        ) : null}

        {rating && reviewCount ? (
          <div className="mt-2">
            <Stars rating={rating} count={reviewCount} />
          </div>
        ) : null}

        {overview ? (
          <p className="line-clamp-3 mt-2 mb-4 text-sm text-muted-foreground">{overview}</p>
        ) : (
          <div className="mb-4" />
        )}

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">
            {priceLabel(supplier.avg_price, supplier.avg_price_num)}
          </span>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link to="/supplier/$slug" params={{ slug: supplier.slug }}>
                View
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/supplier/$slug" params={{ slug: supplier.slug }} hash="enquire">
                Enquire
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function VenueCard({ venue, rank }: { venue: VenueCardRow; rank?: number }) {
  const overview = shortOverview(venue.overview);
  return (
    <article className="card-lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      {rank ? <RankBadge rank={rank} /> : null}
      <Link
        to="/venue/$slug"
        params={{ slug: venue.slug }}
        className="block aspect-4/3 overflow-hidden bg-muted"
      >
        <ListingImage
          src={cardImage(venue.logo_image, venue.gallery_images)}
          alt={`${venue.name}, wedding venue${venue.county ? ` in Co. ${venue.county}` : " in Ireland"}`}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="bg-accent text-accent-foreground">
            Venue
          </Badge>
          {venue.badge ? <Badge variant="outline">{venue.badge}</Badge> : null}
        </div>

        <div className="mt-2 flex items-start justify-between gap-3">
          <h3 className="font-serif text-lg font-semibold leading-snug tracking-tight">
            <Link to="/venue/$slug" params={{ slug: venue.slug }} className="hover:text-primary">
              {venue.name}
            </Link>
          </h3>
          <Stars rating={venue.rating} count={venue.review_count} />
        </div>

        {venue.county ? (
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" /> Co. {venue.county}
          </p>
        ) : null}

        {overview ? (
          <p className="line-clamp-3 mt-2 text-sm text-muted-foreground">{overview}</p>
        ) : null}

        <dl className="mt-3 mb-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>
            <dt className="eyebrow">Capacity</dt>
            <dd className="text-foreground/85">{venue.guest_capacity ?? "On request"}</dd>
          </div>
          <div>
            <dt className="eyebrow">Per person</dt>
            <dd className="text-foreground/85">{venue.per_person_price ?? "On request"}</dd>
          </div>
        </dl>

        <div className="mt-auto flex justify-end gap-2 border-t border-border pt-3">
          <Button asChild size="sm" variant="outline">
            <Link to="/venue/$slug" params={{ slug: venue.slug }}>
              View
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/venue/$slug" params={{ slug: venue.slug }} hash="enquire">
              Enquire
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
