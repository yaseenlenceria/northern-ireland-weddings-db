import fs from "node:fs/promises";
import postgres from "postgres";

async function loadEnvFile(file) {
  try {
    const text = await fs.readFile(file, "utf8");
    for (const rawLine of text.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#") || !line.includes("=")) continue;
      const [key, ...rest] = line.split("=");
      if (process.env[key]) continue;
      process.env[key] = rest
        .join("=")
        .trim()
        .replace(/^['"]|['"]$/g, "");
    }
  } catch {
    // Local env files are optional in Vercel builds and CI.
  }
}

await loadEnvFile(".env.local");
await loadEnvFile(".env");

const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!url) {
  console.error("Missing POSTGRES_URL or DATABASE_URL.");
  process.exit(2);
}

const sql = postgres(url, {
  ssl: "require",
  max: 1,
  idle_timeout: 20,
  connect_timeout: 15,
});

try {
  const venues = [
    {
      id: "14f0f3f1-1d15-5b6a-9001-5a4d29e2a001",
      slug: "demo-london-townhouse-wedding-venue",
      name: "Demo London Townhouse Wedding Venue",
      country: "United Kingdom",
      county: "London",
      badge: "Demo UK listing",
      guest_capacity: "60 to 160 guests",
      capacity_min: 60,
      capacity_max: 160,
      per_person_price: "Request pricing",
      overview:
        "Demo UK venue profile used to test WedHQ's UK location structure before the real UK directory import is added.",
      description:
        "This is a clearly marked demo listing. Replace it with real venue data when the UK workbook is ready.",
      venue_types: ["Townhouse", "City venue"],
      styles: ["Elegant", "Central"],
      facilities: ["Ceremony room", "Private dining", "Evening reception"],
      featured: false,
      source_url: "wedhq-demo",
      website: "https://wedhq.co.uk",
      image_count: 0,
    },
    {
      id: "14f0f3f1-1d15-5b6a-9001-5a4d29e2a002",
      slug: "demo-scotland-country-house-wedding-venue",
      name: "Demo Scotland Country House Wedding Venue",
      country: "United Kingdom",
      county: "Scotland",
      badge: "Demo UK listing",
      guest_capacity: "80 to 220 guests",
      capacity_min: 80,
      capacity_max: 220,
      per_person_price: "Request pricing",
      overview:
        "Demo UK venue profile for checking Scotland pages, venue filters and UK-wide directory pages.",
      description:
        "This is placeholder content for structure testing only. It should be replaced by real venue data later.",
      venue_types: ["Country house", "Exclusive use"],
      styles: ["Countryside", "Classic"],
      facilities: ["Guest accommodation", "Gardens", "Reception suite"],
      featured: false,
      source_url: "wedhq-demo",
      website: "https://wedhq.co.uk",
      image_count: 0,
    },
  ];

  const suppliers = [
    {
      id: "24f0f3f1-1d15-5b6a-9001-5a4d29e2b001",
      slug: "demo-london-wedding-photographer",
      name: "Demo London Wedding Photographer",
      categories: ["wedding-photographers"],
      country: "United Kingdom",
      county: "London",
      avg_price: "Request pricing",
      overview:
        "Demo UK supplier profile used to test WedHQ's UK supplier pages, category filters and enquiry journey.",
      description:
        "This is a placeholder profile for structure testing only. Replace it with real supplier data when available.",
      slogan: "Demo listing for UK structure testing",
      featured: false,
      award_winner: false,
      service_areas: ["London", "South East England"],
      source_url: "wedhq-demo",
      profile_url: "https://wedhq.co.uk",
      website: "https://wedhq.co.uk",
      image_count: 0,
    },
    {
      id: "24f0f3f1-1d15-5b6a-9001-5a4d29e2b002",
      slug: "demo-yorkshire-wedding-florist",
      name: "Demo Yorkshire Wedding Florist",
      categories: ["wedding-florists"],
      country: "United Kingdom",
      county: "Yorkshire",
      avg_price: "Request pricing",
      overview:
        "Demo UK florist profile for checking regional supplier discovery before the full UK data import.",
      description:
        "This profile is not a real supplier listing. It exists only so UK filters and page templates can be reviewed.",
      slogan: "Demo listing for UK structure testing",
      featured: false,
      award_winner: false,
      service_areas: ["Yorkshire", "North West England"],
      source_url: "wedhq-demo",
      profile_url: "https://wedhq.co.uk",
      website: "https://wedhq.co.uk",
      image_count: 0,
    },
  ];

  await sql`
    INSERT INTO venues ${sql(venues)}
    ON CONFLICT (id) DO UPDATE SET
      country = EXCLUDED.country,
      county = EXCLUDED.county,
      badge = EXCLUDED.badge,
      guest_capacity = EXCLUDED.guest_capacity,
      capacity_min = EXCLUDED.capacity_min,
      capacity_max = EXCLUDED.capacity_max,
      per_person_price = EXCLUDED.per_person_price,
      overview = EXCLUDED.overview,
      description = EXCLUDED.description,
      venue_types = EXCLUDED.venue_types,
      styles = EXCLUDED.styles,
      facilities = EXCLUDED.facilities,
      featured = EXCLUDED.featured,
      source_url = EXCLUDED.source_url,
      website = EXCLUDED.website,
      image_count = EXCLUDED.image_count,
      updated_at = now()
  `;

  await sql`
    INSERT INTO suppliers ${sql(suppliers)}
    ON CONFLICT (id) DO UPDATE SET
      categories = EXCLUDED.categories,
      country = EXCLUDED.country,
      county = EXCLUDED.county,
      avg_price = EXCLUDED.avg_price,
      overview = EXCLUDED.overview,
      description = EXCLUDED.description,
      slogan = EXCLUDED.slogan,
      featured = EXCLUDED.featured,
      award_winner = EXCLUDED.award_winner,
      service_areas = EXCLUDED.service_areas,
      source_url = EXCLUDED.source_url,
      profile_url = EXCLUDED.profile_url,
      website = EXCLUDED.website,
      image_count = EXCLUDED.image_count,
      updated_at = now()
  `;

  const [summary] = await sql`
    SELECT
      (SELECT count(*)::int FROM venues WHERE country = 'United Kingdom' AND source_url = 'wedhq-demo') AS demo_venues,
      (SELECT count(*)::int FROM suppliers WHERE country = 'United Kingdom' AND source_url = 'wedhq-demo') AS demo_suppliers
  `;
  console.log(JSON.stringify(summary));
} finally {
  await sql.end();
}
