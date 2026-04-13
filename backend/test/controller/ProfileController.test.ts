import { ProfileController } from '../../src/profile/controller/ProfileController';
import { UserProfile } from '../../src/profile/entity/UserProfile';

// Mock the UserProfile entity
jest.mock('../../src/profile/entity/UserProfile');

describe('ProfileController', () => {
  let controller: ProfileController;

  beforeEach(() => {
    controller = new ProfileController();
    jest.clearAllMocks();
  });

  it('should return success when email does not exist and save succeeds', async () => {
    (UserProfile.existsByEmail as jest.Mock).mockResolvedValue(false);
    (UserProfile.saveProfile as jest.Mock).mockResolvedValue(true);

    const result = await controller.createProfile('New User', 'new.user@example.com', '0498765432', '456 Example Ave');

    expect(result).toEqual({
      success: true,
      message: 'Profile created successfully.',
    });
    expect(UserProfile.existsByEmail).toHaveBeenCalledWith('new.user@example.com');
    expect(UserProfile.saveProfile).toHaveBeenCalledWith('New User', 'new.user@example.com', '0498765432', '456 Example Ave');
  });

  it('should return failure when email already exists', async () => {
    (UserProfile.existsByEmail as jest.Mock).mockResolvedValue(true);

    const result = await controller.createProfile('Existing User', 'existing.user@example.com', '0412345678', '123 Test St');

    expect(result).toEqual({
      success: false,
      message: 'Email already exists.',
    });
    expect(UserProfile.existsByEmail).toHaveBeenCalledWith('existing.user@example.com');
    expect(UserProfile.saveProfile).not.toHaveBeenCalled();
  });

  it('should return failure when save fails', async () => {
    (UserProfile.existsByEmail as jest.Mock).mockResolvedValue(false);
    (UserProfile.saveProfile as jest.Mock).mockResolvedValue(false);

    const result = await controller.createProfile('New User', 'new.user@example.com', '0498765432', '456 Example Ave');

    expect(result).toEqual({
      success: false,
      message: 'Failed to create profile.',
    });
  });
});
