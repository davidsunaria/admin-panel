import React from 'react';
import { isLogin } from '../../lib/middlewares/Auth';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    let location = useLocation();
   
    if (isLogin() === false) {
      return <Navigate to="/login" state={{ from: location }} />;
    }
  
    return children;
  };

export default PrivateRoute;