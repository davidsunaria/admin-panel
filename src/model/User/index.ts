import { StoreModel } from 'react-app-model';
import { Action, action, Thunk, thunk, debug } from "easy-peasy";
import { toast } from "react-toastify";

import { getApi, postApi } from 'react-app-api';
import { IPayload } from 'react-app-interfaces';
import NavigationService from 'src/routes/NavigationService';
import store from 'react-app-store';
import { logoutCompletely } from '../../lib/utils/Service';

const initialState = {
  response: {},
  exportedExcelData: [],
  memberShipData: {},

  isInvitationSend: false,
  isEnabledDisabled: false,
  premiumStatus:false,
  deleteStatus:false
}
export interface UserModel {
  isInvitationSend: boolean;
  isEnabledDisabled:boolean;
  premiumStatus:boolean;
  deleteStatus:boolean;
  response: string | object | any;
  exportedExcelData: string | object | any;
  memberShipData:string | object | any;
  //**************State Actions************///
  setIsInvitationSend: Action<UserModel, boolean>;
  flushData: Action<UserModel>;
  reset: Action<UserModel>;
  setEnabledDisabled: Action<UserModel, boolean>;
  setResponse: Action<UserModel, object | any>;
  setExportedExcelData: Action<UserModel, object | any>;
  setMemberShipData: Action<UserModel, object | any>;

  setPremiumStatus:Action<UserModel, boolean>;
  flushExcelData: Action<UserModel>;
  
  //**************State  Actions************///

  //**************Thunk Actions************///
  getUsers: Thunk<UserModel, object>;
  getExportedExcelData: Thunk<UserModel, object>;
  logout: Thunk<UserModel, object>;
  enableDisable: Thunk<UserModel, object>;
  inviteUser: Thunk<UserModel, object>;
  markAsPremium: Thunk<UserModel, object>;
  deleteUser:Thunk<UserModel, object>;
  //**************Thunk Actions************///
}

const user: UserModel = {

  ...initialState,
  setResponse: action((state, payload) => {
    state.response = payload;
  }),
  setExportedExcelData: action((state, payload) => {
    state.exportedExcelData = payload;
  }),
  setPremiumStatus: action((state, payload) => {
    state.premiumStatus = payload;
  }),
  setMemberShipData: action((state, payload) => {
    state.memberShipData = payload;
  }),
  
  
  setIsInvitationSend: action((state, payload) => {
    state.isInvitationSend = payload;
  }),
  flushData: action((state, payload) => {
    state.isInvitationSend = false;
    state.isEnabledDisabled = false;
    state.premiumStatus = false;
    state.exportedExcelData = [];
    state.deleteStatus = false;
  }),
  setEnabledDisabled: action((state, payload) => {
    state.isEnabledDisabled = payload;
  }),
  reset: action(state => state = initialState),
  flushExcelData: action((state, payload) => {
    state.exportedExcelData = [];
  }),
  getUsers: thunk<UserModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getState }) => {
    if ((getState().response?.data ==undefined && payload?.payload?.page == 1) ||(getState().response?.data?.length >0 && payload?.payload?.page > 1)  ) {
      getStoreActions().common.setLoading(true);
    }
   // getStoreActions().common.setLoading(true);
    let response = await getApi(payload);
    if (response && response.status !== 200) {
      toast.error(response.message);
      getStoreActions().common.setLoading(false);
    } else if (response && response.status === 200) {
      actions.setResponse(response.data);
      getStoreActions().common.setLoading(false);
    }
    else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),

  getExportedExcelData: thunk<UserModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getState }) => {
      getStoreActions().common.setLoading(true);
    
    //console.log("payload",payload)
   // getStoreActions().common.setLoading(true);
    let response = await getApi(payload);
    if (response && response.status !== 200) {
      toast.error(response.message);
      getStoreActions().common.setLoading(false);
    } else if (response && response.status === 200) {
      if(response?.data.length === 0){
        toast.error("Nothing to export");
      }
      else{
        actions.setExportedExcelData(response.data);
      }
      
      getStoreActions().common.setLoading(false);
    }
    else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  logout: thunk<UserModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getStoreState }) => {
    getStoreActions().common.setLoading(true);

    const response = await postApi(payload);
    if (response && response.status !== 200) {
      toast.error(response.message);
      getStoreActions().common.setLoading(false);
    } else if (response && response.status === 200) {
      logoutCompletely();
      getStoreActions().auth.setIsLogin(false);
      getStoreActions().common.setLoading(false);
      getStoreActions().group.reset();
      getStoreActions().event.reset();
      getStoreActions().reportedResource.reset();
      actions.reset();
      NavigationService.navigate("/login");
      setTimeout(async () => {
        await store.persist.clear();
      }, 100)
    }
    else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  enableDisable: thunk<UserModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    actions.setEnabledDisabled(false);
    let response = await postApi(payload);
    if (response && response.status !== 200) {
      toast.error(response.message);
      getStoreActions().common.setLoading(false);
    } else if (response && response.status === 200) {
      actions.setEnabledDisabled(true);
      //await actions.updateResponse(payload?.payload);
      toast.success(response.message);
      getStoreActions().common.setLoading(false);
    }
    else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  inviteUser: thunk<UserModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions }) => {
    actions.setIsInvitationSend(false);
    getStoreActions().common.setLoading(true);
    let response = await postApi(payload);
    console.log("response",response)
    if (response && response.status !== 200) {
      toast.error(response.message);
      getStoreActions().common.setLoading(false);
    } else if (response && response.status === 200) {
      toast.success(response.message);
      getStoreActions().common.setLoading(false);
      actions.setIsInvitationSend(true);
    }
    else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),

  markAsPremium: thunk<UserModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions }) => {
    actions.setPremiumStatus(false);
    getStoreActions().common.setLoading(true);
    let response = await postApi(payload);
    if (response && response.status !== 200) {
      toast.error(response.message);
      getStoreActions().common.setLoading(false);
    } else if (response && response.status === 200) {
      actions.setMemberShipData(response.data.membership);
      toast.success(response.message);
      getStoreActions().common.setLoading(false);
      actions.setPremiumStatus(true);
    }
    else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),

  deleteUser: thunk<UserModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions }) => {
   // actions.setPremiumStatus(false);
    getStoreActions().common.setLoading(true);
    console.log("payload",payload)
    let response = await postApi(payload);
    console.log("response",response)
    if (response && response.status !== 200) {
      toast.error(response.message);
      getStoreActions().common.setLoading(false);
    } else if (response && response.status === 200) {
      actions.setMemberShipData(response.data.membership);
      toast.success(response.message);
      getStoreActions().common.setLoading(false);
     // actions.setPremiumStatus(true);
    }
    else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
};

export default user;