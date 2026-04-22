import { query } from '../../db';

export class FundraisingActivity {
  constructor(
    public readonly activityID: string,
    public readonly title: string,
    public readonly description: string,
    public readonly targetAmount: number,
    public readonly category: string,
    public readonly startDate: string,
    public readonly endDate: string,
    public readonly status: string,
  ) {}

  static async viewFundraisingActivities(): Promise<FundraisingActivity[]> {
    const sql =
      'SELECT activity_id, title, description, target_amount, category, start_date, end_date, status FROM fundraising_activity ORDER BY created_at DESC';
    const result = await query(sql, []);
    return result.rows.map(
      (row) =>
        new FundraisingActivity(
          String(row.activity_id),
          row.title,
          row.description,
          Number(row.target_amount),
          row.category,
          String(row.start_date),
          String(row.end_date),
          row.status,
        ),
    );
  }

  static async viewFundraisingActivityDetails(activityID: string): Promise<FundraisingActivity | null> {
    const sql =
      'SELECT activity_id, title, description, target_amount, category, start_date, end_date, status FROM fundraising_activity WHERE activity_id = $1';
    const result = await query(sql, [activityID]);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return new FundraisingActivity(
      String(row.activity_id),
      row.title,
      row.description,
      Number(row.target_amount),
      row.category,
      String(row.start_date),
      String(row.end_date),
      row.status,
    );
  }

  async saveFundraisingActivity(): Promise<boolean> {
    try {
      const sql =
        'INSERT INTO fundraising_activity (title, description, target_amount, category, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6)';
      await query(sql, [this.title, this.description, this.targetAmount, this.category, this.startDate, this.endDate]);
      return true;
    } catch {
      return false;
    }
  }
}
