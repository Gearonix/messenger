import {reduxForm,Field} from "redux-form";
import {connect} from 'react-redux';
import {registerTC as register} from "../../reducers/login_reducer";
import {Input} from "../others/inputs/inputs";
import {RegisterVal} from "../../validator";
import {Redirect,NavLink} from 'react-router-dom';
import classes from "../login/login.module.css";

const Register = function (props){
    if (props.logined){
        return <Redirect to={'/enterroom'}/>
    }
    function register(data){
        // debugger
        props.register(data)
    }
    return(
        <RegisterFormC onSubmit={register} />
    )
}
const RegisterForm = function (props){
    return(
        <form onSubmit={props.handleSubmit}>
            <div className={classes.loginBlock}>
            <h1 className={classes.title+' '+classes.titleFirst}>Register</h1>
            <h4 className={classes.inputTitle}>Name:</h4>
            <Field component={Input} name={'name'} placeholder={'name'}
                   validate={RegisterVal} maxLength='15'
                   className={classes.input} autoComplete={'off'}/>
            <h4 className={classes.inputTitle}>Password:</h4>
            <Field component={Input} name={'password'}
                   placeholder={'password'} validate={RegisterVal} maxLength='15'
                   className={classes.input} autoComplete={'off'}/>
            <NavLink to={'/login'} className={classes.back}>Login</NavLink>
            <button  className={classes.registerButton}>Register</button>
            <span className={classes.error}>{props.error}</span>
            </div>
        </form>
    )
}

const RegisterFormC = reduxForm({
    form : 'register'
})(RegisterForm)





let state = function (state){
    return{
        user_name : state.login.name,
        logined : state.login.logined
    }
}


export default connect(state,{register})(Register);