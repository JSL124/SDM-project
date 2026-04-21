import { CreateFundraisingActivityController } from '../../src/fundraising/controller/CreateFundraisingActivityController';
import { FundraisingActivity } from '../../src/fundraising/entity/FundraisingActivity';

jest.mock('../../src/fundraising/entity/FundraisingActivity');

const MockFundraisingActivity = FundraisingActivity as unknown as jest.Mock;

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
    const saveMock = jest.fn().mockResolvedValue(true);
    MockFundraisingActivity.mockImplementation(() => ({ saveFundraisingActivity: saveMock }));

    const result = await controller.createFundraisingActivity(...validArgs);

    expect(result).toEqual({ success: true, message: 'Fundraising activity created successfully.' });
    expect(MockFundraisingActivity).toHaveBeenCalledWith('', ...validArgs, 'PENDING');
    expect(saveMock).toHaveBeenCalled();
  });

  it('should return failure when save returns false', async () => {
    const saveMock = jest.fn().mockResolvedValue(false);
    MockFundraisingActivity.mockImplementation(() => ({ saveFundraisingActivity: saveMock }));

    const result = await controller.createFundraisingActivity(...validArgs);

    expect(result).toEqual({ success: false, message: 'Failed to create fundraising activity.' });
  });
});
