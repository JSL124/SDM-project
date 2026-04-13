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
    try {
      this.validateFundraisingActivity(title, description, targetAmount, category, startDate, endDate);
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }

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

  validateFundraisingActivity(
    title: string,
    description: string,
    targetAmount: number,
    category: string,
    startDate: string,
    endDate: string,
  ): void {
    if (!title || !title.trim()) {
      throw new Error('Title is required.');
    }
    if (!description || !description.trim()) {
      throw new Error('Description is required.');
    }
    if (!targetAmount || targetAmount <= 0) {
      throw new Error('Target amount must be greater than zero.');
    }
    if (!category || !category.trim()) {
      throw new Error('Category is required.');
    }
    if (!startDate || !startDate.trim()) {
      throw new Error('Start date is required.');
    }
    if (!endDate || !endDate.trim()) {
      throw new Error('End date is required.');
    }
    if (new Date(endDate) <= new Date(startDate)) {
      throw new Error('End date must be after start date.');
    }
  }
}
