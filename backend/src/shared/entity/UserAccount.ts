import { query } from '../../db';

export class UserAccount {
  private email: string;
  private password: string;
  private name: string;
  private DOB: string;
  private phoneNum: string;
  private profileId: string;
  private username: string;
  private role: string;

  constructor(email: string, password: string, name: string = '', DOB: string = '', phoneNum: string = '', profileId: string = '', username: string = '', role: string = '') {
    this.email = email;
    this.password = password;
    this.name = name;
    this.DOB = DOB;
    this.phoneNum = phoneNum;
    this.profileId = profileId;
    this.username = username;
    this.role = role;
  }

  static async login(email: string, password: string): Promise<UserAccount | null> {
    const sql = 'SELECT email, password, name, dob, phone_num, profile_id, username, role FROM user_account WHERE email = $1';
    const result = await query(sql, [email]);
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    const account = new UserAccount(
      row.email,
      row.password,
      row.name,
      row.dob,
      row.phone_num,
      String(row.profile_id ?? ''),
      row.username ?? '',
      row.role ?? ''
    );
    return password === account.password ? account : null;
  }

  getLoginUser(): { email: string; username: string; role: string } {
    return {
      email: this.email,
      username: this.username,
      role: this.role,
    };
  }

  static async createAccount(email: string, password: string, name: string, DOB: string, phoneNum: string, profileId: string): Promise<UserAccount | null> {
    try {
      const sql = 'INSERT INTO user_account (email, password, name, dob, phone_num, profile_id) VALUES ($1, $2, $3, $4, $5, $6)';
      await query(sql, [email, password, name, DOB, phoneNum, profileId]);
      return new UserAccount(email, password, name, DOB, phoneNum, profileId);
    } catch {
      return null;
    }
  }
}
