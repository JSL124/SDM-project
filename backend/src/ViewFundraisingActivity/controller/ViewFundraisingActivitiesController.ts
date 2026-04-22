import { FundraisingActivity } from '../../shared/entity/FundraisingActivity';

export class ViewFundraisingActivitiesController {
  async viewFundraisingActivities(): Promise<FundraisingActivity[]> {
    return FundraisingActivity.viewFundraisingActivities();
  }

  async viewFundraisingActivityDetails(activityID: string): Promise<FundraisingActivity | null> {
    return FundraisingActivity.viewFundraisingActivityDetails(activityID);
  }
}
