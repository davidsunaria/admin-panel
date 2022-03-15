import React, { Fragment } from 'react';
import {
  NavLink
} from "react-router-dom";
import LOGOICON from 'react-app-images/logo.png';
import { showNavbar } from 'src/lib/utils/Service';

const Sidebar: React.FC = (): JSX.Element => {

  const dropDownKey = [{
    route: "reported_groups",
    title: "Groups"
  },
  {
    route: "reported_events",
    title: "Events"
  },
  {
    route: "reported_users",
    title: "Members"
  }
  
  ]


  return (
    <Fragment>
      <div className="l-navbar" id="nav-bar">
        <nav className="nav">
          <div>
            <div className="nav_logo" onClick={() => showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header')}>

              <span className="nav_logo-name"><img height="25" src={LOGOICON} alt="Logo" /></span>
            </div>
            <ul className="nav_list">
              <li><NavLink className={({ isActive }: { isActive: any }) => isActive ? ' nav_link active' : 'nav_link '} to="dashboard"><i className="bi bi-grid"></i><span className="nav_name">Dashboard</span></NavLink></li>
              <li><NavLink className={({ isActive }: { isActive: any }) => isActive ? ' nav_link active' : 'nav_link '} to="users"><i className="bi bi-person"></i><span className="nav_name">Users</span></NavLink></li>
              <li><NavLink className={({ isActive }: { isActive: any }) => isActive ? ' nav_link active' : 'nav_link '} to="groups"><i className="bi bi-people"></i><span className="nav_name">Groups</span></NavLink></li>
              <li><NavLink className={({ isActive }: { isActive: any }) => isActive ? ' nav_link active' : 'nav_link '} to="events"><i className="bi bi-calendar2-event"></i><span className="nav_name">Events</span></NavLink></li>
              <li><div className={"nav_link cursor"} ><i className="bi  bi-bounding-box" > </i><span className="nav_name">Reported</span>
              <ul className="subNav">
              {dropDownKey.map((value, i) => {
                  return <li><NavLink key={i} className={({ isActive }: { isActive: any }) => isActive ? ' nav_link active' : 'nav_link '} to={value.route} ><span className="nav_name">{value.title}</span></NavLink></li>
                })}
              </ul>
            </div></li>
          </ul>
          <div className="nav_link d-none"> <i className="bi bi-box-arrow-left"></i> <span className="nav_name">SignOut</span></div>
         </div>
        </nav>
      </div>
    </Fragment>

  )
}

export default Sidebar;