import bcrypt from 'bcrypt';
import { query } from '../../db';

export class UserAccount {
  private email: string;
  private username: string;
  private passwordHash: string;
  private role: string;

  constructor(email: string, username: string, passwordHash: string, role: string = '') {
    this.email = email;
    this.username = username;
    this.passwordHash = passwordHash;
    this.role = role;
  }

  getEmail(): string {
    return this.email;
  }

  getUsername(): string {
    return this.username;
  }

  getPasswordHash(): string {
    return this.passwordHash;
  }

  getRole(): string {
    return this.role;
  }

  static async findAccountByEmail(email: string): Promise<UserAccount | null> {
    const sql = 'SELECT email, username, password_hash, role FROM user_account WHERE email = $1';
    const result = await query(sql, [email]);
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new UserAccount(row.email, row.username, row.password_hash, row.role);
  }

  async verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }

  static async existsByUsername(username: string): Promise<boolean> {
    const sql = 'SELECT 1 FROM user_account WHERE username = $1';
    const result = await query(sql, [username]);
    return result.rows.length > 0;
  }

  static async saveAccount(profileId: string, email: string, username: string, password: string, role: string): Promise<boolean> {
    try {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const sql = 'INSERT INTO user_account (profile_id, email, username, password_hash, role) VALUES ($1, $2, $3, $4, $5)';
      await query(sql, [profileId, email, username, passwordHash, role]);
      return true;
    } catch {
      return false;
    }
  }
}
