// http://localhost:4001/enterrrom
const express = require('express');
const app = express()

const http = require('http').Server(app);
const io = require('socket.io')(http, {cors: {origin: "*"}})
const mysql = require('mysql');
let cors = require('cors');

app.use(cors())



const config = {
    host: 'localhost',
    user: 'root',
    database: 'messenger',
    password: 'password'
}
app.use(express.json())
const mysqli = mysql.createConnection(config);
async function checkRequest(request,func = () => {}){
    await mysqli.query(request,(err,response) => {
        if (err){
            console.log('CHECK_REQUEST_ERROR')
            return
        }
        func(response)
    })
}




io.on('connection', function (socket) {
    socket.on('get_messages',({room}) => {
        checkRequest(`select * from messages where room = '${room}';`,(messages) => {
            socket.emit('return_messages',messages);
        });
    })
    socket.on('add_message',({message,from,room,image}) => {
        checkRequest(`insert messages(message,sender,room,image)
         values('${message}','${from}','${room}','${image}');`, () => {
            checkRequest(`select * from messages where room = '${room}';`,(messages) => {
                console.log(room + "2")
                socket.to(room).emit('return_messages',messages)
            })
        });
    })
    socket.on('enter_room',({room}) => {
        socket.join(room)
    })
})
function checkError(err){
    if (err){
        console.log('error')
    }
}
function ok(array={'code' : 0,'status' : 200,'message' : 'ok'}){
    return array
}

app.post('/app_enter_room',(request,response) => {
    response.set('Content-type', 'application/json');
    const {room,name} = request.body;
    checkRequest(`select room from rooms where room = '${room}';`, (result) => {
        if (result?.length==0){
            response.json({'code' : 25,'status' : 404,'message' : 'The selected room does not exist'})
            return
        };
        checkRequest(`update users set room = '${room}' where user_name = '${name}';`,() => {
            response.json(ok())
        });
    });

})


io.on('connect_error', () => {
    console.log('error')
})
http.listen(8080, () => console.log('server started at post 8080'))