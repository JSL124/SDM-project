import { UserProfile } from '../../src/profile/entity/UserProfile';

// Mock the db module
jest.mock('../../src/db', () => ({
  query: jest.fn(),
}));

import { query } from '../../src/db';
const mockQuery = query as jest.MockedFunction<typeof query>;

describe('UserProfile - findProfileById', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return UserProfile when profile exists', async () => {
    mockQuery.mockResolvedValue({
      rows: [{
        profile_id: '1',
        name: 'Test User',
        email: 'test@example.com',
        phone_num: '0412345678',
        address: '123 Test St',
      }],
      command: 'SELECT',
      rowCount: 1,
      oid: 0,
      fields: [],
    });

    const profile = await UserProfile.findProfileById('1');

    expect(profile).not.toBeNull();
    expect(profile!.getProfileId()).toBe('1');
    expect(profile!.getName()).toBe('Test User');
    expect(profile!.getEmail()).toBe('test@example.com');
    expect(profile!.getPhoneNum()).toBe('0412345678');
    expect(profile!.getAddress()).toBe('123 Test St');
    expect(mockQuery).toHaveBeenCalledWith(
      'SELECT profile_id, name, email, phone_num, address FROM user_profile WHERE profile_id = $1',
      ['1']
    );
  });

  it('should return null when profile does not exist', async () => {
    mockQuery.mockResolvedValue({
      rows: [],
      command: 'SELECT',
      rowCount: 0,
      oid: 0,
      fields: [],
    });

    const profile = await UserProfile.findProfileById('999');

    expect(profile).toBeNull();
  });
});
