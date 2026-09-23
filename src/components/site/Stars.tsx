import { Star } from "lucide-react";

export function Stars({ rating, count }: { rating?: number | null; count?: number | null }) {
  if (!rating) return null;
  const rounded = Math.round(rating * 10) / 10;
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <Star className="size-4 fill-gold text-gold" />
      <span className="font-medium">{rounded.toFixed(1)}</span>
      {count ? <span className="text-muted-foreground">({count})</span> : null}
    </span>
  );
}
