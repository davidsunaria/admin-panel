import React, { useCallback } from 'react';
import { useStoreActions } from 'react-app-store';
import { IResetPassword } from 'react-app-interfaces';
import { Formik, ErrorMessage } from 'formik';
import { useAuthValidation } from '../../../lib/validations/AuthSchema';
import LOGO from 'react-app-images/logo.png';
import { getTempData } from '../../../lib/utils/Service';
import { Link } from "react-router-dom";
const VerifyOtp: React.FC = (): JSX.Element => {
  const { ResetPasswordSchema } = useAuthValidation();
  const resetPassword = useStoreActions(actions => actions.auth.resetPassword);
  const userInititalState = useCallback((): IResetPassword => {
    const res = JSON.parse(getTempData());
    return {
      otp: '',
      email: res?.payload?.email,
      password: '',
      password_confirmation: ''
    }
  }, []);

  const reset = useCallback(async (values: IResetPassword) => {
    delete values?.password_confirmation;
    await resetPassword({ url: "auth/reset-password", payload: values });
  }, []);

  return (

    <Formik
      enableReinitialize={true}
      initialValues={userInititalState()}
      onSubmit={async values => {
        console.log(JSON.stringify(values, null, 2))
        reset(values);
      }}
      validationSchema={ResetPasswordSchema}
    >
      {props => {
        const {
          values,
          handleChange,
          handleBlur,
          handleSubmit,
        } = props;
        return (

          <form onSubmit={handleSubmit}>
            <div className="loginMain">
              <div className="loginHeader">
                <img src={LOGO} alt="logo"/>
              </div>
              {/* {JSON.stringify(values)} */}
              <div className="card loginOuter">
                <article className="card-body">
                  <h4 className="card-title mb-4 mt-1">Reset Password</h4>

                  <div className="form-group mb-3">
                    <label>OTP</label>
                    <input
                      placeholder="Enter otp"
                      id="otp"
                      name="otp"
                      type="text"
                      value={values.otp}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="off"
                      className="form-control"
                    />
                    <ErrorMessage name="otp" component="span" className="errorMsg" />
                  </div>
             
                  <div className="form-group mb-3">
                    <label>Password</label>
                    <input
                      placeholder="Enter password"
                      id="password"
                      name="password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="off"
                      className="form-control"
                    />
                    <ErrorMessage name="password" component="span" className="errorMsg" />
                  </div>
                  <div className="form-group mb-3">
                    <label>Re-Enter New Password</label>
                    <input
                       placeholder="Re-enter new password"
                       id="password_confirmation"
                       name="password_confirmation"
                       type="password"
                       value={values.password_confirmation}
                       onChange={handleChange}
                       onBlur={handleBlur}
                       autoComplete="off"
                       className="form-control"
                    />
                    <ErrorMessage name="password_confirmation" component="span" className="errorMsg" />
                  </div>

                  <div className="form-group d-flex justify-content-between">
                    <button type="submit" className="btn btn-primary btn-block"> Submit </button>

                    
                    <Link to="/login" className="btn btn-primary btn-block">Back</Link>
                  

                  </div>

                </article>
              </div>
            </div>
          </form>
        );
      }}
    </Formik>

  )
}

export default VerifyOtp;