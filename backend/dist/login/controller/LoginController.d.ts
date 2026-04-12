export type LoginResult = {
    success: true;
    message: 'Login successful.';
} | {
    success: false;
    message: 'Account does not exist.';
} | {
    success: false;
    message: 'Invalid password.';
};
export declare class LoginController {
    login(email: string, password: string): Promise<LoginResult>;
}
//# sourceMappingURL=LoginController.d.ts.map