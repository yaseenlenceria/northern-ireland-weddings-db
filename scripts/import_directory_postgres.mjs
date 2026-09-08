import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

const root = process.cwd();
const payloadPath = path.join(root, "work", "directory-import-payload.json");

function loadEnv(text) {
  const env = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const [key, ...rest] = line.split("=");
    const value = rest
      .join("=")
      .trim()
      .replace(/^['"]|['"]$/g, "");
    if (value) env[key.trim()] = value;
  }
  return env;
}

function databaseUrl(env) {
  for (const key of [
    "POSTGRES_URL",
    "DATABASE_URL",
    "POSTGRES_PRISMA_URL",
    "POSTGRES_URL_NON_POOLING",
    "DATABASE_URL_UNPOOLED",
  ]) {
    const value = env[key] || process.env[key];
    if (value && value !== '""' && value !== "''" && value.includes("postgres")) {
      return value;
    }
  }
  return undefined;
}

async function pythonCommand() {
  if (process.env.PYTHON) return process.env.PYTHON;
  const bundled =
    "C:\\Users\\Seenu\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe";
  try {
    await fs.access(bundled);
    return bundled;
  } catch {
    return "python";
  }
}

function quoteIdentifier(value) {
  return `"${value.replaceAll('"', '""')}"`;
}

function assignmentFor(table, column) {
  const target = `${quoteIdentifier(table)}.${quoteIdentifier(column)}`;
  const incoming = `EXCLUDED.${quoteIdentifier(column)}`;

  if (["overview", "description"].includes(column)) {
    return `${quoteIdentifier(column)} = CASE
      WHEN ${incoming} IS NULL OR ${incoming} = '' THEN ${target}
      WHEN ${target} IS NULL OR ${target} = '' THEN ${incoming}
      WHEN length(${incoming}) > length(${target}) THEN ${incoming}
      ELSE ${target}
    END`;
  }

  if (
    [
      "gallery_images",
      "venue_types",
      "styles",
      "facilities",
      "service_areas",
      "brochures",
      "real_weddings",
      "categories",
      "video_urls",
    ].includes(column)
  ) {
    if (column === "service_areas") {
      return `${quoteIdentifier(column)} = CASE
        WHEN ${incoming} IS NULL OR cardinality(${incoming}) = 0 THEN ${target}
        ELSE ${incoming}
      END`;
    }

    return `${quoteIdentifier(column)} = CASE
      WHEN ${incoming} IS NULL OR cardinality(${incoming}) = 0 THEN ${target}
      WHEN ${target} IS NULL OR cardinality(${target}) = 0 THEN ${incoming}
      ELSE ARRAY(SELECT DISTINCT item FROM unnest(${target} || ${incoming}) AS item WHERE item IS NOT NULL AND item <> '')
    END`;
  }

  if (["image_count", "review_count"].includes(column)) {
    return `${quoteIdentifier(column)} = GREATEST(COALESCE(${target}, 0), COALESCE(${incoming}, 0))`;
  }

  if (
    ["rating", "avg_price_num", "per_person_price_num", "capacity_min", "capacity_max"].includes(
      column,
    )
  ) {
    return `${quoteIdentifier(column)} = COALESCE(${incoming}, ${target})`;
  }

  if (["featured", "award_winner"].includes(column)) {
    return `${quoteIdentifier(column)} = COALESCE(${target}, false) OR COALESCE(${incoming}, false)`;
  }

  return `${quoteIdentifier(column)} = COALESCE(NULLIF(${incoming}::text, '')::${columnType(column)}, ${target})`;
}

function columnType(column) {
  if (["venue_id", "supplier_id"].includes(column)) return "uuid";
  if (["featured", "award_winner"].includes(column)) return "boolean";
  if (["latitude", "longitude"].includes(column)) return "numeric";
  if (["review_date"].includes(column)) return "date";
  return "text";
}

function unavailableImagePredicate(column) {
  return `
    lower(${column}) LIKE '%://cdn0.hitched.ie/%' OR
    lower(${column}) LIKE '%://www.weddingsuppliers.ie/uploads/%' OR
    lower(${column}) LIKE '%://www.weddingsuppliers.ie/public/uploads/%'
  `;
}

function validImagePredicate(column) {
  return `
    ${column} IS NOT NULL
    AND ${column} <> ''
    AND ${column} ~* '^https?://'
    AND lower(${column}) NOT LIKE '%image_placeholder%'
    AND lower(${column}) NOT LIKE '%defaultnoimage%'
    AND lower(${column}) NOT LIKE '%default-no-image%'
    AND lower(${column}) NOT LIKE '%no-image%'
    AND lower(${column}) NOT LIKE '%noimage%'
    AND lower(${column}) NOT LIKE '%placeholder%'
    AND lower(${column}) NOT LIKE '%undefined%'
    AND NOT (${unavailableImagePredicate(column)})
  `;
}

async function upsertBatch(sql, table, rows, batchSize = 100) {
  if (!rows.length) return;
  const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  const normalizedRows = rows.map((row) =>
    Object.fromEntries(
      columns.map((column) => {
        const value = row[column];
        if ((value === undefined || value === null) && columnType(column) === "boolean") {
          return [column, false];
        }
        return [column, value === undefined ? null : value];
      }),
    ),
  );
  const updateColumns = columns.filter((key) => key !== "id" && key !== "created_at");
  const assignments = updateColumns.map((column) => assignmentFor(table, column)).join(", ");

  for (let offset = 0; offset < normalizedRows.length; offset += batchSize) {
    const batch = normalizedRows.slice(offset, offset + batchSize);
    await sql`
      INSERT INTO ${sql(table)} ${sql(batch, columns)}
      ON CONFLICT (id) DO UPDATE SET
      ${sql.unsafe(assignments)}
    `;
    console.log(
      `Imported ${table}: ${Math.min(offset + batchSize, normalizedRows.length)}/${normalizedRows.length}`,
    );
  }
}

async function cleanMediaPlaceholders(sql) {
  const placeholderPredicate = (column) => `
    ${column} IS NOT NULL AND (
      ${column} !~* '^https?://' OR
      lower(${column}) LIKE '%image_placeholder%' OR
      lower(${column}) LIKE '%defaultnoimage%' OR
      lower(${column}) LIKE '%default-no-image%' OR
      lower(${column}) LIKE '%no-image%' OR
      lower(${column}) LIKE '%noimage%' OR
      lower(${column}) LIKE '%placeholder%' OR
      lower(${column}) LIKE '%undefined%' OR
      ${unavailableImagePredicate(column)}
    )
  `;

  await sql.unsafe(`
    UPDATE venues
    SET logo_image = NULL
    WHERE ${placeholderPredicate("logo_image")}
  `);
  await sql.unsafe(`
    UPDATE suppliers
    SET logo_image = NULL
    WHERE ${placeholderPredicate("logo_image")}
  `);
  await sql.unsafe(`
    UPDATE suppliers
    SET banner_image = NULL
    WHERE ${placeholderPredicate("banner_image")}
  `);
  await sql.unsafe(`
    UPDATE venues
    SET gallery_images = NULLIF(
      ARRAY(
        SELECT image
        FROM unnest(gallery_images) AS image
        WHERE ${validImagePredicate("image")}
      ),
      '{}'::text[]
    )
    WHERE gallery_images IS NOT NULL
  `);
  await sql.unsafe(`
    UPDATE suppliers
    SET gallery_images = NULLIF(
      ARRAY(
        SELECT image
        FROM unnest(gallery_images) AS image
        WHERE ${validImagePredicate("image")}
      ),
      '{}'::text[]
    )
    WHERE gallery_images IS NOT NULL
  `);

  const removedTransport = await sql`
    DELETE FROM suppliers
    WHERE categories @> ARRAY['wedding-cars']::text[]
      AND COALESCE(banner_image, logo_image, gallery_images[1]) IS NULL
    RETURNING slug, name
  `;
  if (removedTransport.length) {
    console.log(
      JSON.stringify(
        {
          removed_transport_without_images: removedTransport.map((row) => row.slug),
        },
        null,
        2,
      ),
    );
  }
}

async function normalizeSupplierCategories(sql) {
  await sql.unsafe(`
    UPDATE suppliers AS s
    SET categories = normalized.categories
    FROM (
      SELECT source.id,
             ARRAY(
               SELECT mapped
               FROM (
                 SELECT DISTINCT ON (mapped)
                        CASE category
                          WHEN 'bands-marquee-hire-in-ireland-private-and-exclusive-wedding-venues-castle-wedding-venues' THEN 'wedding-bands'
                          WHEN 'entertainment-dj-s-and-sax' THEN 'wedding-djs'
                          WHEN 'gifts-and-favours' THEN 'wedding-gifts-favours'
                          WHEN 'wedding-planners-destination-weddings' THEN 'wedding-planners'
                          ELSE category
                        END AS mapped,
                        ord
                 FROM unnest(source.categories) WITH ORDINALITY AS c(category, ord)
                 WHERE category IS NOT NULL AND category <> ''
                 ORDER BY mapped, ord
               ) deduped
               ORDER BY ord
             ) AS categories
      FROM suppliers AS source
    ) AS normalized
    WHERE s.id = normalized.id
  `);
}

async function cleanupSourceSocialLinks(sql) {
  for (const table of ["venues", "suppliers"]) {
    for (const column of ["facebook_url", "instagram_url", "twitter_url"]) {
      await sql.unsafe(`
        UPDATE ${quoteIdentifier(table)}
        SET ${quoteIdentifier(column)} = NULL
        WHERE lower(COALESCE(${quoteIdentifier(column)}, '')) LIKE '%hitched.%'
      `);
    }

    const textColumns =
      table === "suppliers" ? ["overview", "description", "slogan"] : ["overview", "description"];
    for (const column of textColumns) {
      await sql.unsafe(`
        UPDATE ${quoteIdentifier(table)}
        SET ${quoteIdentifier(column)} = NULLIF(
          btrim(
            regexp_replace(
              regexp_replace(
                regexp_replace(${quoteIdentifier(column)}, 'https?://(www\\.)?hitched\\.(co\\.uk|ie)[^[:space:],;|)]*', '', 'gi'),
                'www\\.hitched\\.(co\\.uk|ie)[^[:space:],;|)]*', '', 'gi'
              ),
              'https?://twitter\\.com/hitchedcouk[^[:space:],;|)]*', '', 'gi'
            ),
            ' ,;|'
          ),
          ''
        )
        WHERE ${quoteIdentifier(column)} ~* 'hitched\\.(co\\.uk|ie)|twitter\\.com/hitchedcouk'
      `);
    }
  }
}

const env = {
  ...(await fs
    .readFile(path.join(root, ".env"), "utf8")
    .then(loadEnv)
    .catch(() => ({}))),
  ...(await fs
    .readFile(path.join(root, ".env.local"), "utf8")
    .then(loadEnv)
    .catch(() => ({}))),
  ...(await fs
    .readFile(path.join(root, ".env.development.local"), "utf8")
    .then(loadEnv)
    .catch(() => ({}))),
  ...(await fs
    .readFile(path.join(root, ".env.vercel.local"), "utf8")
    .then(loadEnv)
    .catch(() => ({}))),
  ...(await fs
    .readFile(path.join(root, ".env.vercel.production.local"), "utf8")
    .then(loadEnv)
    .catch(() => ({}))),
  ...process.env,
};
const url = databaseUrl(env);

if (!url) {
  console.error(
    "Missing Postgres URL. Add POSTGRES_URL or DATABASE_URL, then run this script again.",
  );
  process.exit(2);
}

const python = await pythonCommand();
const importArgs = process.argv.slice(2);
const build = spawnSync(
  python,
  ["scripts/import_directory_data.py", "--dry-run", "--out", payloadPath, ...importArgs],
  {
    cwd: root,
    stdio: "inherit",
  },
);
if (build.status !== 0) process.exit(build.status ?? 1);

const payload = JSON.parse(await fs.readFile(payloadPath, "utf8"));
const schema = await fs.readFile(path.join(root, "db", "schema.sql"), "utf8");
const sql = postgres(url, {
  ssl: "require",
  max: 3,
  idle_timeout: 20,
  connect_timeout: 15,
});

try {
  await sql.unsafe(schema);
  await sql`
    DELETE FROM imported_reviews
    WHERE venue_id IN (SELECT id FROM venues WHERE source_url = 'wedhq-demo')
       OR supplier_id IN (SELECT id FROM suppliers WHERE source_url = 'wedhq-demo')
  `;
  await sql`DELETE FROM venues WHERE source_url = 'wedhq-demo'`;
  await sql`DELETE FROM suppliers WHERE source_url = 'wedhq-demo'`;
  for (const table of ["venues", "suppliers", "wedding_fairs", "imported_reviews"]) {
    await upsertBatch(sql, table, payload[table] ?? []);
  }
  await cleanMediaPlaceholders(sql);
  await normalizeSupplierCategories(sql);
  await cleanupSourceSocialLinks(sql);
  const [counts] = await sql`
    SELECT
      (SELECT count(*)::int FROM venues) AS venues,
      (SELECT count(*)::int FROM suppliers) AS suppliers,
      (SELECT count(*)::int FROM wedding_fairs) AS wedding_fairs,
      (SELECT count(*)::int FROM imported_reviews) AS imported_reviews
  `;
  console.log(JSON.stringify(counts, null, 2));
} finally {
  await sql.end();
}
