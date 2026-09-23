/** Small numeric helpers for the visible price guides and FAQ answers. */

export const euro = (n: number) => `€${Math.round(n).toLocaleString("en-IE")}`;

export function median(values: number[]) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2;
}

export type PriceGuide = {
  count: number;
  median: number;
  low: number;
  high: number;
};

/** Returns a price guide only when enough real values exist to be meaningful. */
export function priceGuide(values: number[], minSample = 3): PriceGuide | null {
  if (values.length < minSample) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return {
    count: sorted.length,
    median: median(sorted)!,
    low: sorted[0]!,
    high: sorted[sorted.length - 1]!,
  };
}

/** Weighted average of published listing ratings. */
export function weightedRating(rated: { rating: number; count: number }[]) {
  const totalCount = rated.reduce((sum, r) => sum + r.count, 0);
  if (!totalCount) return null;
  const value = rated.reduce((sum, r) => sum + r.rating * r.count, 0) / totalCount;
  return { value, reviews: totalCount, listings: rated.length };
}
