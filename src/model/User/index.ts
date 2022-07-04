import { StoreModel } from "react-app-model";
import { Action, action, Thunk, thunk } from "easy-peasy";
import { toast } from "react-toastify";
import { getApi, postApi } from "react-app-api";
import { IPayload } from "react-app-interfaces";
import NavigationService from "src/routes/NavigationService";
import store from "react-app-store";
import { logoutCompletely } from "../../lib/utils/Service";

const initialState = {
  response: [],
  isPremium: "",
  userId: "",
  exportedExcelData: [],
  isInvitationSend: false,
  deleteStatus: false,
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
export interface UserModel {
  isInvitationSend: boolean;
  deleteStatus: boolean;
  isPremium: string | number | any;
  userId: string | number;
  paginationObject: IPaginate;
  response: string | object | any;
  exportedExcelData: string | object | any;
  //**************State Actions************///
  setIsInvitationSend: Action<UserModel, boolean>;
  flushData: Action<UserModel>;
  reset: Action<UserModel>;
  setResponse: Action<UserModel, object | any>;
  setUserId: Action<UserModel, object | any>;
  setExportedExcelData: Action<UserModel, object | any>;
  setPremium: Action<UserModel, object | any>;
  setDeleteStatus: Action<UserModel, boolean>;
  flushExcelData: Action<UserModel>;
  setPaginationObject: Action<UserModel, IPaginate>;
  //**************State  Actions************///

  //**************Thunk Actions************///
  getUsers: Thunk<UserModel, object>;
  getExportedExcelData: Thunk<UserModel, object>;
  logout: Thunk<UserModel, object>;
  enableDisable: Thunk<UserModel, object>;
  inviteUser: Thunk<UserModel, object>;
  markAsPremium: Thunk<UserModel, object>;
  deleteUser: Thunk<UserModel, object>;
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
  
  setPremium: action((state, payload) => {
    state.isPremium = payload;
  }),
  setUserId: action((state, payload) => {
    state.userId = payload;
  }),
  setDeleteStatus: action((state, payload) => {
    state.deleteStatus = payload;
  }),
 
  setIsInvitationSend: action((state, payload) => {
    state.isInvitationSend = payload;
  }),

  flushData: action((state, payload) => {
    state.isInvitationSend = false;
    state.exportedExcelData = [];
    state.deleteStatus = false;
  }),
 
  reset: action((state) => (state = initialState)),
  flushExcelData: action((state, payload) => {
    state.exportedExcelData = [];
  }),
  setPaginationObject: action((state, payload) => {
    state.paginationObject = payload;
  }),
  getUsers: thunk<UserModel, IPayload, any, StoreModel>(
    async (actions, payload: IPayload, { getStoreActions, getState }) => {
      if (
        (getState().response?.data === undefined &&
          payload?.payload?.page === 1) ||
        (getState().response?.length > 0 && payload?.payload?.page > 1)
      ) {
        getStoreActions().common.setLoading(true);
      }
      // getStoreActions().common.setLoading(true);
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
          actions.setResponse(response?.data?.data);
        } else {
          actions.setResponse([
            ...getState().response,
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

  getExportedExcelData: thunk<UserModel, IPayload, any, StoreModel>(
    async (actions, payload: IPayload, { getStoreActions, getState }) => {
      getStoreActions().common.setLoading(true);
      let response = await getApi(payload);
      if (response && response.status !== 200) {
        toast.error(response.message);
        getStoreActions().common.setLoading(false);
      } else if (response && response.status === 200) {
        if (response?.data.length === 0) {
          toast.error("Nothing to export");
        } else {
          actions.setExportedExcelData(response.data);
        }
        getStoreActions().common.setLoading(false);
      } else {
        getStoreActions().common.setLoading(false);
        return true;
      }
    }
  ),
  logout: thunk<UserModel, IPayload, any, StoreModel>(
    async (actions, payload: IPayload, { getStoreActions, getStoreState }) => {
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
        getStoreActions().dashboard.reset();
        getStoreActions().reportedResource.reset();
        actions.reset();
        NavigationService.navigate("/login");
        setTimeout(async () => {
          await store.persist.clear();
        }, 100);
      } else {
        getStoreActions().common.setLoading(false);
        return true;
      }
    }
  ),
  enableDisable: thunk<UserModel, IPayload, any, StoreModel>(
    async (actions, payload: IPayload, { getStoreActions, getState }) => {
      getStoreActions().common.setLoading(true);
      let response = await postApi(payload);
      if (response && response?.status !== 200) {
        toast.error(response.message);
        getStoreActions().common.setLoading(false);
      } else if (response && response?.status === 200) {
        let localStateData = [...getState()?.response];
        let updatedData = localStateData.map((val) =>
          val?._id === payload?.payload?._id
            ? { ...val, active: payload?.payload?.status }
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
  inviteUser: thunk<UserModel, IPayload, any, StoreModel>(
    async (actions, payload: IPayload, { getStoreActions }) => {
      actions.setIsInvitationSend(false);
      getStoreActions().common.setLoading(true);
      let response = await postApi(payload);
      console.log("response", response);
      if (response && response.status !== 200) {
        toast.error(response.message);
        getStoreActions().common.setLoading(false);
      } else if (response && response.status === 200) {
        toast.success(response.message);
        getStoreActions().common.setLoading(false);
        actions.setIsInvitationSend(true);
      } else {
        getStoreActions().common.setLoading(false);
        return true;
      }
    }
  ),

  markAsPremium: thunk<UserModel, IPayload, any, StoreModel>(
    async (actions, payload: IPayload, { getStoreActions, getState }) => {
      getStoreActions().common.setLoading(true);
      let response = await postApi(payload);
      if (response && response.status !== 200) {
        toast.error(response.message);
        getStoreActions().common.setLoading(false);
      } else if (response && response.status === 200) {
        // actions.setMemberShipData(response.data.membership);
        let localStateData = [...getState()?.response];
        let updatedData = localStateData.map((val) =>
          val?._id === getState()?.userId
            ? {
                ...val,
                is_premium: payload?.payload?.is_premium,
                membership: response?.data?.membership,
              }
            : val
        );
        actions.setResponse(updatedData);
        actions.setPremium(0);
        toast.success(response.message);
        getStoreActions().common.setLoading(false);
      } else {
        getStoreActions().common.setLoading(false);
        return true;
      }
    }
  ),

  deleteUser: thunk<UserModel, IPayload, any, StoreModel>(
    async (actions, payload: IPayload, { getStoreActions, getState }) => {
      // actions.setDeleteStatus(false);
      getStoreActions().common.setLoading(true);
      let response = await postApi(payload);
      if (response && response.status !== 200) {
        toast.error(response.message);
        getStoreActions().common.setLoading(false);
      } else if (response && response.status === 200) {
        const localStateData = [...getState()?.response];
        const index = localStateData.findIndex(
          (item) => item._id === payload?.payload?.user_id
        );
        localStateData.splice(index, 1);
        actions.setResponse(localStateData);
        toast.success(response.message);
        getStoreActions().common.setLoading(false);
        // actions.setDeleteStatus(true);
      } else {
        getStoreActions().common.setLoading(false);
        return true;
      }
    }
  ),
};

export default user;
