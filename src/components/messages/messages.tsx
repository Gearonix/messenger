import { useDispatch, useSelector} from "react-redux";
import {NavLink, Redirect} from 'react-router-dom';
import {Field, reduxForm, reset, formValues, getFormValues, stopSubmit} from "redux-form";
import {
    setMessagesAC,
    exitRoomAC, getRoomDataTC
} from '../../reducers/messages_reducer';
import {addFilesTC, getUserTC, logoutAC as logout, logoutTC, setCurrentUserAC} from '../../reducers/login_reducer';
import React, {useRef} from 'react';
import {Input} from "../others/inputs/inputs";
import classes from "./messages.module.css";
import {useEffect, useState} from 'react';
import socket from "../../socket";
import { StateType } from "../../store";
import {catchFile, checkVideoUrl, iconStyle, includeImage, isWrong, сutWord} from "../../tools";
import {CloseOutlined, UploadOutlined,YoutubeOutlined,DeleteFilled } from '@ant-design/icons';
import {Button, Image} from 'antd';
import base_avatar from './../../source/base_avatar.jpg';
import { FileButton } from "../others/helpers/helpers";
import YouTube from "../others/video/video";
import unite from 'classnames';
import ShowRoom from "../roomData/roomData";
import messages_background from './../../source/messages_backgorund.png'

type State = {
    name : null | string
    password : null | string
    room : null | string
    logined : boolean
    avatar : null | string
    messanges : Array<any>
    room_data : any
    count : number
}
const Messages = function () {
    let scroll = useRef();
    const dispatch = useDispatch();
    const [userData,setUserData] = useState(null as number | null);
    const [files,setFile] = useState([] as Array<any>);
    const [images,setImage] = useState([] as Array<any>);
    const [isVideoBlock,openVideoBlock] = useState(false);
    let [attachedValue,changeAttachedValue] = useState('');
    let [isRoom,openRoom] = useState(false);
    const state : State = {
        room: useSelector((state : StateType) =>  state.login.room),
        name: useSelector((state : StateType) =>  state.login.name),
        messanges: useSelector((state : StateType) =>  state.messages.messages),
        avatar: useSelector((state : StateType) =>  state.login.avatar),
        room_data: useSelector((state : StateType) =>  state.messages.room_data),
        logined: useSelector((state : StateType) =>  state.login.logined),
        password: useSelector((state : StateType) =>  state.login.password),
        count: useSelector((state : StateType) =>  state.messages.count),
    }
    type MessageType = {
        image: string | null
        message: string | null
        room: string
        sender: string
    }
    function mount() {
        if (!state.room){
            return
        }
        const room_object = {room : state.room}
        socket.on('return_messages',(data : Array<MessageType>) => {
            dispatch(setMessagesAC(data))
        })
        socket.emit('get_messages', {...room_object, count : state.count });
        dispatch(getRoomDataTC(room_object))

        //GENERATOR
        // setInterval(() => props.getMessages({room : props.room}),5000);
    }

    console.log(state.room_data.background)
    useEffect(mount, []);
    if (!state.logined) {
        return <Redirect to={'/'}/>
    }
    if (!state.room) {
        return <Redirect to={'/enterroom'}/>
    }
    let addMessage = (data : { message : string | null,mode : 'default'} | {mode : 'attached'} | {url : string,mode : 'video'} )  : void => {
        let message;
        // @ts-ignore

        switch (data.mode){
            case 'attached':
                message = attachedValue
                break;
            case 'video':
                // @ts-ignore
                message = data.url
                if (!checkVideoUrl(message)){
                    dispatch(stopSubmit('video_form',{_error : 'Invalid video url'}))
                    return
                }
                break;
            case 'default':
                message = data.message
                break;
        }
        // debugger
        if (isWrong(message) && files.length==0){
            return
        }
        const obj =  {message: message,
            from: state.name, room: state.room,
            image: state.avatar};
        socket.emit('add_message',obj);
        dispatch(addFilesTC({...obj,images : files}))
        // socket.emit('get_messages',{room : state.room});
        setTimeout(() => socket.emit('get_messages',{room : state.room}),100)
        clearMessage()
        dispatch(reset('messages'));
        setTimeout(down,20);
    }
    const clearMessage = () => {
        setFile([])
        setImage([])
        openVideoBlock(false)
    }
    const deleteMessage = (id : number) => {
        socket.emit('delete_message',{id})
        socket.emit('get_messages',{room : state.room})
    }


    let elements = state.messanges.map((item, index) =>
        <MessageItem message={item.message} from={item.sender} key={index}
                     image={item.image} getUserData={() => setUserData(index)}
            images={JSON.parse(item.attached_images)} id={item.id} delete={deleteMessage}
                     current_user={state.name} date={item.creation_time}
        />);
    const exitRoom = () => {
        // socket.emit('leave_room',{room : state.room,name: state.name})
        dispatch(exitRoomAC())
    }

    function down() {
        // @ts-ignore
        scroll.current?.scrollTo(0,9999999)
    }
    setTimeout(down,20);
    function userDataClose(){
        dispatch(setCurrentUserAC({
            description :  null,
            user_name :  null,
            image :  null
        }))
        setUserData(null)
    }
    return (
        <div className={classes.main}>
            <img src={includeImage(state.room_data.background,messages_background)}
                 className={classes.mainBack} />
            {/*@ts-ignore*/}
            <div className={classes.messagesBlock} ref={scroll} >
                {elements}
                <button onClick={down} className={classes.downddScroll}>&#9660;</button>

            </div>
            <RoomData open={() => openRoom(true)}/>

            {isRoom && <ShowRoom close={() => openRoom(false)} leave={() => {
                socket.emit('leave_room',{room : state.room,name: state.name})
                dispatch(exitRoomAC())}}/>}
            {userData && <UserData user_name={state.messanges[userData].sender} close={userDataClose} isUserData={false} />}
            <aside className={classes.aside}>
                <NavLink to={'/enterroom'}><button className={classes.exit} onClick={exitRoom}></button></NavLink>
                <button onClick={() => dispatch(logoutTC())} className={classes.logout}></button>
            </aside>

            {/*@ts-ignore*/}
            {isVideoBlock && <VideoFormC onSubmit={(data : {url : string}) =>
                addMessage({url : data.url,mode : 'video'})} close={() => openVideoBlock(false)}
            />}
            {/*@ts-ignore*/}
            <MessagesFormC onSubmit={(data) => addMessage({...data,mode : 'default'})} setFile={(file) => setFile([...files,file])}
            setImage={(src : string) => setImage([...images,src])} images={images}
                           changeAttachedValue={(value : string) => changeAttachedValue(value)}
                           addMessage={addMessage} clearImages={clearMessage}
                           openVideo={() => openVideoBlock(true)}/>
        </div>
    )
}

const RoomData = function ({open} : {open : () => void}){
    const data = useSelector((state : StateType) => state.messages.room_data);
    //16
    return (
        <div className={classes.roomData_main} onClick={open}>

            <img src={includeImage(data.image)} className={classes.roomData_image} />
            <div className={classes.roomData_block}>
                <h2 className={classes.roomData_title}>{сutWord(data.room,16)}</h2>
                <p className={classes.roomData_desc}>{data.users.length} Users</p>
            </div>
        </div>
    )
}

const VideoForm = function(props : any){
    return <form onSubmit={props.handleSubmit} className={classes.videoForm}>
        <div className={classes.attachedMain}>
            <div className={classes.backgroundUserdata}></div>
            <div className={unite(classes.attachedImageBlock,classes.videoMain)}>
                <div  className={classes.userDataCross} onClick={props.close}>
                    <CloseOutlined style={{fontSize : 30,color : 'rgba(132, 138, 134, 1)'}} /></div>
                <h3 className={unite(classes.attachedSend,classes.videoTitle)}>Add Youtube Video</h3>
                <h4 className={classes.atachedTitle}>Video Url:</h4>
                <Field component={'input'} name={'url'} className={classes.atachedInput}
                autoComplete={'off'} />
                <div className={classes.somediv}>
                    <h3 className={classes.attachedSend} onClick={props.handleSubmit}>Send</h3></div>
                    <h3 className={classes.errorMessage}>{props.error}</h3>
            </div>
        </div>
    </form>
}
const VideoFormC = reduxForm({
    form : 'video_form'
})(VideoForm)
type UserDataProps = {
    user_name : string | null
    close : Function
    isUserData : boolean
}

export const UserData = function({user_name,close,isUserData} : UserDataProps){

    const dispatch = useDispatch();
    const [mainClass,setmainClass] = useState(classes.userDataMain);
    function mount(){
        dispatch(getUserTC(user_name));
        if (isUserData){
            setmainClass(classes.room_data_main)
        }
    }
    const user = useSelector((state : StateType) => state.login.currentUser);
    useEffect(mount,[])
    const isUser = !!user.user_name
    const src = includeImage(user.image);
    function closeMain(){
        // useDataMainClose
        setmainClass(classes.useDataMainClose)
        setTimeout(close,600);
    }
    //@ts-ignore
    return  <div className={true &&
        classes.userdata }><div className={classes.backgroundUserdata}></div>
        <div className={mainClass}>
        <div onClick={closeMain} className={classes.userDataCross}>
            <CloseOutlined style={{fontSize : 40,color : 'rgb(85, 87, 82)'}} /></div>
        {!isUser && <h2 className={classes.userDataUserName} style={{marginTop: 100}}>User not found :(</h2>}
        {isUser && <div><img src={src}  className={classes.userDataImage} />
        <h2 className={classes.userDataUserName}>{user.user_name}</h2>
        <h2 className={classes.userDataDesc}>{user.description}</h2></div>}
    </div></div>
}
const AttachedPicture = function({src} : {src : string}){
    return <img src={src} className={classes.attachedpicture}/>
}
const MessagesForm = function (props : any) {
    const send = (file : any) => {
        props.setFile(file)
        const reader = new FileReader();
        reader.onload = function () {
            props.setImage(reader.result)
        }
        reader.readAsDataURL(file);
        }
    return (
        <form onSubmit={props.handleSubmit} className={classes.formMain}>
            {props.images.length>0 && <AttachedBlock images={props.images}
                                                     changeValue={(value : string) =>
                                                         props.changeAttachedValue(value)}
                                                     addImage={catchFile(send)} close={props.clearImages}
            addMessage={(data : any) => props.addMessage(data)} />}
            {/*<input type="file" onChange={catchFile(send)}/>*/}
            <div className={classes.formBlock}>
            <div className={classes.formaddimageblock}>
            {/*<button onClick={props.openVideo}>add video</button>*/}
            <div style={{display: 'flex'}}>
            <YoutubeOutlined onClick={props.openVideo} style={{...iconStyle(50,'rgb(214, 105, 125)'),marginRight: 20}}/>
            <FileButton change={catchFile(send)} /></div></div>
            <div className={classes.formMessagesBlock}>
                <Field component={Input} name={'message'} placeholder={'Write message'}
                       maxLength='200' className={classes.area} autoComplete={'off'} />
                <button className={classes.send}></button>
            </div></div>
        </form>
    )
}
const AttachedBlock = function(props : {images : Array<any>,
     changeValue : Function,addMessage : Function,addImage : Function,close : Function}){
    const images = props.images.map((item : string,index) =>
        <AttachedPicture src={item} key={index} />);
    const input = useRef(null as any)
    const change = () => {
        props.changeValue(input.current.value)
    }
    return  (<div className={classes.attachedMain}>
        <div className={classes.backgroundUserdata}></div>
        <div className={classes.attachedImageBlock}>
        {/*@ts-ignore*/}
        <div  className={classes.userDataCross} onClick={props.close}>
        <CloseOutlined style={{fontSize : 30,color : 'rgba(132, 138, 134, 1)'}} /></div>
        <div className={classes.attachedoverflow}>
        {images}
        </div>
        <h4 className={classes.atachedTitle}>Signature</h4>
        <input type="text" className={classes.atachedInput} ref={input} onChange={change}/>
        <div className={classes.somediv}>
        <FileButton change={props.addImage} svg_color={'#3CA4C9'} />
        <h3 className={classes.attachedSend}
            onClick={() => props.addMessage({mode : 'attached'})}>Send</h3></div>
        </div>
    </div>)
}
type MessageItemProps= {
    message : string
    from : string
    key ?: number
    image : string | null
    getUserData : Function
    images : Array<any>
    id : number
    delete : Function
    current_user : string | null
    date : string | null
}
const MessageItem = function (props : MessageItemProps) {
    let isSrc = includeImage(props.image)
    const attached_elements = props.images?.map((item,index) =>
        includeImage(item)==base_avatar ? <></> : <Image width={'100%'}
       src={includeImage(item)} key={index} />)
    const message = props.message=='undefined' ? '' : props.message;
    const isVideo = checkVideoUrl(message)
    const isMyMessage = props.current_user == props.from
    return (
        <div className={!isMyMessage ? classes.itemMain : classes.itemMyMain}>
            {isVideo && <YouTube src={message} />}
            {attached_elements}
            <div className={classes.itemMainBlock}>
            <div className={classes.itemImageBlock}>
                {/*@ts-ignore*/}
                <img src={isSrc} alt="" onClick={props.getUserData} />
            </div>
            <div className={classes.itemTextBlock}>
                {/*@ts-ignore*/}
                <span className={classes.from} onClick={props.getUserData}>{props.from}</span>
                <h3 className={classes.itemDate}>{props.date}</h3>
                {isMyMessage &&
                <div className={classes.deleteBlock} onClick={() => props.delete(props.id)}>
                    <DeleteFilled style={{fontSize: 28,color : 'rgba(224, 122, 122, 1)'}}/>
                </div>}
                <p className={classes.message}>{isVideo ? <a href={message}>{message}</a> : message}</p>
            </div>
            </div>
        </div>
    )
}
const MessagesFormC = reduxForm({
    form: 'messages'
})(MessagesForm);

export default Messages