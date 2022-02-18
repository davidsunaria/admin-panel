import React from 'react';
interface IConfirmAlert {
  heading: string;
  subHeading?: string;
  onYes: (payload?: any) => void;
  onClose: () => void;
  onSubmitText: string;
  onCloseText: string;
}
const ConfirmAlert = (props: IConfirmAlert) => {

  return (

    <div className='custom-ui'>
      <h1>{props?.heading}</h1>
      <div className="confirmBody">
      <p>{props?.subHeading}</p>
      <div className="confirmFooter">
      <button
        className="btn btn-primary btn-block"
        onClick={() => {
          props.onYes(props);
          props.onClose();
        }}
      >
        {props.onSubmitText}
      </button>
      <button className="btn btn-primary btn-block" onClick={props.onClose}>{props.onCloseText}</button>
      </div>
      </div>
    </div>
  );
};

export default ConfirmAlert;
