import { Router, Request, Response } from 'express';
import { CreateProfileController } from '../profile/controller/CreateProfileController';

const router = Router();
const profileController = new CreateProfileController();

router.post('/api/profile', async (req: Request, res: Response) => {
  try {
    const { name, email, phoneNum, address } = req.body;
    const result = await profileController.createProfile(name, email, phoneNum, address);
    if (result.success) {
      res.status(201).json(result);
      return;
    }

    const statusCode = result.message === 'Email already exists.' ? 409 : 400;
    res.status(statusCode).json(result);
  } catch (error) {
    console.error('Create profile request failed:', error);
    res.status(500).json({ success: false, message: 'Unable to connect to server.' });
  }
});

export default router;
