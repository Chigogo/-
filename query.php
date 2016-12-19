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

	//查询或者创建一个invoice
		//如果c_new_i标记存在，则创建新发票，并返回发票id
			//新建记录，则返回新纪录的id以及description
		//否则还需返回丰富的description
	if (isset($_GET["query_invoice"])){
		if (isset($_GET["c_new_i"])){
			header('Content-Type: application/json');
			$sql = 
				"insert into 
				transaction_documents_description(id,doc_type,trading_object,store_house) 
				values(null,'".$_GET["doc_type"]."',1,1)";

			if($conn->query($sql)){
				$id = $conn->query("select last_insert_id()")->fetch_assoc()['last_insert_id()'];
				// print_r($conn->query("select last_insert_id() from transaction_documents_description where id = '".$last_id."'"));
			}

			else echo "0 results";
		}else{
			$id = $_GET["invoice_id"];//假设是历史单据或者草稿，则根据id查出单据结果
			$invoice_content = $conn->query("select * from transaction_documents_content where transaction_document_id = ".$id.";");
			// print_r($invoice_content);
			if($invoice_content->num_rows>0) {
			// echo var_dump($invoice_content["num_rows"]);
			// echo "<br>".$sql;
				for ($invoice_content_items; $invoice_content_item = $invoice_content->fetch_assoc(); $invoice_content_items[]=$invoice_content_item);

				foreach ($invoice_content_items as $item_key=>$item) {
					$item_id = $item["product_id"];

					$item_detailed = $conn->query(
						"select manufacturer, full_name, unit_1, unit_2, unit_2_factor, unit_3, unit_3_factor from product_info where id = ".$item_id.";"
						)->fetch_assoc(); 
					// print_r($item_detailed);

					$invoice_content_items[$item_key]["units_factor"] = [];
					$invoice_content_items[$item_key]["units_factor"][] = $invoice_content_items[$item_key]["unit"];
					$invoice_content_items[$item_key]["units_factor"][] =["unit_1", $item_detailed["unit_1"]?$item_detailed["unit_1"]:"缺省", 1];
					if($item_detailed["unit_2"]!=null && $item_detailed["unit_2_factor"]!=null) {
						$invoice_content_items[$item_key]["units_factor"][] = ["unit_2", $item_detailed["unit_2"], $item_detailed["unit_2_factor"]];
						unset($item_detailed["unit_2"]);
						unset($item_detailed["unit_2_factor"]);
					
						if($item_detailed["unit_3"]!=null && $item_detailed["unit_3_factor"]!=null) {
							$item["units_factor"][] = ["unit_3", $item_detailed["unit_3"], $item_detailed["unit_3_factor"]];
							unset($item_detailed["unit_3"]);
							unset($item_detailed["unit_3_factor"]);
						}
					}
					foreach ($item_detailed as $item_detailed_property_key => $item_detailed_propeerty) {
						$invoice_content_items[$item_key][$item_detailed_property_key] = $item_detailed_propeerty;//把详细信息写入item
					}

					$invoice_content_items[$item_key]["price"] = $item["amount"] != 0?$item["item_money_received"]*100/$item["amount"]/100:0;
				}
			}
			// print_r($invoice_content_items);
		}

		$invoice = $conn->query("select * from transaction_documents_description where id = '".$id."'")->fetch_assoc();
		$invoice["document_content_array"] = isset($invoice_content_items)?$invoice_content_items:[];

		$trading_object_full_name = $conn->query("select full_name from people where id = '".$invoice["trading_object"]."'")->fetch_assoc()["full_name"];
		$invoice["trading_object"] = [
			$invoice["trading_object"],
			$trading_object_full_name?$trading_object_full_name:""
			];

		$store_house_name = $conn->query("select name from store_house where id = '".$invoice["store_house"]."'")->fetch_assoc()["name"];
		$invoice["store_house"] = [
			$invoice["store_house"],
			$store_house_name?$store_house_name:"仓库1"
			];

		echo json_encode($invoice, JSON_UNESCAPED_UNICODE);
	}

	//如果query_single标记存在，则试图返回查询结果
	if (isset($_GET["query_single"])){

		header('Content-Type: text/plain');
		$sql = "select ".$_GET["q_name"]." from ".$_GET["q_table"]." where ".$_GET["q_condition"];

		//如果有返回结果，则返回，否则报错
		if($result = $conn->query($sql)) {
			$result = $result->fetch_assoc();
			echo $result[$_GET["q_name"]];
		}
		else echo 0;
	}

	//如果query_multiple标记存在，则试图返回查询结果，JSON对象
	if (isset($_GET["query_multiple"])){
		header('Content-Type: application/json');
		if(!isset($_GET["q_condition"]))
			$q_condition = "";
		else{
			foreach ($_GET as $key => $value) {
				$column = preg_replace('/c_(\d)_(.*)/', '\2', $key);
				if($key!=$column){
					$q_condition .= " and ".$column." like '%".$value."%' ";
					// echo $q_condition;
				}
			}
			// echo preg_replace('/and/', '', $q_condition, 1);
			$q_condition =" where ".(preg_replace('/and/', '', $q_condition, 1));
		}
		$order_by = "";
		if(isset($_GET["order_by"])){
			$order_by = " order by ".$_GET["order_by"];
		}

		$sql = "select ".
		$_GET["q_columns_name"].
		" from ".
		$_GET["q_table"].$q_condition.$order_by;

		if($_GET["q_table"]=="transaction_documents_description"){
			$sql = "select ".
			"tdd.id, doc_type, trading_object, created_time, update_time, store_house, money_received, comment, document_status, full_name".
			",full_name from ".
			$_GET["q_table"]." tdd inner join people p on tdd.trading_object=p.id ".$q_condition.$order_by;
		}

		//如果有返回结果，则返回，否则报错
		$result = $conn->query($sql);
		if($result->num_rows>0) {
			// echo var_dump($result["num_rows"]);
			// echo "<br>".$sql;
			for ($result_items; $result_item = $result->fetch_assoc(); $result_items[]=$result_item);
			foreach ($result_items as $item_key=>$item) {
				foreach ($item as $pkey=>$property) {
					if ($property == NULL) {
						// print_r($pkey);echo "\n";
						unset($result_items[$item_key][$pkey]);
					}
				}
				# code...
			}
			// print_r( $result_items);

			//PHP 数组测试
			// $test_var =[0,1,2,3]; foreach ($test_var as $value) {
			// 	echo gettype($value).$value; unset($value); echo "r:".gettype($value)."\n";
			// }
			// var_dump($test_var);

			// echo gettype($result_items[0][simple_name]);
			echo json_encode($result_items, JSON_UNESCAPED_UNICODE);
		}
		else {			
			header('Content-Type: text/html');
			echo $sql;
			// echo $sql."<br>0 results or query failed.";
		}
	}

	if (isset($_GET["complex_query"])){
		if(isset($_GET["items_price"])){
			$data = json_decode(file_get_contents('php://input'), true);
			$people_id = $data["people_id"];
			foreach ($data["products"] as $product_id => $product_price) {
				$sql = "select price_base_on_unit_1 from specific_price_specific_person spp".
					   " inner join transaction_documents_description t1 on spp.transaction_document_id=t1.id".
					   " where spp.people_id=".$people_id.
					   " and product_id=".$product_id.
					   " and doc_type='".$data["doc_type"]."'";
				$last_price = $conn->query($sql);
				if($last_price->num_rows>0){
					//last_price
					$data["products"][$product_id] = [0, $last_price->fetch_assoc()["price_base_on_unit_1"]];
				}
				else{
					// echo $sql;
					$data["products"][$product_id] = [0, 0];
				}

				$sql = "select price_base from product_info where id=".$product_id;
				$base_price = $conn->query($sql);
				if($base_price->num_rows>0){
					$base_price = $base_price->fetch_assoc()["price_base"];
					$data["products"][$product_id][0] = $base_price?$base_price:0;
				}
				else{
					$data["products"][$product_id][0] = 0;
				}
				/** price based on tag 需要添加**/
			}
		}
		//检查库存
		if(isset($_GET["items_amount"])){
			foreach ($data["products"] as $product_id => $product_amount) {
				$sql = "select amount from products_amount_in_store_house where product_id=".$product_id.
							 " and store_house_id=".$data["store_house"]."";
				$amount = $conn->query($sql);
				if($amount->num_rows==0){
					//last_price
					$data["products"][$product_id][2] = 0;
				}
				else{
					$data["products"][$product_id][2] = $amount->fetch_assoc()["amount"];
				}
			}
		}

		echo json_encode($data);
	}


	/*{
		$product_id = 
		$line_number = 
		$admin_define_id = 
		$fullname = 
		$unit = 
		$Specification = 
		$amount = 
		$price_per_unit = 
		$total_sum = 
		$comment = Null;
	}
*/
	//end the connection
	$conn->close();

?>