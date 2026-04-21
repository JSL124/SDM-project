import { Router, type RequestHandler } from 'express';
import { LoginController } from '../Login/controller/LoginController';

const router = Router();
const loginController = new LoginController();

const loginHandler: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const account = await loginController.login(email, password);
    if (account !== null) {
      res.json({
        success: true,
        message: 'Login successful.',
        user: account.getLoginUser(),
      });
      return;
    }

    res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
    });
  } catch (error) {
    console.error('Login request failed:', error);
    res.status(500).json({ success: false, message: 'Unable to connect to server.' });
  }
};

router.post('/api/login', loginHandler);

export default router;
