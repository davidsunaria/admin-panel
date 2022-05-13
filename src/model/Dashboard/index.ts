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
  numberOfMemberPerEvent:{},
  isSubscriberLoading:false,
  isMembersPerResourceLoading: false,
  isEventPerGroupLoading: false,
  isPostPerMemberLoading:false,
  isPaypalVsCashLoading:false,
  postPerMember:{},
  paypalVsCash:{},
  groupEventByLocation:{},
}
export interface DashboardModel {
  subscribersCount: string | number;
  membersCount: string | number;
  numberOfEventPerGroup: object | any;
  numberOfMemberPerGroup: object | any;
  numberOfMemberPerEvent: object | any;
  postPerMember: object | any;
  isMembersPerResourceLoading: boolean,
  isEventPerGroupLoading:boolean,
  isSubscriberLoading:boolean,
  isPostPerMemberLoading:boolean,
  paypalVsCash:object | any;
  groupEventByLocation:object | any;
  isPaypalVsCashLoading:boolean,
  //**************State Actions************///
 
  setSubscribersCount:Action<DashboardModel, object | any>;
  setMembersCount:Action<DashboardModel, object | any>;
  setNumberOfEventPerGroup:Action<DashboardModel, object | any>;
  reset: Action<DashboardModel>;
  setNumberOfMemberPerGroup:Action<DashboardModel>;
  flushData :Action<DashboardModel>;
  setNumberOfMembersPerEvent:Action<DashboardModel>;
  setPostPerMember:Action<DashboardModel>;
  setMembersPerResourceLoading: Action<DashboardModel, object | any>,
  setEventPerGroupLoading:Action<DashboardModel, object | any>,
  setSubscriberLoading:Action<DashboardModel, object | any>,
  setPostPerMemberLoading:Action<DashboardModel, object | any>,
  setPaypalVsCash:Action<DashboardModel, object | any>,
  setPaypalVsCashLoading:Action<DashboardModel, object | any>,
  setGroupEventByLocation:Action<DashboardModel, object | any>,
  //**************State  Actions************///

  //**************Thunk Actions************///
  getSubscribersCount:Thunk<DashboardModel, object>;
  getMembersCount:Thunk<DashboardModel, object>;
  getEventCountPerGroup:Thunk<DashboardModel, object>;
  getMembersCountPerResource:Thunk<DashboardModel, object>;
  getPostPerMember:Thunk<DashboardModel, object>;
  getPaypalVsCash:Thunk<DashboardModel, object>;
  getGroupEventByLocation:Thunk<DashboardModel, object>;
 
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

  setMembersPerResourceLoading: action((state, payload) => {
    state.isMembersPerResourceLoading = payload;
  }),

  setEventPerGroupLoading: action((state, payload) => {
    state.isEventPerGroupLoading = payload;
  }),

  setSubscriberLoading: action((state, payload) => {
    state.isSubscriberLoading = payload;
  }),

  setPostPerMember: action((state, payload) => {
    state.postPerMember = payload;
  }),

  setPostPerMemberLoading: action((state, payload) => {
    state.isPostPerMemberLoading = payload;
  }),

  setPaypalVsCash: action((state, payload) => {
    state.paypalVsCash = payload;
  }),

  setGroupEventByLocation: action((state, payload) => {
    state.groupEventByLocation = payload;
  }),

  setPaypalVsCashLoading: action((state, payload) => {
    state.isPaypalVsCashLoading = payload;
  }),



  flushData: action((state, payload) => {
    state.numberOfMemberPerGroup = {};
  }),
 
  
  

  reset: action(state => state = initialState),
  
  getSubscribersCount: thunk<DashboardModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getState }) => {
    if ((getState()?.subscribersCount ===undefined)) {
      actions.setSubscriberLoading(true);
    }
    
    let response = await getApi(payload);
    if (response && response?.status !== 200) {
      toast.error(response?.message);
     // actions.setSubscriberLoading(false)
    } else if (response && response?.status === 200) {
      actions.setSubscribersCount(response?.data?.total_subscribers);
     actions.setSubscriberLoading(false)
    }
    else {
      actions.setSubscriberLoading(false)
      return true;
    }
  }),

  getMembersCount: thunk<DashboardModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getState }) => {
    let response = await getApi(payload);
    if (response && response?.status !== 200) {
      toast.error(response?.message);
    } else if (response && response?.status === 200) {
      actions.setMembersCount(response?.data?.total_members);
    }
    else {
     // actions.setLoadingAction(false)
      return true;
    }
  }),

  getEventCountPerGroup: thunk<DashboardModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getState }) => {
    if ((getState().numberOfEventPerGroup?.data ===undefined && payload?.payload?.page === 1) ||(getState().numberOfEventPerGroup?.data?.length >0 && payload?.payload?.page > 1)  ) {
      actions.setEventPerGroupLoading(true);
    }
    let response = await getApi(payload);
    if (response && response?.status !== 200) {
      toast.error(response?.message);
      actions.setEventPerGroupLoading(false)
    } else if (response && response?.status === 200) {
      actions.setNumberOfEventPerGroup(response?.data);
      actions.setEventPerGroupLoading(false)
    }
    else {
      actions.setEventPerGroupLoading(false)
      return true;
    }
  }),

  getMembersCountPerResource: thunk<DashboardModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getState }) => {
    if ((getState().numberOfMemberPerGroup?.data ===undefined && payload?.payload?.page === 1) ||(getState().numberOfMemberPerGroup?.data?.length >0 && payload?.payload?.page > 1) 
   || (getState().numberOfMemberPerEvent?.data ===undefined && payload?.payload?.page === 1) ||(getState().numberOfMemberPerEvent?.data?.length >0 && payload?.payload?.page > 1)
    ) {
      actions.setMembersPerResourceLoading(true);
    }
    
   // console.log("payload",payload.payload.resource_type)
    let response = await getApi(payload);
   
    if (response && response?.status !== 200) {
      toast.error(response?.message);
      actions.setMembersPerResourceLoading(false)
    } else if (response && response?.status === 200) {
      if(payload.payload.resource_type==="group"){
        actions.setNumberOfMemberPerGroup(response?.data);
      }
      if(payload.payload.resource_type==="event"){
        actions.setNumberOfMembersPerEvent(response?.data);
      }
     
      actions.setMembersPerResourceLoading(false)
    }
    else {
      actions.setMembersPerResourceLoading(false)
      return true;
    }
  }),

  getPostPerMember: thunk<DashboardModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getState }) => {
    if ((getState().postPerMember?.data ===undefined && payload?.payload?.page === 1) ||(getState().postPerMember?.data?.length >0 && payload?.payload?.page > 1)  ) {
      actions.setPostPerMemberLoading(true);
    }
    let response = await getApi(payload);
    if (response && response?.status !== 200) {
      toast.error(response?.message);
     actions.setPostPerMemberLoading(false)
    } else if (response && response?.status === 200) {
      actions.setPostPerMember(response?.data);
     actions.setPostPerMemberLoading(false)
    }
    else {
     actions.setPostPerMemberLoading(false)
      return true;
    }
  }),

  getPaypalVsCash: thunk<DashboardModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getState }) => {
    if ((getState().paypalVsCash?.data ===undefined && payload?.payload?.page === 1) ||(getState().paypalVsCash?.data?.length >0 && payload?.payload?.page > 1)  ) {
      actions.setPaypalVsCashLoading(true)
    }
     let response = await getApi(payload);
     if (response && response?.status !== 200) {
       toast.error(response?.message);
      actions.setPaypalVsCashLoading(false)
     } else if (response && response?.status === 200) {
       actions.setPaypalVsCash(response?.data);
      actions.setPaypalVsCashLoading(false)
     }
     else {
      actions.setPaypalVsCashLoading(false)
       return true;
     }
   }),

   getGroupEventByLocation: thunk<DashboardModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getState }) => {
    // if ((getState().paypalVsCash?.data ===undefined && payload?.payload?.page === 1) ||(getState().paypalVsCash?.data?.length >0 && payload?.payload?.page > 1)  ) {
    //   actions.setPaypalVsCashLoading(true)
    // }
     let response = await getApi(payload);
     if (response && response?.status !== 200) {
       toast.error(response?.message);
     // actions.setPaypalVsCashLoading(false)
     } else if (response && response?.status === 200) {
       actions.setGroupEventByLocation(response?.data);
      //actions.setPaypalVsCashLoading(false)
     }
     else {
     // actions.setPaypalVsCashLoading(false)
       return true;
     }
   }),

};

export default dashboard;