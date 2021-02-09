import api from "../API";
import {stopSubmit} from "redux-form";
import {loginType} from "../types";
import { ThunkAction } from "redux-thunk";
import { AxiosResponse } from "axios";
import {StateType} from "../store";

const initial : loginType ={
    name : null,
    password : null,
    room : null,
    logined : false,
    avatar : null,
    description : null,
    openChangeProfile : false,
    imageFile : null
}
type ActionTypes = loginAT | registerAT | enterRoomAT | {type : 'OPEN-CHANGE-PROFILE' } |
    {type : 'LOGOUT'} | oldImageAT |
    changeProfileAT | closeChangeProfileAT | addImageAT | {type : 'EXIT-ROOM'}
type ThunkType = ThunkAction<Promise<AxiosResponse<any> | any>, StateType, unknown, ActionTypes>
const login_reducer = function (state=initial,action : ActionTypes) : loginType{
    switch (action.type){
        case 'LOGIN':
            return {...state,name : action.name,password: action.password,room : action.room,
                logined : true,avatar: action.image,description: action.description}
        case 'REGISTER':
            return {...state,name : action.name,password: action.password, logined: true}
        case 'ENTER-ROOM':
            return {...state,room : action.room}
        case 'EXIT-ROOM':
            return {...state,room : null}
        case 'LOGOUT':
            return initial
        case 'CHANGE-PROFILE':
            return {...state, name: action.name,description:
                action.description,openChangeProfile : false,avatar:
                action.image}
        case 'OPEN-CHANGE-PROFILE':
            return {...state,openChangeProfile: true}
        case 'ADD-IMAGE':
            return {...state,imageFile: action.file}
        // case  'ADD-IMAGE-FINALLY':
        //     return {...state,avatar: action.src}
        case 'CLOSE-CHANGE-PROFILE':
            return {...state, openChangeProfile : false}
        case 'CHANGE-PROFILE-BUT-OLD-IMAGE':
            return {...state, name: action.name,description: action.description,openChangeProfile : false}
        default:
            return state
    }
}

type loginAT = {
    type : 'LOGIN'
    name : string | null
    password : string | null
    room : null | string
    image : null | string
    description : null | string
}

type loginATData  = {user_name : null | string, password : null | string,
    room : null | string,
    image : null | string,description : null | string}

export let mmloginAC = function (data : loginATData ) : loginAT{
    return{
        type : 'LOGIN',
        name : data.user_name,
        password: data.password,
        room : data.room,
        image : data.image,
        description: data.description
    }
}
type registerAT = {
    type : 'REGISTER'
    name : null | string
    password : null | string
}

export let registerAC = function (data : {name : null | string,password : null | string}) : registerAT{
    return{
        type : 'REGISTER',
        name : data.name,
        password: data.password
    }
}
type enterRoomAT = {
    type : 'ENTER-ROOM',
    room : string | null
}

export let enterRoomAC = function (room : string | null) : enterRoomAT{
    return{
        type : 'ENTER-ROOM',
        room : room
    }
}


export let openChangeProfileAC = function (): {type : 'OPEN-CHANGE-PROFILE' }{
    return{
        type : 'OPEN-CHANGE-PROFILE'
    }
}

export let loginTC = function (data : {name :  string, password :  string}) : ThunkType{
    return async function (dispatch){
        data.password = data.password.trim();
        data.name = data.name.trim();
        const response = await api.login_api(data)
        // debugger
        if (response.data.code!=0){
            let error = stopSubmit('login',{_error : response.data.message});
            dispatch(error);
            return
        }
        // const double_response = await api.setCookie(data.name);
        dispatch(loginAC(response.data.data));
    }
}

export let registerTC = function (data : {name :  string, password :  string}) : ThunkType{
    return async function(dispatch){
        data.password = data.password.trim();
        data.name = data.name.trim();
        const response = await api.register_api(data)
        if (response.data.code!=0){
            let error = stopSubmit('register',{_error : response.data.message})
            dispatch(error);
            return
        }
        dispatch(registerAC(data))
    }

}

export let enterRoomTC = function (data : { name: string | null
    room: string | null}) : ThunkType{
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



export let logoutAC = function () : {type : 'LOGOUT'}{
    return{
        type : 'LOGOUT'
    }
}
export let createRoom_tc = function (data : {
    room : string | null,
    user_name : string | null
}) : ThunkType{
    return async function(dispatch){
        const response = await api.createRoom_api(data)
        if (response.data.code!=0){
            let error = stopSubmit('createroom',{_error : response.data.message})
            dispatch(error);
            return
        }
        dispatch(enterRoomAC(data.room));
    }
}

type changeProfileAT = {
    type : 'CHANGE-PROFILE',
    name : string | null,
    description : string | null
    image : string | null
}
type changeProfileATData = {name : string | null, description : string | null
    ,src : string | null}
export let changeProfileAC = function(data : changeProfileATData) : changeProfileAT{
    return{
        type : 'CHANGE-PROFILE',
        name : data.name,
        description: data.description,
        image : data.src
    }
}

type oldImageAT = {
    type : 'CHANGE-PROFILE-BUT-OLD-IMAGE',
    name : string | null
    description : string | null
}

export let oldImageAC= function (data : {
    name : string | null
    description : string | null
}) : oldImageAT{
    return{
        type : 'CHANGE-PROFILE-BUT-OLD-IMAGE',
        name : data.name,
        description: data.description
    }
}
type changeProfileDataType = {
    description: string | null
    image: any
    name: string | null
    oldname: string | null
}
export let changeProfileTC = function (data : changeProfileDataType) : ThunkType{
    return async function(dispatch){
    const response = await api.changeProfile_api(data)
        if (response.data.code!=0){
            if (response.data.code==45){
            dispatch(oldImageAC(data));
            return
            }
            let error = stopSubmit('changeprofile',{_error : response.data.message})
            dispatch(error);
            return
        }
        const submit = {...data,src : response.data.src}
        dispatch(changeProfileAC(submit));
    }
}
export let getAuthTC = function() : ThunkType{
    return async function(dispatch){
        const response = await api.auth();
        console.log(response)
        if (response.data.code==0){
            dispatch(loginTC(response.data.data))
        }
    }
}

type addImageAT = {
    type : 'ADD-IMAGE',
    file : any
}

export let addImageAC =function (file : any) : addImageAT{
    return{
        type : 'ADD-IMAGE',
        file : file
    }
}
// type addImageFinnalyAT = {
//     type : 'ADD-IMAGE-FINALLY',
//     src : string | null
// }
//
// export let addImageFinnalyAC = function(src : string | null) : addImageFinnalyAT{
//     return{
//         type : 'ADD-IMAGE-FINALLY',
//         src : src
//     }
// }

type closeChangeProfileAT = {
    type : 'CLOSE-CHANGE-PROFILE'
}

export let closeChangeProfileAC = function () : closeChangeProfileAT{
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