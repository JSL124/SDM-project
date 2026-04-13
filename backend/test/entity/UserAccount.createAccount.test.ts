import { UserAccount } from '../../src/login/entity/UserAccount';

// Mock the db module
jest.mock('../../src/db', () => ({
  query: jest.fn(),
}));

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('$2b$10$hashedpassword'),
  compare: jest.fn(),
}));

import { query } from '../../src/db';
const mockQuery = query as jest.MockedFunction<typeof query>;

describe('UserAccount - Create Account methods', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('existsByUsername', () => {
    it('should return true when username exists', async () => {
      mockQuery.mockResolvedValue({
        rows: [{ '?column?': 1 }],
        command: 'SELECT',
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const exists = await UserAccount.existsByUsername('existinguser');

      expect(exists).toBe(true);
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT 1 FROM user_account WHERE username = $1',
        ['existinguser']
      );
    });

    it('should return false when username does not exist', async () => {
      mockQuery.mockResolvedValue({
        rows: [],
        command: 'SELECT',
        rowCount: 0,
        oid: 0,
        fields: [],
      });

      const exists = await UserAccount.existsByUsername('newuser');

      expect(exists).toBe(false);
    });
  });

  describe('saveAccount', () => {
    it('should return true on successful insert', async () => {
      mockQuery.mockResolvedValue({
        rows: [],
        command: 'INSERT',
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const saved = await UserAccount.saveAccount('1', 'test@example.com', 'newuser', 'Password123!', 'Fundraiser');

      expect(saved).toBe(true);
      expect(mockQuery).toHaveBeenCalledWith(
        'INSERT INTO user_account (profile_id, email, username, password_hash, role) VALUES ($1, $2, $3, $4, $5)',
        ['1', 'test@example.com', 'newuser', '$2b$10$hashedpassword', 'Fundraiser']
      );
    });

    it('should return false when insert fails (e.g. duplicate username)', async () => {
      mockQuery.mockRejectedValue(new Error('duplicate key value violates unique constraint'));

      const saved = await UserAccount.saveAccount('1', 'existing.user@example.com', 'existinguser', 'Password123!', 'Donee');

      expect(saved).toBe(false);
    });
  });
});
