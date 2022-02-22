import { StoreModel } from 'react-app-model';
import { Action, action, Thunk, thunk } from "easy-peasy";
import { toast } from "react-toastify";

import { getApi, postApi } from 'react-app-api';
import { IPayload } from 'react-app-interfaces';
import NavigationService from 'src/routes/NavigationService';
import store from 'react-app-store';
import { logoutCompletely } from '../../lib/utils/Service';
export interface UserModel {
  isInvitationSend: boolean;
  setIsInvitationSend: Action<UserModel, boolean>;
  flushData: Action<UserModel>;
  response: string | object | any;
  setResponse: Action<UserModel, object | any>;
  getUsers: Thunk<UserModel, object>;
	logout:Thunk<UserModel, object>;
  enableDisable:Thunk<UserModel, object>;
  inviteUser:Thunk<UserModel, object>;
}

const user: UserModel = {
  response: {},
  isInvitationSend: false,
  setResponse: action((state, payload) => {
    state.response = payload;
  }),
  setIsInvitationSend: action((state, payload) => {
    state.isInvitationSend = payload;
  }),
  flushData: action((state, payload) => {
    state.isInvitationSend = false;
  }),
  getUsers: thunk<UserModel,IPayload,any,StoreModel>(async (actions, payload: IPayload, { getStoreActions,getState  }) => {
		// if(!getState().response?.data?.length){
    //   getStoreActions().common.setLoading(true);
    // }
    getStoreActions().common.setLoading(true);
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
	logout: thunk<UserModel,IPayload,any,StoreModel>(async (actions, payload: IPayload, {getStoreActions, getStoreState}) => {
    getStoreActions().common.setLoading(true);
    
    const response = await postApi(payload);
    if (response && response.status !== 200) {
      toast.error(response.message);
      getStoreActions().common.setLoading(false);
    } else if (response && response.status === 200) {
      logoutCompletely();
      getStoreActions().auth.setIsLogin(false);
      getStoreActions().common.setLoading(false);
      NavigationService.navigate("/login");
      setTimeout(async() => {
        await store.persist.clear();
      }, 100)
    }
    else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  enableDisable: thunk<UserModel,IPayload,any,StoreModel>(async (actions, payload: IPayload, { getStoreActions }) => {
		getStoreActions().common.setLoading(true);
		let response = await postApi(payload);
		if (response && response.status !== 200) {
			toast.error(response.message);
			getStoreActions().common.setLoading(false);
		} else if (response && response.status === 200) {
			toast.success(response.message);
			getStoreActions().common.setLoading(false);
		}
		else {
			getStoreActions().common.setLoading(false);
			return true;
		}
	}),
  inviteUser: thunk<UserModel,IPayload,any,StoreModel>(async (actions, payload: IPayload, { getStoreActions }) => {
		actions.setIsInvitationSend(false);
    getStoreActions().common.setLoading(true);
		let response = await postApi(payload);
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
	})
};

export default user;