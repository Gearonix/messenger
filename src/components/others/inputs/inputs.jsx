import classes from './inputs.module.css';


export const Input = function({input,meta,...props}){
    //de
    // debugger
    let throw_error = meta.error && meta.touched && !meta.active && meta.error!='_NV_';
    let isError = throw_error ? classes.input_error : null
    return(
        <div className={isError}>
            <input {...input}{...props} ></input>
            <span>{throw_error && meta.error}</span>
        </div>
    )
}

