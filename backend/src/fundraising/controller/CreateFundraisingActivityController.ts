import { FundraisingActivity } from '../entity/FundraisingActivity';

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
    const saved = await FundraisingActivity.saveFundraisingActivity(
      title,
      description,
      targetAmount,
      category,
      startDate,
      endDate,
    );

    if (!saved) {
      return { success: false, message: 'Failed to create fundraising activity.' };
    }

    return { success: true, message: 'Fundraising activity created successfully.' };
  }
}
