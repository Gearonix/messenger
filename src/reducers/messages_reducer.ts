import api from "../API";
import {messagesType} from "../types";
import {ThunkAction} from "redux-thunk";
import {AxiosResponse} from "axios";
import {StateType} from "../store";

const initial : messagesType= {
    messages : [],
    room_data : [],
    online : 0
}

type ActionTypes =  {type : 'EXIT-ROOM'}  | setMessagesAT
function messages_reducer(state=initial,action : ActionTypes) : messagesType{
    switch (action.type){
        case 'SET-MESSAGES':
            return {...state,messages: action.data}
        case 'UPDATE-ROOM-DATA':
            return {...state,room_data: action.data}
        default:
            return state
    }
}
export let exitRoomAC = function () : {type : 'EXIT-ROOM'}{
    return{
        type : 'EXIT-ROOM'
    }
}
type setMessagesAT = {
    type : 'SET-MESSAGES' | 'UPDATE-ROOM-DATA',
    data : any
}
export let setMessagesAC = function (data : any) : setMessagesAT{
    return{
        type : 'SET-MESSAGES',
        data : data
    }
}


export default messages_reducer