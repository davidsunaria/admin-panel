import { StoreModel } from "react-app-model";
import { Action, action, Thunk, thunk } from "easy-peasy";
import { toast } from "react-toastify";

import { getApi, postApi } from "react-app-api";
import { IPayload } from "react-app-interfaces";

const initialState = {
  response: [],
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

export interface GroupModel {
  response: string | object | any;
  paginationObject: IPaginate;

  //**************State Actions************///
  reset: Action<GroupModel>;
  setResponse: Action<GroupModel, object | any>;
  //**************State  Actions************///

  //**************Thunk Actions************///
  getGroups: Thunk<GroupModel, object>;
  enableDisable: Thunk<GroupModel, object>;
  lockedUnlocked: Thunk<GroupModel, object>;
  deleteGroup: Thunk<GroupModel, object>;
  setPaginationObject: Action<GroupModel, IPaginate>;
  //**************Thunk Actions************///
}

const group: GroupModel = {
  ...initialState,
  setResponse: action((state, payload) => {
    state.response = payload;
  }),
  setPaginationObject: action((state, payload) => {
    state.paginationObject = payload;
  }),

  reset: action((state) => (state = initialState)),
  getGroups: thunk<GroupModel, IPayload, any, StoreModel>(
    async (actions, payload: IPayload, { getStoreActions, getState }) => {
      if (
        (getState().response?.data === undefined &&
          payload?.payload?.page === 1) ||
        (getState().response?.length > 0 && payload?.payload?.page > 1)
      ) {
        getStoreActions().common.setLoading(true);
      }

      let response = await getApi(payload);
      if (response && response.status !== 200) {
        toast.error(response.message);
        getStoreActions().common.setLoading(false);
      } else if (response && response.status === 200) {
        const { currentPage } =
          response?.data.pagination.length > 0 && response?.data.pagination[0];
        if (currentPage) {
          actions.setPaginationObject(
            response?.data.pagination.length > 0 && response?.data.pagination[0]
          );
        } else {
          actions.setPaginationObject({
            total: 0,
            currentPage: 0,
            limit: 0,
            pages: 0,
            prevPage: null,
            nextPage: null,
          });
        }
        if (response?.data?.data?.length !== 0) {
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

  enableDisable: thunk<GroupModel, IPayload, any, StoreModel>(
    async (actions, payload: IPayload, { getStoreActions, getState }) => {
      getStoreActions().common.setLoading(true);
      let response = await postApi(payload);
      if (response && response.status !== 200) {
        toast.error(response.message);
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

  lockedUnlocked: thunk<GroupModel, IPayload, any, StoreModel>(
    async (actions, payload: IPayload, { getStoreActions, getState }) => {
      getStoreActions().common.setLoading(true);
      let response = await postApi(payload);
      if (response && response.status !== 200) {
        toast.error(response.message);
        getStoreActions().common.setLoading(false);
      } else if (response && response.status === 200) {
        let localStateData = [...getState()?.response];
        let updatedData = localStateData.map((val) =>
          val?._id === payload?.payload?._id
            ? { ...val, restriction_mode: payload?.payload?.restriction_mode }
            : val
        );
        actions.setResponse(updatedData);
        toast.success(response.message);
        getStoreActions().common.setLoading(false);
      } else {
        getStoreActions().common.setLoading(false);
        return true;
      }
    }
  ),
  deleteGroup: thunk<GroupModel, IPayload, any, StoreModel>(
    async (actions, payload: IPayload, { getStoreActions, getState }) => {
      getStoreActions().common.setLoading(true);
      let response = await postApi(payload);
      if (response && response.status !== 200) {
        toast.error(response.message);
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
};

export default group;
