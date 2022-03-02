import { StoreModel } from 'react-app-model';
import { Action, action, Thunk, thunk } from "easy-peasy";
import { toast } from "react-toastify";

import { getApi, postApi } from 'react-app-api';
import { IPayload } from 'react-app-interfaces';

export interface EventModel {
  response: string | object | any;
  groups: string | object | any;
  isEnabledDisabled: boolean;
  //**************State Actions************///
  flushData: Action<EventModel>;
  setEnabledDisabled: Action<EventModel, boolean>;
  setResponse: Action<EventModel, object | any>;
  setGroups: Action<EventModel, object | any>;
  //**************State  Actions************///

  //**************Thunk Actions************///
  getEvents: Thunk<EventModel, object>;
  enableDisable: Thunk<EventModel, object>;
  getGroups: Thunk<EventModel, object>;
  //**************Thunk Actions************///
}

const event: EventModel = {
  response: {},
  groups: {},
  isEnabledDisabled: false,
  setResponse: action((state, payload) => {
    state.response = payload;
  }),
  setGroups: action((state, payload) => {
    state.groups = payload;
  }),
  flushData: action((state, payload) => {
    state.isEnabledDisabled = false;
  }),
  setEnabledDisabled: action((state, payload) => {
    state.isEnabledDisabled = payload;
  }),
  getEvents: thunk<EventModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getState }) => {
    getStoreActions().common.setLoading(true);
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
  getGroups: thunk<EventModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getState }) => {
    getStoreActions().common.setLoading(true);
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