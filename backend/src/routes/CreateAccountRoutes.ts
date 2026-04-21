import { Router, Request, Response } from 'express';
import { CreateAccountController } from '../CreateAccount/controller/CreateAccountController';

const router = Router();
const createAccountController = new CreateAccountController();

router.post('/api/account', async (req: Request, res: Response) => {
  try {
    const { email, password, name, DOB, phoneNum, profileId } = req.body;
    const account = await createAccountController.createAccount(email, password, name, DOB, phoneNum, profileId);
    if (account === null) {
      res.status(400).json({ success: false, message: 'User Account exists.' });
      return;
    }

    res.json({ success: true, message: 'Account created successfully.' });
  } catch (error) {
    console.error('Create account request failed:', error);
    res.status(500).json({ success: false, message: 'Unable to connect to server.' });
  }
});

export default router;
