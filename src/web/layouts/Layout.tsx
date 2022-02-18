import React, { FC, Fragment, ReactNode } from "react";
import Header from '../layouts/Header';
import Sidebar from '../layouts/Sidebar';
import { useStoreState } from 'react-app-store';
import LoadingOverlay from 'react-loading-overlay-ts';

interface Props {
  children: ReactNode;
}
const Layout: FC<Props> = ({ children }) => {
  const isLogin = useStoreState(state => state.auth.isLogin);
  const isLoading = useStoreState(state => state.common.isLoading);
  return (
    <Fragment>
       {isLoading && <LoadingOverlay
        active={isLoading}
        spinner
        text='Please wait...'
      >
     </LoadingOverlay>}
      {isLogin && <Header />}
      {isLogin && <Sidebar />}
      {children}
    </Fragment>
  )
}

export default Layout;