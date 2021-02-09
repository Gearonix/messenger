import {createRoom_tc as createRoomTC} from "../../reducers/login_reducer";
import {connect, useDispatch, useSelector} from "react-redux";
import {Field, reduxForm} from "redux-form";
import {Input} from "../others/inputs/inputs";
import {NavLink, Redirect} from 'react-router-dom';
import {CreateRoomVal} from "../../validator";
import classes from './createRoom.module.css';
import {StateType} from "../../store";



type State = {
    user_name : string | null
    room : string | null,
}

const CreateRoom = function (){
    const dispatch = useDispatch()
    const state : State = {
        user_name : useSelector((state : StateType) => state.login.name),
        room : useSelector((state : StateType) => state.login.room),
    }

    if (state.room){
        return <Redirect to={'/messages'} />
    }
    if (!state.user_name){
        return <Redirect to={'/'} />
    }
    function createRoom(data : {room : string}){
        let sum = {room : data.room, user_name : state.user_name};
        dispatch(createRoomTC(sum));
    }
    return(
        <div>
            <h1 className={classes.title}>Give a name for your room:</h1>
            {/*@ts-ignore*/}
            <CreateRoomFormC onSubmit={createRoom}/>
        </div>
    )
}
const CreateRoomForm = function (props : any){
    return(
        <form onSubmit={props.handleSubmit}>
            <div className={classes.loginBlock}>
            <Field component={Input} placeholder={'Create room...'} name={'room'}
                   validate={CreateRoomVal} maxLength={'10'}
                   className={classes.input} autoComplete={'off'}/>
            <NavLink to={'/enterroom'} className={classes.back}>Back</NavLink>
            <button className={classes.button}>Create!</button>
            <span>{props.error}</span>
            </div>
        </form>
    )
}

const CreateRoomFormC = reduxForm({
    form : 'createroom'
})(CreateRoomForm);






export default CreateRoom;