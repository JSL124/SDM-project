import { UserAccount } from '../../shared/entity/UserAccount';

export class CreateAccountController {
  async createAccount(email: string, password: string, name: string, DOB: string, phoneNum: string, profileId: string): Promise<UserAccount | null> {
    return UserAccount.createAccount(email, password, name, DOB, phoneNum, profileId);
  }
}
