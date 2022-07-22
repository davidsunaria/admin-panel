import { StoreModel } from "react-app-model";
import { Action, action, Thunk, thunk } from "easy-peasy";
import { toast } from "react-toastify";

import { getApi, postApi } from "react-app-api";
import { IPayload } from "react-app-interfaces";

const paginationObject = {
  total: 0,
  currentPage: 0,
  limit: 0,
  pages: 0,
  prevPage: 0,
  nextPage: 0,
};

const initialState = {
  response: [],
  groups: [],
  paginationObject: paginationObject,
};

interface IPaginate {
  total: number;
  currentPage: number;
  limit: number;
  pages: number;
  prevPage: number | null | undefined;
  nextPage: number | null | undefined;
}
export interface EventModel {
  response: string | object | any;
  paginationObject: IPaginate;
  groups: string | object | any;
  //**************State Actions************///
  setResponse: Action<EventModel, object | any>;
  setGroups: Action<EventModel, object | any>;
  reset: Action<EventModel>;
  setPaginationObject: Action<EventModel, IPaginate>;
  //**************State  Actions************///

  //**************Thunk Actions************///
  getEvents: Thunk<EventModel, object>;
  enableDisable: Thunk<EventModel, object>;
  deleteEvent: Thunk<EventModel, object>;
  getGroups: Thunk<EventModel, object>;
  //**************Thunk Actions************///
}

const event: EventModel = {
  ...initialState,
  setResponse: action((state, payload) => {
    state.response = payload;
  }),
  setPaginationObject: action((state, payload) => {
    state.paginationObject = payload;
  }),
  setGroups: action((state, payload) => {
    state.groups = payload;
  }),

  reset: action((state) => (state = initialState)),

  getEvents: thunk<EventModel, IPayload, any, StoreModel>(
    async (actions, payload: IPayload, { getStoreActions, getState }) => {
      // getStoreActions().common.setLoading(true);
      if (
        (getState().response?.data === undefined &&
          payload?.payload?.page === 1) ||
        (getState().response?.length > 0 && payload?.payload?.page > 1)
      ) {
        getStoreActions().common.setLoading(true);
      }
      let response = await getApi(payload);
      if (response && response.status !== 200) {
        toast.error(response?.message);
        getStoreActions().common.setLoading(false);
      } else if (response && response.status === 200) {
        const { currentPage } =
          response?.data.pagination.length > 0 && response?.data.pagination[0];
        if (currentPage) {
          actions.setPaginationObject(
            response?.data.pagination.length > 0 && response?.data.pagination[0]
          );
        } else {
          actions.setPaginationObject(paginationObject);
        }
        if (response?.data?.data?.length > 0) {
          if (currentPage && currentPage === 1) {
            actions.setResponse(response?.data?.data);
          } else {
            actions.setResponse([
              ...getState().response,
              ...response?.data?.data,
            ]);
          }
        } else {
          actions.setResponse([]);
        }

        getStoreActions().common.setLoading(false);
      } else {
        getStoreActions().common.setLoading(false);
        return true;
      }
    }
  ),

  enableDisable: thunk<EventModel, IPayload, any, StoreModel>(
    async (actions, payload: IPayload, { getStoreActions, getState }) => {
      getStoreActions().common.setLoading(true);
      let response = await postApi(payload);
      if (response && response.status !== 200) {
        toast.error(response?.message);
        getStoreActions().common.setLoading(false);
      } else if (response && response.status === 200) {
        let localStateData = [...getState()?.response];
        let updatedData = localStateData.map((val) =>
          val?._id === payload?.payload?._id
            ? { ...val, status: payload?.payload?.status }
            : val
        );
        actions.setResponse(updatedData);
        //await actions.updateResponse(payload?.payload);
        toast.success(response.message);
        getStoreActions().common.setLoading(false);
      } else {
        getStoreActions().common.setLoading(false);
        return true;
      }
    }
  ),
  deleteEvent: thunk<EventModel, IPayload, any, StoreModel>(
    async (actions, payload: IPayload, { getStoreActions, getState }) => {
      getStoreActions().common.setLoading(true);
      let response = await postApi(payload);
      if (response && response.status !== 200) {
        toast.error(response?.message);
        getStoreActions().common.setLoading(false);
      } else if (response && response.status === 200) {
        const localStateData = [...getState()?.response];
        const index = localStateData.findIndex(
          (item) => item._id === payload?.payload?._id
        );
        localStateData.splice(index, 1);
        actions.setResponse(localStateData);
        toast.success(response.message);
        getStoreActions().common.setLoading(false);
      } else {
        getStoreActions().common.setLoading(false);
        return true;
      }
    }
  ),
  getGroups: thunk<EventModel, IPayload, any, StoreModel>(
    async (actions, payload: IPayload, { getStoreActions, getState }) => {
      // getStoreActions().common.setLoading(true);
      if (getState().response?.data?.length === undefined) {
        getStoreActions().common.setLoading(true);
      }
      let response = await getApi(payload);
      if (response && response.status !== 200) {
        toast.error(response.message);
        getStoreActions().common.setLoading(false);
      } else if (response && response.status === 200) {
        console.log("groups",response?.data)
        actions.setGroups(response?.data);
        getStoreActions().common.setLoading(false);
      } else {
        getStoreActions().common.setLoading(false);
        return true;
      }
    }
  ),
};

export default event;
