"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.query = query;
const pg_1 = require("pg");
const pool = new pg_1.Pool();
exports.pool = pool;
async function query(sql, params) {
    return pool.query(sql, params);
}
//# sourceMappingURL=db.js.map