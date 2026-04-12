"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LoginController_1 = require("../login/controller/LoginController");
const router = (0, express_1.Router)();
const loginController = new LoginController_1.LoginController();
router.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await loginController.login(email, password);
        if (result.success) {
            res.json(result);
            return;
        }
        res.status(401).json(result);
    }
    catch {
        res.status(500).json({ success: false, message: 'Unable to connect to server.' });
    }
});
exports.default = router;
//# sourceMappingURL=loginRoutes.js.map