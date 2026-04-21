import { UserAccount } from '../../src/shared/entity/UserAccount';

jest.mock('../../src/db', () => ({
  query: jest.fn(),
}));

import { query } from '../../src/db';
const mockQuery = query as jest.MockedFunction<typeof query>;

describe('UserAccount - Create Account methods', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAccount', () => {
    it('should return UserAccount on successful insert', async () => {
      mockQuery.mockResolvedValue({
        rows: [],
        command: 'INSERT',
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const account = await UserAccount.createAccount('new.user@example.com', 'Password123!', 'New User', '1998-01-01', '0498765432', '1');

      expect(account).not.toBeNull();
      expect(account).toBeInstanceOf(UserAccount);
      expect(mockQuery).toHaveBeenCalledWith(
        'INSERT INTO user_account (email, password, name, dob, phone_num, profile_id) VALUES ($1, $2, $3, $4, $5, $6)',
        ['new.user@example.com', 'Password123!', 'New User', '1998-01-01', '0498765432', '1']
      );
    });

    it('should return null when account already exists', async () => {
      mockQuery.mockRejectedValue(new Error('duplicate key value violates unique constraint'));

      const account = await UserAccount.createAccount('existing.user@example.com', 'Password123!', 'Existing User', '1998-01-01', '0412345678', '1');

      expect(account).toBeNull();
      expect(mockQuery).toHaveBeenCalledTimes(1);
    });

    it('should return null when insert fails', async () => {
      mockQuery.mockRejectedValue(new Error('insert failed'));

      const account = await UserAccount.createAccount('new.user@example.com', 'Password123!', 'New User', '1998-01-01', '0498765432', '1');

      expect(account).toBeNull();
    });
  });
});
