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
	if($_GET["type"] == "basic_information_build"){
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
	}
	if($_GET["type"] == "save_invoice"){
		if($data["document_status"]=="草稿"){
			$sql = "delete from transaction_documents_content where transaction_document_id=".$data["id"];
			if($conn->query($sql)){
				echo $sql."operation success!\n";
			}else{
				echo $sql."operation failure!\n";
			}
		}
		if($data["document_status"]=="完成"){
			$sql = "select * from transaction_documents_description where id = ".$data["id"];
			if($conn->query($sql)){
				$document_status = $conn->query($sql)->fetch_assoc()["document_status"];
				echo $sql." document_status is ".$document_status." operation success!\n";
				if($document_status == "草稿"){
					$sql = "delete from transaction_documents_content where transaction_document_id=".$data["id"];
					if($conn->query($sql)){
						echo $sql."operation success!\n";
					}else{
						echo $sql."operation failure!\n";
					}
				}
			}else{
				echo $sql."operation failure!\n";
			}
		}

		$sql = "update transaction_documents_description set ".
		" trading_object"."=". $data["trading_object"][0].
		", store_house"."=". $data["store_house"][0].
		", money_received"."=". $data["money_received"].
		", comment"."="."'" .$data["comment"]."'".
		", document_status"."="."'" .$data["document_status"]."'".
		" where id = ".$data["id"];

		//写入单据描述部分
		if($conn->query($sql)){
			echo $sql."operation success!\n";
		}else{
			echo $sql."operation failure!\n";
		}

		foreach ($data["document_content_array"] as $product_key => $product) {
			$sql = "insert into transaction_documents_content (".
				" transaction_document_id,".
				" product_id,".
				" amount,".
				" unit,".
				" price,".
				" item_income,".
				" comment".
				")".
				" values(".
				$data["id"].
				", ". $product["product_id"].
				", ". $product["amount"].
				", ". "'". $product["unit"]."'".
				", ". $product["price"].
				", ". $product["item_money_received"].
				", ". "'".$product["comment_for_item"]."'".
				")"
			;
			if($conn->query($sql)){
				echo $sql."operation success!\n";
			}else{
				echo $sql."operation failure!\n";
			}
		}

		//价格更新
		if($data["document_status"]=="完成"){
			foreach ($data["document_content_array"] as $product_key => $product) {
				//检查是否有原来的价格
				$sql = "select * from specific_price_specific_person where people_id=".$data["trading_object"][0]." and product_id=".$product["product_id"];
				if($result = $conn->query($sql)){
					echo $sql; echo 156;
					$original_price = $result->fetch_assoc()["price_base_on_unit_1"];
				}else{
					$original_price = 0;
				}
				$current_unit = $product["unit"];
				$current_unit_pointer = str_replace("unit_","",$current_unit); 
				$price = $product["price"];
				for (; $current_unit_pointer >1 ; $current_unit_pointer--) {
					$price = $price*$product["units_factor"][$current_unit_pointer][2];
				}
				if($original_price!=$price){
					echo $product["full_name"]."for".$data["trading_object"][1]." is ".$original_price."(基于单位1)\n";
	
					$sql = "update specific_price_specific_person set ".
						   "transaction_document_id=".$data["id"].
						   ", price_base_on_unit_1 = ".$price." where people_id=".$data["trading_object"][0]." and product_id=".$product["product_id"];
					if($conn->query($sql)){
						echo $product["full_name"]."for".$data["trading_object"][1]." is ".$price." now (基于单位1)\n";
					}else{
						echo $sql."operation failure!\n";
					}
				}
			}
		}
		
	}


	//end the connection
	$conn->close();
?>