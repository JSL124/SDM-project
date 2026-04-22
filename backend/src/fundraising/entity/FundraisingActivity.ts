import { query } from '../../db';

export class FundraisingActivity {
  private activityID: string;
  private title: string;
  private description: string;
  private targetAmount: number;
  private category: string;
  private startDate: string;
  private endDate: string;
  private status: string;

  constructor(
    activityID: string,
    title: string,
    description: string,
    targetAmount: number,
    category: string,
    startDate: string,
    endDate: string,
    status: string,
  ) {
    this.activityID = activityID;
    this.title = title;
    this.description = description;
    this.targetAmount = targetAmount;
    this.category = category;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
  }

  getActivityID(): string {
    return this.activityID;
  }

  getTitle(): string {
    return this.title;
  }

  getDescription(): string {
    return this.description;
  }

  getTargetAmount(): number {
    return this.targetAmount;
  }

  getCategory(): string {
    return this.category;
  }

  getStartDate(): string {
    return this.startDate;
  }

  getEndDate(): string {
    return this.endDate;
  }

  getStatus(): string {
    return this.status;
  }

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
