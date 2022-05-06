import React from 'react';
import { isLogin } from '../../lib/middlewares/Auth';
import { Navigate, } from 'react-router-dom';

interface IPublicRoute {
  children: JSX.Element;
  restricted?: boolean;
}

const PublicRoute = ({ children, restricted }:IPublicRoute ) => {
  
    if (isLogin() === true && restricted === true) {
        return <Navigate to="/users" replace={true} />;
    }
  
    return children;
    
};

export default PublicRoute;