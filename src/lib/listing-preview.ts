import { imageCandidates, publicImageUrl } from "./media.ts";

type Preview = {
  gallery_images?: string[] | null;
  overview?: string | null;
};

/** Cards need fallback thumbnails, not an entire business photo gallery. */
export function listingPreview<T extends Preview>(row: T): T {
  return {
    ...row,
    gallery_images: imageCandidates(row.gallery_images).slice(0, 3).map(publicImageUrl),
    overview: row.overview ? row.overview.replace(/\s+/g, " ").trim().slice(0, 240) : row.overview,
  };
}
