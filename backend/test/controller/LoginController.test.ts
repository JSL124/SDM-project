import { LoginController } from '../../src/login/controller/LoginController';
import { UserAccount } from '../../src/login/entity/UserAccount';

// Mock the UserAccount entity
jest.mock('../../src/login/entity/UserAccount');

describe('LoginController', () => {
  let controller: LoginController;

  beforeEach(() => {
    controller = new LoginController();
    jest.clearAllMocks();
  });

  it('should return success when email exists and password is correct', async () => {
    const mockAccount = new UserAccount('active.fundraiser@example.com', 'hash');
    jest.spyOn(mockAccount, 'verifyPassword').mockResolvedValue(true);
    (UserAccount.findAccountByEmail as jest.Mock).mockResolvedValue(mockAccount);

    const result = await controller.login('active.fundraiser@example.com', 'Fundraiser123!');

    expect(result).toEqual({
      success: true,
      message: 'Login successful.',
    });
    expect(UserAccount.findAccountByEmail).toHaveBeenCalledWith('active.fundraiser@example.com');
    expect(mockAccount.verifyPassword).toHaveBeenCalledWith('Fundraiser123!');
  });

  it('should return account missing result when account does not exist', async () => {
    (UserAccount.findAccountByEmail as jest.Mock).mockResolvedValue(null);

    const result = await controller.login('missing.fundraiser@example.com', 'AnyPass123!');

    expect(result).toEqual({
      success: false,
      message: 'Account does not exist.',
    });
    expect(UserAccount.findAccountByEmail).toHaveBeenCalledWith('missing.fundraiser@example.com');
  });

  it('should return invalid password result when password is incorrect', async () => {
    const mockAccount = new UserAccount('wrongpass.fundraiser@example.com', 'hash');
    jest.spyOn(mockAccount, 'verifyPassword').mockResolvedValue(false);
    (UserAccount.findAccountByEmail as jest.Mock).mockResolvedValue(mockAccount);

    const result = await controller.login('wrongpass.fundraiser@example.com', 'WrongPass!');

    expect(result).toEqual({
      success: false,
      message: 'Invalid password.',
    });
    expect(mockAccount.verifyPassword).toHaveBeenCalledWith('WrongPass!');
  });
});
