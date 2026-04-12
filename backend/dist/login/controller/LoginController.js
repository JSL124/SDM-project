"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const UserAccount_1 = require("../entity/UserAccount");
class LoginController {
    async login(email, password) {
        const account = await UserAccount_1.UserAccount.findAccountByEmail(email);
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
exports.LoginController = LoginController;
//# sourceMappingURL=LoginController.js.map