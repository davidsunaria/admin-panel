import { StoreModel } from "react-app-model";
import { Action, action, Thunk, thunk } from "easy-peasy";
import { toast } from "react-toastify";

import { getApi, postApi } from "react-app-api";
import { IPayload } from "react-app-interfaces";

const initialState = {
  reportedGroupsResponse: [],
  reportedUsersResponse: [],
  reportedEventsResponse: [],
  isEnabledDisabled: false,
  paginationObject: {
    total: 0,
    currentPage: 0,
    limit: 0,
    pages: 0,
    prevPage: 0,
    nextPage: 0,
  },
};

interface IPaginate {
  total: number;
  currentPage: number;
  limit: number;
  pages: number;
  prevPage: number | null | undefined;
  nextPage: number | null | undefined;
}

export interface ReportedModel {
  reportedGroupsResponse: string | object | any;
  reportedUsersResponse: string | object | any;
  reportedEventsResponse: string | object | any;
  isEnabledDisabled: boolean;
  paginationObject: IPaginate;
  //**************State Actions************///
  flushData: Action<ReportedModel>;
  setEnabledDisabled: Action<ReportedModel, boolean>;
  setReportedGroupResponse: Action<ReportedModel, object | any>;
  setReportedUsersResponse: Action<ReportedModel, object | any>;
  setReportedEventsResponse: Action<ReportedModel, object | any>;
  reset: Action<ReportedModel>;
  setPaginationObject: Action<ReportedModel, IPaginate>;
  //**************State  Actions************///

  //**************Thunk Actions************///
  getReportedGroups: Thunk<ReportedModel, object>;
  getReportedUsers: Thunk<ReportedModel, object>;
  enableDisable: Thunk<ReportedModel, object>;
  getReportedEvents: Thunk<ReportedModel, object>;
  //**************Thunk Actions************///
}

const reportedResource: ReportedModel = {
  ...initialState,
  setReportedGroupResponse: action((state, payload) => {
    state.reportedGroupsResponse = payload;
  }),
  setPaginationObject: action((state, payload) => {
    state.paginationObject = payload;
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
  reset: action((state) => (state = initialState)),
  getReportedGroups: thunk<ReportedModel, IPayload, any, StoreModel>(
    async (actions, payload: IPayload, { getStoreActions, getState }) => {
      if (
        (getState().reportedGroupsResponse?.data === undefined &&
          payload?.payload?.page === 1) ||
        (getState().reportedGroupsResponse?.length > 0 &&
          payload?.payload?.page > 1)
      ) {
        getStoreActions().common.setLoading(true);
      }
      let response = await getApi(payload);
      if (response && response.status !== 200) {
        toast.error(response.message);
        getStoreActions().common.setLoading(false);
      } else if (response && response.status === 200) {
        const { currentPage } = response?.data.pagination.length
          ? response?.data.pagination[0]
          : undefined;
        actions.setPaginationObject(
          response?.data.pagination.length
            ? response?.data.pagination[0]
            : undefined
        );
        if (currentPage && currentPage === 1) {
          actions.setReportedGroupResponse(response?.data?.data);
        } else {
          actions.setReportedGroupResponse([
            ...getState().reportedGroupsResponse,
            ...response?.data?.data,
          ]);
        }
        getStoreActions().common.setLoading(false);
      } else {
        getStoreActions().common.setLoading(false);
        return true;
      }
    }
  ),

  getReportedUsers: thunk<ReportedModel, IPayload, any, StoreModel>(
    async (actions, payload: IPayload, { getStoreActions, getState }) => {
      if (
        (getState().reportedUsersResponse?.data === undefined &&
          payload?.payload?.page === 1) ||
        (getState().reportedUsersResponse?.length > 0 &&
          payload?.payload?.page > 1)
      ) {
        getStoreActions().common.setLoading(true);
      }
      let response = await getApi(payload);
      if (response && response.status !== 200) {
        toast.error(response.message);
        getStoreActions().common.setLoading(false);
      } else if (response && response.status === 200) {
        const { currentPage } = response?.data.pagination.length
          ? response?.data.pagination[0]
          : undefined;
        actions.setPaginationObject(
          response?.data.pagination.length
            ? response?.data.pagination[0]
            : undefined
        );
        if (currentPage && currentPage === 1) {
          actions.setReportedUsersResponse(response?.data?.data);
        } else {
          actions.setReportedUsersResponse([
            ...getState().reportedUsersResponse,
            ...response?.data?.data,
          ]);
        }
        getStoreActions().common.setLoading(false);
      } else {
        getStoreActions().common.setLoading(false);
        return true;
      }
    }
  ),

  getReportedEvents: thunk<ReportedModel, IPayload, any, StoreModel>(
    async (actions, payload: IPayload, { getStoreActions, getState }) => {
      if (
        (getState().reportedEventsResponse?.data === undefined &&
          payload?.payload?.page === 1) ||
        (getState().reportedEventsResponse?.length > 0 &&
          payload?.payload?.page > 1)
      ) {
        getStoreActions().common.setLoading(true);
      }
      let response = await getApi(payload);
      if (response && response.status !== 200) {
        toast.error(response?.message);
        getStoreActions().common.setLoading(false);
      } else if (response && response.status === 200) {
        const { currentPage } = response?.data.pagination.length
          ? response?.data.pagination[0]
          : undefined;
        actions.setPaginationObject(
          response?.data.pagination.length
            ? response?.data.pagination[0]
            : undefined
        );
        if (currentPage && currentPage === 1) {
          actions.setReportedEventsResponse(response?.data?.data);
        } else {
          actions.setReportedEventsResponse([
            ...getState().reportedEventsResponse,
            ...response?.data?.data,
          ]);
        }
        getStoreActions().common.setLoading(false);
      } else {
        getStoreActions().common.setLoading(false);
        return true;
      }
    }
  ),

  enableDisable: thunk<ReportedModel, IPayload, any, StoreModel>(
    async (actions, payload: IPayload, { getStoreActions, getState }) => {
      getStoreActions().common.setLoading(true);
      actions.setEnabledDisabled(false);
      let response = await postApi(payload);
      if (response && response.status !== 200) {
        toast.error(response.message);
        getStoreActions().common.setLoading(false);
      } else if (response && response.status === 200) {
        switch (payload?.payload?.type) {
          case "user":
            let localUserStateData = [...getState()?.reportedUsersResponse];
            let updatedUserData = localUserStateData.map((val) =>
              val?._id === payload?.payload?._id
                ? { ...val, reported_users:{...val?.reported_users,is_blocked_by_admin: payload?.payload?.is_blocked_by_admin } }
                : val
            );
            //actions.setEnabledDisabled(true);
            actions.setReportedUsersResponse(updatedUserData);
            break;
          case "group":
            let localGroupsStateData = [...getState()?.reportedGroupsResponse];
            let updatedGroupsData = localGroupsStateData.map((val) =>
            val?._id === payload?.payload?._id
                ? {...val,reported_groups:{...val?.reported_groups,is_blocked_by_admin: payload?.payload?.is_blocked_by_admin }}
                : val
              
            );
            //actions.setEnabledDisabled(true);
            actions.setReportedGroupResponse(updatedGroupsData);
            break;
            case "event":
         
            let localEventsStateData = [...getState()?.reportedEventsResponse];
            let updatedEventsData = localEventsStateData.map((val) =>
              val?._id === payload?.payload?._id
                ? { ...val, reported_events:{...val?.reported_events,is_blocked_by_admin: payload?.payload?.is_blocked_by_admin } }
                : val
            );
            //actions.setEnabledDisabled(true);
            actions.setReportedEventsResponse(updatedEventsData);
            break;
            
        }

        //actions.flushData();
        //await actions.updateResponse(payload?.payload);
        toast.success(response.message);
        getStoreActions().common.setLoading(false);
      } else {
        getStoreActions().common.setLoading(false);
        return true;
      }
    }
  ),
};

export default reportedResource;
