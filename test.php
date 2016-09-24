<?php
	header("Content-Type: text/html");
	echo print_r($_GET);
	echo "<br>".$_SERVER["SERVER_PROTOCOL"];
?>