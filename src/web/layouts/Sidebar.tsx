import React, { Fragment,useCallback } from 'react';
import {
  NavLink,useLocation
} from "react-router-dom";
import LOGOICON from 'react-app-images/logo.png';
import NavigationService from 'src/routes/NavigationService';


const Sidebar: React.FC = (): JSX.Element => {

    let pathName= useLocation().pathname
    const dropDownKey = [{
    route: "reported-groups",
    title: "Groups"
  },
  {
    route: "reported-events",
    title: "Events"
  },
   {
     route: "reported-users",
     title: "Members"
   }]
  
  


  const showNavbar = useCallback(() => {
    NavigationService.navigate("/users");

  }, []); 



  return (
    <Fragment>
      <div className="l-navbar" id="nav-bar">
        <nav className="nav">
          <div>


          <div className="nav_logo" onClick={() => showNavbar()}>
              <span className="nav_logo-name"><img height="25" src={LOGOICON} alt="Logo" /></span>
          </div>
            
            <ul className="nav_list">
               <li><NavLink className={({ isActive }: { isActive: any }) => isActive ? ' nav_link active' : 'nav_link '} to="dashboard"><i className="bi bi-grid"></i><span className="nav_name">Dashboard</span></NavLink></li> 
              <li ><NavLink className={({ isActive }: { isActive: any }) => isActive ? ' nav_link active' : 'nav_link '} to="users"><i className="bi bi-person"></i><span className="nav_name">Users</span></NavLink></li>
              <li><NavLink className={({ isActive }: { isActive: any }) => isActive ? ' nav_link active' : 'nav_link '} to="groups"><i className="bi bi-people"></i><span className="nav_name">Groups</span></NavLink></li>
              <li ><NavLink className={({ isActive }: { isActive: any }) => isActive ? ' nav_link active' : 'nav_link '} to="events"><i className="bi bi-calendar2-event"></i><span className="nav_name">Events</span></NavLink></li>
              <li><div className={"nav_link cursor"} ><i className= {`bi  bi-bounding-box ${pathName==="/reported-groups" || pathName==="/reported-events"?"dropActive":""}`} > </i><span className= {`nav_name ${pathName==="/reported-groups" || pathName==="/reported-events"?"dropActive":""}`}>Reported Items</span>
              <ul className="subNav">
              {dropDownKey.map((value, i) => {
                  return <li key={i}><NavLink key={i} className={({ isActive }: { isActive: any }) => isActive ? ' nav_link active' : 'nav_link '} to={value.route} ><span className="nav_name">{value.title}</span></NavLink></li>
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