import {NavLink} from "react-router-dom";
import React from "react";
import classes from './default.module.css';
const Default = function (){
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