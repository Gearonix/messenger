import {reduxForm,Field} from "redux-form";
import { useDispatch, useSelector} from 'react-redux';
import {loginTC as login} from "../../reducers/login_reducer";
import {Input} from "../others/inputs/inputs";
import {LoginVal} from "../../validator";
import {Redirect,NavLink} from 'react-router-dom';
import classes from './login.module.css';
import {StateType} from "../../store";

const Login = function (){
    const dispatch = useDispatch()
    const state = {
        logined : useSelector((state : StateType) => state.login.logined)
    }
    if (state.logined){
        return <Redirect to={'/enterroom'} />
    }
    function log(data :  {name :  string, password :  string}){
        dispatch(login(data))
    }
    return(
        // @ts-ignore
        <LoginFormC onSubmit={log} />
    )
}
const LoginForm = function (props : any){
    return(
        <form onSubmit={props.handleSubmit}>
            <div className={classes.loginBlock}>

            <h1 className={classes.title+' '+classes.titleFirst}>Hello.</h1>
            <h1 className={classes.title}>Welcome back</h1>
            <h4 className={classes.inputTitle}>Name:</h4>
            <Field component={Input} name={'name'} placeholder={'Name'}
                   validate={LoginVal} className={classes.input} autoComplete={'off'} />
            <h4 className={classes.inputTitle}>Password:</h4>
            <Field component={Input} name={'password'} placeholder={'Password'}
                   validate={LoginVal} className={classes.input} autoComplete={'off'}/>
           <NavLink to={'/register'} className={classes.back}>Register</NavLink>
            <button className={classes.loginButton}>Login</button>
            <span className={classes.error}>{props.error}</span>
            </div>
        </form>
    )
}




const LoginFormC = reduxForm({
    form : 'login'
})(LoginForm)



export default Login