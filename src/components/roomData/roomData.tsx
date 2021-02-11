import {useDispatch, useSelector} from "react-redux";
import {StateType} from "../../store";
import {catchFile, iconStyle, includeImage, isNull, isWrong, сutWord } from "../../tools";
import classes from './roomData.module.css';
import {CloseOutlined, EditFilled, DownloadOutlined, UploadOutlined,ArrowLeftOutlined,
    FileImageOutlined } from '@ant-design/icons';
import unite from 'classnames';
import {Field,reduxForm} from "redux-form";
import React, {useState} from "react";
import {ChangeBackgroundTC, ChangeRoomDataTC, ChangeRoomImageTC, getRoomDataTC} from "../../reducers/messages_reducer";
import { UserData } from "../messages/messages";
import {Button} from "antd";
import { Image } from 'antd';
type ChangeRoomDatain = {
    mode : 'name' | 'desc'
    value : string
}
const getMessages = (messages : Array<any>) => {
    return [].concat(...messages.filter((item : any) => JSON.parse(item.attached_images).length>0)
        .map((item : any) => JSON.parse(item.attached_images)))
        .map((item : string) => <div className={classes.galleryImage}><Image
            width={200}
            src={includeImage(item)} style={{marginRight: 20}} /></div>)
}


const ShowRoom = function ({close,leave} : {close : Function,leave : Function}){
    const data = useSelector((state : StateType) => state.messages.room_data);
    const [form,setForm] = useState(null as null | number)
    const [ChangeImage,showChangeImage] = useState(false)
    const [current_user,selectUser] = useState(null as null | number)
    const [isGallery,openGallery] = useState(false)
    const dispatch = useDispatch();
    const messages = useSelector((state : StateType) => state.messages.messages);
    const submit = ({value,mode} : ChangeRoomDatain) => {
        const checker = mode=='name' ? data.room : data.description;

        if (isWrong(value) || value==checker || value.length<=2){
            return
        }
        dispatch(ChangeRoomDataTC({mode,value,old_room : data.room}))
        setForm(null)
        dispatch(getRoomDataTC({room : mode=='name' ? value : data.room}))
    }
    const changeImage = (file : any) => {
        dispatch(ChangeRoomImageTC({room : data.room,file : file}))
    }
    const setBackground = (file : any) => {
        dispatch(ChangeBackgroundTC({room : data.room,file : file}))
    }
    //@ts-ignore
    const users = data.users.map((item : UserType,index) => <UserItem user_name={item.user_name}
    description={item.description} image={item.image} select={() => selectUser(index)}
                                                                key={index} />)

    if (isGallery){
        return <Gallery close={() => openGallery(false)} items={getMessages(messages)}/>
    }
    return (
        <div className={classes.attachedMain}>
        <div className={classes.back}></div>
        <div className={classes.main}>
            {/*@ts-ignore*/}
            <div className={classes.cross} onClick={close}>
                <CloseOutlined style={iconStyle(30,'rgba(132, 138, 134, 1)')} />
            </div>
            <div className={classes.image} onMouseOver={() => showChangeImage(true)}
                 onMouseOut={() => showChangeImage(false)}>
                <img src={includeImage(data.image)}  />
                <div className={ChangeImage ? classes.changeImageBlock : classes.changeImageBlockHidden}>
                    <DownloadOutlined style={{fontSize : 100,color : 'white'}}/>
                </div>
                <div className={classes.fileBlock}><input type={'file'} onChange={catchFile(changeImage)}/>
                <input type={'file'} onChange={catchFile(changeImage)}/>
                <input type={'file'} onChange={catchFile(changeImage)}/>
                <input type={'file'} onChange={catchFile(changeImage)}/>
                <input type={'file'} onChange={catchFile(changeImage)}/>
                <input type={'file'} onChange={catchFile(changeImage)}/>
                <input type={'file'} onChange={catchFile(changeImage)}/>
                <input type={'file'} onChange={catchFile(changeImage)}/>
                <input type={'file'} onChange={catchFile(changeImage)}/>
                <input type={'file'} onChange={catchFile(changeImage)}/>
                <input type={'file'} onChange={catchFile(changeImage)}/>
                </div>
            </div>
            <div className={classes.block}>
            <h4 className={classes.miniTitle}>Room Name:</h4>
            <div className={classes.titleBlock}>
                {form!=0 && <h2 className={classes.title}>{data.room}</h2>}
                {/*@ts-ignore*/}
            {form==0 && <RoomDataNameFormC  onSubmit={(data) => submit({...data,mode : 'name'})}
                                            initialValues={{name : data.room}} />}
            <div className={classes.editWrapper}>
                <EditFilled style={iconStyle(30,'#7E99AC')}
                            onClick={() => setForm(0)}/></div>
            </div>

            <h4 className={classes.miniTitle}>Description:</h4>
            <div className={classes.titleBlock}>
                {form!=1 && <p className={unite(classes.title,classes.desc)}>
                    {сutWord(data.description,16)}</p>}
            {form==1 && <RoomDataDescFormC
                // @ts-ignore
                onSubmit={(data : {value : string}) => submit({...data,mode : 'desc'})} />}
                <div className={classes.editWrapper}>
                    <EditFilled style={iconStyle(30,'#7E99AC')}
                                onClick={() => setForm(1)}/></div>{/*@ts-ignore*/}
            </div>
            <div className={classes.galleryOpen} onClick={() => openGallery(true)}>
                <FileImageOutlined style={{color : '#949494',fontSize: 40,marginRight: 20}} />
                {getMessages(messages).length} images</div>
            <h4 className={classes.miniTitle}>Add Background:</h4>
            <div className={classes.backgroundBlock}>
                <Button style={{
                    height: '100%', width: '90%', margin: '0 auto', display: 'block', fontSize: 20,
                }}>
                    <UploadOutlined/> Add Background
                </Button>
                {/*@ts-ignore*/}
                <input onChange={catchFile(setBackground)} type={'file'} className={classes.inputFile}/>
                {/*@ts-ignore*/}
                <input onChange={catchFile(setBackground)} type={'file'} className={classes.anotherFile}/>
                {/*@ts-ignore*/}
                <input onChange={catchFile(setBackground)} type={'file'} className={classes.middleFile}/>
            </div>
            <h4 className={classes.miniTitle}>{users.length} Users:</h4>
            {users}
            {/*@ts-ignore*/}
            <h2 onClick={leave} className={classes.leave}>Leave room</h2>
            </div>
        </div>
            {current_user!=null && <UserData close={() => selectUser(null)}
                                             user_name={data.users[current_user].user_name}
                                             isUserData={true} />}</div>
    )
}
const Gallery = function({close,items} : {close : () => void,items : Array<any>}){
    return(
        <div className={classes.attachedMain}>
            <div className={classes.back}></div>
            <div className={classes.main}>
                <div className={classes.gallery_main}>
                <div className={classes.arrowleft}><ArrowLeftOutlined onClick={close} style={{fontSize: 50
                    ,color : 'rgba(128, 128, 128, 1)'}}/></div>
                <h2 className={classes.titlegallery}>Images:</h2>
                <div className={classes.gallery}>
                    {items}
                </div>
                </div>
            </div>
        </div>
    )
}



type UserType = {
    image : string | null,
    user_name : string | null,
    description : string | null
    select : Function
}

export const UserItem = function(props : UserType){
    return(
        //@ts-ignore
        <div className={classes.itemMain} onClick={props.select}>
            <div className={classes.itemImage}><img src={includeImage(props.image)} /></div>
            <div className={classes.itemBlock}>
            <h1 className={classes.item_user}>{сutWord(props.user_name,16)}</h1>
            <h1  className={classes.item_desc}>{сutWord(props.description,16)}</h1>
            </div>
        </div>
    )
}

const RoomDataNameForm = (props : any) => {
    return (<form onSubmit={props.handleSubmit}>
        <Field component={'input'} name={'value'}
               className={classes.input} placeholder={'Write room'} autoComplete={'off'} maxLength={'10'} />
    </form>)
}

const RoomDataNameFormC = reduxForm({
        form : 'room_data_name'
    })(RoomDataNameForm)

const RoomDataDescForm = (props : any) => {
    return (<form onSubmit={props.handleSubmit}>
        <Field component={'input'} name={'value'}
               className={classes.input} placeholder={'Write description'}
               autoComplete={'off'} maxLength={'40'}/>
    </form>)
}

const RoomDataDescFormC = reduxForm({
        form : 'room_data_desc'
    })(RoomDataDescForm)

export default ShowRoom