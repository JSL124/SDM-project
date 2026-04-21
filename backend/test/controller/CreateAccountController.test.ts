import { CreateAccountController } from '../../src/CreateAccount/controller/CreateAccountController';
import { UserAccount } from '../../src/shared/entity/UserAccount';

jest.mock('../../src/shared/entity/UserAccount');

describe('CreateAccountController', () => {
  let controller: CreateAccountController;

  beforeEach(() => {
    controller = new CreateAccountController();
    jest.clearAllMocks();
  });

  it('should return UserAccount when account is created', async () => {
    const account = new UserAccount('new.user@example.com', 'hash');
    (UserAccount.createAccount as jest.Mock).mockResolvedValue(account);

    const result = await controller.createAccount('new.user@example.com', 'Password123!', 'New User', '1998-01-01', '0498765432', '1');

    expect(result).toBe(account);
    expect(UserAccount.createAccount).toHaveBeenCalledWith(
      'new.user@example.com',
      'Password123!',
      'New User',
      '1998-01-01',
      '0498765432',
      '1'
    );
  });

  it('should return null when user account exists', async () => {
    (UserAccount.createAccount as jest.Mock).mockResolvedValue(null);

    const result = await controller.createAccount('existing.user@example.com', 'Password123!', 'Existing User', '1998-01-01', '0412345678', '1');

    expect(result).toBeNull();
  });
});
