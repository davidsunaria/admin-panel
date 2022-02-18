import React, {  useEffect } from 'react';
import { UserContext } from '../web/hooks/UserContext';
import { Route, Routes, useNavigate } from 'react-router-dom'
import PublicRoute from '../web/hooks/PublicRoute';
import PrivateRoute from '../web/hooks/PrivateRoute';
import Login from '../web/pages/Login';
import Layout from '../web/layouts/Layout';

import Users from '../web/pages/Users';
import Groups from '../web/pages/Groups';
import Events from '../web/pages/Events';
import ForgotPassword from '../web/pages/ForgotPassword';
import VerifyOtp from '../web/pages/VerifyOtp';
import NavigationService from './NavigationService'
const AppRouter: React.FC = (): JSX.Element => {
  const isLoggedIn = true;

  /* const response: any = useSelector((state: AppState) => state.UserReducer);
   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
 
   useEffect((): void => {
     if (response && response.isLoggedIn !== undefined) {
       setIsLoggedigationIn(response.isLoggedIn);
     }
   }, [response.isLoggedIn]);*/
  const navigation = useNavigate()
  useEffect(() => {
     NavigationService.setNavigateRef(navigation)
  }, [])


  return (
    <Layout>
      <UserContext.Provider value={isLoggedIn}>
        <Routes >
          <Route path="/" element={<PublicRoute restricted={true}><Login /></PublicRoute>}></Route>
          <Route path="*" element={<PublicRoute restricted={false}><NotFound /></PublicRoute>}></Route>

          <Route path="/login" element={<PublicRoute restricted={true}><Login /></PublicRoute>}></Route>
          <Route path="/forgot-password" element={<PublicRoute restricted={true}><ForgotPassword /></PublicRoute>}></Route>
          <Route path="/verify-otp" element={<PublicRoute restricted={true}><VerifyOtp /></PublicRoute>}></Route>
          
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
          <Route path="/groups" element={<PrivateRoute><Groups /></PrivateRoute>} />
          <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
        </Routes>
      </UserContext.Provider>
    </Layout>
  );
}


export const NotFound = () => {
  return <div>This is a 404 page</div>
}
export const Dashboard = () => {
  return <div>This is a Dashboard page</div>
}
export default AppRouter;