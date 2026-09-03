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
    env[key.trim()] = rest.join("=").trim().replace(/^['"]|['"]$/g, "");
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
    if (value && value !== "\"\"" && value !== "''" && value.includes("postgres")) {
      return value;
    }
  }
  return undefined;
}

async function pythonCommand() {
  if (process.env.PYTHON) return process.env.PYTHON;
  const bundled = "C:\\Users\\Seenu\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe";
  try {
    await fs.access(bundled);
    return bundled;
  } catch {
    return "python";
  }
}

function updatableColumns(row) {
  return Object.keys(row).filter((key) => key !== "id" && key !== "created_at");
}

function quoteIdentifier(value) {
  return `"${value.replaceAll('"', '""')}"`;
}

async function upsertBatch(sql, table, rows, batchSize = 100) {
  if (!rows.length) return;
  const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  const normalizedRows = rows.map((row) =>
    Object.fromEntries(columns.map((column) => [column, row[column] === undefined ? null : row[column]])),
  );
  const updateColumns = columns.filter((key) => key !== "id" && key !== "created_at");
  const assignments = updateColumns
    .map((column) => `${quoteIdentifier(column)} = EXCLUDED.${quoteIdentifier(column)}`)
    .join(", ");

  for (let offset = 0; offset < normalizedRows.length; offset += batchSize) {
    const batch = normalizedRows.slice(offset, offset + batchSize);
    await sql`
      INSERT INTO ${sql(table)} ${sql(batch, columns)}
      ON CONFLICT (id) DO UPDATE SET
      ${sql.unsafe(assignments)}
    `;
    console.log(`Imported ${table}: ${Math.min(offset + batchSize, normalizedRows.length)}/${normalizedRows.length}`);
  }
}

const env = {
  ...(await fs.readFile(path.join(root, ".env"), "utf8").then(loadEnv).catch(() => ({}))),
  ...(await fs.readFile(path.join(root, ".env.local"), "utf8").then(loadEnv).catch(() => ({}))),
  ...(await fs.readFile(path.join(root, ".env.development.local"), "utf8").then(loadEnv).catch(() => ({}))),
  ...process.env,
};
const url = databaseUrl(env);

if (!url) {
  console.error("Missing Postgres URL. Add POSTGRES_URL or DATABASE_URL, then run this script again.");
  process.exit(2);
}

const python = await pythonCommand();
const build = spawnSync(python, ["scripts/import_directory_data.py", "--dry-run", "--out", payloadPath], {
  cwd: root,
  stdio: "inherit",
});
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
  for (const table of ["venues", "suppliers", "wedding_fairs", "imported_reviews"]) {
    await upsertBatch(sql, table, payload[table] ?? []);
  }
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
