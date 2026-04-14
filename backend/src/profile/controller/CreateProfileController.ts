import { UserProfile } from '../entity/UserProfile';

export type CreateProfileResult =
  | { success: true; message: 'Profile created successfully.' }
  | { success: false; message: 'Email already exists.' }
  | { success: false; message: 'Failed to create profile.' };

export class CreateProfileController {
  async createProfile(name: string, email: string, phoneNum: string, address: string): Promise<CreateProfileResult> {
    const emailExists = await UserProfile.existsByEmail(email);
    if (emailExists) {
      return { success: false, message: 'Email already exists.' };
    }

    const saved = await UserProfile.saveProfile(name, email, phoneNum, address);
    if (!saved) {
      return { success: false, message: 'Failed to create profile.' };
    }

    return { success: true, message: 'Profile created successfully.' };
  }
}
