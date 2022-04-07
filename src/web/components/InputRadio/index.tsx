import React, { HTMLInputTypeAttribute } from "react";
import { Field,ErrorMessage } from 'formik';
import { string } from "yup/lib/locale";
interface RadioInputValue {
    name: string;
    value: string;
    label: string;
}
interface InputRadio {
    heading?:string,
    values: Array<RadioInputValue>;
}
const InputRadio: React.FC<InputRadio> = ({ values,heading }) => {
    return (
        <>
        <label html-for="name" className="form-label w-100">{heading}</label>
            {
                values.map((data, i) => {
                    return <div className="form-check form-check-inline" key={i}>
                        <Field className="form-check-input" type="radio" name={data?.name} id={i + 1} value={data?.value} />
                        <label className="form-check-label" >{data?.label}</label>
                    </div>
                })
            }
           <br/> <ErrorMessage name={values[0].name} component="span" className="errorMsg" />
        </>

    );
}
export default InputRadio;