import { StoreModel } from 'react-app-model';
import { Action, action, Thunk, thunk, debug } from "easy-peasy";
import { toast } from "react-toastify";

import { getApi, postApi } from 'react-app-api';
import { IPayload } from 'react-app-interfaces';
import NavigationService from 'src/routes/NavigationService';
import store from 'react-app-store';

const initialState = {
  membersDetail:{},
  groupsDetail:{},
}
export interface DashboardModel {
  membersDetail: string | object | any;
  groupsDetail: string | object | any;
  
  //**************State Actions************///
 
  setMembersDetail:Action<DashboardModel, object | any>;
  setGroupsDetail:Action<DashboardModel, object | any>;
  reset: Action<DashboardModel>;
 
  
  //**************State  Actions************///

  //**************Thunk Actions************///
  getMembersDetail:Thunk<DashboardModel, object>;
  getGroupsDetail:Thunk<DashboardModel, object>;
 
 
  //**************Thunk Actions************///
}

const dashboard: DashboardModel = {

  ...initialState,
 
  setMembersDetail: action((state, payload) => {
    state.membersDetail = payload;
  }),
  setGroupsDetail: action((state, payload) => {
    state.groupsDetail = payload;
  }),
 
  
  

  reset: action(state => state = initialState),
  
  getMembersDetail: thunk<DashboardModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getState }) => {
   console.log("pyaload",payload)
   // getStoreActions().common.setLoading(true);
    let response = await getApi(payload);
    if (response && response.status !== 200) {
      toast.error(response.message);
      getStoreActions().common.setLoading(false);
    } else if (response && response.status === 200) {
      actions.setMembersDetail(response.data);
      getStoreActions().common.setLoading(false);
    }
    else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),

  getGroupsDetail: thunk<DashboardModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getState }) => {
    
   // getStoreActions().common.setLoading(true);
    let response = await getApi(payload);
    if (response && response.status !== 200) {
      toast.error(response.message);
      getStoreActions().common.setLoading(false);
    } else if (response && response.status === 200) {
      actions.setMembersDetail(response.data);
      getStoreActions().common.setLoading(false);
    }
    else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
};

export default dashboard;