import { useDispatch, useSelector} from "react-redux";
import {Redirect} from 'react-router-dom';
import {Field, reduxForm, reset} from "redux-form";
import {
    setMessagesAC,
    exitRoomAC
} from '../../reducers/messages_reducer';
import {logoutAC as logout} from '../../reducers/login_reducer';
import React, {useRef} from 'react';
import {Input} from "../others/inputs/inputs";
import {MessageVal} from "../../validator";
import {compose} from "redux";
import base_avatar from "../../source/base_avatar.jpg";
import classes from "./messages.module.css";
import {useEffect, useState} from 'react';
import socket from "../../socket";
import { StateType } from "../../store";


type State = {
    name : null | string
    password : null | string
    room : null | string
    logined : boolean
    avatar : null | string
    messanges : Array<any>
    room_data : any
}
const Messages = function () {
    let scroll = useRef();
    const dispatch = useDispatch();
    const state : State = {
        room: useSelector((state : StateType) =>  state.login.room),
        name: useSelector((state : StateType) =>  state.login.name),
        messanges: useSelector((state : StateType) =>  state.messages.messages),
        avatar: useSelector((state : StateType) =>  state.login.avatar),
        room_data: useSelector((state : StateType) =>  state.messages.room_data),
        logined: useSelector((state : StateType) =>  state.login.logined),
        password: useSelector((state : StateType) =>  state.login.password),
    }
    type MessageType = {
        image: string | null
        message: string | null
        room: string
        sender: string
    }
    function mount() {
        const room_object = {room : state.room}
        socket.on('return_messages',(data : Array<MessageType>) => {
            dispatch(setMessagesAC(data))
        })
        if (state.room) {
            socket.emit('get_messages', room_object);
        }
        //GENERATOR
        // setInterval(() => props.getMessages({room : props.room}),5000);
    }
    useEffect(mount, []);
    if (!state.logined) {
        return <Redirect to={'/'}/>
    }
    if (!state.room) {
        return <Redirect to={'/enterroom'}/>
    }
    let addMessage = (data : { message : string | null }) : void => {
        const obj =  {message: data.message,
            from: state.name, room: state.room,
            image: state.avatar};
        socket.emit('add_message',obj);
        socket.emit('get_messages',{room : state.room});
        dispatch(reset('messages'));
        setTimeout(down,20);
    }
    let elements = state.messanges.map((item, index) =>
        <MessageItem message={item.message} from={item.sender} key={index} image={item.image}
        ></MessageItem>);
    const exitRoom = () => {
        socket.emit('leave_room',{room : state.room,name: state.name})
        dispatch(exitRoomAC())
    }
    function down() {
        // @ts-ignore
        scroll.current?.scrollTo(0,9999999)
    }
    setTimeout(down,20)
    return (
        <div className={classes.main}>
            {/*@ts-ignore*/}
            <div className={classes.messagesBlock} ref={scroll}>
                {elements}
                <button onClick={down} className={classes.downddScroll}>&#9660;</button>

            </div>
            <aside className={classes.aside}>
                <button onClick={exitRoom} className={classes.exit}></button>
                <button onClick={() => dispatch(logout())} className={classes.logout}></button>
            </aside>
            {/*@ts-ignore*/}
            <MessagesFormC onSubmit={addMessage}/>
        </div>
    )
}

// const ChangeRoomDataForm = function (props : any) {
//     return (
//         <form onSubmit={props.handleSubmit}>
//             <Field component={'input'} name={'room'} placeholder={'name...'}/>
//             <Field component={'input'} name={'description'} placeholder={'description...'}/>
//             <button>changeForm</button>
//         </form>
//     )
// }
//
// const ChangeRoomDataFormC = reduxForm({
//     form: 'change_room_data'
// })(ChangeRoomDataForm);

const MessagesForm = function (props : any) {
    return (
        <form onSubmit={props.handleSubmit} className={classes.formMain}>
            <div className={classes.formMessagesBlock}>
                <Field component={Input} name={'message'} placeholder={'Write message'}
                       maxLength='200' className={classes.area} autoComplete={'off'} validate={MessageVal}/>
                <button className={classes.send}></button>
            </div>
        </form>
    )
}
type MessageItemProps= {
    message : string
    from : string
    key ?: number
    image : string | null
}
const MessageItem = function (props : MessageItemProps) {
    let src;
    if (props.image) {
        try {
            src = require(`./../../../../backend/${props.image}`);
        } catch (error) {
            console.log('error');
        }

    }
    let isSrc = props.image && src ? src.default : base_avatar;
    return (
        <div className={classes.itemMain}>
            <div className={classes.itemImageBlock}>
                <img src={isSrc} alt=""/>
            </div>
            <div className={classes.itemTextBlock}>
                <span className={classes.from}>{props.from}</span>
                <p className={classes.message}>{props.message}</p>
            </div>
        </div>
    )
}


const MessagesFormC = reduxForm({
    form: 'messages'
})(MessagesForm);


export default Messages