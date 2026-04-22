import { FundraisingActivity } from '../../src/shared/entity/FundraisingActivity';

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

  describe('viewFundraisingActivities', () => {
    it('should return a list of FundraisingActivity objects', async () => {
      mockQuery.mockResolvedValue({
        rows: [mockRow],
        command: 'SELECT',
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const activities = await FundraisingActivity.viewFundraisingActivities();

      expect(activities).toHaveLength(1);
      expect(activities[0]).toBeInstanceOf(FundraisingActivity);
      expect(activities[0].activityID).toBe('1');
      expect(activities[0].title).toBe('Help the Community');
      expect(activities[0].targetAmount).toBe(5000);
    });

    it('should return an empty array when there are no activities', async () => {
      mockQuery.mockResolvedValue({
        rows: [],
        command: 'SELECT',
        rowCount: 0,
        oid: 0,
        fields: [],
      });

      const activities = await FundraisingActivity.viewFundraisingActivities();

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
      expect(activity?.activityID).toBe('1');
      expect(activity?.title).toBe('Help the Community');
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
