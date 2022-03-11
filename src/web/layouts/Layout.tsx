import React, { FC, Fragment, ReactNode, useEffect, useState } from "react";
import Header from '../layouts/Header';
import Sidebar from '../layouts/Sidebar';
import { useStoreState, useStoreActions } from 'react-app-store';
import LoadingOverlay from 'react-loading-overlay-ts';
import { isLogin } from '../../lib/middlewares/Auth';

interface Props {
  children: ReactNode;
}
const Layout: FC<Props> = ({ children }) => {
  const [dropDownClass, setDropDownClass] = useState(false)
  const isLoading = useStoreState(state => state.common.isLoading);
  const hideDropDown = () => {
    setDropDownClass(!dropDownClass)
  }
  return (
    <div onClick={hideDropDown}>
      <Fragment>
        {isLoading && <LoadingOverlay
          active={isLoading}
          spinner
          text='Please wait...'
        >
        </LoadingOverlay>}
        {isLogin() && <Header />}
        {isLogin() && <Sidebar class={dropDownClass} />}
        {children}
      </Fragment>
    </div>
  )
}

export default Layout;