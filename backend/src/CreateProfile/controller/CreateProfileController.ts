import { UserProfile } from '../entity/UserProfile';

export class CreateProfileController {
  async createProfile(role: string, description: string): Promise<UserProfile | null> {
    return UserProfile.createProfile(role, description);
  }
}
