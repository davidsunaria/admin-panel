import React, { useEffect, useCallback } from 'react';
import { Link } from "react-router-dom";
import { useStoreActions } from 'react-app-store';
import { ILogin } from 'react-app-interfaces';
import { Formik } from 'formik';
import { useAuthValidation } from '../../lib/validations/AuthSchema';
import LOGO from 'react-app-images/logo.png';
import { removeTempData } from '../../lib/utils/Service';
import CustomSuspense from '../components/CustomSuspense';
const Input = React.lazy(() => import('../components/Input'));

const Login: React.FC = (): JSX.Element => {
  const { LoginSchema } = useAuthValidation();
  const login = useStoreActions(actions => actions.auth.login);
  

  const userInititalState = useCallback((): ILogin => {
    return {
      email: '',
      password: ''
    }
  }, []);

  const signIn = useCallback(async (values: ILogin) => {
    await login({ url: "auth/login", payload: values });
  }, []);

  useEffect(() => {
    removeTempData();
  }, []);
  return (

    <Formik
      enableReinitialize={true}
      initialValues={userInititalState()}
      onSubmit={async values => {
        //setFormData(JSON.stringify(values, null, 2))
        signIn(values);
      }}
      validationSchema={LoginSchema}
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
                <img src={LOGO} alt="logo" />
              </div>
              <div className="card loginOuter">
                <article className="card-body">
                  <h4 className="card-title mb-4 mt-1">Sign in2</h4>

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
                    {/* <ErrorMessage name="email" component="span" className="errorMsg" /> */}
                  </div>

                  <div className="form-group mb-3">
                    <Link className="float-end forgotPwd" to="/forgot-password">Forgot Password?</Link>
                    <label>Your password</label>
                    <Input
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
                    {/* <ErrorMessage name="password" component="span" className="errorMsg" /> */}
                  </div>

                 
                  <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-block"> Login </button>
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

export default Login;