export type LogoutResult = { success: true; message: 'Logout successful.' };

export class LogoutController {
  logout(): LogoutResult {
    return {
      success: true,
      message: 'Logout successful.',
    };
  }
}
