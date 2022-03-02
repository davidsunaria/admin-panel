import React from 'react';
import { Link } from "react-router-dom";

import LOGO from 'react-app-images/logo.png';

const NotFound: React.FC = (): JSX.Element => {

  return (
    <>
      <div className="loginMain">
        <div className="loginHeader">
          <img src={LOGO} alt="logo" />
        </div>

        <div className="card loginOuter">
          <article className="card-body">
            <h1>Page Not Found</h1>

            <div className="form-group">
              <Link to="/login" className="btn btn-primary btn-block">Back to login</Link>
            </div>
          </article>
        </div>
      </div>
    </>
  )
}
export default NotFound;
