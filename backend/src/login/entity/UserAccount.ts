import bcrypt from 'bcrypt';
import { query } from '../../db';

export class UserAccount {
  private email: string;
  private passwordHash: string;

  constructor(email: string, passwordHash: string) {
    this.email = email;
    this.passwordHash = passwordHash;
  }

  getEmail(): string {
    return this.email;
  }

  getPasswordHash(): string {
    return this.passwordHash;
  }

  static async findAccountByEmail(email: string): Promise<UserAccount | null> {
    const sql = 'SELECT email, password_hash FROM user_account WHERE email = $1';
    const result = await query(sql, [email]);
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new UserAccount(row.email, row.password_hash);
  }

  async verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }
}
