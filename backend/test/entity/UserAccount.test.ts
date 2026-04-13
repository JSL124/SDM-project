import bcrypt from 'bcrypt';
import { UserAccount } from '../../src/login/entity/UserAccount';

// Mock the db module
jest.mock('../../src/db', () => ({
  query: jest.fn(),
}));

import { query } from '../../src/db';
const mockQuery = query as jest.MockedFunction<typeof query>;

describe('UserAccount', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor and getters', () => {
    it('should store email, username, and passwordHash', () => {
      const account = new UserAccount('test@example.com', 'jason04', 'hashedpw');
      expect(account.getEmail()).toBe('test@example.com');
      expect(account.getUsername()).toBe('jason04');
      expect(account.getPasswordHash()).toBe('hashedpw');
    });
  });

  describe('findAccountByEmail', () => {
    it('should return UserAccount when account exists', async () => {
      mockQuery.mockResolvedValue({
        rows: [{ email: 'active.fundraiser@example.com', username: 'jason04', password_hash: '$2b$10$somehash', role: 'Fundraiser' }],
        command: 'SELECT',
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const account = await UserAccount.findAccountByEmail('active.fundraiser@example.com');

      expect(account).not.toBeNull();
      expect(account!.getEmail()).toBe('active.fundraiser@example.com');
      expect(account!.getUsername()).toBe('jason04');
      expect(account!.getPasswordHash()).toBe('$2b$10$somehash');
      expect(account!.getRole()).toBe('Fundraiser');
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT email, username, password_hash, role FROM user_account WHERE email = $1',
        ['active.fundraiser@example.com']
      );
    });

    it('should return null when account does not exist', async () => {
      mockQuery.mockResolvedValue({
        rows: [],
        command: 'SELECT',
        rowCount: 0,
        oid: 0,
        fields: [],
      });

      const account = await UserAccount.findAccountByEmail('missing.fundraiser@example.com');

      expect(account).toBeNull();
    });
  });

  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      const hash = await bcrypt.hash('Fundraiser123!', 10);
      const account = new UserAccount('test@example.com', 'jason04', hash);

      const result = await account.verifyPassword('Fundraiser123!');

      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const hash = await bcrypt.hash('Fundraiser123!', 10);
      const account = new UserAccount('test@example.com', 'jason04', hash);

      const result = await account.verifyPassword('WrongPassword!');

      expect(result).toBe(false);
    });
  });
});
