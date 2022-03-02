import React from 'react';
interface IProp {
  text: String;
  toggle?: () => void
}
const Navbar: React.FC<IProp> = (props): JSX.Element => {

  return (
    <>
      <div className="mainTitle">
        <h4 className="flex-grow-1">{props?.text}</h4>
        {props.toggle && <button onClick={props.toggle} type="button" className="btn btn-outline-primary btn-lg"><i className="bi bi-plus-lg"></i> Invite user</button>}
      </div>
    </>
  )
}
export default Navbar;
