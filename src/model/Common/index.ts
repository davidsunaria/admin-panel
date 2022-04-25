import { Action, action, Thunk, thunk } from "easy-peasy";
export interface CommonModel {
  isLoading: boolean,
  dropDownStatus:boolean,
  exportStatus:boolean,
  setLoadingAction: Action<CommonModel, object | any>,
  setLoading: Thunk<CommonModel, object | any>,
  setDropDownStatus: Action<CommonModel, object | any>,
  setExportStatus:Action<CommonModel, object | any>,
}

const common: CommonModel = {
  isLoading: false,
  dropDownStatus:false,
  exportStatus:false,
  setLoadingAction: action((state, payload) => {
    state.isLoading = payload;
  }),

  setDropDownStatus: action((state, payload) => {
    state.dropDownStatus = payload;
  }),
  setExportStatus: action((state, payload) => {
    state.exportStatus = payload;
  }),
  setLoading: thunk((actions, payload) => {
    actions.setLoadingAction(payload);
  })
};

export default common;
