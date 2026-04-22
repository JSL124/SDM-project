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

  describe('listProfiles', () => {
    it('should return profiles ordered by profile ID', async () => {
      mockQuery.mockResolvedValue({
        rows: [
          { profile_id: '1', role: 'Donee', description: 'Receives donations' },
          { profile_id: '2', role: 'Fundraiser', description: 'Creates fundraising activities' },
          { profile_id: '3', role: 'User admin', description: 'Manages user accounts' },
          { profile_id: '4', role: 'Platform manager', description: 'Manages platform operations' },
        ],
        command: 'SELECT',
        rowCount: 4,
        oid: 0,
        fields: [],
      });

      const profiles = await UserProfile.listProfiles();

      expect(profiles).toEqual([
        { profileId: '1', role: 'Donee', description: 'Receives donations' },
        { profileId: '2', role: 'Fundraiser', description: 'Creates fundraising activities' },
        { profileId: '3', role: 'User admin', description: 'Manages user accounts' },
        { profileId: '4', role: 'Platform manager', description: 'Manages platform operations' },
      ]);
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT profile_id, role, description FROM user_profile ORDER BY profile_id ASC'
      );
    });

    it('should throw when profile lookup fails', async () => {
      mockQuery.mockRejectedValue(new Error('select failed'));

      await expect(UserProfile.listProfiles()).rejects.toThrow('select failed');
    });
  });
});
