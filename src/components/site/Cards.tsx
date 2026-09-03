import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ListingImage } from "./ListingImage";
import { Stars } from "./Stars";
import { CATEGORY_BY_KEY } from "@/lib/taxonomy";
import type { SupplierCardRow, VenueCardRow } from "@/lib/directory.functions";

function cardImage(logo?: string | null, gallery?: string[] | null) {
  return logo || gallery?.[0] || null;
}

/** Numbered ranking badge used on the "Top 10" directory pages. */
function RankBadge({ rank }: { rank: number }) {
  return (
    <span className="absolute left-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-gold font-serif text-sm text-gold-foreground shadow-lift">
      {rank}
    </span>
  );
}

export function SupplierCard({
  supplier,
  rank,
}: {
  supplier: SupplierCardRow;
  rank?: number;
}) {
  const primary = CATEGORY_BY_KEY.get(supplier.categories?.[0] ?? "");
  return (
    <article className="card-lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      {rank ? <RankBadge rank={rank} /> : null}
      <Link
        to="/supplier/$slug"
        params={{ slug: supplier.slug }}
        className="block aspect-4/3 overflow-hidden bg-muted"
      >
        <ListingImage
          src={cardImage(supplier.logo_image, supplier.gallery_images)}
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
        </div>

        <h3 className="mt-2 font-serif text-lg font-semibold leading-snug tracking-tight">
          <Link to="/supplier/$slug" params={{ slug: supplier.slug }} className="hover:text-primary">
            {supplier.name}
          </Link>
        </h3>

        {supplier.county ? (
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" /> Co. {supplier.county}
          </p>
        ) : null}

        {supplier.overview ? (
          <p className="line-clamp-3b mt-2 text-sm text-muted-foreground">{supplier.overview}</p>
        ) : null}

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">
            {supplier.avg_price ? supplier.avg_price : "Request pricing"}
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

        {venue.overview ? (
          <p className="line-clamp-3b mt-2 text-sm text-muted-foreground">{venue.overview}</p>
        ) : null}

        <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>
            <dt className="eyebrow">Capacity</dt>
            <dd className="text-foreground/85">{venue.guest_capacity ?? "On request"}</dd>
          </div>
          <div>
            <dt className="eyebrow">Per person</dt>
            <dd className="text-foreground/85">{venue.per_person_price ?? "On request"}</dd>
          </div>
        </dl>

        <div className="mt-4 flex justify-end gap-2 border-t border-border pt-3">
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
