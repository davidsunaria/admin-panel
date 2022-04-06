import React, { HTMLInputTypeAttribute } from "react";
import { Field,ErrorMessage } from 'formik';
import { string } from "yup/lib/locale";
interface RadioInputValue {
    name: string;
    value: string;
    label: string;
}
interface InputRadio {
    values: Array<RadioInputValue>;
}
const InputRadio: React.FC<InputRadio> = ({ values }) => {
    return (
        <>
            {
                values.map((data, i) => {
                    return <div className="form-check form-check-inline">
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