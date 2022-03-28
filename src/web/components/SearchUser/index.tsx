/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import { Formik } from 'formik';
import { IUsers, IUsersProps, IEventGroups } from 'react-app-interfaces';
import { useStoreActions, useStoreState } from 'react-app-store';

const SearchUser: React.FC<IUsers & IUsersProps & IEventGroups> = (props) => {
  const [statusData, setStatusdata] = useState([
    { key: 'All', value: 'all' }, { key: 'Active', value: "1" }, { key: 'Inactive', value: '0' }
  ]);

  const [reportedStatus, setReportedStatus] = useState([
    { key: 'All', value: 'all' }, { key: 'Blocked', value: "1" }, { key: 'Unblocked', value: '0' }
  ]);
  const [premiumData, setPremiumData] = useState([
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
      q: '', is_blocked_by_admin: ''
    }
  }, []);
  const groups = useStoreState(state => state.event.groups);



  const getGroups = useStoreActions(actions => actions.event.getGroups);


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

  return (
    <Formik
      enableReinitialize={true}
      initialValues={searchInitialState(props?.type)}
      onSubmit={async values => {
        //setFormData(JSON.stringify(values, null, 2))
        props.onSearch(values);
      }}

    >
      {formProps => {
        const { values, handleChange, handleBlur, handleSubmit, submitForm, resetForm } = formProps;
        return (
          <form onSubmit={handleSubmit} id="login_form">


            <div className="d-xl-flex mb-3">
              <div className="search-box"> <i className="bi bi-search"></i>

                <input
                  id="q"
                  name="q"
                  type="text"
                  value={values?.q}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="off"
                  className="form-control"
                  placeholder="Search by name"
                />

              </div>

              <div className="ms-auto">
                <div className="filter mb-2 me-sm-3">
                  <label>Blocked status:</label>
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
                  props.onReset();
                }}>Reset</div>
              </div>

            </div>
          </form>
        );
      }}
    </Formik>
  );
}

export default SearchUser;