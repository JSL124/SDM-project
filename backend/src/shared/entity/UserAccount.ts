import { query } from '../../db';

export class UserAccount {
  public readonly email: string;
  private password: string;
  private name: string;
  private DOB: string;
  private phoneNum: string;
  private profileId: string;
  public readonly role: string;
  private accountStatus: string;

  constructor(email: string, password: string, name: string = '', DOB: string = '', phoneNum: string = '', profileId: string = '', role: string = '', accountStatus: string = 'ACTIVE') {
    this.email = email;
    this.password = password;
    this.name = name;
    this.DOB = DOB;
    this.phoneNum = phoneNum;
    this.profileId = profileId;
    this.role = role;
    this.accountStatus = accountStatus;
  }

  static async login(email: string, password: string): Promise<UserAccount | null> {
    const sql = 'SELECT email, password, account_status, profile_id, role FROM user_account WHERE email = $1';
    const result = await query(sql, [email]);
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    const account = new UserAccount(
      row.email,
      row.password,
      '',
      '',
      '',
      String(row.profile_id ?? ''),
      row.role ?? '',
      row.account_status ?? 'ACTIVE'
    );
    return password === account.password && account.accountStatus === 'ACTIVE' ? account : null;
  }

  static async createAccount(email: string, password: string, name: string, DOB: string, phoneNum: string, profileId: string): Promise<UserAccount | null> {
    try {
      const sql = `
        INSERT INTO user_account (email, password, profile_id, role)
        SELECT $1, $2, profile_id, role
        FROM user_profile
        WHERE profile_id = $3
      `;
      const result = await query(sql, [email, password, profileId]);
      if (result.rowCount === 0) {
        return null;
      }

      return new UserAccount(email, password, name, DOB, phoneNum, profileId);
    } catch {
      return null;
    }
  }
}
