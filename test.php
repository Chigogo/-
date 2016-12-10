<?php
	$servername = "localhost:33060";
	$username = "root";
	$password = "dmdjzqz!";
	$dbname = "gjp_web";
	//$port = 33060;
	// $conn = new mysqli($servername, $username, $password, $dbname /*,$port*/);
	// if ($conn->connect_error) {
	// 	header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found");
 //    	die("Connection failed: " . $conn->connect_error);
	// } 

	// header("Content-Type: text/html"); 
	echo $_SERVER['HTTP_USER_AGENT'] . "\n\n";
	// $browser = get_browser(null, true);
	// print_r($browser);
	// echo "<br>".$_SERVER["SERVER_PROTOCOL"];
	// $sql = "describe product_info;";

	// $result = $conn->query($sql);
	// if($result->num_rows>0) {
	// 	// echo var_dump($result["num_rows"]);
	// 	// echo "<br>".$sql;
	// 	for ($result_items; $result_item = $result->fetch_assoc(); $result_items[]=$result_item);
	// 	echo json_encode($result_items, JSON_UNESCAPED_UNICODE);
	// }
	// else {			
	// 	header('Content-Type: text/html');
	// 	echo 0;
	// 	// echo $sql."<br>0 results or query failed.";
	// }
		
	// echo "hehe";
	// echo isset($_GET["query_invoice"]);
	// $conn->close();

?>