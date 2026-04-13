import { UserProfile } from '../../src/profile/entity/UserProfile';

// Mock the db module
jest.mock('../../src/db', () => ({
  query: jest.fn(),
}));

import { query } from '../../src/db';
const mockQuery = query as jest.MockedFunction<typeof query>;

describe('UserProfile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor and getters', () => {
    it('should store all profile fields', () => {
      const profile = new UserProfile('1', 'Test User', 'test@example.com', '0412345678', '123 Test St');
      expect(profile.getProfileId()).toBe('1');
      expect(profile.getName()).toBe('Test User');
      expect(profile.getEmail()).toBe('test@example.com');
      expect(profile.getPhoneNum()).toBe('0412345678');
      expect(profile.getAddress()).toBe('123 Test St');
    });
  });

  describe('existsByEmail', () => {
    it('should return true when email exists', async () => {
      mockQuery.mockResolvedValue({
        rows: [{ '?column?': 1 }],
        command: 'SELECT',
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const exists = await UserProfile.existsByEmail('existing.user@example.com');

      expect(exists).toBe(true);
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT 1 FROM user_profile WHERE email = $1',
        ['existing.user@example.com']
      );
    });

    it('should return false when email does not exist', async () => {
      mockQuery.mockResolvedValue({
        rows: [],
        command: 'SELECT',
        rowCount: 0,
        oid: 0,
        fields: [],
      });

      const exists = await UserProfile.existsByEmail('new.user@example.com');

      expect(exists).toBe(false);
    });
  });

  describe('saveProfile', () => {
    it('should return true on successful insert', async () => {
      mockQuery.mockResolvedValue({
        rows: [],
        command: 'INSERT',
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const saved = await UserProfile.saveProfile('New User', 'new.user@example.com', '0498765432', '456 Example Ave');

      expect(saved).toBe(true);
      expect(mockQuery).toHaveBeenCalledWith(
        'INSERT INTO user_profile (name, email, phone_num, address) VALUES ($1, $2, $3, $4)',
        ['New User', 'new.user@example.com', '0498765432', '456 Example Ave']
      );
    });

    it('should return false when insert fails (e.g. duplicate email)', async () => {
      mockQuery.mockRejectedValue(new Error('duplicate key value violates unique constraint'));

      const saved = await UserProfile.saveProfile('Existing User', 'existing.user@example.com', '0412345678', '123 Test St');

      expect(saved).toBe(false);
    });
  });
});
