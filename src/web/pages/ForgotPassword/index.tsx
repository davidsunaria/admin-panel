import React, {  useCallback } from 'react';
import { Link } from "react-router-dom";
import { useStoreActions } from 'react-app-store';
import { IForgotPassword } from 'react-app-interfaces';
import { Formik } from 'formik';
import { useAuthValidation } from '../../../lib/validations/AuthSchema';
import LOGO from 'react-app-images/logo.png';
import CustomSuspense from '../../components/CustomSuspense';
const Input = React.lazy(() => import('../../components/Input'));

const ForgotPassword: React.FC = (): JSX.Element => {
  const { ForgotPasswordSchema } = useAuthValidation();
  const sendForgotPasswordOTP = useStoreActions(actions => actions.auth.sendForgotPasswordOTP);

  const userInititalState = useCallback((): IForgotPassword => {
    return {
      email: '',
    }
  }, []);

  const forgot = useCallback(async (values: IForgotPassword) => {
    await sendForgotPasswordOTP({ url: "auth/forgot-password", payload: values });
  }, []);

  return (

    <Formik
      enableReinitialize={true}
      initialValues={userInititalState()}
      onSubmit={async values => {
        forgot(values);
      }}
      validationSchema={ForgotPasswordSchema}
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
                <img src={LOGO} alt="error" />
              </div>
              <div className="card loginOuter">
                <article className="card-body">
                  <h4 className="card-title mb-4 mt-1">Forgot Password</h4>

                  <div className="form-group mb-3">
                    <label>Email</label>
                    <CustomSuspense>
                    <Input
                      placeholder="Enter email"
                      id="email"
                      name="email"
                      type="text"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="off"
                      className="form-control"
                    />
                    </CustomSuspense>
                  </div>

                  <div className="form-group d-flex justify-content-between">
                    <button type="submit" className="btn btn-primary btn-block">Submit</button>
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

export default ForgotPassword;