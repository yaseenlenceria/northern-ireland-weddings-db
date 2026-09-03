import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const SUPPLIER_CARD_FIELDS =
  "id, slug, name, categories, county, avg_price, avg_price_num, overview, logo_image, gallery_images, featured, service_areas";

export const VENUE_CARD_FIELDS =
  "id, slug, name, county, badge, guest_capacity, capacity_min, capacity_max, per_person_price, per_person_price_num, rating, review_count, overview, logo_image, gallery_images, venue_types, styles, featured";

export type SupplierCardRow = {
  id: string;
  slug: string;
  name: string;
  categories: string[];
  county: string | null;
  avg_price: string | null;
  avg_price_num: number | null;
  overview: string | null;
  logo_image: string | null;
  gallery_images: string[] | null;
  featured: boolean;
  service_areas: string[] | null;
};

export type VenueCardRow = {
  id: string;
  slug: string;
  name: string;
  county: string | null;
  badge: string | null;
  guest_capacity: string | null;
  capacity_min: number | null;
  capacity_max: number | null;
  per_person_price: string | null;
  per_person_price_num: number | null;
  rating: number | null;
  review_count: number | null;
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

const listSuppliersSchema = z.object({
  category: z.string().optional(),
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
        SELECT id, slug, name, categories, county, avg_price, avg_price_num, overview,
               logo_image, gallery_images, featured, service_areas
        FROM suppliers
        WHERE (${data.category ?? null}::text IS NULL OR categories @> ARRAY[${data.category ?? ""}]::text[])
          AND (${data.county ?? null}::text IS NULL OR county = ${data.county ?? ""})
          AND (${data.q ?? null}::text IS NULL OR name ILIKE ${`%${data.q ?? ""}%`})
        ORDER BY featured DESC, image_count DESC NULLS LAST, name ASC
        LIMIT ${perPage} OFFSET ${offset}
      `) as SupplierCardRow[];
      const count = countValue(await sql<{ count: string }[]>`
        SELECT count(*)::text AS count
        FROM suppliers
        WHERE (${data.category ?? null}::text IS NULL OR categories @> ARRAY[${data.category ?? ""}]::text[])
          AND (${data.county ?? null}::text IS NULL OR county = ${data.county ?? ""})
          AND (${data.q ?? null}::text IS NULL OR name ILIKE ${`%${data.q ?? ""}%`})
      `);
      return { rows, count, page, perPage };
    } catch (error) {
      logPublicDataError("listSuppliers", error);
      return { ...emptyListResult, page, perPage };
    }
  });

const listVenuesSchema = z.object({
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
        SELECT id, slug, name, county, badge, guest_capacity, capacity_min, capacity_max,
               per_person_price, per_person_price_num, rating, review_count, overview,
               logo_image, gallery_images, venue_types, styles, featured
        FROM venues
        WHERE (${data.county ?? null}::text IS NULL OR county = ${data.county ?? ""})
          AND (${data.q ?? null}::text IS NULL OR name ILIKE ${`%${data.q ?? ""}%`})
          AND (${data.minCapacity ?? null}::integer IS NULL OR capacity_max >= ${data.minCapacity ?? 0})
          AND (${data.venueType ?? null}::text IS NULL OR venue_types @> ARRAY[${data.venueType ?? ""}]::text[])
        ORDER BY featured DESC, rating DESC NULLS LAST, name ASC
        LIMIT ${perPage} OFFSET ${offset}
      `) as VenueCardRow[];
      const count = countValue(await sql<{ count: string }[]>`
        SELECT count(*)::text AS count
        FROM venues
        WHERE (${data.county ?? null}::text IS NULL OR county = ${data.county ?? ""})
          AND (${data.q ?? null}::text IS NULL OR name ILIKE ${`%${data.q ?? ""}%`})
          AND (${data.minCapacity ?? null}::integer IS NULL OR capacity_max >= ${data.minCapacity ?? 0})
          AND (${data.venueType ?? null}::text IS NULL OR venue_types @> ARRAY[${data.venueType ?? ""}]::text[])
      `);
      return { rows, count, page, perPage };
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
          SELECT id, slug, name, categories, county, avg_price, avg_price_num, overview,
                 logo_image, gallery_images, featured, service_areas
          FROM suppliers
          WHERE id <> ${supplier.id}
            AND county IS NOT DISTINCT FROM ${supplier.county}
            AND categories && ${supplier.categories ?? []}::text[]
          ORDER BY featured DESC, image_count DESC NULLS LAST, name ASC
          LIMIT 4
        `,
      ]);

      return { supplier, reviews: [] as ReviewRow[], sourcedReviews: sourced, similar };
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
          SELECT id, slug, name, county, badge, guest_capacity, capacity_min, capacity_max,
                 per_person_price, per_person_price_num, rating, review_count, overview,
                 logo_image, gallery_images, venue_types, styles, featured
          FROM venues
          WHERE id <> ${venue.id}
            AND county IS NOT DISTINCT FROM ${venue.county}
          ORDER BY featured DESC, rating DESC NULLS LAST, name ASC
          LIMIT 4
        `,
      ]);

      return { venue, reviews: [] as ReviewRow[], sourcedReviews: sourced, similar };
    } catch (error) {
      logPublicDataError("getVenue", error);
      return null;
    }
  });

export const getHomeData = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const sql = await db();
    const [suppliers, venues, supplierCount, venueCount, fairCount] = await Promise.all([
      sql<SupplierCardRow[]>`
        SELECT id, slug, name, categories, county, avg_price, avg_price_num, overview,
               logo_image, gallery_images, featured, service_areas
        FROM suppliers
        WHERE logo_image IS NOT NULL
        ORDER BY image_count DESC NULLS LAST, featured DESC, name ASC
        LIMIT 8
      `,
      sql<VenueCardRow[]>`
        SELECT id, slug, name, county, badge, guest_capacity, capacity_min, capacity_max,
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
    ]);

    return {
      suppliers,
      venues,
      counts: {
        suppliers: countValue(supplierCount),
        venues: countValue(venueCount),
        fairs: countValue(fairCount),
      },
    };
  } catch (error) {
    logPublicDataError("getHomeData", error);
    return {
      suppliers: [] as SupplierCardRow[],
      venues: [] as VenueCardRow[],
      counts: { suppliers: 0, venues: 0, fairs: 0 },
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
  county: z.string().optional(),
});

export const getDirectoryStats = createServerFn({ method: "GET" })
  .validator((d: unknown) => directoryStatsSchema.parse(d))
  .handler(async ({ data }) => {
    try {
      const sql = await db();

      if (data.kind === "venues") {
        const rows = await sql<{ per_person_price_num: number | null; capacity_max: number | null; rating: number | null; review_count: number | null }[]>`
          SELECT per_person_price_num, capacity_max, rating, review_count
          FROM venues
          WHERE (${data.county ?? null}::text IS NULL OR county = ${data.county ?? ""})
          LIMIT 1000
        `;
        return {
          prices: rows.map((r) => r.per_person_price_num).filter((n): n is number => typeof n === "number" && n > 0),
          capacities: rows.map((r) => r.capacity_max).filter((n): n is number => typeof n === "number" && n > 0),
          rated: rows
            .filter((r) => r.rating && r.review_count)
            .map((r) => ({ rating: r.rating as number, count: r.review_count as number })),
        };
      }

      const rows = await sql<{ avg_price_num: number | null }[]>`
        SELECT avg_price_num
        FROM suppliers
        WHERE (${data.category ?? null}::text IS NULL OR categories @> ARRAY[${data.category ?? ""}]::text[])
          AND (${data.county ?? null}::text IS NULL OR county = ${data.county ?? ""})
        LIMIT 1000
      `;
      return {
        prices: rows.map((r) => r.avg_price_num).filter((n): n is number => typeof n === "number" && n > 0),
        capacities: [] as number[],
        rated: [] as { rating: number; count: number }[],
      };
    } catch (error) {
      logPublicDataError("getDirectoryStats", error);
      return {
        prices: [] as number[],
        capacities: [] as number[],
        rated: [] as { rating: number; count: number }[],
      };
    }
  });

export const getCountyStats = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ county: z.string() }).parse(d))
  .handler(async ({ data }) => {
    try {
      const sql = await db();
      const [suppliers, venues] = await Promise.all([
        sql<{ count: string }[]>`SELECT count(*)::text AS count FROM suppliers WHERE county = ${data.county}`,
        sql<{ count: string }[]>`SELECT count(*)::text AS count FROM venues WHERE county = ${data.county}`,
      ]);
      return { suppliers: countValue(suppliers), venues: countValue(venues) };
    } catch (error) {
      logPublicDataError("getCountyStats", error);
      return { suppliers: 0, venues: 0 };
    }
  });

export const getSupplierCategoryCounts = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const sql = await db();
    return await sql<{ category: string; count: number }[]>`
      SELECT category, count(*)::int AS count
      FROM suppliers
      CROSS JOIN LATERAL unnest(categories) AS category
      GROUP BY category
      ORDER BY count DESC, category ASC
    `;
  } catch (error) {
    logPublicDataError("getSupplierCategoryCounts", error);
    return [] as { category: string; count: number }[];
  }
});

export const getGuideHighlights = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const sql = await db();
    const [venues, suppliers] = await Promise.all([
      sql<{ slug: string; name: string; county: string | null; image: string | null }[]>`
        SELECT slug, name, county, COALESCE(logo_image, gallery_images[1]) AS image
        FROM venues
        WHERE COALESCE(logo_image, gallery_images[1]) IS NOT NULL
        ORDER BY rating DESC NULLS LAST, image_count DESC NULLS LAST, name ASC
        LIMIT 3
      `,
      sql<{ slug: string; name: string; county: string | null; image: string | null }[]>`
        SELECT slug, name, county, COALESCE(logo_image, gallery_images[1]) AS image
        FROM suppliers
        WHERE COALESCE(logo_image, gallery_images[1]) IS NOT NULL
        ORDER BY image_count DESC NULLS LAST, name ASC
        LIMIT 3
      `,
    ]);
    return { venues, suppliers };
  } catch (error) {
    logPublicDataError("getGuideHighlights", error);
    return {
      venues: [] as { slug: string; name: string; county: string | null; image: string | null }[],
      suppliers: [] as { slug: string; name: string; county: string | null; image: string | null }[],
    };
  }
});
