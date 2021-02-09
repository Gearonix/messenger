import {NavLink, Redirect} from "react-router-dom";
import React from "react";
import classes from './default.module.css';
import {useSelector} from "react-redux";
import {StateType} from "../../store";
const Default = function (){
    const logined = useSelector((state : StateType) => state.login.logined);
    if (logined){
        return <Redirect to={'/enterroom'} />
    }
    return(
        <div className={classes.main}>
            <div className={classes.logo}></div>
            <h2 className={classes.logoTitle}>Gearonix</h2>
            <h1 className={classes.title}>Welcome to Gearonix messages!</h1>
            <div className={classes.loginRegisterBlock}>
            <NavLink to={'/login'} className={classes.login}>login</NavLink>
            <NavLink to={'/register'} className={classes.register}>register</NavLink>
            </div>
        </div>
    )
}

export default Default;