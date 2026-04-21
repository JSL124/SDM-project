import { UserAccount } from '../../shared/entity/UserAccount';

export class LoginController {
  async login(email: string, password: string): Promise<UserAccount | null> {
    return UserAccount.login(email, password);
  }
}
