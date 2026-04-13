import { Router, Request, Response } from 'express';
import { CreateAccountController } from '../account/controller/CreateAccountController';

const router = Router();
const createAccountController = new CreateAccountController();

router.post('/api/account', async (req: Request, res: Response) => {
  try {
    const { profileId, username, password, role } = req.body;
    const result = await createAccountController.createAccount(profileId, username, password, role);
    if (result.success) {
      res.json(result);
      return;
    }

    res.status(400).json(result);
  } catch (error) {
    console.error('Create account request failed:', error);
    res.status(500).json({ success: false, message: 'Unable to connect to server.' });
  }
});

export default router;
