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
    var th = document.createElement("tr");
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

    for (var i = 0; i < table_data.length; i++) {
      var tr = document.createElement("tr");
      for (var j = 0; j < th.children.length; j++) {
        td = document.createElement("td");
        for (var k = 0, k_useful = false; k < table_data[i].length; k++) {
          for (var l = 0; l < table_data[i][k].length; l++) {
            if(table_data[i][k][l].type == th.children[j].getAttribute("name")) k_useful = true;
          };
          if(k_useful)
            for (var l = 0; l < table_data[i][k].length; l++) {
              switch(table_data[i][k][l]){
                case "a": td.setAttribute(table_head[i][k][l].value[0],table_head[i][k][l].value[1]);break;
                case "e": td.addEventListener(table_head[i][k][l].value[0],table_head[i][k][l].value[1]);break;
                case "i": td.innerHTML= table_head[i][k][l].value;break;
              }
            };
        };
        tr.appendChild(td);
      };
      ds.appendChild(tr);
    };

    for (var i = 0; i < ds.length; i++) {
      ds[i].insertBefore(document.createElement(td),ds[i].children[0]);//td和th 在用一行？
      ds[i].children[0].innerHTML = (ds[i] == ds.children[0])?"行号":i;
    };
  },

  "product_info": [1,[],[],[1,[]]],
  //products_tag 加入,第一个元素表状态，0表示没有基础信息变动，无需从服务区抓取数据，1表示基础信息已有变动，需要更新;
  // 第二个元素表示抓取的原始数据，
  // 第三个元素表示处理过，用于展示的数据
  // 第四个数据是一个包含两个元素的数组，第一个元素表示更新状态，1表示需要更新（还未更新），0表示不需要更新(已经更新)；
  "pr_q_d": function(e){//product query and display，用于商品信息的查询event listener
    if(ls.product_info[0]==0);
    else if(ls.query("*","product_info","")==0){
      for (var i = 0; i < ls.product_info[1].length; i++) {
        for (var i = 0; i < ls.product_info[1].length; i++) {
          Things[i]
        };
        ls.product_info[2][i]=ls.product_info[1][i];

      };
      for (var i = 0; i < ls.product_info[2].length; i++) {
        switch(ls.product_info[2][i]){

        }
      };

    }
    var table_head = [
      [{type: "a",value:["name","product_id"]},{type: "i",value:"id"}],
      [{type: "a",value:["name","admin_defined_id"]},{type: "i",value:"商品编号"}],
      [{type: "a",value:["name","full_name"]},{type: "i",value:"商品全名"}],
      [{type: "a",value:["name","product_id"]},{type: "i",value:"id"}],
      [{type: "a",value:["name","product_id"]},{type: "i",value:"id"}],
      [{type: "a",value:["name","product_id"]},{type: "i",value:"id"}],
      [{type: "a",value:["name","product_id"]},{type: "i",value:"id"}],
      [{type: "a",value:["name","product_id"]},{type: "i",value:"id"}],
      [{type: "a",value:["name","product_id"]},{type: "i",value:"id"}],
      [{type: "a",value:["name","product_id"]},{type: "i",value:"id"}],
      [{type: "a",value:["name","product_id"]},{type: "i",value:"id"}],
      [{type: "a",value:["name","product_id"]},{type: "i",value:"id"}],
      [{type: "a",value:["name","product_id"]},{type: "i",value:"id"}],
      [{type: "a",value:["name","product_id"]},{type: "i",value:"id"}],
      [{type: "a",value:["name","product_id"]},{type: "i",value:"id"}],
      [{type: "a",value:["name","product_id"]},{type: "i",value:"id"}],
      [{type: "a",value:["name","product_id"]},{type: "i",value:"id"}],
      [{type: "a",value:["name","product_id"]},{type: "i",value:"id"}],
      [{type: "a",value:["name","product_id"]},{type: "i",value:"id"}],
      [{type: "a",value:["name","product_id"]},{type: "i",value:"id"}],
      [{type: "a",value:["name","manufacture"]},{type: "i",value:"生产厂家"}],
      [{type: "a",value:["name","py_code"]},{type: "i",value:"拼音码"}],
    ];

    ls.display(table_head,ls.product_info[2]);
    ls.product_info[0]=0;
  },

  "people": [],//people tag 加入
  "people_for_update": [],

  "specific_price_specific_person": [],
  "specific_price_specific_person_for_update": [],

  "query": function(queried_columns, table, condition){
    ajax_object.onreadystatechange = function(){//在invoice.js中已经定义
      if (ajax_object.readyState === XMLHttpRequest.DONE && ajax_object.status === 200)
      {
        if(Number(ajax_object.response) != 0)
        {
          ls[table][1] = JSON.parse(ajax_object.response);//查询的结果数组立即作为数组存储
          ls[table][0] = 0;
          return 0;//表示查询成功，数组已经写入ls 对象
        }
          else {
            alert("当前查询条件无结果");
            return 1;
          }

        }
      };
    ajax_object.open("GET", "query.php?query_multiple&q_columns_name=*&q_table=product_info&condition="+condition
         +"&q_condition_value="+this.innerHTML, true);
    ajax_object.send();
  },

  "history_invoice": [],
  "craft_invoice": ,

  "edit": {
    "edir_event": function(){},
    "updater": function(){}, //for basic_info
    "event": function(){} //event for edit
  },

  "saver": function(){}, //for invoice

  "filter": function(){}, //for information displaying
};

document.querySelector("#checkout_people_info").addEventListener("click", ls.pr_q_d);