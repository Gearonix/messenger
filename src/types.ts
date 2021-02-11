export type loginType = {
    name: null | string
    password: null | string
    room: null | string
    logined: boolean
    avatar: null | string
    description: null | string
    openChangeProfile: boolean
    imageFile: null | string,
    currentUser: {
        description: string | null,
        user_name: string | null,
        image: string | null
    }
    rooms : Array<any>
}
export type messagesType = {
    messages: Array<any>,
    room_data: {
        description: string | null
        image: string | null
        room: string | null
        background: string | null
        users: Array<{ image: string | null,
                user_name: string | null,
                description: string | null }> | []
    },
    count: number
}
