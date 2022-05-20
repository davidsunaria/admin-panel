import React, { useState } from "react";
import { ErrorMessage } from 'formik';
import DatePicker from "react-datepicker";
import moment from "moment"

interface ICustomDatePicker {
  frequency?:any;
   value?: any;
    label?: string | undefined;
    name: string;
    props:any;
}
const CustomDatePicker: React.FC<ICustomDatePicker> = ({  frequency,value, label, name, props}) => {

  const [minDate]=useState(new Date())
  const [monthDate]=useState(moment().add(1, 'M').format('DD-MM-YYYY'))
  // const [yearDate]=useState(moment().add(365, 'days').format('DD-MM-YYYY'))
  
  const {
    setFieldValue
  } = props;
    return (
        <div className="mb-3">
        <label html-for="name" className="form-label w-100">{label}</label>
        <div className="PopupDatePicker">
          <DatePicker
            name={name}
            selected={frequency==="monthly" ?new Date(): new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
             minDate={minDate}
             maxDate={
              frequency==="monthly" ?new Date(new Date(monthDate).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'}))
               :new Date(new Date().setFullYear(new Date().getFullYear() + 1))
             }
            value={value || ""}
            onChange={date => {
              const formattedDate = moment(date).format("YYYY-MM-DD");
              setFieldValue(`${name}`, formattedDate)
            }}
          />
        </div>
        <ErrorMessage name={name} component="span" className="errorMsg" />
      </div>
    );
}
export default CustomDatePicker;