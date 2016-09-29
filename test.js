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


            ls["product_info"][1] = JSON.parse(ajax_object.response);//查询的结果数组立即作为数组存储
            ls["product_info"][0] = 0;
            for (var i = 0; i < ls.product_info[1].length; i++) {

              var p_names = Object.getOwnPropertyNames(ls.product_info[1][i]);//所有属性组成的数组
              ls.product_info[2][i] = [];
              for (var j = 0; j < p_names.length; j++) {
                var a = ls.product_info[2][i][j] =[]; 
                if(p_names[j]=="id")
                  a.push({type:"a",value:['name','product_id']});
                else
                  a.push({type:"a",value:['name',p_names[j]]});
                //需要饱含的函数预定义

                  
                var td_value = ls.product_info[1][i][p_names[j]];//原来的值

                var c_e = ["contenteditable","true"];
                var nc_w = ["keypress",ls.checker.number_check_when_input];
                var nc_a = ["blur",ls.checker.number_check_after_input];

                function editable(){
                  a.push({type: "a", value: c_e}); 
                  a.push({type: "a", value: ["modify_status", false]});
                  a.push({type: "a", value: ["placeholder", td_value.toString()]});//把原来的值存入placeholder 属性中，便于后来的状态检查
                  a.push({type: "e", value: ["blur",ls.checker.status.equal_origin_value]});

                }
                function e_num(){//add event listener for num tds
                  a.push({type: "a", value: c_e}); 
                  a.push({type: "e", value: nc_w});
                  a.push({type: "e", value: nc_a});
                }

                switch(p_names[j]){
                  case "id" : 
                  break;
                  case "py_code" :;break;
                  case "admin_defined_id" : editable() break;
                  case "full_name" : editable() break;
                  case "manufacturer" : editable() break;
                  case "simple_name" : editable() break;

                  case "unit_1" : editable() break;

                  case "admin_defined_unit_1" : editable() break;
                  case "admin_defined_unit_1_factor" :editable() break;
                  case "admin_defined_unit_2" :editable() break;
                  case "admin_defined_unit_2_factor" :editable() break;
                  case "price_base" :e_num();
                  case "price_for_manufacturer" :e_num();
                  case "price_for_dealer" :e_num();
                  case "price_for_bigger" :e_num();
                  case "price_for_big" :e_num();
                  case "price_for_Medium" :e_num();
                  case "price_for_small" :e_num();
                  case "price_for_smaller" :e_num();
                  case "price_for_smallest" :e_num();
                  break;

                  case "size_id" :editable() break;

                  case "created_at" :;break;
                  case "changed_at" :;break;
                  case "user_comment" :editable() break;
                  case "system_log" :;break;
                  case "hidden_toggle" :editable() break;
                  default:

                  break;
                }

                if(td_value!=null && td_value!="null" && td_value!=undefined && td_value!="undefined")
                  a.push({type:"i",value: td_value});
                else
                  a.push({type:"i",value:""});
              }//内循环结束
            }//外循环结束

            var table_head = [
              [{type: "a",value:["name","product_id"]},{type: "i",value:"id"}],
              [{type: "a",value:["name","admin_defined_id"]},{type: "i",value:"商品编号"}],
              [{type: "a",value:["name","full_name"]},{type: "i",value:"商品全名"}],
              [{type: "a",value:["name","simple_name"]},{type: "i",value:"简名"}],
              [{type: "a",value:["name","admin_defined_unit_1"]},{type: "i",value:"辅助单位1"}],
              [{type: "a",value:["name","admin_defined_unit_1_factor"]},{type: "i",value:"辅助单位1系数"}],//辅助单位需要有alt 弹出提示吗？
              [{type: "a",value:["name","admin_defined_unit_2"]},{type: "i",value:"辅助单位2"}],
              [{type: "a",value:["name","admin_defined_unit_2_factor"]},{type: "i",value:"辅助单位2系数"}],//辅助单位需要有alt 弹出提示吗？
              [{type: "a",value:["name","price_base"]},{type: "i",value:"基准价"}],
              [{type: "a",value:["name","price_for_manufacturer"]},{type: "i",value:"厂商价"}],
              [{type: "a",value:["name","price_for_dealer"]},{type: "i",value:"经销商价"}],
              [{type: "a",value:["name","price_for_bigger"]},{type: "i",value:"特大户价"}],
              [{type: "a",value:["name","price_for_big"]},{type: "i",value:"大户价"}],
              [{type: "a",value:["name","price_for_Medium"]},{type: "i",value:"中户价"}],
              [{type: "a",value:["name","price_for_small"]},{type: "i",value:"小户价"}],
              [{type: "a",value:["name","price_for_smaller"]},{type: "i",value:"个人价"}],
              [{type: "a",value:["name","price_for_smallest"]},{type: "i",value:"零售价"}],
              [{type: "a",value:["name","manufacturer"]},{type: "i",value:"生产厂家"}],
              [{type: "a",value:["name","py_code"]},{type: "i",value:"拼音码"}],
              [{type: "a",value:["name","created_at"]},{type: "i",value:"创建时间"}],
              [{type: "a",value:["name","changed_at"]},{type: "i",value:"上次修改时间"}],
              [{type: "a",value:["name","hidden_toggle"]},{type: "i",value:"是否停用"}],
              [{type: "a",value:["name","user_comment"]},{type: "i",value:"用户备注"}]
            ];

            ls.display(table_head,ls.product_info[2]);
            ls.product_info[0]=0;
          }//内if结束