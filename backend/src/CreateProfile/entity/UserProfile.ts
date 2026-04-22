import { query } from '../../db';

export type ProfileListItem = {
  profileId: string;
  role: string;
  description: string;
};

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

  static async listProfiles(): Promise<ProfileListItem[]> {
    const sql = 'SELECT profile_id, role, description FROM user_profile ORDER BY profile_id ASC';
    const result = await query(sql);
    return result.rows.map((row) => ({
      profileId: String(row.profile_id),
      role: row.role,
      description: row.description ?? '',
    }));
  }
}
