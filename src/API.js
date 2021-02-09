import * as axios from 'axios';

// withCredentials
const instance = axios.create({
    withCredentials: true,
    baseURL : 'http://localhost:8080'
})

const API = {
    login_api(data){
        return instance.post('/login',data)
    },
    register_api(data){
        return instance.post('/register',data)
    },
    enterRoom_api(data){
        return instance.post('/app_enter_room',data)
    },
    createRoom_api(data){
        return instance.post('/createroom',data);
    },
    changeProfile_api(data){
        // debugger;
        let some_file = new FormData()
        some_file.append('image',data.image);
        some_file.append('json',JSON.stringify(data));
        return axios.post('http://localhost:4001/changeprofile', some_file);
    },
    auth(){
        return instance.get('/auth');
    },
    // setCookie(user_name){
    //     return instance.post('/setcookie', {user_name : user_name});
    // }
}

export default API;