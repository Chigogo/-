<?php
	$servername = "localhost:33060";
	$username = "root";
	$password = "dmdjzqz!";
	$dbname = "gjp_web";
	//$port = 33060;
	$conn = new mysqli($servername, $username, $password, $dbname /*,$port*/);
	if ($conn->connect_error) {
		header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found");
    	die("Connection failed: " . $conn->connect_error);
	}

	$data = json_decode(file_get_contents('php://input'), true);
	// print_r($data);
	// print_r($data);
	// print_r($_GET);
	$id;
	$t;
	$sql;

	foreach ($data as $item_key => $item) {
		foreach ($item as $item_property => $item_value) {
			switch ($item_property) {
				case 'id': //检查id
					$id = $data[$item_key]["id"];
					if($id==0){//id为0 则新建
						switch ($_GET["table"]) {
							case 'people':
								$sql = "insert into ".$_GET["table"]."(id,full_name) values(null, '缺省');";
								break;
							case 'product_info':
								$sql = "insert into ".$_GET["table"]."(id,full_name,manufacturer,unit_1) values(null, '缺省', '缺省', '箱');";
								break;
							default:
								# code...
								break;
						}
						echo $sql;
						if($conn->query($sql)){
							$id = $conn->query("select last_insert_id()")->fetch_assoc()['last_insert_id()'];
							echo "operation success!\n";
						}
					}
					break;
				case 't': 
					$t = $item_value;
					if($t=="d"){
						$sql = "DELETE FROM ".$_GET["table"]." where id = ".$id.";";
						if($conn->query($sql)){
							echo $sql." operation success!\n";
							unset($id);
						}
						else echo $sql." operation failure!\n";
					}
					break;
				default:
					break;
			}
		}

		if($id){
			foreach ($item as $item_property => $item_value) {
				switch ($item_property) {
					case 'content': 
						foreach ($item_value as $key => $value) {
							$sql="update ".$_GET["table"]." set ".$key." = '".$value."' Where id='".$id."';";
							// echo $sql;
							if($conn->query($sql)){
								echo $sql." operation success!\n";
							}
							else echo $sql." operation failure!\n";
						}
						break;
					default:
						break;
				}
			}
		}

	}


	//end the connection
	$conn->close();
?>