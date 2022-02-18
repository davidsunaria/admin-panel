import React, { Fragment, useCallback } from 'react';
import { useStoreActions } from 'react-app-store';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import ConfirmAlert from '../components/ConfirmAlert';
import { showNavbar } from 'src/lib/utils/Service';
const Header: React.FC = (): JSX.Element => {
  const logout = useStoreActions(actions => actions.user.logout);

  const onYes = useCallback(async () => {
    async function postData() {
      await logout({ url: 'user/logout' });
    }
    postData();
  }, []);
  const logoutMe = useCallback(() => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <ConfirmAlert onClose={onClose} onYes={onYes} heading="Are you sure?" subHeading={"You want to logout?"} onCloseText="Close" onSubmitText="Logout" />
        );
      }
    });
  }, []);
  
  return (
    <Fragment>
      <header className="header" id="header">
        <div className="header_toggle" onClick={() => showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header')}> <i  className='bi bi-list' id="header-toggle"></i> </div>
        <div onClick={() => logoutMe()} className="logout"> <i className="bi bi-box-arrow-left"></i> <span className="nav_name">Logout</span> </div>
      </header>
    </Fragment>

  )
}

export default Header;