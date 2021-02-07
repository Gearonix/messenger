// <RoomFormC user_name={props.user_name} onSubmit={enterRoom}/>

import {Field, reduxForm} from "redux-form";
import {Input} from "../others/inputs/inputs";
import {ChangeProfileDescVal, ChangeProfileVal, LoginVal} from "../../validator";
import {connect} from "react-redux";
import {enterRoomTC as enterRoom,logoutAC as logout,changeProfileTC as changeProfile,openChangeProfileAC as openChangeProfile,addImageAC as addImage,closeChangeProfileAC as closeChangeProfile} from "../../reducers/login_reducer";
import {NavLink, Redirect} from 'react-router-dom';
import React from "react";
import base_avatar from '../../source/base_avatar.jpg';
import classes from './enterRoom.module.css';
import styles from './changeProfile.module.css';
import {useEffect,useState} from "react";
import socket from "../../socket";

// async function test(image){
//     let module = await import(`../../../../backend/${image}`);
//     return module
// }


const EnterRoom = function (props){

    if (props.image){
        console.log(typeof props.image);
    }
    // debugger
    if (props.room){
        socket.emit('enter_room',{room : props.room})
        return <Redirect to={'/messages'} />
    }
    if (!props.logined){
        return <Redirect to={'/'} />
    }
    function enterRoom(data){
        let sum = {room : data.room,name : props.user_name}
        props.enterRoom(sum)
    }
    function logout(event){
        // debugger
        props.logout();
        event.preventDefault();
    }
    function submitProfileForm(data){
        let sum = {name : data.name,description : data.description,oldname : props.user_name,image : props.imageFile};
        if (!sum.name){
            sum.name = props.user_name
        }
        // debugger
        props.changeProfile(sum);

    }

    // debugger;
    let src;
    if (props.image){
        try {
            src = require(`./../../../../backend/${props.image}`);
        }
        catch (error){
            console.log(error);
        }

    }
    let isSrc = props.image && src ? src.default : base_avatar;
    // debugger;
    return(
        <div className={classes.main}>

        <div className={classes.profileBlock}>
        <span onClick={logout} className={classes.logout}>Logout</span>
        <div className={classes.profileInnerBlock}>
        <img src={isSrc} alt="" className={classes.image}/>
        <button onClick={props.openChangeProfile} className={classes.changeProfileButton}>Change profile</button>
        <h2 className={classes.userName}>{props.user_name}</h2>
        <p className={classes.description}>{props.description}</p>

        </div>
            {props.change && <ChangeProfileFormC onSubmit={submitProfileForm} addImage={props.addImage} image={isSrc} closeChangeProfile={props.closeChangeProfile}
            user_name={props.user_name} description={props.description}/>}
        </div>
        <RoomFormC user_name={props.user_name} onSubmit={enterRoom}/>
        </div>
    )
}

const ChangeProfileForm = function(props){
    let file;
    function addImage(event){

        if (event.target.files.length>0){
            file = event.target.files[0];
            props.addImage(file);
        }
    }
    // debugger;
    function cancel(event){
        props.closeChangeProfile();
        event.preventDefault();
    }
    function mount(){
        props.initialize({ name: props.user_name , description: props.description});
    }
    useEffect(mount,[]);
    return(
        <form onSubmit={props.handleSubmit} className={styles.main} >
            <h2 className={styles.roomEdit}>Edit</h2>
            <div className={styles.mainBlock}>

                <div className={styles.nameAndDescBlock}>

                    <div className={styles.nameBlock}>
                        <h2 className={styles.h2Name}>Name: </h2>
                        <Field name={'name'} component={Input}
                               placeholder={'name...'} validate={ChangeProfileVal}
                               maxLength={'15'} className={styles.fullName} autoComplete={'off'}></Field>
                    </div>
                    <div className={styles.descriptionBlock+' '+styles.nameBlock}>
                        <h4 className={styles.h2Name}>Description:</h4>
                        <Field name={'description'} component={Input}
                               placeholder={'description...'} validate={ChangeProfileDescVal}
                               maxLength={'40'}  className={styles.fullName+' '+styles.deskArea} autoComplete={'off'}/>
                    </div>
                </div>
                <div className={styles.imageBlock}>
                    <img src={props.image} alt="" className={styles.userImage}/>
                    <div className={styles.addImageButton}>
                        <span className={styles.addImageTitle}>Change</span>
                        <input type='file' name='image' onChange={addImage} className={styles.addImageHidden} title={''}/>
                    </div>
                </div>
            </div>
            <div className={styles.saveOrCancelBlock}>
                <button  className={styles.save}>Save</button>
                <button className={styles.cancel} onClick={cancel}>Cancel</button>
            </div>
            <span className={styles.globalError}>{props.error}</span>
        </form>
    )
}


const ChangeProfileFormC = reduxForm({
    form : 'changeprofile'
})(ChangeProfileForm);





const RoomForm = function (props){
    return (
        <form onSubmit={props.handleSubmit} className={classes.roomBlock}>
            <div className={classes.roomInnerBlock}>
            <h2 className={classes.roomTitle}>Hey, {props.user_name}, which room do you want to enter?</h2>
            <div className={classes.inputRoomBlock}>
            <Field component={Input} name={'room'} placeholder={'Enter room...'} validate={LoginVal}
                   className={classes.roomInput} autoComplete={'off'} />
            <button className={classes.roomButton}>Enter</button>

            <NavLink to={'/createroom'} ><button className={classes.createRoom}>Create</button></NavLink>
            <h2>{props.error}</h2>
            </div>
            </div>
        </form>
    )
}

const RoomFormC = reduxForm({
    form : 'enterRoom'
})(RoomForm)

let state = function (state){
    return{
        user_name : state.login.name,
        room : state.login.room,
        logined : state.login.logined,
        avatar : state.login.avatar,
        description : state.login.description,
        change : state.login.openChangeProfile,
        image : state.login.avatar,
        imageFile : state.login.imageFile
    }
}// user_name : state.login.name,



export default connect(state,{enterRoom,logout,changeProfile,openChangeProfile,addImage,closeChangeProfile})(EnterRoom);