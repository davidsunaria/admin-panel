import { StoreModel } from 'react-app-model';
import { Action, action, Thunk, thunk} from "easy-peasy";
import { toast } from "react-toastify";

import { getApi} from 'react-app-api';
import { IPayload } from 'react-app-interfaces';


const initialState = {
  subscribersCount:0,
  membersCount:0,
  numberOfEventPerGroup:{},
  numberOfMemberPerGroup:{},
  numberOfMemberPerEvent:{}
}
export interface DashboardModel {
  subscribersCount: string | number;
  membersCount: string | number;
  numberOfEventPerGroup: object | any;
  numberOfMemberPerGroup: object | any;
  numberOfMemberPerEvent: object | any;
  //**************State Actions************///
 
  setSubscribersCount:Action<DashboardModel, object | any>;
  setMembersCount:Action<DashboardModel, object | any>;
  setNumberOfEventPerGroup:Action<DashboardModel, object | any>;
  reset: Action<DashboardModel>;
  setNumberOfMemberPerGroup:Action<DashboardModel>;
  flushData :Action<DashboardModel>;
  setNumberOfMembersPerEvent:Action<DashboardModel>;
  //**************State  Actions************///

  //**************Thunk Actions************///
  getSubscribersCount:Thunk<DashboardModel, object>;
  getMembersCount:Thunk<DashboardModel, object>;
  getEventCountPerGroup:Thunk<DashboardModel, object>;
  getMembersCountPerResource:Thunk<DashboardModel, object>;
 
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

  setNumberOfEventPerGroup: action((state, payload) => {
    state.numberOfEventPerGroup = payload;
  }),

  setNumberOfMemberPerGroup: action((state, payload) => {
    state.numberOfMemberPerGroup = payload;
  }),

  setNumberOfMembersPerEvent: action((state, payload) => {
    state.numberOfMemberPerEvent = payload;
  }),

  flushData: action((state, payload) => {
    state.numberOfMemberPerGroup = {};
  }),
 
  
  

  reset: action(state => state = initialState),
  
  getSubscribersCount: thunk<DashboardModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getState }) => {
    // if ((getState()?.subscribersCount ===0)) {
    //   getStoreActions()?.common?.setLoading(true);
    // }
    getStoreActions().common.setLoading(true);
    let response = await getApi(payload);
    if (response && response?.status !== 200) {
      toast.error(response?.message);
      getStoreActions()?.common?.setLoading(false);
    } else if (response && response?.status === 200) {
      actions.setSubscribersCount(response?.data?.total_subscribers);
      getStoreActions()?.common?.setLoading(false);
    }
    else {
      getStoreActions()?.common?.setLoading(false);
      return true;
    }
  }),

  getMembersCount: thunk<DashboardModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getState }) => {
    
    //getStoreActions().common.setLoading(true);
    let response = await getApi(payload);
    if (response && response?.status !== 200) {
      toast.error(response?.message);
      getStoreActions()?.common?.setLoading(false);
    } else if (response && response?.status === 200) {
      actions.setMembersCount(response?.data?.total_members);
      getStoreActions()?.common?.setLoading(false);
    }
    else {
      getStoreActions()?.common?.setLoading(false);
      return true;
    }
  }),

  getEventCountPerGroup: thunk<DashboardModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getState }) => {
    //  getStoreActions().common.setLoading(true);
    let response = await getApi(payload);
    if (response && response?.status !== 200) {
      toast.error(response?.message);
      getStoreActions()?.common?.setLoading(false);
    } else if (response && response?.status === 200) {
      actions.setNumberOfEventPerGroup(response?.data);
     // getStoreActions()?.common?.setLoading(false);
    }
    else {
    //  getStoreActions()?.common?.setLoading(false);
      return true;
    }
  }),

  getMembersCountPerResource: thunk<DashboardModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getState }) => {
    //  getStoreActions().common.setLoading(true);
    let response = await getApi(payload);
   
    if (response && response?.status !== 200) {
      toast.error(response?.message);
      getStoreActions()?.common?.setLoading(false);
    } else if (response && response?.status === 200) {
      //if(payload.payload.resource_type==="group"){
        actions.setNumberOfMemberPerGroup(response?.data);
     // }
      // if(payload.payload.resource_type==="event"){
      //   actions.setNumberOfMembersPerEvent(response?.data);
      // }
    
     // getStoreActions()?.common?.setLoading(false);
    }
    else {
    //  getStoreActions()?.common?.setLoading(false);
      return true;
    }
  }),

};

export default dashboard;