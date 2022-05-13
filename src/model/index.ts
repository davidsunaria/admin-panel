import auth, { AuthModel } from './Auth';
import common, { CommonModel } from './Common';
import user, { UserModel } from './User';
import group, { GroupModel } from './Group';
import event, { EventModel } from './Event';
import dashboard, { DashboardModel } from './Dashboard';
import reportedResource, { ReportedModel } from './Reported';

export interface StoreModel {
  auth: AuthModel;
  common: CommonModel;
  user: UserModel;
  group:GroupModel;
  event:EventModel;
  dashboard:DashboardModel;
  reportedResource:ReportedModel;
};

const model: StoreModel = {
  auth, 
  common,
  user,
  group,
  event,
  dashboard,
  reportedResource,
};

export default model;
