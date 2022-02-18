import React, { useCallback, useState } from 'react';
import { Formik } from 'formik';
import { IUsers, IUsersProps } from 'react-app-interfaces';

const SearchUser: React.FC<IUsers & IUsersProps> = (props) => {
  const [statusData, setStatusdata] = useState([
    { key: 'All', value: 'all' }, { key: 'Active', value: 1 }, { key: 'Inactive', value: '0' },
  ]);
  const [premiumData, setPremiumData] = useState([
    { key: 'All', value: 'all' }, { key: 'Yes', value: 1 }, { key: 'No', value: '0' },
  ]);
  const userInititalState = useCallback((): IUsers => {
    return {
      q: '', status: '', is_premium: ''
    }
  }, []);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={userInititalState()}
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
                  <label>Status:</label>
                  <select name="status"
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
                  </select>
                </div>
                <div className="filter mb-2 me-sm-2">
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
                </div><div className="btn btn-outline-primary align-top" onClick={() => {
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