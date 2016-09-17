
var product_items_array = [];

var ajax_object;
		if (window.XMLHttpRequest) {ajax_object = new XMLHttpRequest();} 
		else {/*code for IE6, IE5*/ajax_object = new ActiveXObject("Microsoft.XMLHTTP");}


ajax_object.addEventListener("load", function(){ alert(ajax_object.response);
		product_items_array = product_items_array.concat(JSON.parse(ajax_object.response));
});

function query(q_string) {
		ajax_object.open("GET", "query.php?py_code="+q_string, true);
		ajax_object.send();

}

//query("xct");
