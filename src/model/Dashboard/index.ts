import { StoreModel } from 'react-app-model';
import { Action, action, Thunk, thunk, debug } from "easy-peasy";
import { toast } from "react-toastify";

import { getApi, postApi } from 'react-app-api';
import { IPayload } from 'react-app-interfaces';
import NavigationService from 'src/routes/NavigationService';
import store from 'react-app-store';

const initialState = {
  subscribersCount:{},
  membersCount:{},
}
export interface DashboardModel {
  subscribersCount: string | object | any;
  membersCount: string | object | any;
  
  //**************State Actions************///
 
  setSubscribersCount:Action<DashboardModel, object | any>;
  setMembersCount:Action<DashboardModel, object | any>;
  reset: Action<DashboardModel>;
 
  
  //**************State  Actions************///

  //**************Thunk Actions************///
  getSubscribersCount:Thunk<DashboardModel, object>;
  getMembersCount:Thunk<DashboardModel, object>;
 
 
  //**************Thunk Actions************///
}

const dashboard: DashboardModel = {

  ...initialState,
 
  setSubscribersCount: action((state, payload) => {
    state.subscribersCount = payload;
  }),
  setMembersCount: action((state, payload) => {
    state.membersCount = payload;
  }),
 
  
  

  reset: action(state => state = initialState),
  
  getSubscribersCount: thunk<DashboardModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getState }) => {
   console.log("pyaload",payload)
   // getStoreActions().common.setLoading(true);
    let response = await getApi(payload);
    if (response && response.status !== 200) {
      toast.error(response.message);
      getStoreActions().common.setLoading(false);
    } else if (response && response.status === 200) {
      actions.setSubscribersCount(response.data);
      getStoreActions().common.setLoading(false);
    }
    else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),

  getMembersCount: thunk<DashboardModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getState }) => {
    
   // getStoreActions().common.setLoading(true);
    let response = await getApi(payload);
    if (response && response.status !== 200) {
      toast.error(response.message);
      getStoreActions().common.setLoading(false);
    } else if (response && response.status === 200) {
      actions.setMembersCount(response.data);
      getStoreActions().common.setLoading(false);
    }
    else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
};

export default dashboard;