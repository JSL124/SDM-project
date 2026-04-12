import { Router, Request, Response } from 'express';
import { LoginController } from '../login/controller/LoginController';

const router = Router();
const loginController = new LoginController();

router.post('/api/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await loginController.login(email, password);
    if (result.success) {
      res.json(result);
      return;
    }

    res.status(401).json(result);
  } catch (error) {
    console.error('Login request failed:', error);
    res.status(500).json({ success: false, message: 'Unable to connect to server.' });
  }
});

export default router;
