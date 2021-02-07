
<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Credentials: true');

$host = 'localhost';
$user = 'root';
$password = 'password';
$database = 'messenger';

$mysqli = new mysqli($host,$user,$password,$database);

if (!$mysqli){
	$result = ['code' => 10,'status' => 500,'message' => 'Request Error'];
	exit();
}

//HELPERS
function ok($response=['code' => 0,'status' => 200,'message' => 'ok']){
	echo json_encode($response);
}

function checkRequest($request){
	global $mysqli;
	$error = ['code' => 10,'status' => 500,'message' => 'Request Error'];
	$result = $mysqli->query($request);
	if (!$result){
		echo json_encode($error);
		exit();
	}
	return $result;
}
function throwError($bool,$array){
	if ($bool){
		echo json_encode($array);
		exit();
	}
}



function register($data){
	extract($data);
	$result = checkRequest("select user_name from users where user_name='$name';");
	throwError($result->num_rows>0,['code' => 15,'message' => 'This name already exists']);
	$result = checkRequest("insert users(user_name,password) values('$name','$password')");
	ok();
}
function read($result){
	$list=[];
	for ($i=0; $i < $result->num_rows; $i++) { 
		$result->data_seek($i);
		$string = $result->fetch_assoc();
		$list[] = $string;
	}
	return $list;
}
function login($data){
	extract($data);
	$result = checkRequest("select * from users where user_name='$name';");
	throwError($result->num_rows==0,['code' => 15,'message' => 'You not registred']);
	$result->data_seek(0);
	$result_array = $result->fetch_assoc();
	throwError($result_array['password']!=$password,['code' => 20,'message' => 'Wrong password']);
	ok(['code' => 0,'status' => 200,'message' => 'ok','data' => $result_array]);
}
function enterRoom($data){
	extract($data);
	$result = checkRequest("select room from rooms where room = '$room';");	
	throwError($result->num_rows==0,['code' => 25,'status' => 404,'message' => 'The selected room does not exist']);
	checkRequest("update users set room = '$room' where user_name = '$name';");
	ok();
}
function addMessage($data){
	extract($data);
	checkRequest("insert messages(message,sender,room,image) values('$message','$from','$room','$image');");
	$result = checkRequest("select * from messages where room = '$room';");
	echo json_encode(read($result));
}


function getMessages($data){
	extract($data);
	$result = checkRequest("select * from messages where room = '$room';");
	$roomData = checkRequest("select * from rooms where room='$room';");
	$roomData->data_seek(0);
	echo json_encode(['messages' => read($result),'room_data' => $roomData->fetch_assoc()]);
}

function exitRoom($data){
	checkRequest("update users set room=NULL where user_name='$data[name]';");
	ok();
}
function createRoom($data){
	extract($data);
	$result = checkRequest("select * from rooms where room='$room';");
	throwError($result->num_rows>0,['code' => 35,'status' => 200,'message' => 'The name of the room already exists']);
	checkRequest("insert rooms(room) values('$room');");
	checkRequest("update users set room='$room' where user_name='$user_name';");
	ok();
}
function changeProfile($data){
	extract($data);
	$result = checkRequest("select * from users where user_name='$name';");
	throwError($reuslt->num_rows>0,['code' => 15,'message' => 'This name already exists']);
	checkRequest("update users set user_name='$name', description='$description' where user_name = '$oldname';");
	checkRequest("update messages set sender='$name' where sender = '$oldname';");
}
function loadImage($name,$tmp_name,$data){
	$user_name = $data['name'];
	throwError(!$name,['code' => 45,'status' => 200,'message' => 'old image']);
	$result = move_uploaded_file($tmp_name, "images/$name");
	throwError(!$result,['code' => 10,'status' => 500,'message' => 'Request Error']);
	checkRequest("update users set image='images/$name' where user_name='$user_name';");
	checkRequest("update messages set image='images/$name' where sender='$user_name';");
	ok(['code' => 0,'status' => 200,'message' => 'ok','src' => "images/$name"]);
}
function changeRoomData($data){
	extract($data);
	checkRequest("update rooms set room='$room',description='$description' where room='$name';");
	checkRequest("update messages set room='$room' where room='$name';");
	checkRequest("update users set room='$room' where room='$name';");
	// ok();
	echo json_encode("update rooms set room='$room',description='$description' where room='$name';");
}
?>