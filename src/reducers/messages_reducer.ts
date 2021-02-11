import api from "../API";
import {messagesType} from "../types";
import {ThunkAction} from "redux-thunk";
import {AxiosResponse} from "axios";
import {StateType} from "../store";

const initial: messagesType = {
    messages: [],
    room_data: {
        description: null,
        image: null,
        room: null,
        users: [],
        background : null
    },
    count: 4,
}

type ActionTypes = { type: 'EXIT-ROOM' } | setMessagesAT | setRoomDataAT

type ThunkType = ThunkAction<Promise<AxiosResponse<any> | any>, StateType, unknown, ActionTypes>

function messages_reducer(state = initial, action: ActionTypes): messagesType {
    switch (action.type) {
        case 'SET-MESSAGES':
            return {...state, messages: action.data, count: state.count + 2}
        case 'UPDATE-ROOM-DATA':
            return {...state, room_data: action.data}
        case 'SET-ROOM-DATA':
            return {...state, room_data: action.data}
        default:
            return state
    }
}

export let exitRoomAC = function (): { type: 'EXIT-ROOM' } {
    return {
        type: 'EXIT-ROOM'
    }
}
type setMessagesAT = {
    type: 'SET-MESSAGES' | 'UPDATE-ROOM-DATA',
    data: any
}
export let setMessagesAC = function (data: any): setMessagesAT {
    return {
        type: 'SET-MESSAGES',
        data: data
    }
}
export const getRoomDataTC = function (data: { room: string | null }): ThunkType {
    return async function (dispatch) {
        const response = await api.getRoomData(data)
        console.log(response.data)
        dispatch(setRoomDataAC(response.data))
    }
}
type usersArray = Array<{
        image: string | null, user_name: string | null,
        description: string | null
    }>
    | []

type setRoomDataIn = {
    description: string | null
    image: string | null
    room: string
    users: usersArray
    background : string | null
}

type setRoomDataAT = {
    type: 'SET-ROOM-DATA',
    data: setRoomDataIn
}
export const setRoomDataAC = function (data: setRoomDataIn): setRoomDataAT {
    return {
        type: 'SET-ROOM-DATA',
        data: data
    }
}
type ChangeRoomDatain = {
    mode: 'name' | 'desc'
    value: string
    old_room: string | null
}

export const ChangeRoomDataTC = (data: ChangeRoomDatain): ThunkType => {
    return async function (dispatch) {
        await api.changeRoomData(data);
    }
}
export const ChangeRoomImageTC = (data: { room: string | null, file: any }): ThunkType => {
    return async function (dispatch) {
        await api.changeRoomImage(data);
    }
}

export const ChangeBackgroundTC = (data: { room: string | null, file: any }): ThunkType => {
    return async function (dispatch) {
        await api.changeBackground(data);
    }
}
export default messages_reducer