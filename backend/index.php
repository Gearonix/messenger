<?php


// header('Content-type: application/json');
// header('Access-Control-Allow-Origin: http://localhost:3000');
// header('Access-Control-Allow-Headers: http://localhost:3000');
// header(' Access-Control-Allow-Credentials: true');

header('Content-type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Credentials: true');

$path =  $_SERVER['REQUEST_URI'];

$method = $_SERVER['REQUEST_METHOD'];

$data = json_decode(file_get_contents('php://input'), true);

$params = explode('/',$path);


include 'functions.php';
// if ($method=='GET'){
// 	switch ($params[1]) {
// 		case 'getmessages':
// 		// echo 'hello';
// 			getMessages($data);
// 		default:
// 			# code...
// 			break;
// 	}
// 	// echo 'hello';
// }
$GLOBALDATA=[];
if ($method=='POST'){
	switch ($params[1]) {
		case 'register':
			register($data);
			break;
		case 'login':
			 login($data);
			 break;
		case 'enterrrom':
			enterRoom($data);
			break;
		case 'messages':
			addMessage($data);
			break;
		case 'getmessages':
// 		// echo 'hello';
			getMessages($data);
			break;
		case 'exitroom':
			exitRoom($data);
			break;
		case 'createroom':
			createRoom($data);
			break;
	    case 'changeprofile':
	   		 header('Content-Type: form/multipart');
	    	$data = json_decode($_POST['json'],true);
	    	changeProfile($data);
			$name =  $_FILES['image']['name'];
			$tmp_name =  $_FILES['image']['tmp_name'];
			loadImage($name,$tmp_name,$data); 
			break;
		case 'changeroomdata':
			changeRoomData($data);
			break;
		case 'setattachedimages':
		 	header('Content-Type: form/multipart');
	    	$data = json_decode($_POST['json'],true);
			$name =  $_FILES['image']['name'];
			$tmp_name =  $_FILES['image']['tmp_name'];
			setAttachedImages($name,$tmp_name,$data); 
			break;
		case 'changeroomimage':
			header('Content-Type: form/multipart');
	    	$data = json_decode($_POST['json'],true);
			$name =  $_FILES['image']['name'];
			$tmp_name =  $_FILES['image']['tmp_name'];
			changeRoomImage($name,$tmp_name,$data); 
			break;
		case 'changebackground':
			header('Content-Type: form/multipart');
	    	$data = json_decode($_POST['json'],true);
			$name =  $_FILES['image']['name'];
			$tmp_name =  $_FILES['image']['tmp_name'];
			changeBackground($name,$tmp_name,$data); 
			break;
}


	// if ($params[1]=='register'){
	// 	// echo 'HELLO WRODL';
	// 	register($data);
	// }
	// if ($params[1]=='login'){
	// 	 login($data);
	// }
	// if ($params[1]=='enterrrom'){
		
	// }
}








?>