export type loginType = {
    name : null | string
    password : null | string
    room : null | string
    logined : boolean
    avatar : null | string
    description : null | string
    openChangeProfile : boolean
    imageFile : null | string
}
export type messagesType = {
    messages : Array<any>,
    room_data : Array<any>,
    online : number
}
