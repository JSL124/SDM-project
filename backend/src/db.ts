import dotenv from 'dotenv';
import { Pool, QueryResult } from 'pg';

dotenv.config({ override: true });

const isSupabaseHost = process.env.PGHOST?.includes('supabase.com') ?? false;

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: isSupabaseHost
    ? {
        rejectUnauthorized: false,
      }
    : false,
});

export async function query(sql: string, params?: unknown[]): Promise<QueryResult> {
  return pool.query(sql, params);
}

export function getDbConnectionSummary() {
  return {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    ssl: isSupabaseHost,
  };
}

export { pool };
