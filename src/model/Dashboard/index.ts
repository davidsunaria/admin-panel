import { StoreModel } from "react-app-model";
import { Action, action, Thunk, thunk } from "easy-peasy";
import { toast } from "react-toastify";

import { getApi } from "react-app-api";
import { IPayload } from "react-app-interfaces";
import * as _ from "lodash";

const initialState = {
  subscribersCount: 0,
  membersCount: 0,
  numberOfEventsPerGroup: { pagination: [], data: [] },
  numberOfMembersPerGroup: { pagination: [], data: [] },
  numberOfMembersPerEvent: {
    pagination: [],
    data: [],
  },
  isSubscriberLoading: false,
  isMembersPerResourceLoading: false,
  isEventPerGroupLoading: false,
  isPostPerMemberLoading: false,
  isPaypalVsCashLoading: false,
  postPerMember: { pagination: [], data: [] },
  paypalVsCash: {},
  groupEventByLocation: {},
  isGroupEventByLocationLoading: false,
  paypalCash: {
    payPalAmount: 0,
    cashAmount: 0,
  },
  totalSum: 0,
};

interface IPaginate {
  total: number;
  currentPage: number;
  limit: number;
  pages: number;
  prevPage: number | null | undefined;
  nextPage: number | null | undefined;
}

interface IPaypalCash {
  payPalAmount: number;
  cashAmount: number;
}
interface IResponse {
  pagination: [IPaginate];
  data: any[];
}
export interface DashboardModel {
  subscribersCount: string | number;
  membersCount: string | number;
  numberOfEventsPerGroup: IResponse | any;
  numberOfMembersPerGroup: IResponse | any;
  numberOfMembersPerEvent: any;
  postPerMember: IResponse | any;
  isMembersPerResourceLoading: boolean;
  isEventPerGroupLoading: boolean;
  isSubscriberLoading: boolean;
  isPostPerMemberLoading: boolean;
  paypalVsCash: object | any;
  groupEventByLocation: object | any;
  isPaypalVsCashLoading: boolean;
  isGroupEventByLocationLoading: object | any;
  paypalCash: IPaypalCash;
  totalSum: number;
  //**************State Actions************///

  setSubscribersCount: Action<DashboardModel, object | any>;
  setMembersCount: Action<DashboardModel, object | any>;
  setNumberOfEventPerGroup: Action<DashboardModel, IResponse>;
  reset: Action<DashboardModel>;
  setNumberOfMemberPerGroup: Action<DashboardModel, IResponse>;
  flushData: Action<DashboardModel>;
  setNumberOfMembersPerEvent: Action<DashboardModel, IResponse>;
  setPostPerMember: Action<DashboardModel, IResponse>;
  setMembersPerResourceLoading: Action<DashboardModel, object | any>;
  setEventPerGroupLoading: Action<DashboardModel, object | any>;
  setSubscriberLoading: Action<DashboardModel, object | any>;
  setPostPerMemberLoading: Action<DashboardModel, object | any>;
  setPaypalVsCash: Action<DashboardModel, object | any>;
  setPaypalVsCashLoading: Action<DashboardModel, object | any>;
  setGroupEventByLocation: Action<DashboardModel, object | any>;
  setGroupEventByLocationLoading: Action<DashboardModel, object | any>;
  setPayPalCashAmount: Action<DashboardModel, object | any>;
  setTotalSum: Action<DashboardModel, object | any>;
  // setPaginationObject: Action<DashboardModel, IPaginate>;
  //**************State  Actions************///

  //**************Thunk Actions************///
  getSubscribersCount: Thunk<DashboardModel, object>;
  getMembersCount: Thunk<DashboardModel, object>;
  getEventCountPerGroup: Thunk<DashboardModel, object>;
  getMembersCountPerResource: Thunk<DashboardModel, object>;
  getPostPerMember: Thunk<DashboardModel, object>;
  getPaypalVsCash: Thunk<DashboardModel, object>;
  getGroupEventByLocation: Thunk<DashboardModel, object>;

  //**************Thunk Actions************///
}

const dashboard: DashboardModel = {
  ...initialState,

  setSubscribersCount: action((state, payload) => {
    state.subscribersCount = payload;
  }),
  setMembersCount: action((state, payload) => {
    state.membersCount = payload;
  }),
  setPayPalCashAmount: action((state, payload) => {
    state.paypalCash = payload;
  }),
  setTotalSum: action((state, payload) => {
    state.totalSum = payload;
  }),

  setNumberOfEventPerGroup: action((state, payload) => {
    state.numberOfEventsPerGroup = payload;
  }),

  setNumberOfMemberPerGroup: action((state, payload) => {
    state.numberOfMembersPerGroup = payload;
  }),

  setNumberOfMembersPerEvent: action((state, payload) => {
    state.numberOfMembersPerEvent = payload;
  }),

  setMembersPerResourceLoading: action((state, payload) => {
    state.isMembersPerResourceLoading = payload;
  }),

  setEventPerGroupLoading: action((state, payload) => {
    state.isEventPerGroupLoading = payload;
  }),

  setSubscriberLoading: action((state, payload) => {
    state.isSubscriberLoading = payload;
  }),

  setPostPerMember: action((state, payload) => {
    state.postPerMember = payload;
  }),

  setPostPerMemberLoading: action((state, payload) => {
    state.isPostPerMemberLoading = payload;
  }),

  setPaypalVsCash: action((state, payload) => {
    state.paypalVsCash = payload;
  }),

  setGroupEventByLocation: action((state, payload) => {
    state.groupEventByLocation = payload;
  }),

  setPaypalVsCashLoading: action((state, payload) => {
    state.isPaypalVsCashLoading = payload;
  }),

  setGroupEventByLocationLoading: action((state, payload) => {
    state.isGroupEventByLocationLoading = payload;
  }),

  flushData: action((state, payload) => {
    state.numberOfMembersPerGroup = {};
  }),

  reset: action((state) => (state = initialState)),

  getSubscribersCount: thunk<DashboardModel, IPayload, any, StoreModel>(
    async (actions, payload: IPayload, { getStoreActions, getState }) => {
      if (getState()?.subscribersCount === undefined) {
        actions.setSubscriberLoading(true);
      }

      let response = await getApi(payload);
      if (response && response?.status !== 200) {
        toast.error(response?.message);
        // actions.setSubscriberLoading(false)
      } else if (response && response?.status === 200) {
        actions.setSubscribersCount(response?.data?.total_subscribers);
        actions.setSubscriberLoading(false);
      } else {
        actions.setSubscriberLoading(false);
        return true;
      }
    }
  ),

  getMembersCount: thunk<DashboardModel, IPayload, any, StoreModel>(
    async (actions, payload: IPayload, { getStoreActions, getState }) => {
      let response = await getApi(payload);
      if (response && response?.status !== 200) {
        toast.error(response?.message);
      } else if (response && response?.status === 200) {
        actions.setMembersCount(response?.data?.total_members);
      } else {
        // actions.setLoadingAction(false)
        return true;
      }
    }
  ),

  getEventCountPerGroup: thunk<DashboardModel, IPayload, any, StoreModel>(
    async (actions, payload: IPayload, { getStoreActions, getState }) => {
      if (
        (getState().numberOfEventsPerGroup?.data === undefined &&
          payload?.payload?.page === 1) ||
        (getState().numberOfEventsPerGroup?.data?.length > 0 &&
          payload?.payload?.page > 1)
      ) {
        actions.setEventPerGroupLoading(true);
      }
      let response = await getApi(payload);
      if (response && response?.status !== 200) {
        toast.error(response?.message);
        actions.setEventPerGroupLoading(false);
      } else if (response && response?.status === 200) {
        const { currentPage } =
          response?.data.pagination.length > 0 && response?.data.pagination[0];
        if (response?.data?.data?.length !== 0) {
          if (currentPage && currentPage === 1) {
            actions.setNumberOfEventPerGroup(response?.data);
          } else {
            actions.setNumberOfEventPerGroup({
              pagination: response?.data?.pagination,
              data: [
                ...getState().numberOfEventsPerGroup?.data,
                ...response?.data?.data,
              ],
            });
          }
        } else {
          actions.setNumberOfEventPerGroup({
            pagination: [
              {
                total: 0,
                currentPage: 0,
                limit: 0,
                pages: 0,
                prevPage: null,
                nextPage: null,
              },
            ],
            data: [],
          });
        }

        //actions.setNumberOfEventPerGroup(response?.data);
        actions.setEventPerGroupLoading(false);
      } else {
        actions.setEventPerGroupLoading(false);
        return true;
      }
    }
  ),

  getMembersCountPerResource: thunk<DashboardModel, IPayload, any, StoreModel>(
    async (actions, payload: IPayload, { getStoreActions, getState }) => {
      if (
        (getState().numberOfMembersPerGroup?.data === undefined &&
          payload?.payload?.page === 1) ||
        (getState().numberOfMembersPerGroup?.data?.length > 0 &&
          payload?.payload?.page > 1) ||
        (getState().numberOfMembersPerEvent?.data === undefined &&
          payload?.payload?.page === 1) ||
        (getState().numberOfMembersPerEvent?.data?.length > 0 &&
          payload?.payload?.page > 1)
      ) {
        actions.setMembersPerResourceLoading(true);
      }

      // console.log("payload",payload.payload.resource_type)
      let response = await getApi(payload);

      if (response && response?.status !== 200) {
        toast.error(response?.message);
        actions.setMembersPerResourceLoading(false);
      } else if (response && response?.status === 200) {
        if (payload.payload.resource_type === "group") {
          const { currentPage } =
            response?.data.pagination.length > 0 &&
            response?.data.pagination[0];
          if (response?.data?.data?.length !== 0) {
            if (currentPage && currentPage === 1) {
              actions.setNumberOfMemberPerGroup(response?.data);
            } else {
              actions.setNumberOfMemberPerGroup({
                pagination: response?.data?.pagination,
                data: [
                  ...getState().numberOfMembersPerGroup?.data,
                  ...response?.data?.data,
                ],
              });
            }
          } else {
            actions.setNumberOfMemberPerGroup({
              pagination: [
                {
                  total: 0,
                  currentPage: 0,
                  limit: 0,
                  pages: 0,
                  prevPage: null,
                  nextPage: null,
                },
              ],
              data: [],
            });
          }
        }
        if (payload.payload.resource_type === "event") {
          const { currentPage } =
            response?.data.pagination.length > 0 &&
            response?.data.pagination[0];
          if (response?.data?.data?.length !== 0) {
            if (currentPage && currentPage === 1) {
              actions.setNumberOfMembersPerEvent(response?.data);
            } else {
              actions.setNumberOfMembersPerEvent({
                pagination: response?.data?.pagination,
                data: [
                  ...getState().numberOfMembersPerEvent?.data,
                  ...response?.data?.data,
                ],
              });
            }
          } else {
            actions.setNumberOfMembersPerEvent({
              pagination: [
                {
                  total: 0,
                  currentPage: 0,
                  limit: 0,
                  pages: 0,
                  prevPage: null,
                  nextPage: null,
                },
              ],
              data: [],
            });
          }
        }

        actions.setMembersPerResourceLoading(false);
      } else {
        actions.setMembersPerResourceLoading(false);
        return true;
      }
    }
  ),

  getPostPerMember: thunk<DashboardModel, IPayload, any, StoreModel>(
    async (actions, payload: IPayload, { getStoreActions, getState }) => {
      if (
        (getState().postPerMember?.data === undefined &&
          payload?.payload?.page === 1) ||
        (getState().postPerMember?.data?.length > 0 &&
          payload?.payload?.page > 1)
      ) {
        actions.setPostPerMemberLoading(true);
      }

      let response = await getApi(payload);
      if (response && response?.status !== 200) {
        toast.error(response?.message);
        actions.setPostPerMemberLoading(false);
      } else if (response && response?.status === 200) {
        const { currentPage } =
          response?.data.pagination.length > 0 && response?.data.pagination[0];
        if (response?.data?.data?.length !== 0) {
          if (currentPage && currentPage === 1) {
            actions.setPostPerMember(response?.data);
          } else {
            actions.setPostPerMember({
              pagination: response?.data?.pagination,
              data: [
                ...getState().postPerMember?.data,
                ...response?.data?.data,
              ],
            });
          }
        } else {
          actions.setPostPerMember({
            pagination: [
              {
                total: 0,
                currentPage: 0,
                limit: 0,
                pages: 0,
                prevPage: null,
                nextPage: null,
              },
            ],
            data: [],
          });
        }

        // actions.setPostPerMember(response?.data);
        actions.setPostPerMemberLoading(false);
      } else {
        actions.setPostPerMemberLoading(false);
        return true;
      }
    }
  ),

  getPaypalVsCash: thunk<DashboardModel, IPayload, any, StoreModel>(
    async (actions, payload: IPayload, { getStoreActions, getState }) => {
      if (
        (getState().paypalVsCash?.data === undefined &&
          payload?.payload?.page === 1) ||
        (getState().paypalVsCash?.data?.length > 0 &&
          payload?.payload?.page > 1)
      ) {
        actions.setPaypalVsCashLoading(true);
      }
      let response = await getApi(payload);
      if (response && response?.status !== 200) {
        toast.error(response?.message);
        actions.setPaypalVsCashLoading(false);
      } else if (response && response?.status === 200) {
        let sum = _.sumBy(response?.data, "total");
        actions.setTotalSum(sum);
        response?.data &&
          response?.data?.length > 0 &&
          response?.data?.forEach((val: any) => {
            if (val?._id === "cash") {
              actions.setPayPalCashAmount({
                ...getState().paypalCash,
                cashAmount: val?.total,
              });
            }
            if (val?._id === "paypal") {
              actions.setPayPalCashAmount({
                ...getState().paypalCash,
                payPalAmount: val?.total,
              });
            }
          });

        actions.setPaypalVsCash(response?.data);
        actions.setPaypalVsCashLoading(false);
      } else {
        actions.setPaypalVsCashLoading(false);
        return true;
      }
    }
  ),

  getGroupEventByLocation: thunk<DashboardModel, IPayload, any, StoreModel>(
    async (actions, payload: IPayload, { getStoreActions, getState }) => {
      if (
        (getState().groupEventByLocation?.data === undefined &&
          payload?.payload?.page === 1) ||
        (getState().groupEventByLocation?.data?.length > 0 &&
          payload?.payload?.page > 1)
      ) {
        actions.setGroupEventByLocationLoading(true);
      }
      let response = await getApi(payload);
      if (response && response?.status !== 200) {
        toast.error(response?.message);
        actions.setGroupEventByLocationLoading(false);
      } else if (response && response?.status === 200) {
        const { currentPage } = response?.data.pagination.length
          ? response?.data.pagination[0]
          : undefined;
        if (currentPage && currentPage === 1) {
          actions.setGroupEventByLocation(response?.data);
        } else {
          actions.setGroupEventByLocation({
            pagination: response?.data?.pagination,
            data: [
              ...getState().groupEventByLocation?.data,
              ...response?.data?.data,
            ],
          });
        }
        //  actions.setGroupEventByLocation(response?.data);
        actions.setGroupEventByLocationLoading(false);
      } else {
        actions.setGroupEventByLocationLoading(false);
        return true;
      }
    }
  ),
};

export default dashboard;
