import React, { useEffect, Suspense ,useRef} from 'react';
import { UserContext } from '../web/hooks/UserContext';
import { Route, Routes, useNavigate } from 'react-router-dom'
import PublicRoute from '../web/hooks/PublicRoute';
import PrivateRoute from '../web/hooks/PrivateRoute';
import Layout from '../web/layouts/Layout';
import NavigationService from './NavigationService';
import CustomSuspense from '../web/components/CustomSuspense';




const Users = React.lazy(() => import('../web/pages/Users'));
const Login = React.lazy(() => import('../web/pages/Login'));
 const Groups = React.lazy(() => import('../web/pages/Groups'));
const Events = React.lazy(() => import('../web/pages/Events'));
const ReportedGroups = React.lazy(() => import('../web/pages/ReportedGroups'));
const ReportedUsers = React.lazy(() => import('../web/pages/ReportedUsers'));
const ReportedEvents = React.lazy(() => import('../web/pages/ReportedEvents'));
const ForgotPassword = React.lazy(() => import('../web/pages/ForgotPassword'));
const VerifyOtp = React.lazy(() => import('../web/pages/VerifyOtp'));
const NotFound = React.lazy(() => import('../../src/web/components/NotFound'));

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
    <Layout >
      <UserContext.Provider value={isLoggedIn}>
        <Routes >
          <Route path="/"  element={<PublicRoute restricted={true}>
            <CustomSuspense><Login /></CustomSuspense>
          </PublicRoute>}></Route>
          
          <Route path="*" element={<PublicRoute restricted={false}> 
           <Suspense fallback={<>Loading...</>}><NotFound /></Suspense></PublicRoute>}></Route>

          <Route path="/login" element={<PublicRoute restricted={true}>
          <CustomSuspense><Login /></CustomSuspense>
          </PublicRoute>}></Route>

          <Route path="/forgot-password" element={<PublicRoute restricted={true}>
          <CustomSuspense><ForgotPassword /></CustomSuspense>
          </PublicRoute>}></Route>

          <Route path="/verify-otp" element={<PublicRoute restricted={true}>
          <CustomSuspense><VerifyOtp /></CustomSuspense>
          </PublicRoute>}></Route>

          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute>
            <CustomSuspense><Users /></CustomSuspense>
          </PrivateRoute>} />

          <Route path="/groups" element={<PrivateRoute>
            <CustomSuspense><Groups /></CustomSuspense>
          </PrivateRoute>} />

          <Route path="/events" element={<PrivateRoute>
            <CustomSuspense><Events /></CustomSuspense>
          </PrivateRoute>} />

          <Route path="/reported_groups" element={<PrivateRoute>
            <Suspense fallback={<>Loading...</>}><ReportedGroups /></Suspense>
          </PrivateRoute>} />

          <Route path="/reported_events" element={<PrivateRoute>
            <Suspense fallback={<>Loading...</>}><ReportedEvents /></Suspense>
          </PrivateRoute>} />
          <Route path="/reported_users" element={<PrivateRoute>
            <Suspense fallback={<>Loading...</>}><ReportedUsers /></Suspense>
          </PrivateRoute>} />

        </Routes>
      </UserContext.Provider>
    </Layout>
  );
}

export const Dashboard = () => {
  return <div>This is a Dashboard page</div>
}
export default AppRouter;