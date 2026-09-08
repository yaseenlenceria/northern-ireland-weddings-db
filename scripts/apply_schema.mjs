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
