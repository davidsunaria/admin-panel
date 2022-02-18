import { Action, action, Thunk, thunk } from "easy-peasy";
export interface CommonModel {
  isLoading: boolean,
  setLoadingAction: Action<CommonModel, object | any>,
  setLoading: Thunk<CommonModel, object | any>,
}

const common: CommonModel = {
  isLoading: false,
  setLoadingAction: action((state, payload) => {
    state.isLoading = payload;
  }),
  setLoading: thunk((actions, payload) => {
    actions.setLoadingAction(payload);
  })
};

export default common;
