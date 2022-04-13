import { StoreModel } from 'react-app-model';
import { Action, action, Thunk, thunk } from "easy-peasy";
import { toast } from "react-toastify";

import { getApi, postApi } from 'react-app-api';
import { IPayload } from 'react-app-interfaces';
import { compact } from 'lodash';

const initialState = {
  response: {},
  exportedGroups: {},
  isEnabledDisabled: false,
}

export interface GroupModel {
  response: string | object | any;
  exportedGroups: string | object | any;
  isEnabledDisabled: boolean;
  //**************State Actions************///
  flushData: Action<GroupModel>;
  setEnabledDisabled: Action<GroupModel, boolean>;
  reset: Action<GroupModel>;
  setResponse: Action<GroupModel, object | any>;
  setExportedGroups:Action<GroupModel, object | any>;
  //**************State  Actions************///

  //**************Thunk Actions************///
  getGroups: Thunk<GroupModel, object>;
  getExportedGroups:Thunk<GroupModel, object>;
  enableDisable: Thunk<GroupModel, object>;

  //**************Thunk Actions************///
}

const group: GroupModel = {
  ...initialState,
  setResponse: action((state, payload) => {
    state.response = payload;
  }),
  setExportedGroups: action((state, payload) => {
    state.exportedGroups = payload;
  }),
  reset: action(state =>state=initialState),
  flushData: action((state, payload) => {
    state.isEnabledDisabled = false;
  }),
  setEnabledDisabled: action((state, payload) => {
    state.isEnabledDisabled = payload;
  }),
  getGroups: thunk<GroupModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getState }) => {
    if ((getState().response?.data ==undefined && payload?.payload?.page == 1) ||(getState().response?.data?.length >0 && payload?.payload?.page > 1)  ) {
      getStoreActions().common.setLoading(true);
    }

    let response = await getApi(payload);
    if (response && response.status !== 200) {
      toast.error(response.message);
      getStoreActions().common.setLoading(false);
    } else if (response && response.status === 200) {
      // console.log("response",response)
      actions.setResponse(response.data);
      getStoreActions().common.setLoading(false);
    }
    else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),


  getExportedGroups: thunk<GroupModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getState }) => {
    if ((getState().response?.data ==undefined && payload?.payload?.page == 1) ||(getState().response?.data?.length >0 && payload?.payload?.page > 1)  ) {
      getStoreActions().common.setLoading(true);
    }
console.log("apyload",payload)
    let response = await getApi(payload);
    if (response && response.status !== 200) {
      toast.error(response.message);
      getStoreActions().common.setLoading(false);
    } else if (response && response.status === 200) {
      // console.log("response",response)
      actions.setExportedGroups(response.data);
      getStoreActions().common.setLoading(false);
    }
    else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),




  enableDisable: thunk<GroupModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    actions.setEnabledDisabled(false);
    let response = await postApi(payload);
    if (response && response.status !== 200) {
      toast.error(response.message);
      getStoreActions().common.setLoading(false);
    } else if (response && response.status === 200) {
      toast.success(response.message);
      getStoreActions().common.setLoading(false);
      actions.setEnabledDisabled(true);
    }
    else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
};

export default group;