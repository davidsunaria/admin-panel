import React, { HTMLInputTypeAttribute } from "react";
import { ErrorMessage } from 'formik';

interface IInput {
  type: HTMLInputTypeAttribute | undefined;
  value?: string | ReadonlyArray<string> | number | undefined;
  label?: string | undefined;
  name: string;
  id?: string | undefined;
  placeholder?: string | undefined;
  autoComplete?: string | undefined;
  className?: string | undefined;
  onChange?: (e: any) => void;
  onBlur?: (e: any) => void;
}

const Input: React.FC<IInput> = ({ type, className, value, label, name, id, placeholder, autoComplete, onChange, onBlur }) => {
  return (
    <div className="mb-3">
      {label && <label html-for={id} className="form-label">{label}</label>}
      <input type={type} name={name} value={value} onChange={onChange} onBlur={onBlur} className={className} id={id} placeholder={placeholder} autoComplete={autoComplete} />
      <ErrorMessage name={name} component="span" className="errorMsg" />
    </div>
  );
}
export default Input;