import { query } from '../../db';

export class UserProfile {
  constructor(public role: string, public description: string) {}

  static async createProfile(role: string, description: string): Promise<UserProfile | null> {
    try {
      const sql = 'INSERT INTO user_profile (role, description) VALUES ($1, $2)';
      await query(sql, [role, description]);
      return new UserProfile(role, description);
    } catch {
      return null;
    }
  }
}
