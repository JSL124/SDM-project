import { Router, Request, Response } from 'express';
import { CreateProfileController } from '../CreateProfile/controller/CreateProfileController';

const router = Router();
const profileController = new CreateProfileController();

router.get('/api/profile', async (_req: Request, res: Response) => {
  try {
    const profiles = await profileController.listProfiles();
    res.json(profiles);
  } catch (error) {
    console.error('List profiles request failed:', error);
    res.status(500).json([]);
  }
});

router.post('/api/profile', async (req: Request, res: Response) => {
  try {
    const { role, description } = req.body;
    const profile = await profileController.createProfile(role, description);
    if (profile !== null) {
      res.status(201).json(profile);
      return;
    }

    res.status(400).json(null);
  } catch (error) {
    console.error('Create profile request failed:', error);
    res.status(500).json(null);
  }
});

export default router;
