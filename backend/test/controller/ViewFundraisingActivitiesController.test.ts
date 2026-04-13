import { ViewFundraisingActivitiesController } from '../../src/fundraising/controller/ViewFundraisingActivitiesController';
import { FundraisingActivity } from '../../src/fundraising/entity/FundraisingActivity';

jest.mock('../../src/fundraising/entity/FundraisingActivity');

describe('ViewFundraisingActivitiesController', () => {
  let controller: ViewFundraisingActivitiesController;

  const mockActivity = new FundraisingActivity(
    '1', 'Help the Community', 'A fundraiser.', 5000, 'Community', '2026-05-01', '2026-06-01', 'ACTIVE',
  );

  beforeEach(() => {
    controller = new ViewFundraisingActivitiesController();
    jest.clearAllMocks();
  });

  describe('getFundraisingActivities', () => {
    it('should return list of activities from entity', async () => {
      (FundraisingActivity.retrieveFundraisingActivities as jest.Mock).mockResolvedValue([mockActivity]);

      const result = await controller.getFundraisingActivities();

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(mockActivity);
      expect(FundraisingActivity.retrieveFundraisingActivities).toHaveBeenCalledTimes(1);
    });

    it('should return empty list when there are no activities', async () => {
      (FundraisingActivity.retrieveFundraisingActivities as jest.Mock).mockResolvedValue([]);

      const result = await controller.getFundraisingActivities();

      expect(result).toEqual([]);
    });
  });

  describe('getFundraisingActivityDetails', () => {
    it('should return activity when found', async () => {
      (FundraisingActivity.retrieveFundraisingActivityDetails as jest.Mock).mockResolvedValue(mockActivity);

      const result = await controller.getFundraisingActivityDetails('1');

      expect(result).toBe(mockActivity);
      expect(FundraisingActivity.retrieveFundraisingActivityDetails).toHaveBeenCalledWith('1');
    });

    it('should return null when activity is not found', async () => {
      (FundraisingActivity.retrieveFundraisingActivityDetails as jest.Mock).mockResolvedValue(null);

      const result = await controller.getFundraisingActivityDetails('999');

      expect(result).toBeNull();
    });
  });
});
