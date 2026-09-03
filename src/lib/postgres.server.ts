import postgres from "postgres";

let db: postgres.Sql | undefined;

export function getDatabaseUrl() {
  return (
    process.env["POSTGRES_URL"] ||
    process.env["DATABASE_URL"] ||
    process.env["POSTGRES_PRISMA_URL"] ||
    process.env["POSTGRES_URL_NON_POOLING"] ||
    null
  );
}

export function sql() {
  const url = getDatabaseUrl();
  if (!url) {
    throw new Error("Missing Postgres environment variable. Set POSTGRES_URL or DATABASE_URL.");
  }

  db ??= postgres(url, {
    ssl: "require",
    max: 3,
    idle_timeout: 20,
    connect_timeout: 15,
  });

  return db;
}
