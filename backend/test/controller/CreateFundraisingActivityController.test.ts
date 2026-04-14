import { CreateFundraisingActivityController } from '../../src/fundraising/controller/CreateFundraisingActivityController';
import { FundraisingActivity } from '../../src/fundraising/entity/FundraisingActivity';

jest.mock('../../src/fundraising/entity/FundraisingActivity');

describe('CreateFundraisingActivityController', () => {
  let controller: CreateFundraisingActivityController;

  const validArgs: [string, string, number, string, string, string] = [
    'Help the Community',
    'A fundraiser to support local shelters.',
    5000,
    'Community',
    '2026-05-01',
    '2026-06-01',
  ];

  beforeEach(() => {
    controller = new CreateFundraisingActivityController();
    jest.clearAllMocks();
  });

  it('should return success when save succeeds', async () => {
    (FundraisingActivity.saveFundraisingActivity as jest.Mock).mockResolvedValue(true);

    const result = await controller.createFundraisingActivity(...validArgs);

    expect(result).toEqual({
      success: true,
      message: 'Fundraising activity created successfully.',
    });
    expect(FundraisingActivity.saveFundraisingActivity).toHaveBeenCalledWith(...validArgs);
  });

  it('should return failure when save returns false', async () => {
    (FundraisingActivity.saveFundraisingActivity as jest.Mock).mockResolvedValue(false);

    const result = await controller.createFundraisingActivity(...validArgs);

    expect(result).toEqual({
      success: false,
      message: 'Failed to create fundraising activity.',
    });
  });

  it('should return failure when title is empty', async () => {
    const result = await controller.createFundraisingActivity('', 'Description', 5000, 'Community', '2026-05-01', '2026-06-01');

    expect(result).toEqual({ success: false, message: 'Title is required.' });
    expect(FundraisingActivity.saveFundraisingActivity).not.toHaveBeenCalled();
  });

  it('should return failure when description is empty', async () => {
    const result = await controller.createFundraisingActivity('Title', '', 5000, 'Community', '2026-05-01', '2026-06-01');

    expect(result).toEqual({ success: false, message: 'Description is required.' });
    expect(FundraisingActivity.saveFundraisingActivity).not.toHaveBeenCalled();
  });

  it('should return failure when targetAmount is zero', async () => {
    const result = await controller.createFundraisingActivity('Title', 'Description', 0, 'Community', '2026-05-01', '2026-06-01');

    expect(result).toEqual({ success: false, message: 'Target amount must be greater than zero.' });
    expect(FundraisingActivity.saveFundraisingActivity).not.toHaveBeenCalled();
  });

  it('should return failure when targetAmount is negative', async () => {
    const result = await controller.createFundraisingActivity('Title', 'Description', -100, 'Community', '2026-05-01', '2026-06-01');

    expect(result).toEqual({ success: false, message: 'Target amount must be greater than zero.' });
    expect(FundraisingActivity.saveFundraisingActivity).not.toHaveBeenCalled();
  });

  it('should return failure when category is empty', async () => {
    const result = await controller.createFundraisingActivity('Title', 'Description', 5000, '', '2026-05-01', '2026-06-01');

    expect(result).toEqual({ success: false, message: 'Category is required.' });
    expect(FundraisingActivity.saveFundraisingActivity).not.toHaveBeenCalled();
  });

  it('should return failure when startDate is empty', async () => {
    const result = await controller.createFundraisingActivity('Title', 'Description', 5000, 'Community', '', '2026-06-01');

    expect(result).toEqual({ success: false, message: 'Start date is required.' });
    expect(FundraisingActivity.saveFundraisingActivity).not.toHaveBeenCalled();
  });

  it('should return failure when endDate is empty', async () => {
    const result = await controller.createFundraisingActivity('Title', 'Description', 5000, 'Community', '2026-05-01', '');

    expect(result).toEqual({ success: false, message: 'End date is required.' });
    expect(FundraisingActivity.saveFundraisingActivity).not.toHaveBeenCalled();
  });

  it('should return failure when endDate is before startDate', async () => {
    const result = await controller.createFundraisingActivity('Title', 'Description', 5000, 'Community', '2026-06-01', '2026-05-01');

    expect(result).toEqual({ success: false, message: 'End date must be after start date.' });
    expect(FundraisingActivity.saveFundraisingActivity).not.toHaveBeenCalled();
  });

  it('should return failure when endDate equals startDate', async () => {
    const result = await controller.createFundraisingActivity('Title', 'Description', 5000, 'Community', '2026-05-01', '2026-05-01');

    expect(result).toEqual({ success: false, message: 'End date must be after start date.' });
    expect(FundraisingActivity.saveFundraisingActivity).not.toHaveBeenCalled();
  });
});
