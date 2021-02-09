// <RoomFormC user_name={props.user_name} onSubmit={enterRoom}/>

import {Field, reduxForm} from "redux-form";
import {Input} from "../others/inputs/inputs";
import {ChangeProfileDescVal, ChangeProfileVal, LoginVal} from "../../validator";
import {connect, useDispatch, useSelector} from "react-redux";
import {
    logoutAC,
    changeProfileTC,
    openChangeProfileAC,
    addImageAC as addImage,
    closeChangeProfileAC as closeChangeProfile,
    enterRoomTC
} from "../../reducers/login_reducer";
import {NavLink, Redirect} from 'react-router-dom';
import React from "react";
import base_avatar from '../../source/base_avatar.jpg';
import classes from './enterRoom.module.css';
import styles from './changeProfile.module.css';
import {useEffect} from "react";
import socket from "../../socket";
import {StateType} from "../../store";

// async function test(image){
//     let module = await import(`../../../../backend/${image}`);
//     return module
// }


type State = {
    user_name: null | string
    password: null | string
    room: null | string
    logined: boolean
    image: null | string
    description: null | string
    imageFile: null | string
    change: boolean
}

const EnterRoom = function () {
    const dispatch = useDispatch()
    const state: State = {
        room: useSelector((state: StateType) => state.login.room),
        logined: useSelector((state: StateType) => state.login.logined),
        description: useSelector((state: StateType) => state.login.description),
        change: useSelector((state: StateType) => state.login.openChangeProfile),
        image: useSelector((state: StateType) => state.login.avatar),
        imageFile: useSelector((state: StateType) => state.login.imageFile),
        user_name: useSelector((state: StateType) => state.login.name),
        password: useSelector((state: StateType) => state.login.password)
    }
    if (state.room) {
        socket.emit('enter_room', {room: state.room})
        return <Redirect to={'/messages'}/>
    }
    if (!state.logined) {
        return <Redirect to={'/'}/>
    }

    function enterRoom(data: { room : string }) {
        let sum = {room: data.room, name: state.user_name}
        dispatch(enterRoomTC(sum))
    }

    function logout(event: any) {
        dispatch(logoutAC());
        event.preventDefault();
    }

    function submitProfileForm(data: {
        description: string | null
        name:  string | null
    }) {
        let sum = {name: data.name, description: data.description, oldname: state.user_name, image: state.imageFile};
        if (!sum.name) {
            sum.name = state.user_name
        }
        dispatch(changeProfileTC(sum));
    }

    let src;
    if (state.image) {
        try {
            src = require(`./../../../../backend/${state.image}`);
        } catch (error) {
            console.log('error');
        }

    }
    let isSrc = state.image && src ? src.default : base_avatar;
    return (
        <div className={classes.main}>

            <div className={classes.profileBlock}>
                <span onClick={logout} className={classes.logout}>Logout</span>
                <div className={classes.profileInnerBlock}>
                    <img src={isSrc} alt="" className={classes.image}/>
                    <button onClick={() => dispatch(openChangeProfileAC())}
                            className={classes.changeProfileButton}>Change profile
                    </button>
                    <h2 className={classes.userName}>{state.user_name}</h2>
                    <p className={classes.description}>{state.description}</p>

                </div>
                {state.change && <ChangeProfileFormC
                    // @ts-ignore
                    onSubmit={submitProfileForm} addImage={(file: any) => dispatch(addImage(file))} image={isSrc}
                    closeChangeProfile={() => dispatch(closeChangeProfile())}
                    user_name={state.user_name} description={state.description}/>}
            </div>
            {/*@ts-ignore*/}
            <RoomFormC user_name={state.user_name} onSubmit={enterRoom}/>
        </div>
    )
}

const ChangeProfileForm = function (props : any) {
    let file;

    function addImage(event : any) {

        if (event.target.files.length > 0) {
            file = event.target.files[0];
            props.addImage(file);
        }
    }

    // debugger;
    function cancel(event : any) {
        props.closeChangeProfile();
        event.preventDefault();
    }

    function mount() {
        props.initialize({name: props.user_name, description: props.description});
    }

    useEffect(mount, []);
    return (
        <form onSubmit={props.handleSubmit} className={styles.main}>
            <h2 className={styles.roomEdit}>Edit</h2>
            <div className={styles.mainBlock}>

                <div className={styles.nameAndDescBlock}>

                    <div className={styles.nameBlock}>
                        <h2 className={styles.h2Name}>Name: </h2>
                        <Field name={'name'} component={Input}
                               placeholder={'name...'} validate={ChangeProfileVal}
                               maxLength={'15'} className={styles.fullName} autoComplete={'off'}></Field>
                    </div>
                    <div className={styles.descriptionBlock + ' ' + styles.nameBlock}>
                        <h4 className={styles.h2Name}>Description:</h4>
                        <Field name={'description'} component={Input}
                               placeholder={'description...'} validate={ChangeProfileDescVal}
                               maxLength={'40'} className={styles.fullName + ' ' + styles.deskArea}
                               autoComplete={'off'}/>
                    </div>
                </div>
                <div className={styles.imageBlock}>
                    <img src={props.image} alt="" className={styles.userImage}/>
                    <div className={styles.addImageButton}>
                        <span className={styles.addImageTitle}>Change</span>
                        <input type='file' name='image' onChange={addImage} className={styles.addImageHidden}
                               title={''}/>
                    </div>
                </div>
            </div>
            <div className={styles.saveOrCancelBlock}>
                <button className={styles.save}>Save</button>
                <button className={styles.cancel} onClick={cancel}>Cancel</button>
            </div>
            <span className={styles.globalError}>{props.error}</span>
        </form>
    )
}


const ChangeProfileFormC = reduxForm({
    form: 'changeprofile'
})(ChangeProfileForm);


const RoomForm = function (props : any) {
    return (
        <form onSubmit={props.handleSubmit} className={classes.roomBlock}>
            <div className={classes.roomInnerBlock}>
                <h2 className={classes.roomTitle}>Hey, {props.user_name}, which room do you want to enter?</h2>
                <div className={classes.inputRoomBlock}>
                    <Field component={Input} name={'room'} placeholder={'Enter room...'} validate={LoginVal}
                           className={classes.roomInput} autoComplete={'off'}/>
                    <button className={classes.roomButton}>Enter</button>

                    <NavLink to={'/createroom'}>
                        <button className={classes.createRoom}>Create</button>
                    </NavLink>
                    <h2>{props.error}</h2>
                </div>
            </div>
        </form>
    )
}

const RoomFormC = reduxForm({
    form: 'enterRoom'
})(RoomForm)

export default EnterRoom