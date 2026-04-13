import { CreateAccountController } from '../../src/account/controller/CreateAccountController';
import { UserAccount } from '../../src/login/entity/UserAccount';
import { UserProfile } from '../../src/profile/entity/UserProfile';

// Mock the entities
jest.mock('../../src/login/entity/UserAccount');
jest.mock('../../src/profile/entity/UserProfile');

describe('CreateAccountController', () => {
  let controller: CreateAccountController;

  beforeEach(() => {
    controller = new CreateAccountController();
    jest.clearAllMocks();
  });

  it('should return success when account is created successfully', async () => {
    (UserAccount.existsByUsername as jest.Mock).mockResolvedValue(false);
    (UserProfile.findProfileById as jest.Mock).mockResolvedValue({
      getEmail: () => 'test@example.com',
    });
    (UserAccount.saveAccount as jest.Mock).mockResolvedValue(true);

    const result = await controller.createAccount('1', 'newuser', 'Password123!', 'Fundraiser');

    expect(result).toEqual({
      success: true,
      message: 'Account created successfully.',
    });
    expect(UserAccount.existsByUsername).toHaveBeenCalledWith('newuser');
    expect(UserProfile.findProfileById).toHaveBeenCalledWith('1');
    expect(UserAccount.saveAccount).toHaveBeenCalledWith('1', 'test@example.com', 'newuser', 'Password123!', 'Fundraiser');
  });

  it('should return error when username is empty', async () => {
    const result = await controller.createAccount('1', '', 'Password123!', 'Fundraiser');

    expect(result).toEqual({
      success: false,
      message: 'Username is required.',
    });
    expect(UserAccount.existsByUsername).not.toHaveBeenCalled();
  });

  it('should return error when username is whitespace only', async () => {
    const result = await controller.createAccount('1', '   ', 'Password123!', 'Fundraiser');

    expect(result).toEqual({
      success: false,
      message: 'Username is required.',
    });
    expect(UserAccount.existsByUsername).not.toHaveBeenCalled();
  });

  it('should return error when password is empty', async () => {
    const result = await controller.createAccount('1', 'newuser', '', 'Fundraiser');

    expect(result).toEqual({
      success: false,
      message: 'Password is required.',
    });
    expect(UserAccount.existsByUsername).not.toHaveBeenCalled();
  });

  it('should return error when password is whitespace only', async () => {
    const result = await controller.createAccount('1', 'newuser', '   ', 'Fundraiser');

    expect(result).toEqual({
      success: false,
      message: 'Password is required.',
    });
    expect(UserAccount.existsByUsername).not.toHaveBeenCalled();
  });

  it('should return error when username already exists', async () => {
    (UserAccount.existsByUsername as jest.Mock).mockResolvedValue(true);

    const result = await controller.createAccount('1', 'existinguser', 'Password123!', 'Donee');

    expect(result).toEqual({
      success: false,
      message: 'Username already exists.',
    });
    expect(UserProfile.findProfileById).not.toHaveBeenCalled();
  });

  it('should return error when profile is not found', async () => {
    (UserAccount.existsByUsername as jest.Mock).mockResolvedValue(false);
    (UserProfile.findProfileById as jest.Mock).mockResolvedValue(null);

    const result = await controller.createAccount('999', 'newuser', 'Password123!', 'User admin');

    expect(result).toEqual({
      success: false,
      message: 'Profile not found.',
    });
    expect(UserAccount.saveAccount).not.toHaveBeenCalled();
  });

  it('should return error when saveAccount fails', async () => {
    (UserAccount.existsByUsername as jest.Mock).mockResolvedValue(false);
    (UserProfile.findProfileById as jest.Mock).mockResolvedValue({
      getEmail: () => 'test@example.com',
    });
    (UserAccount.saveAccount as jest.Mock).mockResolvedValue(false);

    const result = await controller.createAccount('1', 'newuser', 'Password123!', 'Platform manager');

    expect(result).toEqual({
      success: false,
      message: 'Failed to create account.',
    });
  });
});
