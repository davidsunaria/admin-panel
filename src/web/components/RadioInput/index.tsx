import React, { HTMLInputTypeAttribute } from "react";
import {  Field } from 'formik';

interface RadioInput {
    value?: string | ReadonlyArray<string> | number | undefined;
    label?: string | undefined;
    name: string
}
const RadioInput: React.FC<RadioInput> = ({  value, label, name}) => {
    return (
        <div className="form-check form-check-inline">
            <Field className="form-check-input" type="radio" name={name} id="inlineRadio1" value={value} />
            <label className="form-check-label" >{label}</label>
        </div>
    );
}
export default RadioInput;