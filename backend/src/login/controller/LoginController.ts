import { UserAccount } from '../entity/UserAccount';

export type LoginResult =
  | { success: true; message: 'Login successful.' }
  | { success: false; message: 'Account does not exist.' }
  | { success: false; message: 'Invalid password.' };

export class LoginController {
  async login(email: string, password: string): Promise<LoginResult> {
    const account = await UserAccount.findAccountByEmail(email);
    if (account === null) {
      return {
        success: false,
        message: 'Account does not exist.',
      };
    }

    const isValidPassword = await account.verifyPassword(password);
    if (!isValidPassword) {
      return {
        success: false,
        message: 'Invalid password.',
      };
    }

    return {
      success: true,
      message: 'Login successful.',
    };
  }
}
