import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { publicImageUrl } from "@/lib/media";

export const SUPPLIER_CARD_FIELDS =
  "id, slug, name, categories, country, county, avg_price, avg_price_num, rating, review_count, overview, logo_image, banner_image, gallery_images, featured, award_winner, service_areas";

export const VENUE_CARD_FIELDS =
  "id, slug, name, country, county, badge, guest_capacity, capacity_min, capacity_max, per_person_price, per_person_price_num, rating, review_count, overview, logo_image, gallery_images, venue_types, styles, featured";

export type SupplierCardRow = {
  id: string;
  slug: string;
  name: string;
  categories: string[];
  country: string | null;
  county: string | null;
  avg_price: string | null;
  avg_price_num: number | string | null;
  rating: number | string | null;
  review_count: number | string | null;
  overview: string | null;
  logo_image: string | null;
  banner_image: string | null;
  gallery_images: string[] | null;
  featured: boolean;
  award_winner: boolean;
  service_areas: string[] | null;
};

export type VenueCardRow = {
  id: string;
  slug: string;
  name: string;
  country: string | null;
  county: string | null;
  badge: string | null;
  guest_capacity: string | null;
  capacity_min: number | null;
  capacity_max: number | null;
  per_person_price: string | null;
  per_person_price_num: number | string | null;
  rating: number | string | null;
  review_count: number | string | null;
  overview: string | null;
  logo_image: string | null;
  gallery_images: string[] | null;
  venue_types: string[] | null;
  styles: string[] | null;
  featured: boolean;
};

type ReviewRow = {
  id: string;
  author_name: string | null;
  rating: number | null;
  title: string | null;
  body: string;
  created_at?: string;
  review_date?: string | null;
  source_name?: string | null;
  source_url?: string | null;
};

type DirectoryLocationStat = {
  county: string | null;
  country: string | null;
  count: number;
};

type DirectoryTermStat = {
  label: string;
  count: number;
};

const emptyListResult = { rows: [], count: 0, page: 1, perPage: 24 };

function logPublicDataError(scope: string, error: unknown) {
  console.error(`[Directory public data] ${scope} failed`, error);
}

async function db() {
  const { sql } = await import("@/lib/postgres.server");
  return sql();
}

function countValue(rows: { count: string | number }[]) {
  return Number(rows[0]?.count ?? 0);
}

function numericValue(value: number | string | null | undefined) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

type ImageBearing = {
  logo_image?: string | null;
  banner_image?: string | null;
  gallery_images?: string[] | null;
  image?: string | null;
  source_url?: string | null;
  source_site?: string | null;
  profile_url?: string | null;
  facebook_url?: string | null;
  instagram_url?: string | null;
  tiktok_url?: string | null;
  youtube_url?: string | null;
  twitter_url?: string | null;
};

function proxyImage(value?: string | null) {
  return value ? publicImageUrl(value) : value;
}

function sanitizeImages<T extends ImageBearing>(row: T): T {
  return {
    ...row,
    logo_image: proxyImage(row.logo_image),
    banner_image: proxyImage(row.banner_image),
    image: proxyImage(row.image),
    gallery_images: row.gallery_images?.map(publicImageUrl) ?? row.gallery_images,
  };
}

function sanitizeDetail<T extends ImageBearing>(row: T): T {
  const demoSource = row.source_url === "wedhq-demo" ? "wedhq-demo" : null;
  return {
    ...sanitizeImages(row),
    source_url: demoSource,
    source_site: null,
    profile_url: null,
    facebook_url: publicExternalUrl(row.facebook_url),
    instagram_url: publicExternalUrl(row.instagram_url),
    tiktok_url: publicExternalUrl(row.tiktok_url),
    youtube_url: publicExternalUrl(row.youtube_url),
    twitter_url: publicExternalUrl(row.twitter_url),
  };
}

function sanitizeReview(row: ReviewRow): ReviewRow {
  return {
    ...row,
    source_name: null,
    source_url: null,
  };
}

function publicExternalUrl(value?: string | null) {
  if (!value) return value ?? null;
  try {
    const url = new URL(value);
    if (url.hostname.toLowerCase().includes("hitched.")) return null;
  } catch {
    return null;
  }
  return value;
}

const listSuppliersSchema = z.object({
  category: z.string().optional(),
  country: z.string().optional(),
  county: z.string().optional(),
  q: z.string().optional(),
  page: z.number().int().optional(),
  perPage: z.number().int().optional(),
});

export const listSuppliers = createServerFn({ method: "GET" })
  .validator((d: unknown) => listSuppliersSchema.parse(d ?? {}))
  .handler(async ({ data }) => {
    const perPage = Math.min(Math.max(data.perPage ?? 24, 1), 60);
    const page = Math.max(data.page ?? 1, 1);
    const offset = (page - 1) * perPage;

    try {
      const sql = await db();
      const rows = (await sql<SupplierCardRow[]>`
        SELECT id, slug, name, categories, country, county, avg_price, avg_price_num, overview,
               rating, review_count, logo_image, banner_image, gallery_images,
               featured, award_winner, service_areas
        FROM suppliers
        WHERE (${data.category ?? null}::text IS NULL OR categories @> ARRAY[${data.category ?? ""}]::text[])
          AND (${data.country ?? null}::text IS NULL OR country = ${data.country ?? ""})
          AND (${data.county ?? null}::text IS NULL OR regexp_replace(county, '^Co\\.?\\s+', '', 'i') = ${data.county ?? ""})
          AND (${data.q ?? null}::text IS NULL OR name ILIKE ${`%${data.q ?? ""}%`})
        ORDER BY (COALESCE(banner_image, logo_image, gallery_images[1]) IS NOT NULL) DESC,
                 featured DESC, award_winner DESC, rating DESC NULLS LAST, image_count DESC NULLS LAST, name ASC
        LIMIT ${perPage} OFFSET ${offset}
      `) as SupplierCardRow[];
      const count = countValue(
        await sql<{ count: string }[]>`
        SELECT count(*)::text AS count
        FROM suppliers
        WHERE (${data.category ?? null}::text IS NULL OR categories @> ARRAY[${data.category ?? ""}]::text[])
          AND (${data.country ?? null}::text IS NULL OR country = ${data.country ?? ""})
          AND (${data.county ?? null}::text IS NULL OR regexp_replace(county, '^Co\\.?\\s+', '', 'i') = ${data.county ?? ""})
          AND (${data.q ?? null}::text IS NULL OR name ILIKE ${`%${data.q ?? ""}%`})
      `,
      );
      return { rows: rows.map(sanitizeImages), count, page, perPage };
    } catch (error) {
      logPublicDataError("listSuppliers", error);
      return { ...emptyListResult, page, perPage };
    }
  });

const listVenuesSchema = z.object({
  country: z.string().optional(),
  county: z.string().optional(),
  q: z.string().optional(),
  minCapacity: z.number().optional(),
  venueType: z.string().optional(),
  page: z.number().int().optional(),
  perPage: z.number().int().optional(),
});

export const listVenues = createServerFn({ method: "GET" })
  .validator((d: unknown) => listVenuesSchema.parse(d ?? {}))
  .handler(async ({ data }) => {
    const perPage = Math.min(Math.max(data.perPage ?? 24, 1), 60);
    const page = Math.max(data.page ?? 1, 1);
    const offset = (page - 1) * perPage;

    try {
      const sql = await db();
      const rows = (await sql<VenueCardRow[]>`
        SELECT id, slug, name, country, county, badge, guest_capacity, capacity_min, capacity_max,
               per_person_price, per_person_price_num, rating, review_count, overview,
               logo_image, gallery_images, venue_types, styles, featured
        FROM venues
        WHERE (${data.country ?? null}::text IS NULL OR country = ${data.country ?? ""})
          AND (${data.county ?? null}::text IS NULL OR regexp_replace(county, '^Co\\.?\\s+', '', 'i') = ${data.county ?? ""})
          AND (${data.q ?? null}::text IS NULL OR name ILIKE ${`%${data.q ?? ""}%`})
          AND (${data.minCapacity ?? null}::integer IS NULL OR capacity_max >= ${data.minCapacity ?? 0})
          AND (${data.venueType ?? null}::text IS NULL OR venue_types @> ARRAY[${data.venueType ?? ""}]::text[])
        ORDER BY (COALESCE(logo_image, gallery_images[1]) IS NOT NULL) DESC,
                 featured DESC, rating DESC NULLS LAST, image_count DESC NULLS LAST, name ASC
        LIMIT ${perPage} OFFSET ${offset}
      `) as VenueCardRow[];
      const count = countValue(
        await sql<{ count: string }[]>`
        SELECT count(*)::text AS count
        FROM venues
        WHERE (${data.country ?? null}::text IS NULL OR country = ${data.country ?? ""})
          AND (${data.county ?? null}::text IS NULL OR regexp_replace(county, '^Co\\.?\\s+', '', 'i') = ${data.county ?? ""})
          AND (${data.q ?? null}::text IS NULL OR name ILIKE ${`%${data.q ?? ""}%`})
          AND (${data.minCapacity ?? null}::integer IS NULL OR capacity_max >= ${data.minCapacity ?? 0})
          AND (${data.venueType ?? null}::text IS NULL OR venue_types @> ARRAY[${data.venueType ?? ""}]::text[])
      `,
      );
      return { rows: rows.map(sanitizeImages), count, page, perPage };
    } catch (error) {
      logPublicDataError("listVenues", error);
      return { ...emptyListResult, page, perPage };
    }
  });

export const getSupplier = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ slug: z.string() }).parse(d))
  .handler(async ({ data }) => {
    try {
      const sql = await db();
      const suppliers = await sql`
        SELECT *
        FROM suppliers
        WHERE slug = ${data.slug}
        LIMIT 1
      `;
      const supplier = suppliers[0];
      if (!supplier) return null;

      const [sourced, similar] = await Promise.all([
        sql<ReviewRow[]>`
          SELECT id, author_name, rating, title, body, review_date, source_name, source_url
          FROM imported_reviews
          WHERE supplier_id = ${supplier.id}
          ORDER BY review_date DESC NULLS LAST, created_at DESC
          LIMIT 20
        `,
        sql<SupplierCardRow[]>`
          SELECT id, slug, name, categories, country, county, avg_price, avg_price_num, overview,
                 rating, review_count, logo_image, banner_image, gallery_images,
                 featured, award_winner, service_areas
          FROM suppliers
          WHERE id <> ${supplier.id}
            AND county IS NOT DISTINCT FROM ${supplier.county}
            AND country IS NOT DISTINCT FROM ${supplier.country}
            AND categories && ${supplier.categories ?? []}::text[]
          ORDER BY (COALESCE(banner_image, logo_image, gallery_images[1]) IS NOT NULL) DESC,
                   featured DESC, award_winner DESC, rating DESC NULLS LAST, image_count DESC NULLS LAST, name ASC
          LIMIT 4
        `,
      ]);

      return {
        supplier: sanitizeDetail(supplier),
        reviews: [] as ReviewRow[],
        sourcedReviews: sourced.map(sanitizeReview),
        similar: similar.map(sanitizeImages),
      };
    } catch (error) {
      logPublicDataError("getSupplier", error);
      return null;
    }
  });

export const getVenue = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ slug: z.string() }).parse(d))
  .handler(async ({ data }) => {
    try {
      const sql = await db();
      const venues = await sql`
        SELECT *
        FROM venues
        WHERE slug = ${data.slug}
        LIMIT 1
      `;
      const venue = venues[0];
      if (!venue) return null;

      const [sourced, similar] = await Promise.all([
        sql<ReviewRow[]>`
          SELECT id, author_name, rating, title, body, review_date, source_name, source_url
          FROM imported_reviews
          WHERE venue_id = ${venue.id}
          ORDER BY review_date DESC NULLS LAST, created_at DESC
          LIMIT 20
        `,
        sql<VenueCardRow[]>`
          SELECT id, slug, name, country, county, badge, guest_capacity, capacity_min, capacity_max,
                 per_person_price, per_person_price_num, rating, review_count, overview,
                 logo_image, gallery_images, venue_types, styles, featured
          FROM venues
          WHERE id <> ${venue.id}
            AND county IS NOT DISTINCT FROM ${venue.county}
            AND country IS NOT DISTINCT FROM ${venue.country}
          ORDER BY (COALESCE(logo_image, gallery_images[1]) IS NOT NULL) DESC,
                   featured DESC, rating DESC NULLS LAST, image_count DESC NULLS LAST, name ASC
          LIMIT 4
        `,
      ]);

      return {
        venue: sanitizeDetail(venue),
        reviews: [] as ReviewRow[],
        sourcedReviews: sourced.map(sanitizeReview),
        similar: similar.map(sanitizeImages),
      };
    } catch (error) {
      logPublicDataError("getVenue", error);
      return null;
    }
  });

export const getHomeData = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const sql = await db();
    const [suppliers, venues, supplierCount, venueCount, fairCount, categoryCounts] =
      await Promise.all([
        sql<SupplierCardRow[]>`
        WITH priority_categories AS (
          SELECT unnest(ARRAY[
            'wedding-photographers',
            'wedding-videographers',
            'wedding-bands',
            'church-singers-music',
            'wedding-florists',
            'wedding-planners',
            'wedding-celebrants',
            'wedding-djs'
          ]::text[]) AS category
        ),
        picked AS (
          SELECT DISTINCT ON (pc.category)
            s.id, s.slug, s.name, s.categories, s.country, s.county, s.avg_price, s.avg_price_num,
            s.rating, s.review_count, s.overview, s.logo_image, s.banner_image,
            s.gallery_images, s.featured, s.award_winner, s.service_areas,
            pc.category
          FROM priority_categories pc
          JOIN suppliers s ON s.categories @> ARRAY[pc.category]::text[]
          WHERE COALESCE(s.banner_image, s.logo_image, s.gallery_images[1]) IS NOT NULL
          ORDER BY pc.category, s.featured DESC, s.award_winner DESC, s.rating DESC NULLS LAST, s.image_count DESC NULLS LAST, s.name ASC
        )
        SELECT id, slug, name, categories, country, county, avg_price, avg_price_num, overview,
               rating, review_count, logo_image, banner_image, gallery_images,
               featured, award_winner, service_areas
        FROM picked
        ORDER BY array_position(ARRAY[
          'wedding-photographers',
          'wedding-videographers',
          'wedding-bands',
          'church-singers-music',
          'wedding-florists',
          'wedding-planners',
          'wedding-celebrants',
          'wedding-djs'
        ]::text[], category)
        LIMIT 8
      `,
        sql<VenueCardRow[]>`
        SELECT id, slug, name, country, county, badge, guest_capacity, capacity_min, capacity_max,
               per_person_price, per_person_price_num, rating, review_count, overview,
               logo_image, gallery_images, venue_types, styles, featured
        FROM venues
        WHERE logo_image IS NOT NULL
        ORDER BY rating DESC NULLS LAST, image_count DESC NULLS LAST, name ASC
        LIMIT 6
      `,
        sql<{ count: string }[]>`SELECT count(*)::text AS count FROM suppliers`,
        sql<{ count: string }[]>`SELECT count(*)::text AS count FROM venues`,
        sql<{ count: string }[]>`SELECT count(*)::text AS count FROM wedding_fairs`,
        sql<{ category: string; count: number }[]>`
        SELECT category, count(*)::int AS count
        FROM suppliers
        CROSS JOIN LATERAL unnest(categories) AS category
        GROUP BY category
      `,
      ]);

    return {
      suppliers: suppliers.map(sanitizeImages),
      venues: venues.map(sanitizeImages),
      counts: {
        suppliers: countValue(supplierCount),
        venues: countValue(venueCount),
        fairs: countValue(fairCount),
      },
      categoryCounts,
    };
  } catch (error) {
    logPublicDataError("getHomeData", error);
    return {
      suppliers: [] as SupplierCardRow[],
      venues: [] as VenueCardRow[],
      counts: { suppliers: 0, venues: 0, fairs: 0 },
      categoryCounts: [] as { category: string; count: number }[],
    };
  }
});

export const listFairs = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const sql = await db();
    return await sql`
      SELECT *
      FROM wedding_fairs
      ORDER BY name ASC
    `;
  } catch (error) {
    logPublicDataError("listFairs", error);
    return [];
  }
});

const directoryStatsSchema = z.object({
  kind: z.enum(["suppliers", "venues"]),
  category: z.string().optional(),
  country: z.string().optional(),
  county: z.string().optional(),
});

export const getDirectoryStats = createServerFn({ method: "GET" })
  .validator((d: unknown) => directoryStatsSchema.parse(d))
  .handler(async ({ data }) => {
    try {
      const sql = await db();

      if (data.kind === "venues") {
        const [rows, topLocations, venueTypes, styles, imageRows] = await Promise.all([
          sql<
            {
              per_person_price_num: number | string | null;
              capacity_max: number | null;
              rating: number | string | null;
              review_count: number | null;
            }[]
          >`
            SELECT per_person_price_num, capacity_max, rating, review_count
            FROM venues
            WHERE (${data.country ?? null}::text IS NULL OR country = ${data.country ?? ""})
              AND (${data.county ?? null}::text IS NULL OR regexp_replace(county, '^Co\\.?\\s+', '', 'i') = ${data.county ?? ""})
            LIMIT 1000
          `,
          sql<DirectoryLocationStat[]>`
            SELECT county, country, count(*)::int AS count
            FROM venues
            WHERE (${data.country ?? null}::text IS NULL OR country = ${data.country ?? ""})
              AND (${data.county ?? null}::text IS NULL OR regexp_replace(county, '^Co\\.?\\s+', '', 'i') = ${data.county ?? ""})
              AND county IS NOT NULL
            GROUP BY county, country
            ORDER BY count DESC, county ASC
            LIMIT 8
          `,
          sql<DirectoryTermStat[]>`
            SELECT term.label, count(*)::int AS count
            FROM venues
            CROSS JOIN LATERAL unnest(venue_types) AS term(label)
            WHERE (${data.country ?? null}::text IS NULL OR country = ${data.country ?? ""})
              AND (${data.county ?? null}::text IS NULL OR regexp_replace(county, '^Co\\.?\\s+', '', 'i') = ${data.county ?? ""})
            GROUP BY term.label
            ORDER BY count DESC, term.label ASC
            LIMIT 6
          `,
          sql<DirectoryTermStat[]>`
            SELECT term.label, count(*)::int AS count
            FROM venues
            CROSS JOIN LATERAL unnest(styles) AS term(label)
            WHERE (${data.country ?? null}::text IS NULL OR country = ${data.country ?? ""})
              AND (${data.county ?? null}::text IS NULL OR regexp_replace(county, '^Co\\.?\\s+', '', 'i') = ${data.county ?? ""})
            GROUP BY term.label
            ORDER BY count DESC, term.label ASC
            LIMIT 6
          `,
          sql<{ count: number }[]>`
            SELECT count(*)::int AS count
            FROM venues
            WHERE (${data.country ?? null}::text IS NULL OR country = ${data.country ?? ""})
              AND (${data.county ?? null}::text IS NULL OR regexp_replace(county, '^Co\\.?\\s+', '', 'i') = ${data.county ?? ""})
              AND COALESCE(logo_image, gallery_images[1]) IS NOT NULL
          `,
        ]);
        const prices = rows
          .map((r) => numericValue(r.per_person_price_num))
          .filter((n): n is number => n !== null && n > 0);
        const rated = rows
          .map((r) => ({ rating: numericValue(r.rating), count: numericValue(r.review_count) }))
          .filter(
            (r): r is { rating: number; count: number } =>
              r.rating !== null && r.count !== null && r.count > 0,
          );
        return {
          prices,
          capacities: rows
            .map((r) => r.capacity_max)
            .filter((n): n is number => typeof n === "number" && n > 0),
          rated,
          topLocations,
          popularTerms: [...venueTypes, ...styles].slice(0, 8),
          imageCount: Number(imageRows[0]?.count ?? 0),
        };
      }

      const [rows, topLocations, categories, serviceAreas, imageRows] = await Promise.all([
        sql<
          {
            avg_price_num: number | string | null;
            rating: number | string | null;
            review_count: number | null;
          }[]
        >`
          SELECT avg_price_num, rating, review_count
          FROM suppliers
          WHERE (${data.category ?? null}::text IS NULL OR categories @> ARRAY[${data.category ?? ""}]::text[])
            AND (${data.country ?? null}::text IS NULL OR country = ${data.country ?? ""})
            AND (${data.county ?? null}::text IS NULL OR regexp_replace(county, '^Co\\.?\\s+', '', 'i') = ${data.county ?? ""})
          LIMIT 1000
        `,
        sql<DirectoryLocationStat[]>`
          SELECT county, country, count(*)::int AS count
          FROM suppliers
          WHERE (${data.category ?? null}::text IS NULL OR categories @> ARRAY[${data.category ?? ""}]::text[])
            AND (${data.country ?? null}::text IS NULL OR country = ${data.country ?? ""})
            AND (${data.county ?? null}::text IS NULL OR regexp_replace(county, '^Co\\.?\\s+', '', 'i') = ${data.county ?? ""})
            AND county IS NOT NULL
          GROUP BY county, country
          ORDER BY count DESC, county ASC
          LIMIT 8
        `,
        sql<DirectoryTermStat[]>`
          SELECT term.label, count(*)::int AS count
          FROM suppliers
          CROSS JOIN LATERAL unnest(categories) AS term(label)
          WHERE (${data.category ?? null}::text IS NULL OR categories @> ARRAY[${data.category ?? ""}]::text[])
            AND (${data.country ?? null}::text IS NULL OR country = ${data.country ?? ""})
            AND (${data.county ?? null}::text IS NULL OR regexp_replace(county, '^Co\\.?\\s+', '', 'i') = ${data.county ?? ""})
          GROUP BY term.label
          ORDER BY count DESC, term.label ASC
          LIMIT 6
        `,
        sql<DirectoryTermStat[]>`
          SELECT term.label, count(*)::int AS count
          FROM suppliers
          CROSS JOIN LATERAL unnest(service_areas) AS term(label)
          WHERE (${data.category ?? null}::text IS NULL OR categories @> ARRAY[${data.category ?? ""}]::text[])
            AND (${data.country ?? null}::text IS NULL OR country = ${data.country ?? ""})
            AND (${data.county ?? null}::text IS NULL OR regexp_replace(county, '^Co\\.?\\s+', '', 'i') = ${data.county ?? ""})
          GROUP BY term.label
          ORDER BY count DESC, term.label ASC
          LIMIT 6
        `,
        sql<{ count: number }[]>`
          SELECT count(*)::int AS count
          FROM suppliers
          WHERE (${data.category ?? null}::text IS NULL OR categories @> ARRAY[${data.category ?? ""}]::text[])
            AND (${data.country ?? null}::text IS NULL OR country = ${data.country ?? ""})
            AND (${data.county ?? null}::text IS NULL OR regexp_replace(county, '^Co\\.?\\s+', '', 'i') = ${data.county ?? ""})
            AND COALESCE(banner_image, logo_image, gallery_images[1]) IS NOT NULL
        `,
      ]);
      const prices = rows
        .map((r) => numericValue(r.avg_price_num))
        .filter((n): n is number => n !== null && n > 0);
      const rated = rows
        .map((r) => ({ rating: numericValue(r.rating), count: numericValue(r.review_count) }))
        .filter(
          (r): r is { rating: number; count: number } =>
            r.rating !== null && r.count !== null && r.count > 0,
        );
      return {
        prices,
        capacities: [] as number[],
        rated,
        topLocations,
        popularTerms: [...categories, ...serviceAreas].slice(0, 8),
        imageCount: Number(imageRows[0]?.count ?? 0),
      };
    } catch (error) {
      logPublicDataError("getDirectoryStats", error);
      return {
        prices: [] as number[],
        capacities: [] as number[],
        rated: [] as { rating: number; count: number }[],
        topLocations: [] as DirectoryLocationStat[],
        popularTerms: [] as DirectoryTermStat[],
        imageCount: 0,
      };
    }
  });

export const getCountyStats = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ county: z.string(), country: z.string().optional() }).parse(d))
  .handler(async ({ data }) => {
    try {
      const sql = await db();
      const [suppliers, venues] = await Promise.all([
        sql<
          { count: string }[]
        >`SELECT count(*)::text AS count FROM suppliers WHERE regexp_replace(county, '^Co\\.?\\s+', '', 'i') = ${data.county} AND (${data.country ?? null}::text IS NULL OR country = ${data.country ?? ""})`,
        sql<
          { count: string }[]
        >`SELECT count(*)::text AS count FROM venues WHERE regexp_replace(county, '^Co\\.?\\s+', '', 'i') = ${data.county} AND (${data.country ?? null}::text IS NULL OR country = ${data.country ?? ""})`,
      ]);
      return { suppliers: countValue(suppliers), venues: countValue(venues) };
    } catch (error) {
      logPublicDataError("getCountyStats", error);
      return { suppliers: 0, venues: 0 };
    }
  });

const categoryCountsSchema = z.object({
  country: z.string().optional(),
  county: z.string().optional(),
});

export const getSupplierCategoryCounts = createServerFn({ method: "GET" })
  .validator((d: unknown) => categoryCountsSchema.parse(d ?? {}))
  .handler(async ({ data }) => {
    try {
      const sql = await db();
      return await sql<{ category: string; count: number }[]>`
        SELECT category, count(*)::int AS count
        FROM suppliers
        CROSS JOIN LATERAL unnest(categories) AS category
        WHERE (${data.country ?? null}::text IS NULL OR country = ${data.country ?? ""})
          AND (${data.county ?? null}::text IS NULL OR regexp_replace(county, '^Co\\.?\\s+', '', 'i') = ${data.county ?? ""})
        GROUP BY category
        ORDER BY count DESC, category ASC
      `;
    } catch (error) {
      logPublicDataError("getSupplierCategoryCounts", error);
      return [] as { category: string; count: number }[];
    }
  });

export const getHeaderHighlights = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const sql = await db();
    const [venues, suppliers] = await Promise.all([
      sql<{ slug: string; name: string; country: string | null; county: string | null; image: string | null }[]>`
        SELECT slug, name, country, county, COALESCE(logo_image, gallery_images[1]) AS image
        FROM venues
        WHERE COALESCE(logo_image, gallery_images[1]) IS NOT NULL
        ORDER BY featured DESC, rating DESC NULLS LAST, image_count DESC NULLS LAST, name ASC
        LIMIT 2
      `,
      sql<
        {
          slug: string;
          name: string;
          country: string | null;
          county: string | null;
          image: string | null;
          category: string | null;
        }[]
      >`
        SELECT slug, name, country, county, COALESCE(banner_image, logo_image, gallery_images[1]) AS image, categories[1] AS category
        FROM suppliers
        WHERE COALESCE(banner_image, logo_image, gallery_images[1]) IS NOT NULL
          AND NOT categories @> ARRAY['hens-stags']::text[]
        ORDER BY featured DESC, award_winner DESC, rating DESC NULLS LAST, image_count DESC NULLS LAST, name ASC
        LIMIT 2
      `,
    ]);
    return { venues: venues.map(sanitizeImages), suppliers: suppliers.map(sanitizeImages) };
  } catch (error) {
    logPublicDataError("getHeaderHighlights", error);
    return {
      venues: [] as { slug: string; name: string; country: string | null; county: string | null; image: string | null }[],
      suppliers: [] as {
        slug: string;
        name: string;
        country: string | null;
        county: string | null;
        image: string | null;
        category: string | null;
      }[],
    };
  }
});

export const getGuideHighlights = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const sql = await db();
    const [venues, suppliers] = await Promise.all([
      sql<{ slug: string; name: string; country: string | null; county: string | null; image: string | null }[]>`
        SELECT slug, name, country, county, COALESCE(logo_image, gallery_images[1]) AS image
        FROM venues
        WHERE COALESCE(logo_image, gallery_images[1]) IS NOT NULL
        ORDER BY rating DESC NULLS LAST, image_count DESC NULLS LAST, name ASC
        LIMIT 3
      `,
      sql<{ slug: string; name: string; country: string | null; county: string | null; image: string | null }[]>`
        SELECT slug, name, country, county, COALESCE(banner_image, logo_image, gallery_images[1]) AS image
        FROM suppliers
        WHERE COALESCE(banner_image, logo_image, gallery_images[1]) IS NOT NULL
        ORDER BY rating DESC NULLS LAST, image_count DESC NULLS LAST, name ASC
        LIMIT 3
      `,
    ]);
    return { venues: venues.map(sanitizeImages), suppliers: suppliers.map(sanitizeImages) };
  } catch (error) {
    logPublicDataError("getGuideHighlights", error);
    return {
      venues: [] as { slug: string; name: string; country: string | null; county: string | null; image: string | null }[],
      suppliers: [] as {
        slug: string;
        name: string;
        country: string | null;
        county: string | null;
        image: string | null;
      }[],
    };
  }
});
