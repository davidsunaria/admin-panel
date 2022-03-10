import auth, { AuthModel } from './Auth';
import common, { CommonModel } from './Common';
import user, { UserModel } from './User';
import group, { GroupModel } from './Group';
import event, { EventModel } from './Event';
import ReportedData, { ReportedModel } from './Reported';

export interface StoreModel {
  auth: AuthModel;
  common: CommonModel;
  user: UserModel;
  group:GroupModel;
  event:EventModel;
  ReportedData:ReportedModel;
};

const model: StoreModel = {
  auth, 
  common,
  user,
  group,
  event,
  ReportedData,
};

export default model;
