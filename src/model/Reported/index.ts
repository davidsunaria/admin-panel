import { StoreModel } from 'react-app-model';
import { Action, action, Thunk, thunk } from "easy-peasy";
import { toast } from "react-toastify";

import { getApi, postApi } from 'react-app-api';
import { IPayload } from 'react-app-interfaces';


const initialState = {
  reportedGroupsResponse: {},
  reportedUsersResponse: {},
  reportedEventsResponse:{},
  isEnabledDisabled: false,
}

export interface ReportedModel {
  reportedGroupsResponse: string | object | any;
  reportedUsersResponse: string | object | any;
  reportedEventsResponse: string | object | any;
  isEnabledDisabled: boolean;
  //**************State Actions************///
  flushData: Action<ReportedModel>;
  setEnabledDisabled: Action<ReportedModel, boolean>;
  setReportedGroupResponse: Action<ReportedModel, object | any>;
  setReportedUsersResponse:Action<ReportedModel, object | any>;
  setReportedEventsResponse:Action<ReportedModel, object | any>;
  reset: Action<ReportedModel>;
  //**************State  Actions************///

  //**************Thunk Actions************///
  getReportedGroups: Thunk<ReportedModel, object>;
  getReportedUsers:Thunk<ReportedModel, object>;
  enableDisable: Thunk<ReportedModel, object>;
  getReportedEvents:Thunk<ReportedModel, object>;
  //**************Thunk Actions************///
}

const reportedResource: ReportedModel = {
  ...initialState,
  setReportedGroupResponse: action((state, payload) => {
    state.reportedGroupsResponse = payload;
  }),
  setReportedUsersResponse: action((state, payload) => {
    state.reportedUsersResponse = payload;
  }),
  setReportedEventsResponse: action((state, payload) => {
    state.reportedEventsResponse = payload;
  }),
  flushData: action((state, payload) => {
    state.isEnabledDisabled = false;
  }),
  setEnabledDisabled: action((state, payload) => {
    state.isEnabledDisabled = payload;
  }),
  reset: action(state =>state=initialState),
  getReportedGroups: thunk<ReportedModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getState }) => {
    if ((getState().reportedGroupsResponse?.data ===undefined && payload?.payload?.page === 1) ||(getState().reportedGroupsResponse?.data?.length >0 && payload?.payload?.page > 1)  ) {
      getStoreActions().common.setLoading(true);
    }
    let response = await getApi(payload);
    if (response && response.status !== 200) {
      toast.error(response.message);
      getStoreActions().common.setLoading(false);
    } else if (response && response.status === 200) {
      actions.setReportedGroupResponse(response.data);
      getStoreActions().common.setLoading(false);
    }
    else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),

  getReportedUsers: thunk<ReportedModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getState }) => {
    if ((getState().reportedUsersResponse?.data ===undefined && payload?.payload?.page === 1) ||(getState().reportedUsersResponse?.data?.length >0 && payload?.payload?.page > 1)  ) {
      getStoreActions().common.setLoading(true);
    }
    let response = await getApi(payload);
    if (response && response.status !== 200) {
      toast.error(response.message);
      getStoreActions().common.setLoading(false);
    } else if (response && response.status === 200) {
      actions.setReportedUsersResponse(response.data);
      getStoreActions().common.setLoading(false);
    }
    else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),

  getReportedEvents: thunk<ReportedModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions, getState }) => {
    if ((getState().reportedEventsResponse?.data ===undefined && payload?.payload?.page === 1) ||(getState().reportedEventsResponse?.data?.length >0 && payload?.payload?.page > 1)  ) {
      getStoreActions().common.setLoading(true);
    }
    let response = await getApi(payload);
    if (response && response.status !== 200) {
      toast.error(response?.message);
      getStoreActions().common.setLoading(false);
    } else if (response && response.status === 200) {
      actions.setReportedEventsResponse(response?.data);
      getStoreActions().common.setLoading(false);
    }
    else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),


  enableDisable: thunk<ReportedModel, IPayload, any, StoreModel>(async (actions, payload: IPayload, { getStoreActions }) => {
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

export default reportedResource;