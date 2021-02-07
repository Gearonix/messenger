import {createRoom_tc as createRoom} from "../../reducers/login_reducer";
import {connect} from "react-redux";
import {Field, reduxForm} from "redux-form";
import {Input} from "../others/inputs/inputs";
import {NavLink, Redirect} from 'react-router-dom';
import {CreateRoomVal} from "../../validator";
import classes from './createRoom.module.css';

const CreateRoom = function (props){
    if (props.room){
        return <Redirect to={'/messages'} />
    }
    if (!props.user_name){
        return <Redirect to={'/'} />
    }
    function createRoom(data){
        let sum = {room : data.room, user_name : props.user_name};
        props.createRoom(sum);
        // debugger
    }
    return(
        <div>
            <h1 className={classes.title}>Give a name for your room:</h1>
            <CreateRoomFormC onSubmit={createRoom}/>
        </div>
    )
}
const CreateRoomForm = function (props){
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







let state = function(state){
    return{
        user_name : state.login.name,
        room : state.login.room
    }
}



export default connect(state,{createRoom})(CreateRoom);