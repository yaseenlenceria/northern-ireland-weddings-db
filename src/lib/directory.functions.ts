import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

/** Publishable-key client for public directory reads. RLS applies as anon. */
function publicClient() {
  return createClient<Database>(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_PUBLISHABLE_KEY"]!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

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

const listSuppliersSchema = z.object({
  category: z.string().optional(),
  county: z.string().optional(),
  q: z.string().optional(),
  page: z.number().int().optional(),
  perPage: z.number().int().optional(),
});

export const listSuppliers = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => listSuppliersSchema.parse(d ?? {}))
  .handler(async ({ data }) => {
    const perPage = Math.min(Math.max(data.perPage ?? 24, 1), 60);
    const page = Math.max(data.page ?? 1, 1);
    const from = (page - 1) * perPage;

    let query = publicClient()
      .from("suppliers")
      .select(SUPPLIER_CARD_FIELDS, { count: "estimated" })
      .order("featured", { ascending: false })
      .order("image_count", { ascending: false, nullsFirst: false })
      .order("name", { ascending: true })
      .range(from, from + perPage - 1);

    if (data.category) query = query.contains("categories", [data.category]);
    if (data.county) query = query.eq("county", data.county);
    if (data.q) query = query.ilike("name", `%${data.q}%`);

    const { data: rows, count, error } = await query;
    if (error) throw new Error(error.message);
    return {
      rows: (rows ?? []) as unknown as SupplierCardRow[],
      count: count ?? 0,
      page,
      perPage,
    };
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
  .inputValidator((d: unknown) => listVenuesSchema.parse(d ?? {}))
  .handler(async ({ data }) => {
    const perPage = Math.min(Math.max(data.perPage ?? 24, 1), 60);
    const page = Math.max(data.page ?? 1, 1);
    const from = (page - 1) * perPage;

    let query = publicClient()
      .from("venues")
      .select(VENUE_CARD_FIELDS, { count: "estimated" })
      .order("featured", { ascending: false })
      .order("rating", { ascending: false, nullsFirst: false })
      .order("name", { ascending: true })
      .range(from, from + perPage - 1);

    if (data.county) query = query.eq("county", data.county);
    if (data.q) query = query.ilike("name", `%${data.q}%`);
    if (data.minCapacity) query = query.gte("capacity_max", data.minCapacity);
    if (data.venueType) query = query.contains("venue_types", [data.venueType]);

    const { data: rows, count, error } = await query;
    if (error) throw new Error(error.message);
    return { rows: (rows ?? []) as unknown as VenueCardRow[], count: count ?? 0, page, perPage };
  });

export const getSupplier = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: supplier, error } = await sb
      .from("suppliers")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!supplier) return null;

    const [{ data: reviews }, { data: similar }] = await Promise.all([
      sb
        .from("reviews")
        .select("id, author_name, rating, title, body, created_at")
        .eq("supplier_id", supplier.id)
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .limit(20),
      sb
        .from("suppliers")
        .select(SUPPLIER_CARD_FIELDS)
        .contains("categories", [supplier.categories?.[0] ?? ""])
        .eq("county", supplier.county ?? "")
        .neq("id", supplier.id)
        .limit(4),
    ]);

    return {
      supplier,
      reviews: reviews ?? [],
      similar: (similar ?? []) as unknown as SupplierCardRow[],
    };
  });

export const getVenue = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: venue, error } = await sb
      .from("venues")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!venue) return null;

    const [{ data: reviews }, { data: similar }] = await Promise.all([
      sb
        .from("reviews")
        .select("id, author_name, rating, title, body, created_at")
        .eq("venue_id", venue.id)
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .limit(20),
      sb
        .from("venues")
        .select(VENUE_CARD_FIELDS)
        .eq("county", venue.county ?? "")
        .neq("id", venue.id)
        .limit(4),
    ]);

    return { venue, reviews: reviews ?? [], similar: (similar ?? []) as unknown as VenueCardRow[] };
  });

export const getHomeData = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const [suppliers, venues, supplierCount, venueCount, fairCount] = await Promise.all([
    sb
      .from("suppliers")
      .select(SUPPLIER_CARD_FIELDS)
      .not("logo_image", "is", null)
      .order("image_count", { ascending: false, nullsFirst: false })
      .limit(8),
    sb
      .from("venues")
      .select(VENUE_CARD_FIELDS)
      .not("logo_image", "is", null)
      .order("rating", { ascending: false, nullsFirst: false })
      .limit(6),
    sb.from("suppliers").select("id", { count: "exact", head: true }),
    sb.from("venues").select("id", { count: "exact", head: true }),
    sb.from("wedding_fairs").select("id", { count: "exact", head: true }),
  ]);

  return {
    suppliers: (suppliers.data ?? []) as unknown as SupplierCardRow[],
    venues: (venues.data ?? []) as unknown as VenueCardRow[],
    counts: {
      suppliers: supplierCount.count ?? 0,
      venues: venueCount.count ?? 0,
      fairs: fairCount.count ?? 0,
    },
  };
});

export const listFairs = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("wedding_fairs")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getCountyStats = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ county: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const [suppliers, venues] = await Promise.all([
      sb.from("suppliers").select("id", { count: "exact", head: true }).eq("county", data.county),
      sb.from("venues").select("id", { count: "exact", head: true }).eq("county", data.county),
    ]);
    return { suppliers: suppliers.count ?? 0, venues: venues.count ?? 0 };
  });
