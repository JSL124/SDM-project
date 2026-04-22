import { FundraisingActivity } from '../../src/fundraising/entity/FundraisingActivity';

jest.mock('../../src/db', () => ({
  query: jest.fn(),
}));

import { query } from '../../src/db';
const mockQuery = query as jest.MockedFunction<typeof query>;

describe('FundraisingActivity', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor and getters', () => {
    it('should store all activity fields', () => {
      const activity = new FundraisingActivity(
        '1',
        'Help the Community',
        'A fundraiser to support local shelters.',
        5000,
        'Community',
        '2026-05-01',
        '2026-06-01',
        'ACTIVE',
      );

      expect(activity.getActivityID()).toBe('1');
      expect(activity.getTitle()).toBe('Help the Community');
      expect(activity.getDescription()).toBe('A fundraiser to support local shelters.');
      expect(activity.getTargetAmount()).toBe(5000);
      expect(activity.getCategory()).toBe('Community');
      expect(activity.getStartDate()).toBe('2026-05-01');
      expect(activity.getEndDate()).toBe('2026-06-01');
      expect(activity.getStatus()).toBe('ACTIVE');
    });
  });

  describe('saveFundraisingActivity', () => {
    it('should return true on successful insert', async () => {
      mockQuery.mockResolvedValue({
        rows: [],
        command: 'INSERT',
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const activity = new FundraisingActivity(
        '',
        'Help the Community',
        'A fundraiser to support local shelters.',
        5000,
        'Community',
        '2026-05-01',
        '2026-06-01',
        'PENDING',
      );
      const saved = await activity.saveFundraisingActivity();

      expect(saved).toBe(true);
      expect(mockQuery).toHaveBeenCalledWith(
        'INSERT INTO fundraising_activity (title, description, target_amount, category, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6)',
        ['Help the Community', 'A fundraiser to support local shelters.', 5000, 'Community', '2026-05-01', '2026-06-01'],
      );
    });

    it('should return false when insert fails', async () => {
      mockQuery.mockRejectedValue(new Error('DB connection error'));

      const activity = new FundraisingActivity(
        '',
        'Help the Community',
        'A fundraiser to support local shelters.',
        5000,
        'Community',
        '2026-05-01',
        '2026-06-01',
        'PENDING',
      );
      const saved = await activity.saveFundraisingActivity();

      expect(saved).toBe(false);
    });
  });
});
