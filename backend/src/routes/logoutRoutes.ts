import { Router, Request, Response } from 'express';
import { LogoutController } from '../logout/controller/LogoutController';

const router = Router();
const logoutController = new LogoutController();

router.post('/api/logout', (req: Request, res: Response) => {
  logoutController.logout();
  res.json({ success: true });
});

export default router;
