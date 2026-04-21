import { LoginController } from '../../src/Login/controller/LoginController';
import { UserAccount } from '../../src/shared/entity/UserAccount';

jest.mock('../../src/shared/entity/UserAccount');

describe('LoginController', () => {
  let controller: LoginController;

  beforeEach(() => {
    controller = new LoginController();
    jest.clearAllMocks();
  });

  it('should return UserAccount when UserAccount.login returns an account', async () => {
    const account = {
      getLoginUser: () => ({
        email: 'active.fundraiser@example.com',
        username: 'active-user',
        role: 'User admin',
      }),
    } as unknown as UserAccount;
    (UserAccount.login as jest.Mock).mockResolvedValue(account);

    const result = await controller.login('active.fundraiser@example.com', 'Fundraiser123!');

    expect(result).toBe(account);
    expect(UserAccount.login).toHaveBeenCalledWith('active.fundraiser@example.com', 'Fundraiser123!');
  });

  it('should return null when UserAccount.login returns null', async () => {
    (UserAccount.login as jest.Mock).mockResolvedValue(null);

    const result = await controller.login('missing.fundraiser@example.com', 'AnyPass123!');

    expect(result).toBeNull();
    expect(UserAccount.login).toHaveBeenCalledWith('missing.fundraiser@example.com', 'AnyPass123!');
  });
});
