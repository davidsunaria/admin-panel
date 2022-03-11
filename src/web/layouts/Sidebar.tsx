import React, { Fragment, useState,useRef, useEffect } from 'react';
import {
  NavLink
} from "react-router-dom";
import LOGOICON from 'react-app-images/logo.png';
import { showNavbar } from 'src/lib/utils/Service';
interface ISideBar {
  class: boolean;
}
const Sidebar: React.FC<ISideBar> = (props): JSX.Element => {
  const dropdown = useRef<HTMLDivElement | any>(null);

  const dropDownKey = [{
    route:"reported-groups",
    title:"Reported Groups"
  },
  {
    route:"reported-users",
    title:"Reported Users"
  },
  {
    route:"reported-events",
    title:"Reported Events"
  }
]
  const setSubMenu = () =>{
    dropdown.current.className="submenu-active"
  }
  useEffect(()=>{
    dropdown.current.className="submenu-link"
  },[props.class])

  return (
    <Fragment>
      <div className="l-navbar" id="nav-bar">
        <nav className="nav">
          <div>
            <div className="nav_logo" onClick={() => showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header')}>

              <span className="nav_logo-name"><img height="25" src={LOGOICON} alt="Logo" /></span>
            </div>
            <div className="nav_list">
              <NavLink className={({ isActive }: { isActive: any }) => isActive ? ' nav_link active' : 'nav_link '} to="dashboard"><i className="bi bi-grid"></i><span className="nav_name">Dashboard</span></NavLink>
              <NavLink className={({ isActive }: { isActive: any }) => isActive ? ' nav_link active' : 'nav_link '} to="users"><i className="bi bi-person"></i><span className="nav_name">Users</span></NavLink>
              <NavLink className={({ isActive }: { isActive: any }) => isActive ? ' nav_link active' : 'nav_link '} to="groups"><i className="bi bi-people"></i><span className="nav_name">Groups</span></NavLink>
              <NavLink className={({ isActive }: { isActive: any }) => isActive ? ' nav_link active' : 'nav_link '} to="events"><i className="bi bi-calendar2-event"></i><span className="nav_name">Events</span></NavLink>
              <div className={"nav_link cursor"}  onMouseEnter={() => { setSubMenu() }} ><i className="bi  bi-bounding-box" onMouseEnter={() => { setSubMenu() }} > </i>Reported Detail</div>
              <div ref ={dropdown}>
                {dropDownKey.map((value,i)=>{
                 return <NavLink key ={i} className={({ isActive }: { isActive: any }) => isActive ? ' nav_link active' : 'nav_link '} to={value.route} onClick={() => { setSubMenu() }}><span className="nav_name">{value.title}</span></NavLink>
                })}
              </div>
            </div>
          </div>
          <div className="nav_link d-none"> <i className="bi bi-box-arrow-left"></i> <span className="nav_name">SignOut</span></div>
        </nav>
      </div>
    </Fragment>

  )
}

export default Sidebar;