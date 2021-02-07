import api from "../API";

const initial = {
    messages : [],
    room_data : [],
    online : 0
}

function messages_reducer(state=initial,action){
    switch (action.type){
        case 'ADD-MESSAGE':
            return {...state,messages : action.messages}
        case 'SET-MESSAGES':
            return {...state,messages: action.data}
        case 'UPDATE-ROOM-DATA':
            return {...state,room_data: action.data}
        case 'SET-ONLINE':
            return {...state,online : action.online}
        default:
            return state
    }
}
export let setOnlineAC = function(online){
    return{
        type : 'SET-ONLINE',
        online : online
    }
}

export let addMessageAC= function (data){
    return{
        type : 'ADD-MESSAGE',
        messages : data
    }
}

export let addMessageTC = function (data){
    return function(dispatch){
        api.addMessage_api(data).then((response) =>{
            // debugger;
            if (!response.data.code){
                dispatch(addMessageAC(response.data))
            }
            // debugger
        })
    }
}
export let getMessagesTC = function (data){
    return function(dispatch){
        api.getMessages_api(data).then((response) =>{
            // debugger;
            if (!response.data.code){
                // debugger;
                dispatch(setMessagesAC(response.data))
            }
        })
    }
}
export let exitRoomAC = function (){
    return{
        type : 'EXIT-ROOM'
    }
}

export let exitRoomTC = function (data){
    return function(dispatch){
        // debugger
        api.exitRoom_api(data).then((response)=>{
            // debugger;
            if (response.data.code==0){
                dispatch(exitRoomAC());
            }

        })
    }
}
export let setMessagesAC = function (data){
    return{
        type : 'SET-MESSAGES',
        data : data
    }
}
export let updateRoomDataAC = function (data){
    return{
        type : 'UPDATE-ROOM-DATA',
        data : data
    }
}

export let changeRoomDataTC = function (data){
    return function(dispatch){
        api.changeRoomData_api(data).then((response) =>{
            debugger
            dispatch(updateRoomDataAC(data))
        })
    }
}


export default messages_reducer