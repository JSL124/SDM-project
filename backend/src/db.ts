import { Pool, QueryResult } from 'pg';

const pool = new Pool();

export async function query(sql: string, params?: unknown[]): Promise<QueryResult> {
  return pool.query(sql, params);
}

export { pool };
