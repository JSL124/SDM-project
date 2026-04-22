import { FundraisingActivity } from '../../shared/entity/FundraisingActivity';

export type CreateFundraisingActivityResult =
  | { success: true; message: 'Fundraising activity created successfully.' }
  | { success: false; message: string };

export class CreateFundraisingActivityController {
  async createFundraisingActivity(
    title: string,
    description: string,
    targetAmount: number,
    category: string,
    startDate: string,
    endDate: string,
  ): Promise<CreateFundraisingActivityResult> {
    const activity = new FundraisingActivity('', title, description, targetAmount, category, startDate, endDate, 'PENDING');
    const saved = await activity.saveFundraisingActivity();

    if (!saved) {
      return { success: false, message: 'Failed to create fundraising activity.' };
    }

    return { success: true, message: 'Fundraising activity created successfully.' };
  }
}
