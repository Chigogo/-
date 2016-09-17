var product_items_array = [];

var ajax_object;
		if (window.XMLHttpRequest) {ajax_object = new XMLHttpRequest();} 
		else {/*code for IE6, IE5*/ajax_object = new ActiveXObject("Microsoft.XMLHTTP");}


ajax_object.onreadystatechange = function(){
	if (ajax_object.readyState === XMLHttpRequest.DONE &&
		ajax_object.status === 200)
	{
		alert(ajax_object.response);
		product_items_array = product_items_array.concat(ajax_object.response);
	}
};

function query(string) {
		ajax_object.open("GET", "query.php?py_code="+string, true);
		ajax_object.send();

}

query("xct");
product_items_array;

//使用addEventListener 的方法
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

query("xct");
product_items_array;
var c = document.querySelector('#i_c');
c.appendChild(td.builder.new_line_creator({}));
