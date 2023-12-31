/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import { Formik } from 'formik';
import { IUsers, IUsersProps, IEventGroups } from 'react-app-interfaces';
import { useStoreActions, useStoreState } from 'react-app-store';
import { ExportToExcel } from '../../components/ExportToExcel'
import * as _ from "lodash";
const Input = React.lazy(() => import('../../components/Input'));
const SearchUser: React.FC<IUsers & IUsersProps & IEventGroups> = (props) => {
  
  const [statusData] = useState([
    { key: 'All', value: 'all' }, { key: 'Active', value: "1" }, { key: 'Inactive', value: '0' }
  ]);

  const [reportedStatus] = useState([
    { key: 'All', value: 'all' }, { key: 'Blocked', value: "1" }, { key: 'Unblocked', value: '0' }
  ]);
  const [premiumData] = useState([
    { key: 'All', value: 'all' }, { key: 'Yes', value: 1 }, { key: 'No', value: '0' }
  ]);
  const userInititalState = useCallback((): IUsers => {
    return {
      q: '', status: '', is_premium: ''
    }
  }, []);

  const groupInititalState = useCallback((): IUsers => {
    return {
      q: '', status: ''
    }
  }, []);

  const eventInititalState = useCallback((): IUsers => {
    return {
      q: '', status: '', group_id: ''
    }
  }, []);

  const reportedResourceInititalState = useCallback((): IUsers => {
    return {
      q: '', is_blocked_by_admin: 'all'
    }
  }, []);
  const groups = useStoreState(state => state.event.groups);


  const getGroups = useStoreActions(actions => actions.event.getGroups);
  const setLoading = useStoreActions(actions => actions.common.setLoading);

  const getGroupData = useCallback(() => {
    getGroups({ url: "event/get-groups" });
  }, []);

  useEffect(() => {
    if (props.type && props.type === 'events') {
      getGroupData();
    }
  }, [props.type]);

  const searchInitialState = (type: any): IUsers => {
    switch (type) {
      case 'users':
        return userInititalState();
      case 'events':
        return eventInititalState();
      case 'groups':
        return groupInititalState();
      case 'reported':
        return reportedResourceInititalState();
      default:
        return userInititalState();
    }
  }
  const [exportPayload, setExportPayload] = useState<any>(searchInitialState(props?.type));
  return (
    <>
    <Formik
      enableReinitialize={true}
      initialValues={searchInitialState(props?.type)}
      onSubmit={async values => {
        //setFormData(JSON.stringify(values, null, 2))
        setLoading(true)
        setExportPayload(values);
        props.onSearch(values);
      }}

    >
      {formProps => {
        const { values, handleChange, handleBlur, handleSubmit, submitForm, resetForm } = formProps;
        return (
          <form onSubmit={handleSubmit} id="login_form">


            <div className="d-xl-flex mb-3">
              <div className="search-box"> <i className="bi bi-search"></i>

                <Input
                  id="q"
                  name="q"
                  type="text"
                  value={values?.q}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="off"
                  className="form-control"
                  placeholder={props?.placeholder}
                />

              </div>

              <div className="ms-auto">
                <div className="filter mb-2 me-sm-3">
                  <label>Status:</label>
                  {props.type === 'reported' && <select name="is_blocked_by_admin"
                    value={values?.is_blocked_by_admin}
                    onChange={(e) => {
                      handleChange(e);
                      submitForm();
                    }}
                    onBlur={handleBlur} className="form-select" aria-label="Default select example">
                    {
                      reportedStatus && reportedStatus.length > 0 && reportedStatus.map((val, index) => (
                        <option key={index} value={val?.value}>{val?.key}</option>
                      ))
                    }
                  </select>}
                  {props.type !== 'reported' && <select name="status"
                    value={values?.status}
                    onChange={(e) => {
                      handleChange(e);
                      submitForm();
                    }}
                    onBlur={handleBlur} className="form-select" aria-label="Default select example">
                    {
                      statusData && statusData.length > 0 && statusData.map((val, index) => (
                        <option key={index} value={val?.value}>{val?.key}</option>
                      ))
                    }
                  </select>}
                </div>

                {props.type === 'users' && <div className="filter mb-2 me-sm-2">
                  <label>Premium:</label>
                  <select name="is_premium" value={values?.is_premium}
                    onChange={(e) => {
                      handleChange(e);
                      submitForm();
                    }}
                    onBlur={handleBlur} className="form-select" aria-label="Default select example">
                    {
                      premiumData && premiumData.length > 0 && premiumData.map((val, index) => (
                        <option key={index} value={val?.value}>{val?.key}</option>
                      ))
                    }
                  </select>
                </div>}

                {props.type === 'events' && <div className="filter mb-2 me-sm-2">
                  <label>Groups:</label>
                  <select name="group_id" value={values?.group_id}
                    onChange={(e) => {
                      handleChange(e);
                      submitForm();
                    }}
                    onBlur={handleBlur} className="form-select" aria-label="Default select example">
                    <option value="all">All</option>
                    {
                      groups?.length > 0 && groups?.map((val: any, index: number) => (
                        <option key={index} value={val?._id}>{val?.name}</option>
                      ))
                    }
                  </select>
                </div>}
                <div className="btn btn-outline-primary align-top" onClick={() => {
                  resetForm();
                  if(!_.isEmpty(Object.fromEntries(Object.entries(values).filter(([_, v]) => v !== "")))){
                    setLoading(true)
                  }
                  props.onReset();
                  setExportPayload(searchInitialState(props?.type));
                }}>Reset</div>
                    {props?.exportButton && <ExportToExcel payload={exportPayload} type={props?.type} class_name="btn btn-primary mx-2 mb-2" />}

              </div>

            </div>
          </form>
        );
      }}
    </Formik>
    </>
  );
}

export default SearchUser;