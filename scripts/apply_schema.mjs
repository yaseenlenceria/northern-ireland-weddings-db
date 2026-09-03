import fs from "node:fs/promises";
import postgres from "postgres";

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
  await sql.unsafe(await fs.readFile("db/schema.sql", "utf8"));
  const [result] = await sql`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_name = 'enquiries'
    ) AS enquiries_exists
  `;
  console.log(JSON.stringify(result));
} finally {
  await sql.end();
}
