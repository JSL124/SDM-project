import { FundraisingActivity } from '../../src/fundraising/entity/FundraisingActivity';

jest.mock('../../src/db', () => ({
  query: jest.fn(),
}));

import { query } from '../../src/db';
const mockQuery = query as jest.MockedFunction<typeof query>;

const mockRow = {
  activity_id: 1,
  title: 'Help the Community',
  description: 'A fundraiser to support local shelters.',
  target_amount: '5000.00',
  category: 'Community',
  start_date: '2026-05-01T00:00:00.000Z',
  end_date: '2026-06-01T00:00:00.000Z',
  status: 'ACTIVE',
};

describe('FundraisingActivity - retrieve methods', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('retrieveFundraisingActivities', () => {
    it('should return a list of FundraisingActivity objects', async () => {
      mockQuery.mockResolvedValue({
        rows: [mockRow],
        command: 'SELECT',
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const activities = await FundraisingActivity.retrieveFundraisingActivities();

      expect(activities).toHaveLength(1);
      expect(activities[0]).toBeInstanceOf(FundraisingActivity);
      expect(activities[0].getActivityID()).toBe('1');
      expect(activities[0].getTitle()).toBe('Help the Community');
      expect(activities[0].getTargetAmount()).toBe(5000);
    });

    it('should return an empty array when there are no activities', async () => {
      mockQuery.mockResolvedValue({
        rows: [],
        command: 'SELECT',
        rowCount: 0,
        oid: 0,
        fields: [],
      });

      const activities = await FundraisingActivity.retrieveFundraisingActivities();

      expect(activities).toEqual([]);
    });
  });

  describe('viewFundraisingActivityDetails', () => {
    it('should return a FundraisingActivity when found', async () => {
      mockQuery.mockResolvedValue({
        rows: [mockRow],
        command: 'SELECT',
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const activity = await FundraisingActivity.viewFundraisingActivityDetails('1');

      expect(activity).toBeInstanceOf(FundraisingActivity);
      expect(activity?.getActivityID()).toBe('1');
      expect(activity?.getTitle()).toBe('Help the Community');
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE activity_id = $1'),
        ['1'],
      );
    });

    it('should return null when activity is not found', async () => {
      mockQuery.mockResolvedValue({
        rows: [],
        command: 'SELECT',
        rowCount: 0,
        oid: 0,
        fields: [],
      });

      const activity = await FundraisingActivity.viewFundraisingActivityDetails('999');

      expect(activity).toBeNull();
    });
  });
});
