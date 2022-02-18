import React from 'react';
//import { isLogin } from '../../lib/middlewares/Auth';
import { Navigate, useLocation } from 'react-router-dom';
import { useStoreState } from 'react-app-store';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    let location = useLocation();
    const isLogin = useStoreState(state => state.auth.isLogin);
  
    /*if (loading) {
      return <p>Checking authenticaton..</p>;
    }*/
    console.log('Private', isLogin);
    if (isLogin === false) {
      return <Navigate to="/login" state={{ from: location }} />;
    }
  
    return children;
  };

export default PrivateRoute;