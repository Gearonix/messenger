import {reduxForm,Field} from "redux-form";
import {connect} from 'react-redux';
import {loginTC as login,enterRoomTC as enterRoom} from "../../reducers/login_reducer";
import {Input} from "../others/inputs/inputs";
import {LoginVal} from "../../validator";
import {Redirect,NavLink} from 'react-router-dom';
import classes from './login.module.css';

const Login = function (props){

    if (props.logined){
        return <Redirect to={'/enterroom'} />
    }
    return(
        <LoginFormC onSubmit={props.login} />
    )
}
const LoginForm = function (props){
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





let state = function (state){
    return{
        logined : state.login.logined
    }
}


export default connect(state,{login})(Login);