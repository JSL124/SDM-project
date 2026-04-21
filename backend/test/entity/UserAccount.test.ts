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
          name: 'Active Fundraiser',
          dob: '1998-01-01',
          phone_num: '0412345678',
          profile_id: '1',
          username: 'active-user',
          role: 'User admin',
        }],
        command: 'SELECT',
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const account = await UserAccount.login('active.fundraiser@example.com', 'Fundraiser123!');

      expect(account).not.toBeNull();
      expect(account).toBeInstanceOf(UserAccount);
      expect(account?.getLoginUser()).toEqual({
        email: 'active.fundraiser@example.com',
        username: 'active-user',
        role: 'User admin',
      });
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT email, password, name, dob, phone_num, profile_id, username, role FROM user_account WHERE email = $1',
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
          name: 'Active Fundraiser',
          dob: '1998-01-01',
          phone_num: '0412345678',
          profile_id: '1',
          username: 'active-user',
          role: 'Fundraiser',
        }],
        command: 'SELECT',
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const account = await UserAccount.login('active.fundraiser@example.com', 'WrongPassword!');

      expect(account).toBeNull();
    });
  });
});
