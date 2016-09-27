//如何阻止用户close window？
window.onclose = window_close_check;

function window_close_check (e) {
	alert("what");
	e.preventDefault();
}


var ls = list = {
  "display": function(table_head, table_data){
    //table_head 是一个数组，[[{}...{}]...[{}...{}]],每一个元素对应一个td
      //每一个元素也是数组，这个数组由对应的td 的内容组成，比如属性、事件、innerHTM等
    //table_data 是一个数组，比上述数组高一阶[
      // [[{}...{}]...[{}...{}]],
      // ...
      // [[{}...{}]...[{}...{}]]
      // ]
    //[{}...{}]的元素是对象，其格式为{
    //   type = "a"/"e"/"i"
    //     a,attribute
    //     e,eventlistener
    //     i,innerHTML
    //   value = [name,value]/[listenertype,funcion]/"string"
    // }
    var ds = document.querySelector("#display_section");
    //条件语句，若当前窗口有未保存的修改，则不继续执行下列语句
    ds.innerHTML = "";
    ds = ds.appendChild(document.createElement("table"));
    var th = document.createElement("tr");//th是head_tr
    for (var i = 0; i < table_head.length; i++) {
      var td = document.createElement("th");
      for (var j = 0; j < table_head[i].length; j++) {
        switch(table_head[i][j].type){
          case "a": td.setAttribute(table_head[i][j].value[0],table_head[i][j].value[1]);break;
          case "e": td.addEventListener(table_head[i][j].value[0],table_head[i][j].value[1]);break;
          case "i": td.innerHTML= table_head[i][j].value;break;
        }
      };
      th.appendChild(td);
    };

    ds.appendChild(th);//表头字段写入页面
    for (var i = 0; i < table_data.length; i++) {//遍历每一个数组元素，创建对一个的tr，一个tr对应一个商品
      var tr = document.createElement("tr");
      for (var j = 0; j < th.children.length; j++) {//遍历head_tr的每一个td，也就是每一列
        td = document.createElement("td");
        for (var k = 0, k_useful = false; k < table_data[i].length; k++) {//遍历单个商品数组的每一个元素，每个元素数组对应一个td
          for (var l = 0; l < table_data[i][k].length; l++) {//td对应tr数组的一个元素，遍历td元素的元素，
            if(table_data[i][k][l].type == "a" && table_data[i][k][l].value[0]=="name" && table_data[i][k][l].value[1]== th.children[j].getAttribute("name")) 
            {  
              k_useful = true; 
            }
            if(k_useful)
            {
              for (var l = 0; l < table_data[i][k].length; l++) {
                //console.log(table_data);
                switch(table_data[i][k][l].type){
                  case "a": td.setAttribute(table_data[i][k][l].value[0],table_data[i][k][l].value[1]);break;
                  case "e": td.addEventListener(table_data[i][k][l].value[0],table_data[i][k][l].value[1]);break;
                  case "i": td.innerHTML= table_data[i][k][l].value;break;
                }
              }
              break;
            }
          }
          if(k_useful){
            k_useful = false;
            break;
          }
        }
        tr.appendChild(td);
      }
      ds.appendChild(tr);
    }

    for (var i = 0; i < ds.children.length; i++) {
      ds.children[i].insertBefore(document.createElement("td"),ds.children[i].children[0]);//td和th 在用一行？
      ds.children[i].children[0].innerHTML = (ds.children[i] == ds.children[0])?"行号":i;
    };
  },

  "product_info": [1,[],[],[1,[]]],
  //products_tag 加入,第一个元素表状态，0表示没有基础信息变动，无需从服务区抓取数据，1表示基础信息已有变动，需要更新;
  // 第二个元素表示抓取的原始数据，
  // 第三个元素表示处理过，用于展示的数据
  // 第四个数据是一个包含两个元素的数组,该数组用语更新商品信息，第一个元素表示更新状态，1表示需要更新（还未更新），0表示不需要更新(已经更新)；
  "pr_q_d": function(e){//product query and display，用于商品信息的查询event listener
    if(ls.product_info[0]==0) alert("0");
    else {
      // for (var i = 0; i < ls.product_info[1].length; i++) {
      //   for (var i = 0; i < ls.product_info[1].length; i++) {
      //     Things[i]
      //   };
      //   ls.product_info[2][i]=ls.product_info[1][i];

      // };
      ajax_object.onreadystatechange = function(){//在invoice.js中已经定义
        if (ajax_object.readyState === XMLHttpRequest.DONE && ajax_object.status === 200)
        {
          if(Number(ajax_object.response) != 0)
          { 
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
                // switch(p_names[j]){
                //   case "id" : 
                  
                //   break;
                //   case "py_code" :
                //   case "admin_defined_id" :
                //   case "full_name" :
                //   case "manufacturer" :
                //   case "simple_name" :
                //   case "unit_1" :
                //   case "admin_defined_unit_1" :
                //   case "admin_defined_unit_1_factor" :;break;
                //   case "admin_defined_unit_2" :;break;
                //   case "admin_defined_unit_2_factor" :;break;
                //   case "price_base" :;break;
                //   case "price_for_manufacturer" :;break;
                //   case "price_for_dealer" :;break;
                //   case "price_for_bigger" :;break;
                //   case "price_for_big" :;break;
                //   case "price_for_Medium" :;break;
                //   case "price_for_small" :;break;
                //   case "price_for_smaller" :;break;
                //   case "price_for_smallest" :;break;
                //   case "size_id" :;break;
                //   case "created_at" :;break;
                //   case "changed_at" :;break;
                //   case "user_comment" :;break;
                //   case "system_log" :;break;
                //   case "hidden_toggle" :;break;
                //   default:
                  
                //   break;
                // }
                var td_value = ls.product_info[1][i][p_names[j]];
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
        }
            else {
              alert("当前查询条件无结果");
              return;
            }
        }
    };
    ls.query("*","product_info","");
  }
  },

  "people": [],//people tag 加入
  "people_for_update": [],

  "specific_price_specific_person": [],
  "specific_price_specific_person_for_update": [],

  "query": function(queried_columns, table, q_condition_value){
    ajax_object.open("GET", "query.php?query_multiple&q_columns_name="+queried_columns+"&q_table="+table+"&q_condition_value="+q_condition_value, true);
    ajax_object.send();
  },

  "history_invoice": [],
  "craft_invoice": [],

  "edit": {
    "edir_event": function(){},
    "updater": function(){}, //for basic_info
    "event": function(){} //event for edit
  },

  "saver": function(){}, //for invoice

  "filter": function(){}, //for information displaying
};

document.querySelector("#checkout_people_info").addEventListener("click", ls.pr_q_d);