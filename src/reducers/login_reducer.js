import api from "../API";
import {stopSubmit} from "redux-form";
const initial={
    name : null,
    password : null,
    room : null,
    logined : false,
    avatar : null,
    description : null,
    openChangeProfile : false,
    imageFile : null
}


const login_reducer = function (state=initial,action){
    switch (action.type){
        case 'LOGIN':
            // debugger;
            return {...state,name : action.name,password: action.password,room : action.room, logined : true,avatar: action.image,description: action.description}
        case 'REGISTER':
            return {...state,name : action.name,password: action.password, room : action.room, logined: true}
        case 'ENTER-ROOM':
            return {...state,room : action.room}
        case 'EXIT-ROOM':
            return {...state,room : null}
        case 'LOGOUT':
            return initial
        case 'CHANGE-PROFILE':
            // debugger;
            return {...state, name: action.name,description: action.description,openChangeProfile : false,avatar: action.image}
        case 'OPEN-CHANGE-PROFILE':
            return {...state,openChangeProfile: true}
        case 'ADD-IMAGE':
            return {...state,imageFile: action.file}
        case  'ADD-IMAGE-FINALLY':
            return {...state,avatar: action.src}
        case 'CLOSE-CHANGE-PROFILE':
            return {...state, openChangeProfile : false}
        case 'CHANGE-PROFILE-BUT-OLD-IMAGE':
            return {...state, name: action.name,description: action.description,openChangeProfile : false}
        default:
            return state
    }
}

export let loginAC = function (data){
    return{
        type : 'LOGIN',
        name : data.user_name,
        password: data.password,
        room : data.room,
        image : data.image,
        description: data.description
    }
}
export let registerAC = function (data){
    return{
        type : 'REGISTER',
        name : data.name,
        password: data.password
    }
}
export let enterRoomAC = function (room){
    return{
        type : 'ENTER-ROOM',
        room : room
    }
}
export let openChangeProfileAC = function (){
    return{
        type : 'OPEN-CHANGE-PROFILE'
    }
}

export let loginTC = function (data){
    return function (dispatch){
        // debugger;
        data.password = data.password.trim();
        data.name = data.name.trim();
        api.login_api(data).then((response) => {
            // console.log(response)
            // debugger
            if (response.data.code!=0){
                let error = stopSubmit('login',{_error : response.data.message});
                dispatch(error);
                return
                // debugger
            }

            dispatch(loginAC(response.data.data));
            // debugger
        })
    }
}

export let registerTC = function (data){
    return function(dispatch){
        data.password = data.password.trim();
        data.name = data.name.trim();
        api.register_api(data).then((response) =>{
            // debugger
            if (response.data.code!=0){
                let error = stopSubmit('register',{_error : response.data.message})
                dispatch(error);
                return
                // dispatch(registerAC(data))
            }
            dispatch(registerAC(data))
        })
    }

}

export let enterRoomTC = function (data){
    return async function(dispatch){
        const response = await api.enterRoom_api(data)
        if (response.data.code!=0){
            let error = stopSubmit('enterRoom',{_error : response.data.message})
            dispatch(error);
            return
        }
        dispatch(enterRoomAC(data.room))
    }
}



export let logoutAC = function (){
    return{
        type : 'LOGOUT'
    }
}
export let createRoom_tc = function (data){
    return function(dispatch){
        api.createRoom_api(data).then((response) =>{
            // debugger;
            // console.log(response.data)
            if (response.data.code!=0){
                let error = stopSubmit('createroom',{_error : response.data.message})
                dispatch(error);
                return
            }
            dispatch(enterRoomAC(data.room));

        })
    }
}

export let changeProfileAC = function(data){
    return{
        type : 'CHANGE-PROFILE',
        name : data.name,
        description: data.description,
        image : data.src
    }
}
export let oldImageAC= function (data){
    return{
        type : 'CHANGE-PROFILE-BUT-OLD-IMAGE',
        name : data.name,
        description: data.description
    }
}
export let changeProfileTC = function (data){
    return function(dispatch){
        api.changeProfile_api(data).then((response) =>{
            // debugger;
            if (response.data.code!=0){
                if (response.data.code==45){
                dispatch(oldImageAC(data));
                return
                }
                let error = stopSubmit('changeprofile',{_error : response.data.message})
                dispatch(error);
                return
            }
            // debugger;
            data = {...data,src : response.data.src}
            dispatch(changeProfileAC(data));
        })

    }
}



export let addImageAC =function (file){
    return{
        type : 'ADD-IMAGE',
        file : file
    }
}
export let addImageFinnalyAC = function(src){
    return{
        type : 'ADD-IMAGE-FINALLY',
        src : src
    }
}
export let closeChangeProfileAC = function (){
    return{
        type : 'CLOSE-CHANGE-PROFILE'
    }
}






// export let authTC = function (){
//     return function(dispatch){
//         api.auth_api().then((response) =>{
//             // debugger
//         })
//     }
// }





export default login_reducer;