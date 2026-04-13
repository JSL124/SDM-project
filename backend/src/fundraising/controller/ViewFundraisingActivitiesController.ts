import { FundraisingActivity } from '../entity/FundraisingActivity';

export class ViewFundraisingActivitiesController {
  async getFundraisingActivities(): Promise<FundraisingActivity[]> {
    return FundraisingActivity.retrieveFundraisingActivities();
  }

  async getFundraisingActivityDetails(activityID: string): Promise<FundraisingActivity | null> {
    return FundraisingActivity.retrieveFundraisingActivityDetails(activityID);
  }
}
