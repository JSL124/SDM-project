import { Pool, QueryResult } from 'pg';
declare const pool: Pool;
export declare function query(sql: string, params?: unknown[]): Promise<QueryResult>;
export { pool };
//# sourceMappingURL=db.d.ts.map