import { Pool, type QueryResultRow } from "pg";

let pool: Pool | null = null;

export function getDb() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL ?? "postgresql:///brag_dev"
    });
  }

  return pool;
}

export async function query<T extends QueryResultRow>(
  text: string,
  values: unknown[] = []
) {
  return getDb().query<T>(text, values);
}
