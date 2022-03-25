import React from 'react';
import { isLogin } from '../../lib/middlewares/Auth';
import { Navigate, } from 'react-router-dom';
// import { useStoreState } from 'react-app-store';

interface PublicRoute {
  children: JSX.Element;
  restricted?: boolean;
}

const PublicRoute = ({ children, restricted }:PublicRoute ) => {
  /*const navigate = useNavigate();

    const login = useStoreState(state => state.auth.isLogin);
    const { isAuthenticated, loading } = useSelector(state => state.auth);
  
    if (loading) {
      return <p>Checking authenticaton..</p>;
    }*/
    if (isLogin() === true && restricted === true) {
        return <Navigate to="/users" replace={true} />;
    }
  
    return children;
    
};

export default PublicRoute;