import { UserAccount } from '../../src/shared/entity/UserAccount';

jest.mock('../../src/db', () => ({
  query: jest.fn(),
}));

import { query } from '../../src/db';
const mockQuery = query as jest.MockedFunction<typeof query>;

describe('UserAccount', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create a UserAccount instance from the BCE diagram fields', () => {
      const account = new UserAccount('test@example.com', 'hashedpw', 'Test User', '1998-01-01', '0412345678', '1');

      expect(account).toBeInstanceOf(UserAccount);
    });
  });

  describe('login', () => {
    it('should return UserAccount when email exists and password matches', async () => {
      mockQuery.mockResolvedValue({
        rows: [{
          email: 'active.fundraiser@example.com',
          password: 'Fundraiser123!',
          profile_id: '1',
          role: 'User admin',
          account_status: 'ACTIVE',
        }],
        command: 'SELECT',
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const account = await UserAccount.login('active.fundraiser@example.com', 'Fundraiser123!');

      expect(account).not.toBeNull();
      expect(account).toBeInstanceOf(UserAccount);
      expect(account?.email).toBe('active.fundraiser@example.com');
      expect(account?.role).toBe('User admin');
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT email, password, account_status, profile_id, role FROM user_account WHERE email = $1',
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

      const account = await UserAccount.login('missing.fundraiser@example.com', 'AnyPass123!');

      expect(account).toBeNull();
    });

    it('should return null when password does not match', async () => {
      mockQuery.mockResolvedValue({
        rows: [{
          email: 'active.fundraiser@example.com',
          password: 'Fundraiser123!',
          profile_id: '1',
          role: 'Fundraiser',
          account_status: 'ACTIVE',
        }],
        command: 'SELECT',
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const account = await UserAccount.login('active.fundraiser@example.com', 'WrongPassword!');

      expect(account).toBeNull();
    });

    it('should return null when account is disabled', async () => {
      mockQuery.mockResolvedValue({
        rows: [{
          email: 'disabled.fundraiser@example.com',
          password: 'Disabled123!',
          profile_id: '1',
          role: 'Fundraiser',
          account_status: 'DISABLED',
        }],
        command: 'SELECT',
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const account = await UserAccount.login('disabled.fundraiser@example.com', 'Disabled123!');

      expect(account).toBeNull();
    });
  });
});
