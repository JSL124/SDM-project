import { Router, Request, Response } from 'express';
import { CreateFundraisingActivityController } from '../fundraising/controller/CreateFundraisingActivityController';
import { ViewFundraisingActivitiesController } from '../fundraising/controller/ViewFundraisingActivitiesController';

const router = Router();
const createFundraisingActivityController = new CreateFundraisingActivityController();
const viewFundraisingActivitiesController = new ViewFundraisingActivitiesController();

router.post('/api/fundraising-activity', async (req: Request, res: Response) => {
  try {
    const { title, description, targetAmount, category, startDate, endDate } = req.body;
    const result = await createFundraisingActivityController.createFundraisingActivity(
      title,
      description,
      targetAmount,
      category,
      startDate,
      endDate,
    );

    if (result.success) {
      res.status(201).json(result);
      return;
    }

    res.status(400).json(result);
  } catch (error) {
    console.error('Create fundraising activity request failed:', error);
    res.status(500).json({ success: false, message: 'Unable to connect to server.' });
  }
});

router.get('/api/fundraising-activity', async (req: Request, res: Response) => {
  try {
    const activities = await viewFundraisingActivitiesController.getFundraisingActivities();
    res.status(200).json({ success: true, activities });
  } catch (error) {
    console.error('Get fundraising activities request failed:', error);
    res.status(500).json({ success: false, message: 'Unable to connect to server.' });
  }
});

router.get('/api/fundraising-activity/:activityID', async (req: Request, res: Response) => {
  try {
    const activityID = String(req.params.activityID);
    const activity = await viewFundraisingActivitiesController.getFundraisingActivityDetails(activityID);
    if (activity === null) {
      res.status(404).json({ success: false, message: 'Activity not found.' });
      return;
    }
    res.status(200).json({ success: true, activity });
  } catch (error) {
    console.error('Get fundraising activity details request failed:', error);
    res.status(500).json({ success: false, message: 'Unable to connect to server.' });
  }
});

export default router;
