import { StoreModel } from 'react-app-model';
import { Action, action, Thunk, thunk } from "easy-peasy";
import { toast } from "react-toastify";

import { getApi, postApi } from 'react-app-api';
import { IPayload } from 'react-app-interfaces';


const initialState = {
  response: {},
  groups: {},
  isEnabledDisabled: false,
  deleteStatus:false
}
export interface EventModel {
  response: string | object | any;
  groups: string | object | any;
  isEnabledDisabled: boolean;
  deleteStatus:boolean;
  //**************State Actions************///
  flushData: Action<EventModel>;
  setEnabledDisabled: Action<EventModel, boolean>;
  setResponse: Action<EventModel, object | any>;
  setGroups: Action<EventModel, object | any>;
  reset: Action<EventModel>;
  setDeleteStatus: Action<EventModel, object | any>;
  //**************State  Actions************///

  //**************Thunk Actions************///
  getEvents: Thunk<EventModel, object>;
  enableDisable: Thunk<EventModel, object>;
  deleteEvent:Thunk<EventModel, object>;
  getGroups: Thunk<EventModel, object>;
  //**************Thunk Actions************///
}

const event: EventModel = {
  ...initialState,
  setResponse: action((state, payload) => {
    state.response = payload;
  }),

  setGroups: action((state, payload) => {
    state.groups = payload;
  }),
  flushData: action((state, payload) => {
    state.isEnabledDisabled = false;
    state.deleteStatus = false;
  }),
  setEnabledDisabled: action((state, payload) => {
    state.isEnabledDisabled = payload;
  }),
  setDeleteStatus: action((state, payload) => {
    state.deleteStatus = payload;
  }),

  reset: action(state =>state=initialState),
  
  getEvents: thunk<EventModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getState }) => {
   // getStoreActions().common.setLoading(true);
   if ((getState().response?.data ===undefined && payload?.payload?.page === 1) ||(getState().response?.data?.length >0 && payload?.payload?.page > 1)  ) {
    getStoreActions().common.setLoading(true);
  }
    let response = await getApi(payload);
    if (response && response.status !== 200) {
      toast.error(response?.message);
      getStoreActions().common.setLoading(false);
    } else if (response && response.status === 200) {
      actions.setResponse(response?.data);
      getStoreActions().common.setLoading(false);
    }
    else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),



  enableDisable: thunk<EventModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    actions.setEnabledDisabled(false);
    let response = await postApi(payload);
    if (response && response.status !== 200) {
      toast.error(response?.message);
      getStoreActions().common.setLoading(false);
    } else if (response && response.status === 200) {
      toast.success(response?.message);
      getStoreActions().common.setLoading(false);
      actions.setEnabledDisabled(true);
    }
    else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  deleteEvent: thunk<EventModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    actions.setDeleteStatus(false);
    let response = await postApi(payload);
    if (response && response.status !== 200) {
      toast.error(response?.message);
      getStoreActions().common.setLoading(false);
    } else if (response && response.status === 200) {
      toast.success(response?.message);
      getStoreActions().common.setLoading(false);
      actions.setDeleteStatus(true);
    }
    else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  getGroups: thunk<EventModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getState }) => {
   // getStoreActions().common.setLoading(true);
    if (getState().response?.data?.length  ===undefined) {
      getStoreActions().common.setLoading(true);
    }
    let response = await getApi(payload);
    if (response && response.status !== 200) {
      toast.error(response.message);
      getStoreActions().common.setLoading(false);
    } else if (response && response.status === 200) {
      actions.setGroups(response?.data);
      getStoreActions().common.setLoading(false);
    }
    else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
};

export default event;