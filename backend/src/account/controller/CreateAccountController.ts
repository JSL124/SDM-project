import { UserAccount } from '../../login/entity/UserAccount';
import { UserProfile } from '../../profile/entity/UserProfile';

export type CreateAccountResult =
  | { success: true; message: 'Account created successfully.' }
  | { success: false; message: string };

export class CreateAccountController {
  async createAccount(profileId: string, username: string, password: string, role: string): Promise<CreateAccountResult> {
    try {
      this.validateInput(username, password);
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }

    const usernameExists = await UserAccount.existsByUsername(username);
    if (usernameExists) {
      return {
        success: false,
        message: 'Username already exists.',
      };
    }

    const profile = await UserProfile.findProfileById(profileId);
    if (profile === null) {
      return {
        success: false,
        message: 'Profile not found.',
      };
    }

    const saved = await UserAccount.saveAccount(profileId, profile.getEmail(), username, password, role);
    if (!saved) {
      return {
        success: false,
        message: 'Failed to create account.',
      };
    }

    return {
      success: true,
      message: 'Account created successfully.',
    };
  }

  validateInput(username: string, password: string): void {
    if (!username || !username.trim()) {
      throw new Error('Username is required.');
    }

    if (!password || !password.trim()) {
      throw new Error('Password is required.');
    }
  }
}
