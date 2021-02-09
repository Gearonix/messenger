// http://localhost:4001/enterrrom
const express = require('express');
const app = express()

const http = require('http').Server(app);
const io = require('socket.io')(http, {cors: {credentials: true,origin: "http://localhost:3000"}})
const mysql = require('mysql');
let cors = require('cors');
const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(express.json())

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials : true
}
app.use(cors(corsOptions))


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
                socket.to(room).emit('return_messages',messages)
            })
        });
    })
    socket.on('enter_room',({room}) => {
        socket.join(room)
    })
    socket.on('leave_room',({room,name}) => {
        checkRequest(`update users set room=NULL where user_name='${name}';`);
        socket.leave(room)
    })
})

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



app.post('/login',(request,response) => {
    const {name,password} = request.body
    response.cookie('username', name)
    response.cookie('password', password)
    checkRequest(`select * from users where user_name='${name}';`,(result) => {
        if (result?.length==0){
            response.json({'code' : 15,'message' : 'You not registred'})
            return
        }
        if (result[0].password!=password){
            response.json({'code' : 20,'message' : 'Wrong password'})
            return
        }
        response.json({'code' : 0,'message' : 'OK','status' : 200,'data' : result[0]})
    })
})

app.post('/register',(request,response) => {
    const {name,password} = request.body
    response.cookie('username', name)
    response.cookie('password', password)
    checkRequest(`select user_name from users where user_name='${name}';`,(result) => {
        if (result?.length>0){
            response.json({'code' : 15,'message' : 'This name already exists'})
            return
        }
        checkRequest(`insert users(user_name,password) values('${name}','${password}')`);
        response.json(ok())
    });
})

app.post('/createroom',(request,response) => {
    const {room,user_name} = request.body
    checkRequest(`select * from rooms where room='${room}';`,(result) => {
        if (result?.length>0){
            response.json({'code' : 35,'status' : 200,
                'message' : 'The name of the room already exists'})
            return
        }
        checkRequest(`insert rooms(room) values('${room}');`);
        checkRequest(`update users set room='$room' where user_name='${user_name}';`);
        response.json(ok())
    });
})


app.get('/auth', (req, res) => {
    const {username,password} = req.cookies;
    const ok_json = {'code' : 0,'status' : 200, data : {name : username,password},message : 'OK'};
    if (username && password) {
        res.json(ok_json);
        return
    }
    res.json({'code' : 10,'status' : 404, message : 'No cookie found'});
})




io.on('connect_error', () => {
    console.log('error')
})
http.listen(8080, () => console.log('server started at post 8080'))