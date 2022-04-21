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
 exportedUsers:[],
  isInvitationSend: false,
  isEnabledDisabled: false,
  premiumStatus:false
}
export interface UserModel {
  isInvitationSend: boolean;
  isEnabledDisabled:boolean;
  premiumStatus:boolean;
  response: string | object | any;
  exportedUsers: string | object | any;
  //**************State Actions************///
  setIsInvitationSend: Action<UserModel, boolean>;
  flushData: Action<UserModel>;
  reset: Action<UserModel>;
  setEnabledDisabled: Action<UserModel, boolean>;
  setResponse: Action<UserModel, object | any>;
  setExportedUsers: Action<UserModel, object | any>;
  setPremiumStatus:Action<UserModel, boolean>;
  //**************State  Actions************///

  //**************Thunk Actions************///
  getUsers: Thunk<UserModel, object>;
  getExportedUsers: Thunk<UserModel, object>;
  logout: Thunk<UserModel, object>;
  enableDisable: Thunk<UserModel, object>;
  inviteUser: Thunk<UserModel, object>;
  markAsPremium: Thunk<UserModel, object>;
  //**************Thunk Actions************///
}

const user: UserModel = {

  ...initialState,
  setResponse: action((state, payload) => {
    state.response = payload;
  }),
  setExportedUsers: action((state, payload) => {
    state.exportedUsers = payload;
  }),
  setPremiumStatus: action((state, payload) => {
    state.premiumStatus = payload;
  }),
  setIsInvitationSend: action((state, payload) => {
    state.isInvitationSend = payload;
  }),
  flushData: action((state, payload) => {
    state.isInvitationSend = false;
    state.isEnabledDisabled = false;
    state.premiumStatus = false;
  }),
  setEnabledDisabled: action((state, payload) => {
    state.isEnabledDisabled = payload;
  }),
  reset: action(state =>state=initialState),
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

  getExportedUsers: thunk<UserModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getState }) => {
    if ((getState().response?.data ==undefined && payload?.payload?.page == 1) ||(getState().response?.data?.length >0 && payload?.payload?.page > 1)  ) {
      getStoreActions().common.setLoading(true);
    }
    console.log("payload",payload)
   // getStoreActions().common.setLoading(true);
    let response = await getApi(payload);
    if (response && response.status !== 200) {
      toast.error(response.message);
      getStoreActions().common.setLoading(false);
    } else if (response && response.status === 200) {
      actions.setExportedUsers(response.data);
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
    console.log("response",response)
    if (response && response.status !== 200) {
      toast.error(response.message);
      getStoreActions().common.setLoading(false);
    } else if (response && response.status === 200) {
      toast.success(response.message);
      getStoreActions().common.setLoading(false);
      actions.setPremiumStatus(true);
    }
    else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
};

export default user;