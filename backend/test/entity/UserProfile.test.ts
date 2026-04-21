import { UserProfile } from '../../src/CreateProfile/entity/UserProfile';

jest.mock('../../src/db', () => ({
  query: jest.fn(),
}));

import { query } from '../../src/db';
const mockQuery = query as jest.MockedFunction<typeof query>;

describe('UserProfile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should store role and description', () => {
      const profile = new UserProfile('Fundraiser', 'Creates fundraising activities');

      expect(profile.role).toBe('Fundraiser');
      expect(profile.description).toBe('Creates fundraising activities');
    });
  });

  describe('createProfile', () => {
    it('should return UserProfile on successful insert', async () => {
      mockQuery.mockResolvedValue({
        rows: [],
        command: 'INSERT',
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const profile = await UserProfile.createProfile('Fundraiser', 'Creates fundraising activities');

      expect(profile).not.toBeNull();
      expect(profile!.role).toBe('Fundraiser');
      expect(profile!.description).toBe('Creates fundraising activities');
      expect(mockQuery).toHaveBeenCalledWith(
        'INSERT INTO user_profile (role, description) VALUES ($1, $2)',
        ['Fundraiser', 'Creates fundraising activities']
      );
    });

    it('should return null when insert fails', async () => {
      mockQuery.mockRejectedValue(new Error('insert failed'));

      const profile = await UserProfile.createProfile('Fundraiser', 'Creates fundraising activities');

      expect(profile).toBeNull();
    });
  });
});
