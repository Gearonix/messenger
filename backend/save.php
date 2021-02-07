
<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Credentials: true');
header('--allow-file-access-from-files');


$host = 'localhost';
$user = 'root';
$password = 'A&ud9D?xf_jM';
$database = 'messenger';

$mysqli = new mysqli($host,$user,$password,$database);

if (!$mysqli){
	$result = ['code' => 10,'status' => 500,'message' => 'request error'];
	exit();
}


//code 15 - register error;
//code 10 - server(request) error;
//code 0 - OK;
//code 20 - login error(wrong password);
//code 25 - no room error;
//code 30 - cookie error;
//code 35 - create room error
function register($data){
	global $mysqli;
	$name = $data['name'];
	$password = $data['password'];
	$error = ['code' => 10,'status' => 500,'message' => 'request error'];
	$request = "select user_name from users where user_name='$name';";
	$result = $mysqli->query($request);

	//!WARNING
	if (!$result){
		echo json_encode($error);
	}
	//!WARNING
	$rows = $result->num_rows;
	if ($rows>0){
		$throw_error = ['code' => 15,'message' => 'This name already exists'];
		echo json_encode($throw_error);
		exit();
	}

	$request = "insert users(user_name,password) values('$name','$password')";
	$result = $mysqli->query($request);
	if (!$result){
		echo json_encode($error);
		exit();
	}
	$response = ['code' => 0,'status' => 200,'message' => 'ok'];
	echo json_encode($response);
}

function checkRequest($request){
	global $mysqli;
	$error = ['code' => 10,'status' => 500,'message' => 'request error'];
	$result = $mysqli->query($request);
	if (!$result){
		return json_encode($error);
	}
	return $result;
}

function login($data){
	global $mysqli;
	$error = ['code' => 10,'status' => 500,'message' => 'request error'];
	$name = $data['name'];
	$password = $data['password'];
	$request = "select * from users where user_name='$name';";
	$result = $mysqli->query($request);
	if (!$result){
		echo json_encode($error);
	}
	$rows = $result->num_rows;
	if ($rows==0){
		$throw_error = ['code' => 15,'message' => 'You not registred'];
		echo json_encode($throw_error);
		exit();
	}
	$result->data_seek(0);
	$result_array = $result->fetch_assoc();
	// echo json_encode($result_array);
	// echo $password;
	// exit();
	// echo $value;
	if ($result_array['password']!=$password){
		$throw_error = ['code' => 20,'message' => 'Wrong password'];
		echo json_encode($throw_error);
		exit();
	}
	// $request = "select * from users where user_name = '$name';";
	// $result = $mysqli->query($request);
	$response = ['code' => 0,'status' => 200,'message' => 'ok','data' => $result_array];
	echo json_encode($response);
}
function enterRoom($data){
	global $mysqli;
	$error = ['code' => 10,'status' => 500,'message' => 'request error'];
	$room = $data['room'];
	$name = $data['name'];
	$request = "select room from rooms where room = '$room';";
	$result = $mysqli->query($request);
	if (!$result){
		echo json_encode($error);
		exit();
	}
	$rows = $result->num_rows;
	if ($rows==0){
		$response = ['code' => 25,'status' => 404,'message' => 'The selected room does not exist'];
		echo json_encode($response);
		exit();
	}
	$request = "update users set room = '$room' where user_name = '$name';";
	$result = $mysqli->query($request);
	if (!$result){
		echo json_encode($error);
		exit();
	};

	$response = ['code' => 0,'status' => 200,'message' => 'ok'];
	echo json_encode($response);
}
function addMessage($data){
	global $mysqli;
	$error = ['code' => 10,'status' => 500,'message' => 'request error'];
	$message = $data['message'];
	$from = $data['from'];
	$room = $data['room'];
	$request = "insert messages(message,sender,room) values('$message','$from','$room');";
	$result = $mysqli->query($request);
	if (!$result){
		echo json_encode($error);
		exit();
	}
	$request = "select * from messages where room = '$room';";
	$result = $mysqli->query($request);
	if (!$result){
		echo json_encode($error);
		exit();
	}
	$rows = $result->num_rows;
	for ($i=0; $i < $rows ; $i++) { 
		$result->data_seek($i);
		$string = $result->fetch_assoc();
		$list[] = $string;
	}
	echo json_encode($list);
}

function getMessages($data){
	global $mysqli;
	$error = ['code' => 10,'status' => 500,'message' => 'request error'];

	$room=$data['room'];
	$name = $data['name'];

	$request = "select * from messages where room = '$room';";
	$result = $mysqli->query($request);
	if (!$result){
		echo json_encode($error);
		exit();
	}
	$list = [];
	$rows = $result->num_rows;
	for ($i=0; $i < $rows ; $i++) { 
		$result->data_seek($i);
		$string = $result->fetch_assoc();
		$list[] = $string;
	}
	echo json_encode($list);
}
function exitRoom($data){
	global $mysqli;
	$error = ['code' => 10,'status' => 500,'message' => 'request error'];
	$name = $data['name'];
	$request = "update users set room=NULL where user_name='$name';";
	$result = $mysqli->query($request);
	if (!$result){
		echo json_encode($error);
		exit();
	}
	$response = ['code' => 0,'status' => 200,'message' => 'ok'];
	echo json_encode($response);
}
function createRoom($data){
	global $mysqli;
	$error = ['code' => 10,'status' => 500,'message' => 'request error'];
	$room = $data['room'];
	$name = $data['user_name'];
	$request = "select * from rooms where room='$room';";
	// echo $request;
	$result = $mysqli->query($request);
	if (!$result){
		echo json_encode($error);
		exit();
	}
	$rows = $result->num_rows;
	// echo $rows;
	if ($rows>0){
		$response = ['code' => 35,'status' => 200,'message' => 'The name of the room already exists'];
		echo json_encode($response);
		exit();
	}
	 // update users set room='test' where user_name='test';
	$request = "insert rooms(room) values('$room');";
	$result = $mysqli->query($request);
	if (!$result){
		echo json_encode($error);
		exit();
	}

	$request = "update users set room='$room' where user_name='$name';";
	$result = $mysqli->query($request);
	if (!$result){
		echo json_encode($error);
		exit();
	}

	$response = ['code' => 0,'status' => 200,'message' => 'ok'];
	echo json_encode($response);
}
function changeProfile($data){
	global $mysqli;
	$error = ['code' => 10,'status' => 500,'message' => 'request error'];
	$name = $data['name'];
	$description = $data['description'];
	$oldName = $data['oldname'];
	$image = $data['image'];
	 // select * from users where user_name='test';
	$request = " select * from users where user_name='$name';";
	// echo $request;
	$result = $mysqli->query($request);
	if (!$result){
		echo json_encode($error);
		exit();
	}
	$rows = $result->num_rows;
	if ($rows>0){
		$response = ['code' => 15,'message' => 'This name already exists'];
		echo json_encode($response);
		exit();
	}
	// $image = substr($image, 0,10);
	$request = " update users set user_name='$name', description='$description' where user_name = '$oldName';";
	// echo $request;
	$result = $mysqli->query($request);
	if (!$result){
		echo json_encode($error);
		exit();
	}
	// echo $request;
}
function loadImage($name,$tmp_name,$data){
	 global $mysqli;
	 $error = ['code' => 10,'status' => 500,'message' => 'request error'];
	 $src = "images/$name";
	 $user_name = $data['name'];
	 $result = move_uploaded_file($tmp_name, $src);
	 if (!$result){
		echo json_encode($error);
		exit();
	}
	$request = "update users set image='$src' where user_name='$user_name';";
	$result = $mysqli->query($request);
	if (!$result){
		echo json_encode($error);
		exit();
	}
	$response = ['code' => 0,'status' => 200,'message' => 'ok','src' => $src];
	echo json_encode($response);
}




// function auth(){
// 	echo $_COOKIE['user_name'];
// 	echo $_COOKIE['password'];

// 	if (isset($_COOKIE['user_name'])){
// 		$response = ['user_name' => $_COOKIE['user_name'],'password' => $_COOKIE['password'],'room' => $_COOKIE['room']];
// 	}
// 	else{
// 		$response = ['code' => 30,'status' => 200,'message' => 'No cookie'];
// 	}
// 	// echo 'hello world';
// 	echo json_encode($response);
// }



?>