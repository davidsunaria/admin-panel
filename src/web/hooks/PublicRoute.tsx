import React from 'react';
//import { isLogin } from '../../lib/middlewares/Auth';
import { Navigate, useLocation } from 'react-router-dom';
import { useStoreState } from 'react-app-store';

const PublicRoute = ({ children, restricted }: { children: JSX.Element, restricted: boolean }) => {
    let location = useLocation();
    const isLogin = useStoreState(state => state.auth.isLogin);
    /*const { isAuthenticated, loading } = useSelector(state => state.auth);
  
    if (loading) {
      return <p>Checking authenticaton..</p>;
    }*/
    console.log('Public', isLogin);
    if (isLogin === true && restricted === true) {
        return <Navigate to="/users" state={{ from: location }} />;
    }
    
    return children;
};

export default PublicRoute;