import {connect, useDispatch, useSelector} from "react-redux";
import {Redirect} from 'react-router-dom';
import {Field, reduxForm, reset} from "redux-form";
import {
    addMessageTC as addMessage,
    getMessagesTC as getMessages,
    exitRoomTC as exitRoom,
    changeRoomDataTC as changeRoomData,
    setMessagesAC, setOnlineAC
} from './../../reducers/messages_reducer';
import {logoutAC as logout} from './../../reducers/login_reducer';
import React from 'react';
import {Input} from "../others/inputs/inputs";
import {MessageVal} from "../../validator";
import {compose} from "redux";
import base_avatar from "../../source/base_avatar.jpg";
import classes from "./messages.module.css";
import {useEffect, useState} from 'react';
import socket from "../../socket";

const Messages = function (props) {
    console.log(props.room_data);
    let scroll = React.createRef();
    let [ChangeRoomData, openChangeRoomData] = useState(false);
    const messages = useSelector((state) => state.messages.messages);
    const online = useSelector((state) => state.messages.online)
    const dispatch = useDispatch()
    function mount() {
        const room_object = {room : props.room}
        socket.on('return_messages',(data) => {
            dispatch(setMessagesAC(data))
        })
        if (props.room) {
            // props.getMessages({room : props.room});
            socket.emit('get_messages', room_object);
            down();
        }
        down()
        //GENERATOR

        // setInterval(() => props.getMessages({room : props.room}),5000);
    }


    useEffect(mount, []);
    // useEffect(test__,[props.messages])
    if (!props.logined) {
        return <Redirect to={'/'}/>
    }
    if (!props.room) {
        return <Redirect to={'/enterroom'}/>
    }
    let addMessage = (data) => {
        const obj =  {message: data.message,
            from: props.name, room: props.room,
            image: props.avatar};
        socket.emit('add_message',obj);
        socket.emit('get_messages',{room : props.room});
        // props.addMessage
        // ({message: data.message, from: props.name,
        // room: props.room, image: props.avatar});
        props.reset();
        down();
    }
    let elements = props.messanges.map((item, index) =>
        <MessageItem message={item.message} from={item.sender} key={index} image={item.image}
        ></MessageItem>);
    // debugger
    const exitRoom = () => {
        // debugger;
        props.exitRoom({name: props.name})
    }

    // debugger;
    function down() {
        console.log('SCROLL CURRENT ' + !!scroll.current)
        scroll.current?.scrollTo(0,9999999)
    }
    function showChangeForm() {
        openChangeRoomData(true)
    }

    let src;
    if (props.room_data?.image) {
        try {
            src = require(`./../../../../backend/${props.room_data.image}`);
        } catch (error) {
            console.log(error);
        }
    }
    // debugger
    setTimeout(down,20)
    let isSrc = props.room_data?.image && src ? src.default : base_avatar;
    return (
        <div className={classes.main}>

            <div className={classes.messagesBlock} ref={scroll}>
                {elements}
                <button onClick={down} className={classes.downddScroll}>&#9660;</button>

            </div>
            <aside className={classes.aside}>
                <button onClick={exitRoom} className={classes.exit}></button>
                <button onClick={props.logout} className={classes.logout}></button>
            </aside>
            <MessagesFormC onSubmit={addMessage}/>
        </div>
    )
}

const ChangeRoomDataForm = function (props) {
    return (
        <form onSubmit={props.handleSubmit}>
            <Field component={'input'} name={'room'} placeholder={'name...'}/>
            <Field component={'input'} name={'description'} placeholder={'description...'}/>
            <button>changeForm</button>
        </form>
    )
}

const ChangeRoomDataFormC = reduxForm({
    form: 'change_room_data'
})(ChangeRoomDataForm);


const MessagesForm = function (props) {
    // debugger
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
const MessageItem = function (props) {
    let src;
    if (props.image) {
        try {
            src = require(`./../../../../backend/${props.image}`);
        } catch (error) {
            console.log(error);
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


let state = function (state) {
    return {
        logined: state.login.logined,
        room: state.login.room,
        name: state.login.name,
        messanges: state.messages.messages,
        avatar: state.login.avatar,
        room_data: state.messages.room_data
    }
}
let dispatch_mtp = function (dispatch) {
    return {
        reset: function () {
            dispatch(reset('messages'))
        }
    }
}

export default compose(connect(state, {addMessage, getMessages, exitRoom, logout, changeRoomData}),
    connect(null, dispatch_mtp))(Messages);

