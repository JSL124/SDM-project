"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAccount = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../../db");
class UserAccount {
    constructor(email, passwordHash) {
        this.email = email;
        this.passwordHash = passwordHash;
    }
    getEmail() {
        return this.email;
    }
    getPasswordHash() {
        return this.passwordHash;
    }
    static async findAccountByEmail(email) {
        const sql = 'SELECT email, password_hash FROM user_account WHERE email = $1';
        const result = await (0, db_1.query)(sql, [email]);
        if (result.rows.length === 0) {
            return null;
        }
        const row = result.rows[0];
        return new UserAccount(row.email, row.password_hash);
    }
    async verifyPassword(password) {
        return bcrypt_1.default.compare(password, this.passwordHash);
    }
}
exports.UserAccount = UserAccount;
//# sourceMappingURL=UserAccount.js.map