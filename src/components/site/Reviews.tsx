import type React from "react";
import { ExternalLink, Star } from "lucide-react";

type Review = {
  id: string;
  author_name: string | null;
  rating: number | null;
  title: string | null;
  body: string;
  review_date?: string | null;
  source_name?: string | null;
  source_url?: string | null;
};

function formatDate(value?: string | null) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Intl.DateTimeFormat("en-IE", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function reviewTitle(review: Review) {
  if (review.title) return review.title;
  if (review.rating) return `${review.rating}/5 review`;
  return "Couple review";
}

export function ReviewList({
  reviews,
  empty,
  summary,
}: {
  reviews: Review[];
  empty: string;
  summary?: React.ReactNode;
}) {
  if (!reviews.length) {
    return <p className="mt-3 text-muted-foreground">{empty}</p>;
  }

  return (
    <div className="mt-4 space-y-4">
      {summary}
      <div className="grid gap-4">
        {reviews.map((review) => {
          const date = formatDate(review.review_date);
          return (
            <article key={review.id} className="rounded-xl border border-border bg-card p-5 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-lg leading-snug">{reviewTitle(review)}</h3>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    <span>{review.author_name || "Verified couple"}</span>
                    {date ? <span>{date}</span> : null}
                    {review.source_name ? <span>via {review.source_name}</span> : null}
                  </p>
                </div>
                {review.rating ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-sm text-accent-foreground">
                    <Star className="size-3 fill-current" aria-hidden="true" />
                    {Number(review.rating).toFixed(1)}
                  </span>
                ) : null}
              </div>
              <p className="line-clamp-6 mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                {review.body}
              </p>
              {review.source_url ? (
                <a
                  href={review.source_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Source <ExternalLink className="size-3" aria-hidden="true" />
                </a>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
