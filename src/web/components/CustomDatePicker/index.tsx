import React  from "react";
import { ErrorMessage } from 'formik';
import DatePicker from "react-datepicker";
import moment from "moment"

interface ICustomDatePicker {
   value?: any;
    label?: string | undefined;
    name: string;
    props:any;
}
const CustomDatePicker: React.FC<ICustomDatePicker> = ({  value, label, name, props}) => {
  
  const {
    setFieldValue
  } = props;
    return (
        <div className="mb-3">
        <label html-for="name" className="form-label w-100">{label}</label>
        <div className="PopupDatePicker">
          <DatePicker
            name={name}
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