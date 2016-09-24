window.onclose = window_close_check;

function window_close_check (e) {
	alert("what");
	e.preventDefault();
}

var ls = list = {
  "display": function(table_head, table_data, display_column){
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

  "products_info": [],//products_tag 加入
  "products_info_for_update": [],

  "people": [],//people tag 加入
  "prople_for_update": [],

  "specific_price_specific_person": [],
  "specific_price_specific_person_for_update": [],

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