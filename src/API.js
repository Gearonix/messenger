import * as axios from 'axios';

// withCredentials


const API = {
    login_api(data){
        return axios.post('http://localhost:4001/login',data)
    },
    register_api(data){
        return axios.post('http://localhost:4001/register',data)
    },
    enterRoom_api(data){
        return axios.post('http://localhost:8080/app_enter_room',data)
    },
    // auth_api(){
    //     return axios.get('http://localhost:4001/auth',{withCredentials : true})
    // }
    addMessage_api(data){
        // debugger;
        return axios.post('http://localhost:4001/messages',data)
    },
    getMessages_api(data){
        // debugger
        return axios.post('http://localhost:4001/getmessages',data);
    },
    exitRoom_api(data){
        return axios.post('http://localhost:4001/exitroom',data);
    },
    createRoom_api(data){
        // debugger;
        return axios.post('http://localhost:4001/createroom',data);
    },
    // changeProfile_api(data){
    //     let some_file = new FormData()
    //     some_file.append('image',data.image);
    //     return axios.post('http://localhost:4001/changeprofile', data);
    // },
    changeProfile_api(data){
        // debugger;
        let some_file = new FormData()
        some_file.append('image',data.image);
        some_file.append('json',JSON.stringify(data));
        return axios.post('http://localhost:4001/changeprofile', some_file);
    },
    changeRoomData_api(data){
        return axios.post('http://localhost:4001/changeroomdata', data);
    }


}

export default API;