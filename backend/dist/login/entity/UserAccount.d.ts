export declare class UserAccount {
    private email;
    private passwordHash;
    constructor(email: string, passwordHash: string);
    getEmail(): string;
    getPasswordHash(): string;
    static findAccountByEmail(email: string): Promise<UserAccount | null>;
    verifyPassword(password: string): Promise<boolean>;
}
//# sourceMappingURL=UserAccount.d.ts.map