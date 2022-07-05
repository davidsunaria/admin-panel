import React,{useCallback} from "react";
import { Field,ErrorMessage } from 'formik';
import { RadioInputValue} from "react-app-interfaces";
interface IInputRadio {
    heading?:string,
    values: Array<RadioInputValue>;
    changeHandler?:any
}

const InputRadio: React.FC<IInputRadio> = ({ values,heading,changeHandler }) => {

    const   getSelectedValue = useCallback((value?: any) => {
        changeHandler(value)
       }, []);
    return (
        <>
        <label html-for="name" className="form-label w-100">{heading}</label>
            {
                values.map((data, i) => {
                    return <div className="form-check form-check-inline" key={i} >
                        <Field id={`radio_${data?.name}_${i}`} className="form-check-input" type="radio" name={data?.name} 
                         value={data?.value} onClick={()=>getSelectedValue(data?.value)}/>
                        <label htmlFor={`radio_${data?.name}_${i}`} className="form-check-label" >{data?.label}</label>
                    </div>
                })
            }
           <br/> <ErrorMessage name={values[0].name} component="span" className="errorMsg" />
        </>

    );
}
export default InputRadio;