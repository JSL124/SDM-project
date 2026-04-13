import { query } from '../../db';

export class UserProfile {
  private profileId: string;
  private name: string;
  private email: string;
  private phoneNum: string;
  private address: string;

  constructor(profileId: string, name: string, email: string, phoneNum: string, address: string) {
    this.profileId = profileId;
    this.name = name;
    this.email = email;
    this.phoneNum = phoneNum;
    this.address = address;
  }

  getProfileId(): string {
    return this.profileId;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getPhoneNum(): string {
    return this.phoneNum;
  }

  getAddress(): string {
    return this.address;
  }

  static async existsByEmail(email: string): Promise<boolean> {
    const sql = 'SELECT 1 FROM user_profile WHERE email = $1';
    const result = await query(sql, [email]);
    return result.rows.length > 0;
  }

  static async saveProfile(name: string, email: string, phoneNum: string, address: string): Promise<boolean> {
    try {
      const sql = 'INSERT INTO user_profile (name, email, phone_num, address) VALUES ($1, $2, $3, $4)';
      await query(sql, [name, email, phoneNum, address]);
      return true;
    } catch {
      return false;
    }
  }

  static async findProfileById(profileId: string): Promise<UserProfile | null> {
    const sql = 'SELECT profile_id, name, email, phone_num, address FROM user_profile WHERE profile_id = $1';
    const result = await query(sql, [profileId]);
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new UserProfile(row.profile_id, row.name, row.email, row.phone_num, row.address);
  }
}
