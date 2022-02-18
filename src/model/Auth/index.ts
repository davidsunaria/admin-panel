import { StoreModel } from 'react-app-model';
import { Action, action, Thunk, thunk } from "easy-peasy";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import NavigationService from "src/routes/NavigationService";

import { postApi } from 'react-app-api';
import { IPayload } from 'react-app-interfaces';
import { setToken, setTempData} from '../../lib/utils/Service';
export interface AuthModel {
  isLogin: boolean;
  isOtpSend: boolean;
  isOtpVerified: boolean;
  isSignupCompleted: boolean;
  isPasswordReset: boolean;
  isLoggedOut: boolean;
  response: string | object | any;
  setIsLogin: Action<AuthModel, boolean>;
  setIsOtpSend: Action<AuthModel, boolean>;
  setIsOtpVerified: Action<AuthModel, boolean>;
  setIsSignupCompleted: Action<AuthModel, boolean>;
  setIsLoggedOut: Action<AuthModel, boolean>;
  setIsPasswordReset: Action<AuthModel, boolean>;
  setResponse: Action<AuthModel, object | any>;
  login: Thunk<AuthModel, object>;
  sendForgotPasswordOTP:Thunk<AuthModel, object>;
  resetPassword:Thunk<AuthModel, object>;
}

const auth: AuthModel = {
  isLogin: false,
  isOtpSend: false,
  isOtpVerified: false,
  isSignupCompleted: false,
  isPasswordReset: false,
  isLoggedOut: false,
  response: {},
  setIsLogin: action((state, payload) => {
    state.isLogin = payload;
  }),
  setIsOtpSend: action((state, payload) => {
    state.isOtpSend = payload;
  }),
  setIsOtpVerified: action((state, payload) => {
    state.isOtpVerified = payload;
  }),
  setIsSignupCompleted: action((state, payload) => {
    state.isSignupCompleted = payload;
  }),
  setIsLoggedOut: action((state, payload) => {
    state.isLoggedOut = payload;
  }),
  setIsPasswordReset: action((state, payload) => {
    state.isPasswordReset = payload;
  }),
  setResponse: action((state, payload) => {
    state.response = payload;
  }),
  login: thunk<AuthModel,IPayload,any,StoreModel>(async (actions, payload: IPayload, {getStoreActions}) => {
    actions.setResponse({});
    getStoreActions().common.setLoading(true);
    const response = await postApi(payload);
    if (response && response.status !== 200) {
      toast.error(response.message);
      getStoreActions().common.setLoading(false);
    } else if (response && response.status === 200) {
      //toast.success(response.message);
      setToken(response.data.access_token);
      
      actions.setResponse(response.data);
      actions.setIsLogin(true);
      getStoreActions().common.setLoading(false);
      NavigationService.navigate("/users");
    }
    else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  sendForgotPasswordOTP: thunk<AuthModel,IPayload,any,StoreModel>(async (actions, payload: IPayload, { getStoreActions }) => {
		getStoreActions().common.setLoading(true);
		let response = await postApi(payload);
		if (response && response.status !== 200) {
			toast.error(response.message);
			getStoreActions().common.setLoading(false);
		} else if (response && response.status === 200) {
			toast.success(response.message);
			getStoreActions().common.setLoading(false);
			setTempData(payload);
      NavigationService.navigate("/verify-otp");
		}
		else {
			getStoreActions().common.setLoading(false);
			return true;
		}
	}),
  resetPassword: thunk<AuthModel,IPayload,any,StoreModel>(async (actions, payload: IPayload, { getStoreActions }) => {
		getStoreActions().common.setLoading(true);
		let response = await postApi(payload);
		if (response && response.status !== 200) {
			toast.error(response.message);
			getStoreActions().common.setLoading(false);
		} else if (response && response.status === 200) {
			toast.success(response.message);
			getStoreActions().common.setLoading(false);
      NavigationService.navigate("/login");
		}
		else {
			getStoreActions().common.setLoading(false);
			return true;
		}
	}),
};

export default auth;