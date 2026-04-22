import { CreateProfileController } from '../../src/CreateProfile/controller/CreateProfileController';
import { UserProfile } from '../../src/CreateProfile/entity/UserProfile';

jest.mock('../../src/CreateProfile/entity/UserProfile');

describe('CreateProfileController', () => {
  let controller: CreateProfileController;

  beforeEach(() => {
    controller = new CreateProfileController();
    jest.clearAllMocks();
  });

  it('should return UserProfile when profile is created', async () => {
    const profile = new UserProfile('Fundraiser', 'Creates fundraising activities');
    (UserProfile.createProfile as jest.Mock).mockResolvedValue(profile);

    const result = await controller.createProfile('Fundraiser', 'Creates fundraising activities');

    expect(result).toBe(profile);
    expect(UserProfile.createProfile).toHaveBeenCalledWith('Fundraiser', 'Creates fundraising activities');
  });

  it('should return null when profile creation fails', async () => {
    (UserProfile.createProfile as jest.Mock).mockResolvedValue(null);

    const result = await controller.createProfile('Fundraiser', 'Creates fundraising activities');

    expect(result).toBeNull();
  });

  it('should return profiles when listing profiles succeeds', async () => {
    const profiles = [
      { profileId: '1', role: 'Donee', description: 'Receives donations' },
      { profileId: '2', role: 'Fundraiser', description: 'Creates fundraising activities' },
    ];
    (UserProfile.listProfiles as jest.Mock).mockResolvedValue(profiles);

    const result = await controller.listProfiles();

    expect(result).toBe(profiles);
    expect(UserProfile.listProfiles).toHaveBeenCalled();
  });
});
