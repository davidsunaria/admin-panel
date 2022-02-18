import auth, { AuthModel } from './Auth';
import common, { CommonModel } from './Common';
import user, { UserModel } from './User';
export interface StoreModel {
  auth: AuthModel;
  common: CommonModel;
  user: UserModel;
};

const model: StoreModel = {
  auth, 
  common,
  user
};

export default model;
