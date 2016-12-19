var ajax_object,
    cl=console.log,
    removeSpaceInBeginEnd = /^( |　|&nbsp;)*|( |　|&nbsp;)*$/g;
if (window.XMLHttpRequest) ajax_object = new XMLHttpRequest();
else {/*code for IE6, IE5*/ajax_object = new ActiveXObject("Microsoft.XMLHTTP");}

// var query_result;
PRODUCT_ITEMS_queried = {
	product_items_array: [],


  PRODUCT_CONSTRUCTOR: function (
    product_id,
    admin_defined_id,
    full_name,
    unit, //is an array
    specification,
    amount,
    price_per_unit,
    total_sum,
    comment) {
    this.product_id = product_id;
    this.admin_defined_id = admin_defined_id;
    this.full_name = full_name;
    this.unit = unit;
    this.specification = specification;
    this.amount = amount;
    this.price_per_unit = price_per_unit;
    this.total_sum = total_sum;
    this.comment = comment;
}

};

var ui = {
  tabManager: function(tabOperationType, tabAttr){
    //该函数用来管理tab，以对象的方式返回对应tab 的html属性:
      // tabAttr:
      // {
          // tabElement: 对应的Element
          // tabContent:
          // html_attr: {
            // class:
            // tab_type:invoice
            // my_invoice_id: someid
          // }
          // eventListeners: []
      // }
      // {
          // tabElement: 对应的Element
          // tabContent:
          // html_attr: {
            // class:
            // tab_type:list
            // list_type: product_info
          // }
          // eventListeners: []
      // }
    //tabOperationType操作类型，
      // create，创建tab，如果type是info类型，则直接active 元素
      // delete，删除tab
      // modify，修改tab，比如将给元素class添加active
      // isActive, 检测是否是active，
    switch(tabOperationType){
      //1573
      case "create":
          // 检查tabAttr.tab_type的值，遍历所有这些tab
          if(tabAttr.html_attr.tab_type.search(/list/)!=-1){
            var a = document.querySelector("#documents_tab>ul").querySelector('*[list_type="'+tabAttr.html_attr.list_type+'"]');
          }


          if(tabAttr.html_attr.tab_type.search(/invoice/)!=-1){
            var a = document.querySelector("#documents_tab>ul").querySelector('*[my_invoice_id="'+tabAttr.html_attr.my_invoice_id+'"]');
          }

          if(!a){
            var a = document.createElement("li");
            //a 指的是tab中的li元素
            a.appendChild(tabAttr.tabContent);
            tabAttr.tabElement = a;
            tabAttr.eventListeners.push(["click", function(){
              ui.tabManager("modify",
                {
                  html_attr:{class:"active"},
                  tabElement: this
                }
              );      
            }]);

            ui.tabManager("modify",tabAttr);
            document.querySelector("#documents_tab>ul").appendChild(a);
          }

          tabAttr.tabElement = a;
          ui.tabManager("modify",
            {
              html_attr:{class:"active"},
              tabElement: a
            }
          );                                                                                                      
          break;

      case "modify":
          if(tabAttr.html_attr){
            if(tabAttr.html_attr.hasOwnProperty("class") && tabAttr.html_attr.class.search(/active/)!=-1){
              $("#documents_tab").find(".active").removeClass("active");
            }
            for(var html_attrProperty in tabAttr.html_attr){
              tabAttr.tabElement.setAttribute(html_attrProperty, tabAttr.html_attr[html_attrProperty]);
            }
          }
          if(tabAttr.tabContent){
            $(tabAttr.tabElement).html("").append($(tabAttr.tabContent));
          }
          if(tabAttr.eventListeners){
            for (var i = 0; i < tabAttr.eventListeners.length; i++) {
              tabAttr.tabElement.addEventListener(tabAttr.eventListeners[i][0], tabAttr.eventListeners[i][1]);
            };
          }
          break;
      case "delete":
          $(tabAttr.tabElement).remove();
          break;

      case "isActive":
          $(tabAttr.tabElement).hasClass('active');
          break;

      default:
          break;
    }
  return tabAttr;
  }

};

//这是单据函数、多个单据数组的对象
var td = TRANSACTION_DOCUMENT = {

  //此处的id 与lists 中的id 
  //一一对应，用于查找对应的list
  //:creator
  "ids_in_document_lists":[],

  "queried_result_products":[],

  //文件列表指的是发票的列表，因为用户可能同时编辑多个发票
  //文件列表时一个数组，数组的元素是单独的发票
  //单个发票的构成：发票描述、发票内容
  "document_lists": {
    invoice_content_head_description_array: [
      [{t: "a",v:["name","line_number"]},{t: "i",v:"行号"}],
      [{t: "a",v:["name","product_id"]},{t: "i",v:"商品id"}],
      [{t: "a",v:["name","manufacturer"]},{t: "i",v:"厂家"}],
      [{t: "a",v:["name","full_name"]},{t: "i",v:"商品全名"}],
      [{t: "a",v:["name","amount"]},{t: "i",v:"数量"}],
      [{t: "a",v:["name","item_income"]},{t: "i",v:"金额"}],
      [{t: "a",v:["name","price"]},{t: "i",v:"单价"}],
      [{t: "a",v:["name","units_factor"]},{t: "i",v:"单位和规格"}],
      [{t: "a",v:["name","comment_for_item"]},{t: "i",v:"备注"}]
    ],


    "invoice_id1": {
        ////INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
      "trading_object": [1,"系统"],//[id, full_name]
      "doc_type" : "xs",//doc_type enum('xs','jh','db','dd'),销售，进货，调拨，用户订单
      "store_house" : [1,"仓库1"],//[id, full_name]
      "money_received" : 0,//Decimal(12,2)
      "comment" : '',//varchar(63)，描述区的备注
      "document_status" : "管理员编辑",  /*enum("完成","管理员反冲", "管理员编辑","管理员取消", "用户编辑", "用户取消") not null default "管理员编辑"*/
      "created_time": "2016-11-21 11:46:15",
      "update_time" : "0000-00-00 00:00:00",
      
      // "document_description": 
      "document_content_array": [{
        "product_id": 123,
        "full_name": "小脆筒",
        "unit": "箱",//标注用户所选用的计算规格的方式
        "amount": 0,
        "item_income": 0,
        "comment": ""
       },{
        "product_id":"",
        "manufacturer":"",
        "full_name":"",
        "amount":"",
        "price":"",
        "unit":"",//unit1还是其他？
        "units_factor":[
          "unit_1",
          ["unit_1", "箱", 1],
          ["unit_2", "支", 50],
          ["unit_3", "g", 60]
        ],
        "item_income":"",
        "comment_for_item":""
       }]
    }
  },

  //方法————单据对象的查看，查看之前需先保存当前显示的销售单
  // 1、获取当前invoice 的id
  // 2、注明当前的invoice type
  // 3、给部分表格（客户）添加事件监听器
  // 4、把新的id 写入表格描述部分
  // 5、更新发票对应的对象
  // 6、修改tab 状态
  "viewer": function(editable_tag ,invoice_id){
    //当前视图如果存在单据,id=i，则先保存该单据
    var section = document.querySelector("#display_section");

    var doc_type_caption = document.querySelector("*[my_invoice_id='"+invoice_id+"']").querySelector("a").innerHTML.replace(/^(销售|进货).*/,"$1"+"单");
    section.innerHTML=[
      '<!-- i 表示invoice -->',
      '<table id="i" class="table table-bordered col-md-12" >',
      '<caption class="text-center lead">'+doc_type_caption+'</caption>',
      '<!-- i_des 表示invoice_description-->',
      '<thead id="i_des">',
      '<tr>',
      '<td colspan=2>往来单位：</td>',
      '<td name="trading_object" colspan="2" contenteditable></td>',
      '<td name="invoice_id" invoice_id="'+invoice_id+'">单据编号：</td>',
      '<td name="generated_id" colspan="1"></td>',
      '<td>制单时间：</td> <td name="created_time" ></td>',
      '</tr>',
      '<tr>',
      '<td colspan=2>仓库：</td>',
      '<td name="store_house" store_house_id colspan="2"></td>',
      '<td>备注：</td>',
      '<td name="comment" colspan="3" contenteditable></td>',
      '</tr>',
      '</thead>',
      '<!-- i_c表示invoice content -->',

      '<tbody id="i_c">',
      '</tbody>',

      '<tfoot>',
      '<tr>',
      '<td>合计</td>',
      '<td colspan=2></td>',
      '<td name="total_amount"></td>',
      '<td colspan=2 name="money_received"></td>',
      '<td colspan=3 name="money_received_chinese"></td>',
      '</tr>',
      '</tfoot>'
    ].join("\n");

    var ls_fucntion_tab = $([
      '<div id="ls_fucntion_tab" class="">',


      '<button id="print_invoice" class="btn btn-default"><a href="#">打印单据</a></button>',
      '<button id="save_as_draft" class="btn btn-default"><a href="#">存为草稿</a></button>',
      '<button id="invoice_to_db" class="btn btn-default"><a href="#">单据过账</a></button>',


      '</div>'
      ].join("\n")
      );

    ls_fucntion_tab.find("#print_invoice").on("click", function(){window.print();});
    
    var save_as_draft_btn = ls_fucntion_tab.find("#save_as_draft");
    var invoice_to_db_btn = ls_fucntion_tab.find("#invoice_to_db");
    if(editable_tag){
      save_as_draft_btn.on("click", function(){td.saver_toSever("草稿");});
      invoice_to_db_btn.on("click", function(){td.saver_toSever("完成");});
    }else{
      save_as_draft_btn.attr("disabled","disabled");
      invoice_to_db_btn.attr("disabled","disabled");
    }

    $(section).append(ls_fucntion_tab);

    document.querySelector("td[name='trading_object']").addEventListener("keypress", td.builder.query_people);

    //获取对应的对象文件
    var a = td.document_lists["invoice_id"+invoice_id];

    var tab = document.querySelector('[my_invoice_id="'+invoice_id+'"]');
    //修改tab
    ui.tabManager("modify", {
      tabElement: tab,

      tabContent: $("<a/>",{
        href: "#",
        text: a.trading_object[1]?tab.querySelector("a").innerHTML.replace(/^(销售给|进货从).*/,'$1'+a.trading_object[1]):""
      }).get(0)

    });

    var des = document.querySelector('#i_des');
    //从对象文件中读取描述和数据
    des.querySelector('td[name="invoice_id"]').invoice_id = invoice_id;
    //展示往来单位
    var des_td = des.querySelector("td[name='trading_object']");
    des_td.addEventListener("click",td.builder.cell_checker);
    des_td.setAttribute("people_id",a.trading_object[0]?a.trading_object[0]:"");
    des_td.innerHTML = a.trading_object[1]?a.trading_object[1]:"";

    //展示单据描述数据
    des.querySelector('td[name="generated_id"]').innerHTML = a.doc_type+"-"+invoice_id;
    des.querySelector('td[name="created_time"]').innerHTML = a.created_time;
    des.querySelector('td[name="store_house"]').innerHTML = a.store_house[1];

    var des_comment = des.querySelector('td[name="comment"]');
    des_comment.innerHTML = a.comment;
    des_comment.addEventListener("click",td.builder.cell_checker);
    des_comment.addEventListener("blur",function(){
      a.comment = this.innerHTML;  
    });
    document.querySelector('td[name="money_received"]').innerHTML  = a.money_received?a.money_received:"";


    var c = document.querySelector('#i_c');
    var table_head_fields_description_array = td.document_lists.invoice_content_head_description_array;
    //初始化表格头
    c.appendChild(td.builder.creat_new_tr("th",table_head_fields_description_array));

    for (var i = 0; i < a.document_content_array.length; i++) {
      c.appendChild(td.builder.create_invoice_line(a.document_content_array[i], table_head_fields_description_array, editable_tag));
    };

    //last line in tbody
    if(editable_tag){
      var last_line = td.builder.create_invoice_line("td",table_head_fields_description_array, 0);
      var full_name_td = last_line.querySelector("[name='full_name']");
      full_name_td.removeEventListener("blur", td.builder.cell_checker);
      c.appendChild(last_line);
    }

    for (var i = 1; i < c.childNodes.length; i++) {
      c.childNodes[i].querySelector('[name="full_name"]').addEventListener("keypress",td.builder.query_products);
    }

    td.builder.line_number_refresher(c);
    td.builder.sum_refresher();
  },

  "saver_toBg": function(id){
    var a = document.querySelector("#i_c").querySelectorAll("tr");
    var d_a=td.document_lists["invoice_id"+id].document_content_array;

    
    d_a.splice(0,d_a.length);// 思考为什么不能用d_a=[];
    for (var i = 1; i < a.length-1; i++) {
      var o = {
      "product_id": Number(a[i].querySelector('*[name="product_id"]').innerHTML),
      "manufacturer": a[i].querySelector('*[name="manufacturer"]').innerHTML,
      "full_name": a[i].querySelector('*[name="full_name"]').innerHTML,
      "unit": td.builder.priceUnitManager("sv", a[i].querySelector('*[name="units_factor"]').querySelector("div"))[0],//标注用户所选用的计算规格的方式
      "units_factor": td.builder.priceUnitManager("sv", a[i].querySelector('*[name="units_factor"]').querySelector("div")),
      "price": Number(a[i].querySelector('*[name="price"]').innerHTML),
      "amount": Number(a[i].querySelector('*[name="amount"]').innerHTML),
      "item_income": Number(a[i].querySelector('*[name="item_income"]').innerHTML),
      "comment_for_item": a[i].querySelector('*[name="comment_for_item"]').innerHTML
      };

      d_a.push(o);

    }
  },


  "saver_toSever": function(document_status, id ){
    var invoice_id = id?id:document.querySelector("td[name=invoice_id]").getAttribute("invoice_id");
    if(document_status != "草稿")
    {
      if(td.invoice_validator(document_status, invoice_id)==false) return;
    }

    td.saver_toBg(invoice_id);
    td.document_lists["invoice_id"+invoice_id].document_status = document_status;

    $.ajax({
      url: "update.php?type=save_invoice",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(td.document_lists["invoice_id"+invoice_id]),

      success: function(data, status, XMLHttpRequest_object){
        cl(data);
        //删除对应 tab
        var element_to_close = $('#documents_tab li[my_invoice_id="'+invoice_id+'"]');
        element_to_close.next().length?element_to_close.next().click():element_to_close.prev().click();
        ui.tabManager("delete", {tabElement: element_to_close[0]});
        delete td.document_lists["invoice_id"+invoice_id];
      }
    });
  },

  "invoice_validator": function(document_status, id ){
    var invoice = $("#i");
    var i_des = invoice.find("#i_des");
    var div = $("<div/>");
    var value = true;
    if(i_des.find('[name="trading_object"]').attr("people_id")=="1"||
      i_des.find('[name="trading_object"]').text()==""){
      $("<div/>",{
        "text": "往来单位有误"
      }).appendTo(div);
      value = false;
    }

    var i_content = invoice.find("#i_c");
    var trs = i_content.find("tr");cl(trs);

    if(trs.length<3){
      $("<div/>",{
        "text": "列表中无商品！"
      }).appendTo(div);
      value = false;
    }

    for (var i = 1; i < trs.length-1; i++) {
      var mark = false;
      var outer = $("<div/>");
      var line_number = $(trs[i]).find('[name="line_number"]').text();
      outer.append($("<div/>",{
        "text": "行号为"+line_number+"的产品存在以下问题："
      }));


      var full_name = $(trs[i]).find('[name="full_name"]');
      var amount = $(trs[i]).find('[name="amount"]');
      var price = $(trs[i]).find('[name="price"]');
      if(full_name.text()=="") {
        outer.append($("<div>商品名称不正确</div>"));
        mark = true;
      }
      if(typeof Number(amount.text())!="number"||Number(amount.text())==0) {
        outer.append($("<div>商品数量不正确</div>"));
        mark = true;
      }
      if(typeof Number(price.text())!="number"||Number(price.text())==0) {
        outer.append($("<div>商品价格不正确</div>"));
        mark = true;
      }

      if(mark){
        div.append(outer);
        value = false;
      }
    };

    if(value==false){
      ls.checker.status.pop_up_creator("您不能保存单据，原因是", div.get(0));
    }

    return value==false?false:true;
  },
  //方法————单据对象的创建
  //在主数据库创建一个单据，主数据库返回单据id
  "creator": function (doc_type, operationType, invoice_id){
    //doc_type,主要有xs，jh
    //operationType,主要有
      // cr，create
      // vw，view
      // ed, editor
    var c_new_i,
        doc_type_Chinese;

    if(doc_type=="xs") {
      doc_type_Chinese="销售给某单位";

    }
    if(doc_type=="jh") {
      doc_type_Chinese="进货从某单位";

    }

    (function query(string){
      var ajax_object;
      if (window.XMLHttpRequest) ajax_object = new XMLHttpRequest();
      else {/*code for IE6, IE5*/ajax_object = new ActiveXObject("Microsoft.XMLHTTP");}

      ajax_object.onreadystatechange = function(){
        if (ajax_object.readyState === XMLHttpRequest.DONE && ajax_object.status === 200){

          //transaction_documents_description, Object
          var tdd = JSON.parse(ajax_object.response);cl(tdd);
          invoice_id = tdd.id;

          var invoice = "invoice_id"+invoice_id;//invoice_id12331
          td.document_lists[invoice] = tdd;

          var viewer_arg = operationType=="cr"||operationType=="ed"?1:0;

          //tab 对象创建
          ui.tabManager("create",{
            html_attr:{
              tab_type: "invoice",
              my_invoice_id: invoice_id
            },

            eventListeners: [
              ["click",function(){ td.viewer(viewer_arg, this.getAttribute("my_invoice_id")); }],
            ],

            tabContent: $("<a/>",{
              href: "#",
              text: doc_type_Chinese
            }).get(0)
          });

          //创建并添加到视图
          td.viewer(viewer_arg, invoice_id);
        }
        if (ajax_object.readyState === XMLHttpRequest.DONE && ajax_object.status == 404){
          alert("数据库连接错误");
        }
      };

      ajax_object.open("GET", "query.php?" + string, true);
      ajax_object.send();
    })//此处传入的c_new_i是字符串，php发现此标记后，进行新发票的创建，返回新发票id
    ("query_invoice"+
      (operationType=="cr"?("&c_new_i&doc_type="+doc_type):("&invoice_id="+invoice_id))
    );
  },

  "creator_xs": function(){
    td.creator("xs", "cr");
  },

  "creator_jh": function(){
    td.creator("jh", "cr");
  },

  "creator_in_history_list": function(){
    var $_this = $(this);
    var doc_type = $_this.find("[name='doc_type']").text();
    var document_status = $_this.find("[name='document_status']").text();
    var invoice_id = $_this.find("[name='invoice_id']").text();
    var doc_create_type = document_status=="完成"?"vw":"ed";
    td.creator(doc_type, doc_create_type, invoice_id);
  },
  /*
  如果该方法由viewer 唤起，则为相应td 元素添加事件处理器；
  如果该方法用于创建表格列表，则
    使用字符串或者py_code来检索商品，陈列商品，为列表添加时间处理器
    当用户选中某几个条目时，将条目写入发票中，写入td的lists 中
  */
  "builder": {
    creat_new_tr: function(tag_name_within_line_tr, fields_description_array){
      var tr=document.createElement("tr");
      for (var i = 0; i < fields_description_array.length; i++) {
        tr.appendChild(td.builder.create_new_element_in_tr(tag_name_within_line_tr, fields_description_array[i]));
      };
      return tr;
    },

    create_new_element_in_tr: function(tag_name, field_description_array){
      var element = document.createElement(tag_name);
      for (var i = 0; i < field_description_array.length; i++) {
        switch(field_description_array[i].t){
          case "a":
              element.setAttribute(field_description_array[i].v[0],field_description_array[i].v[1]);
              break;
          case "i":
              if(field_description_array[i].v==undefined) field_description_array[i].v = "";
              if(typeof field_description_array[i].v=="number") field_description_array[i].v = field_description_array[i].v.toString();
              element.appendChild(typeof field_description_array[i].v=="string"?document.createTextNode(field_description_array[i].v):field_description_array[i].v);
              break;
          case "e":
              element.addEventListener(field_description_array[i].v[0],field_description_array[i].v[1]);
              break;
        }
      };
      return element;
    },

    create_invoice_line: function (a, table_head_fields_description_array, editable_tag){//a是document_content_array的item
      var tr_fields_description=[]
      for (var i = 0; i < table_head_fields_description_array.length; i++) {
        tr_fields_description[i] = [table_head_fields_description_array[i][0]];
      };

      for (var i = 0; i < tr_fields_description.length; i++) {
        //innerHTML
        var td_des = tr_fields_description[i];
        if(tr_fields_description[i][0]["v"][1]!="units_factor")
        tr_fields_description[i].push({t:"i",v:a[tr_fields_description[i][0]["v"][1]]});

        if(editable_tag){
          switch(tr_fields_description[i][0]["v"][1]){
            case "line_number":
                break;
            case "product_id":
                td_des.push(
                  {t:"a",v:["product_id", a.product_id]}
                );
                break;
            case "manufacturer":
                break;
            case "full_name":
                td_des.push(
                  {t:"e",v:["name","line_number"]},
                  {t:"e",v:["keypress",td.builder.query_products]},
                  {t:"e",v:["blur", td.builder.cell_checker]},
                  {t:"e",v:["click", td.builder.cell_checker]},
                  {t:"e",v:["keydown", ls.edit.arrow_key_control]},
                  {t:"e",v:["click", 
                    function(){
                      $("[input_end_point]").removeAttr("input_end_point");
                      $(this).parent().attr("input_end_point","");
                    }
                    ]},
                  {t:"a", v:["placeholder",a.full_name]},//用于checker
                  {t:"a", v:["contenteditable","true"]}
                  );
                break;
            case "units_factor":
                td_des.push(
                  {t:"i",v: td.builder.priceUnitManager("cr", a.units_factor)}
                );
                break;
            case "amount":
                td_des.push(
                  {t:"e",v:["click", td.builder.cell_checker]},
                  {t:"e",v:["blur",td.builder.number_check_after_input]},
                  {t:"e",v:["blur",td.builder.amount_or_price_affect_received]},
                  {t:"e",v:["blur", td.builder.whether_amount_out_of_storage]},
                  {t:"e",v:["keydown", ls.edit.arrow_key_control]},
                  {t:"e",v:["keypress", td.builder.number_check_when_input]},
                  {t:"a",v:["contenteditable","true"]}
                );
                break;
            case "price":
                td_des.push(
                  {t:"e",v:["click", td.builder.cell_checker]},
                  {t:"e",v:["blur",td.builder.number_check_after_input]},
                  {t:"e",v:["blur",td.builder.amount_or_price_affect_received]},
                  {t:"e",v:["keydown", ls.edit.arrow_key_control]},
                  {t:"e",v:["keypress", td.builder.number_check_when_input]},
                  {t:"e",v:["blur", td.builder.whether_price_reasonable]},
                  {t:"a",v:["contenteditable","true"]}
                );
                break;
            case "item_income":
                td_des.push(
                  {t:"e",v:["click", td.builder.cell_checker]},
                  {t:"e",v:["blur",td.builder.number_check_after_input]},
                  {t:"e",v:["keydown", ls.edit.arrow_key_control]},
                  {t:"e",v:["keypress", td.builder.number_check_when_input]},
                  {t:"e",v:["blur",td.builder.receive_affects_price]},
                  {t:"a",v:["contenteditable","true"]}
                );
                break;
            case "comment_for_item":
                td_des.push(
                  {t:"e",v:["click", td.builder.cell_checker]},
                  {t:"e",v:["keydown", ls.edit.arrow_key_control]},
                  {t:"a",v:["contenteditable","true"]}
                )
                break;
          }
        }
        if(!editable_tag){
          switch(tr_fields_description[i][0]["v"][1]){
            case "line_number":
                break;
            case "product_id":
                break;
            case "manufacturer":
                break;
            case "full_name":
                td_des.push(
                  {t:"e",v:["name","line_number"]},
                  {t:"e",v:["keypress",td.builder.query_products]},
                  {t:"e",v:["blur", td.builder.cell_checker]},
                  {t:"e",v:["click", td.builder.cell_checker]},
                  {t:"e",v:["keydown", ls.edit.arrow_key_control]},
                  {t:"e",v:["click", 
                    function(){
                      $("[input_end_point]").removeAttr("input_end_point");
                      $(this).parent().attr("input_end_point","");
                    }
                    ]},
                  {t:"a", v:["placeholder",a.full_name]},//用于checker
                  {t:"a", v:["contenteditable","true"]}
                  );
                break;
            case "unit":
                break;
            case "amount":
                break;
            case "price":
                break;
            case "item_income":
                break;
            case "comment_for_item":
                break;
          }
        }
      };

      //tr created
      return td.builder.creat_new_tr("td",tr_fields_description);
    },

    // 两个功能，如果是click和focus，则选中表格内容
    // 如果是blur，则检查输入结果是否为空
    "cell_checker": function(e){
      //点击后自动选择表格内容，用于td
      if(e.type=="click" || e.type=="focus"){
        if (document.selection) {
            var range = document.body.createTextRange();
            range.moveToElementText(this);
            range.select();
        } else if (window.getSelection) {
            var range = document.createRange();
            range.selectNodeContents(this);
            window.getSelection().addRange(range);
        } 
      }

      if(e.type=="blur"){
          // console.log(this.innerHTML.replace(/ /g,"").replace(/　/g,""));
        if(this.innerHTML.replace(removeSpaceInBeginEnd,"")==""){//正则表达式
          console.log(this.parentNode);
          td.builder.line_deleter(this.parentNode);
        }else 
        if(this.hasAttribute("placeholder") && this.innerHTML != this.getAttribute("placeholder"))
          this.innerHTML=this.getAttribute("placeholder");
      }
    },

    "line_deleter": function(tr_node){
      tr_node.parentNode.removeChild(tr_node);
      td.builder.sum_refresher();
      td.builder.line_number_refresher(document.querySelector("#i_c"));
    },

    "line_number_refresher": function(tbody){
      var tr = tbody.querySelectorAll("tr");
      for (var i = 1; i < tr.length; i++) {
        tr[i].querySelector("td").innerHTML = i;
      }
    },

    priceUnitManager: function(operationType, units_factor_array_or_div){
      //进行 种操作
      //第一种，创建,
        //根据服务器提供的"价格、单位、规格"对象创建表格内容
      //第二种，检查状态,event listener
        //根据当前的invoice状态、用户操作，调整对应的价格和单位
        //当用户调整价格或者单元的同时
      //第三种，生成服务器接受的"价格、单元、规格"格式
      if(operationType == "cr"){
        var element = $("<div/>");
        for (var i = 1; i < units_factor_array_or_div.length; i++) {
          var outer_span = $("<span/>",{
            name: units_factor_array_or_div[i][0],
            name_for_user: units_factor_array_or_div[i][1],
            factor: units_factor_array_or_div[i][2]
          }).text(units_factor_array_or_div[i][2]);

          outer_span.on("click", function(){
            var tr = $(this).closest('tr');
            var price_element = tr.find('[name="price"]');
            var price = Number(price_element.text());
            var amount_element = tr.find('[name="amount"]');
            var amount = Number(amount_element.text());

            var span_siblings = $(this).parent().children('span');
            var allUnits = [];
            for (var j = 0; j < span_siblings.length; j++) {
              allUnits.push([$(span_siblings[j]).attr("name"), $(span_siblings[j]).attr("factor")]);
              if($(span_siblings[j]).hasClass('info')){
                var prevUnitElement = $(span_siblings[j]);
                var prevUnitElement_pointer = j;
                prevUnitElement.removeClass('info');
              }
              if(this == span_siblings[j]){
                var currentUnitElement_pointer = j;
              }
            };

            for(pointer = prevUnitElement_pointer;pointer<currentUnitElement_pointer;pointer++){
              var price = price / allUnits[pointer+1][1];
              // var amount = amount * allUnits[pointer+1][1];
            }

            for(pointer = prevUnitElement_pointer;pointer>currentUnitElement_pointer;pointer--){
              var price = price * allUnits[pointer][1];
              // var amount = amount / allUnits[pointer][1];
            }
            price_element.text(price);
            $(this).addClass('info');
            
            td.builder.amount_or_price_affect_received.apply($(price_element)[0]);
            td.builder.whether_price_reasonable.apply($(price_element)[0]);

          });
  
          var inner_span = $("<span/>",{
            name: "name_for_user",
            text: units_factor_array_or_div[i][1]
          }).appendTo(outer_span);
  
          if(units_factor_array_or_div[i][0]==units_factor_array_or_div[0]){
            outer_span.addClass('info');
          }
          element.append(outer_span);

          if(i<units_factor_array_or_div.length-1){
            element.append($(document.createTextNode("×")));
          }
        };
  
        return element.get(0);
      }
      if(operationType == "sv"){
        var units_factor = [];
        var div = $(units_factor_array_or_div);
        var units = div.children('span');
        var info = div.find('.info');
        units_factor.push(info.attr("name"));
        for (var i = 0; i < units.length; i++) {
          units_i = $(units[i]);
          units_factor.push([units_i.attr("name"), units_i.attr("name_for_user"), units_i.attr("factor")]);
        };
        return units_factor;
      }

    },

    "sum_refresher": function(){
      var i_c_tr=document.querySelector("#i_c").querySelectorAll('tr');
      var amount=money_received=0;
      for (var i = 1; i < i_c_tr.length; i++) {
        amount += Number(i_c_tr[i].querySelector("*[name='amount']").innerHTML);
        money_received += Number(i_c_tr[i].querySelector("*[name='item_income']").innerHTML);
      };
      money_received=money_received.toFixed(2);
      document.querySelector("tfoot").querySelector("*[name='total_amount']").innerHTML = amount;
      document.querySelector("tfoot").querySelector("*[name='money_received']").innerHTML = Number(money_received);
      function convertCurrency(currencyDigits) { 
        // Constants: 
        var MAXIMUM_NUMBER = 99999999999.99; 
        // Predefine the radix characters and currency symbols for output: 
        var CN_ZERO = "零"; 
        var CN_ONE = "壹"; 
        var CN_TWO = "贰"; 
        var CN_THREE = "叁"; 
        var CN_FOUR = "肆"; 
        var CN_FIVE = "伍"; 
        var CN_SIX = "陆"; 
        var CN_SEVEN = "柒"; 
        var CN_EIGHT = "捌"; 
        var CN_NINE = "玖"; 
        var CN_TEN = "拾"; 
        var CN_HUNDRED = "佰"; 
        var CN_THOUSAND = "仟"; 
        var CN_TEN_THOUSAND = "万"; 
        var CN_HUNDRED_MILLION = "亿"; 
        var CN_SYMBOL = ""; 
        var CN_DOLLAR = "元"; 
        var CN_TEN_CENT = "角"; 
        var CN_CENT = "分"; 
        var CN_INTEGER = "整"; 
         
        // Variables: 
        var integral;    // Represent integral part of digit number. 
        var decimal;    // Represent decimal part of digit number. 
        var outputCharacters;    // The output result. 
        var parts; 
        var digits, radices, bigRadices, decimals; 
        var zeroCount; 
        var i, p, d; 
        var quotient, modulus; 
         
        // Validate input string: 
        currencyDigits = currencyDigits.toString(); 
        if (currencyDigits == "") { 
            alert("Empty input!"); 
            return ""; 
        } 
        if (currencyDigits.match(/[^,.\d]/) != null) { 
            alert("Invalid characters in the input string!"); 
            return ""; 
        } 
        if ((currencyDigits).match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) { 
            alert("Illegal format of digit number!"); 
            return ""; 
        } 
         
         // Normalize the format of input digits: 
        currencyDigits = currencyDigits.replace(/,/g, "");    // Remove comma delimiters. 
        currencyDigits = currencyDigits.replace(/^0+/, "");    // Trim zeros at the beginning. 
        // Assert the number is not greater than the maximum number. 
        if (Number(currencyDigits) > MAXIMUM_NUMBER) { 
            alert("Too large a number to convert!"); 
            return ""; 
        } 
         
        // Process the coversion from currency digits to characters: 
        // Separate integral and decimal parts before processing coversion: 
        parts = currencyDigits.split("."); 
        if (parts.length > 1) { 
            integral = parts[0]; 
            decimal = parts[1]; 
            // Cut down redundant decimal digits that are after the second. 
            decimal = decimal.substr(0, 2); 
        } 
        else { 
            integral = parts[0]; 
            decimal = ""; 
        } 
        // Prepare the characters corresponding to the digits: 
        digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE); 
        radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND); 
        bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION); 
        decimals = new Array(CN_TEN_CENT, CN_CENT); 
        // Start processing: 
        outputCharacters = ""; 
        // Process integral part if it is larger than 0: 
        if (Number(integral) > 0) { 
            zeroCount = 0; 
            for (i = 0; i < integral.length; i++) { 
                p = integral.length - i - 1; 
                d = integral.substr(i, 1); 
                quotient = p / 4; 
                modulus = p % 4; 
                if (d == "0") { 
                    zeroCount++; 
                } 
                else { 
                    if (zeroCount > 0) 
                    { 
                        outputCharacters += digits[0]; 
                    } 
                    zeroCount = 0; 
                    outputCharacters += digits[Number(d)] + radices[modulus]; 
                } 
                if (modulus == 0 && zeroCount < 4) { 
                    outputCharacters += bigRadices[quotient]; 
                } 
            } 
            outputCharacters += CN_DOLLAR; 
        } 
        // Process decimal part if there is: 
        if (decimal != "") { 
            for (i = 0; i < decimal.length; i++) { 
                d = decimal.substr(i, 1); 
                if (d != "0") { 
                    outputCharacters += digits[Number(d)] + decimals[i]; 
                } 
            } 
        } 
        // Confirm and return the final output string: 
        if (outputCharacters == "") { 
            outputCharacters = CN_ZERO + CN_DOLLAR; 
        } 
        if (decimal == "") { 
            outputCharacters += CN_INTEGER; 
        } 
        outputCharacters = CN_SYMBOL + outputCharacters; 
        return outputCharacters; 
      }


      document.querySelector("tfoot").querySelector("*[name='money_received_chinese']").innerHTML = convertCurrency(money_received);
      td.document_lists["invoice_id" + document.querySelector("#i_des").querySelector("*[name='invoice_id']").getAttribute("invoice_id")].money_received = money_received;

    },

    "number_check_when_input": function (e){
      if(e.keyCode >= 48 && e.keyCode<=57 || e.keyCode==46 || e.keyCode==32 || e.keyCode >= 37 && e.keyCode<=40 );
      else e.preventDefault();
    },

    "number_check_after_input": function(){
      if(this.innerHTML=="NaN"||this.innerHTML=="undefined") this.innerHTML = 0;
      this.innerHTML= Number(this.innerHTML);
      td.builder.sum_refresher();
    },

    //amount or price column 添加次为event listener
    "amount_or_price_affect_received": function (e){
      this.parentNode.querySelector('*[name="item_income"]').innerHTML = 
      Number(
        (
            (Number(this.parentNode.querySelector('*[name="price"]').innerHTML)*100) * 
            (Number(this.parentNode.querySelector('*[name="amount"]').innerHTML)*100)/10000
        ).toFixed(5)
      );
      td.builder.sum_refresher();

    },

    "receive_affects_price": function (e){
      var a = (
        Number(this.parentNode.querySelector('*[name="item_income"]').innerHTML)*1000/
        Number(this.parentNode.querySelector('*[name="amount"]').innerHTML)/1000
        ).toFixed(5);
      if(a.toString()=="NaN"||a==Infinity) a = "";
      Number(a).toFixed(5);
      var price_element = this.parentNode.querySelector('*[name="price"]')
      price_element.innerHTML = Number(a);
      td.builder.whether_price_reasonable.apply(price_element);
      td.builder.sum_refresher();
    },

    whether_amount_out_of_storage: function(){
      var remaining_amount = Number($(this).attr("remaining_amount"));
      var amount = Number($(this).text());
      var doc_type = $('[name="generated_id"]').html().replace(/-\d+/,"");
      var amount_to_base_on_unit_1 = amount;
      var is_out_of_storage = false;
      var currentUnitElement = $(this).parent().find('[name="units_factor"] span.info');
      var currentUnit = currentUnitElement.attr("name");
      for(var i = currentUnit.replace("unit_",""); i>1;i--){
        amount_to_base_on_unit_1 = amount_to_base_on_unit_1/
          Number(currentUnitElement.parent().find('[name="unit_'+i+'"]').attr("factor"));
      }
      if(doc_type == "xs" && amount_to_base_on_unit_1!=0 && amount_to_base_on_unit_1 > remaining_amount){
        is_out_of_storage = true;
      }

      var $_this = $(this);

      if(is_out_of_storage){
        $_this.attr("title", "输入数量（转化成单位1）后为："+amount_to_base_on_unit_1+"，库存数量为："+remaining_amount+"！").addClass("danger");
      }else{
        $_this.attr("title", "").removeClass("danger");
      }
    },

    "whether_price_reasonable": function (e){
      var price_base = Number($(this).attr("price_base"));
      var last_price = Number($(this).attr("last_price"));
      var price_reasonable = true;
      var price = Number($(this).html());
      var this_price_to_base_on_unit_1 = price;
      var currentUnitElement = $(this).parent().find('[name="units_factor"] span.info');
      var currentUnit = currentUnitElement.attr("name");
      for(var i = currentUnit.replace("unit_",""); i>1;i--){
        this_price_to_base_on_unit_1 = this_price_to_base_on_unit_1*
          Number(currentUnitElement.parent().find('[name="unit_'+i+'"]').attr("factor"));
      }

      var doc_type = $('[name="generated_id"]').html().replace(/-\d+/,"");

      var $_this = $(this);
      if(doc_type == "xs"){
        if(price_base && this_price_to_base_on_unit_1 < price_base||
           last_price && this_price_to_base_on_unit_1 < last_price
          ){
          price_reasonable = false;
          $_this.attr("title", "价格为："+price+"，低于近期进价或售价！");
        }else{
          $_this.attr("title", "");
        }
      }
      if(doc_type == "jh"){
        if(price_base && this_price_to_base_on_unit_1 > price_base||
           last_price && this_price_to_base_on_unit_1 > last_price
          ) {
          price_reasonable = false;
          $_this.attr("title", "价格为："+price+"，高于近期进价！");
        }else{
          $_this.attr("title", "");
        }
      }

      if(price_reasonable == false) $(this).addClass("danger");
      else $(this).removeClass("danger");
    },

    //tr 用return function的方式,在viewer 中使用
    //td 用eventlistener 的方式，在创建中使用
    "make_td_contenteditable": function (type){
        this.setAttribute("contenteditable","true");
    },

    "query_products": function(e){
      if(e.keyCode == 13){
        var that = this;
        var q_condition_column;
        if (this.innerHTML.charCodeAt(0)>= 123 || 
            this.innerHTML.charCodeAt(0)<= 96)
          q_condition_column = "full_name";
        else
          q_condition_column = "py_code";
        (function query(string){
          var ajax_object;
          if (window.XMLHttpRequest) ajax_object = new XMLHttpRequest();
          else {/*code for IE6, IE5*/ajax_object = new ActiveXObject("Microsoft.XMLHTTP");}
          
          ajax_object.onreadystatechange = function(){
            if (ajax_object.readyState === XMLHttpRequest.DONE && ajax_object.status === 200){
              if(Number(ajax_object.response) != 0){
                var table_head = [
                  [{type: "a",value:["name","line_number"]},{type: "i",value:"行号"}],
                  [{type: "a",value:["name","product_id"]},{type: "i",value:"商品编号"}],
                  [{type: "a",value:["name","manufacturer"]},{type: "i",value:"生产厂家"}],
                  [{type: "a",value:["name","admin_defined_order"]},{type: "i",value:"用户排序"}],
                  [{type: "a",value:["name","full_name"]},{type: "i",value:"商品全名"}],
                  [{type: "a",value:["name","simple_name"]},{type: "i",value:"简名"}],
                  [{type: "a",value:["name","unit_1"]},{type: "i",value:"单位1"}],
                  [{type: "a",value:["name","unit_2"]},{type: "i",value:"单位2"}],
                  [{type: "a",value:["name","unit_2_factor"]},{type: "i",value:"单位2系数"}],//辅助单位需要有alt 弹出提示吗？
                  [{type: "a",value:["name","unit_3"]},{type: "i",value:"单位3"}],
                  [{type: "a",value:["name","unit_3_factor"]},{type: "i",value:"单位3系数"}],//辅助单位需要有alt 弹出提示吗？
                  [{type: "a",value:["name","py_code"]},{type: "i",value:"拼音码"}],
                  [{type: "a",value:["name","user_comment"]},{type: "i",value:"用户备注"}]
                ];
                //重写查询结果对象
                td.query_result = JSON.parse(ajax_object.response);
                    
                var storeArray = [];
                ls.edit.data_convert_JSON_to_array(td.query_result, storeArray, table_head, "for_input");

                var display_table = ls.create_list_table(
                  table_head,
                  storeArray,
                  [
                    ["click", function(e){td.builder.selection_status(e, this,"select_one");}]
                  ]
                );
                var modal = ls.checker.status.pop_up_creator("商品查询结果", display_table);
                modal.querySelector('.modal-content').addEventListener("click", function(e){td.builder.selection_status(e, this, "unselect_all");});
                modal.querySelector('.btn-primary').addEventListener("click", td.builder.input_selected_products);
                ajax_object.response = 0;
              }
              else {
                ls.checker.status.pop_up_creator("查询提示", $("<p>当前查询条件无结果</p>").get(0));
              }
            }
          };
          
          ajax_object.open("GET", "query.php?" + string, true);
          ajax_object.send();
        }
        )("query_multiple&q_columns_name=*&q_table=product_info&q_condition&c_1_"+q_condition_column+"="+that.innerHTML+"&order_by=admin_defined_order");

        event.preventDefault();
      }
    },
    //query_products 对象结束

    "query_single_and_modify": function(that, q_name, q_table, q_condition){
      //php发现query_single标记后，进行单挑条目查询，返回字符串
      var query_result;
      
      (function query(string) 
      {
      var ajax_object;
      if (window.XMLHttpRequest) ajax_object = new XMLHttpRequest();
      else {/*code for IE6, IE5*/ajax_object = new ActiveXObject("Microsoft.XMLHTTP");}

      ajax_object.onreadystatechange = function(){
        if (ajax_object.readyState === XMLHttpRequest.DONE && ajax_object.status === 200)

        that.innerHTML = ajax_object.response;

      };
      ajax_object.open("GET", "query.php?" + string, true);ajax_object.send();
      }
      )(
        "query_single&q_name="+q_name+"&q_table="+q_table+"&q_condition="+q_condition
       );
    },

    // "query_multiple": function(q_columns_name, q_table, q_condition_column, q_condition_value){
    //   var that = this;

    //   (function query(string) 
    //   {
    //   ajax_object.onreadystatechange = function(){
    //     if (ajax_object.readyState === XMLHttpRequest.DONE && ajax_object.status === 200) 

    //     if(JSON.parse(ajax_object.response)) that.query_result = JSON.parse(ajax_object.response);
    //     else query_result = false;

    //   };
    //   ajax_object.open("GET", "query.php?" + string, true);ajax_object.send();
    //   }
    //   )(
    //     "query_multiple&q_columns_name="+q_columns_name
    //        +"&q_table="+q_table
    //        +"&q_condition_column="+q_condition_column
    //        +"&q_condition_value="+q_condition_value
    //    );    
    // },

    "make_selection_single": function (){
      document.querySelector('#pop_up').focus();
        if(this.className!=="info"){
            var a = document.querySelector("#pop_up").getElementsByClassName("info");
            for (var i = 0; i < a.length; i++) {
              a[i].className = "";
              }
            this.className="info";
        }
        else this.className="";
    },

    //使用info来进行选中高亮、选中标记
    "selection_status": function(e, that, type){
      if(type){
        if (type=="select_one") {
            document.querySelector('#pop_up').focus();
            if(that.className!=="info"){
              that.className="info";
            }
            else that.className="";
            e.stopPropagation();
          };
      
        if(type == 'unselect_all'){
            $(that).find(".info").removeClass('info');
          }
      
        // e.stopPropagation();
      }

    },

    "toggle_display": function (){
        if(window.getComputedStyle(this).display=="none"){
        this.style.display="block";
      }
        else this.style.display="none";
        
    },

    "esc_display": function(event){
        if(event.keyCode == 27){
        $("#pop_up_modal").modal("hide");
        }
    },

    "input_selected_products": function(event){
      if(event.keyCode ==13 || event.type=="click" ){
        //a 是选中的元素组成的数组
        //获取视图中发票的id
        var a = $("#pop_up").find(".info"),
            id = $("td[name='invoice_id']").attr("invoice_id"),
            i_c = $("#i_c"),
            new_tr,
            storeObject = {
              //for ajax
              //price_based on tag 需要添加
              people_id: $("#i_des").find('[name="trading_object"]').attr("people_id"),
              products: {},//数据格式为id:[price_base, last_price, amount_in_store_house]
              doc_type : $('[name="generated_id"]').html().replace(/-\d+/,""),
              store_house : td.document_lists["invoice_id"+id].store_house[0]
            };
        var e_point = i_c.find("*[input_end_point]").first();

        for (var i = 0; i < a.length; i++) {
          var o = {
              "product_id": Number($(a[i]).find('*[name="product_id"]').html()),
              "manufacturer":$(a[i]).find('*[name="manufacturer"]').html(),
              "full_name": $(a[i]).find('*[name="full_name"]').html(),
              "units_factor": [],
              "unit": "unit_1",
              "amount": 0,
              "price": 0,
              "item_income": 0,
              "comment_for_item":""
          };
          o.units_factor = [
            "unit_1",
            ["unit_1", $(a[i]).find('[name="unit_1"]').text(), 1]
          ];

          if($(a[i]).find('[name="unit_2"]').text() && $(a[i]).find('[name="unit_2_factor"]').text())
            o.units_factor.push(["unit_2", $(a[i]).find('[name="unit_2"]').text(), Number($(a[i]).find('[name="unit_2_factor"]').text())]);

          if($(a[i]).find('[name="unit_3"]').text() && $(a[i]).find('[name="unit_3_factor"]').text())
            o.units_factor.push(["unit_3", $(a[i]).find('[name="unit_3"]').text(), Number($(a[i]).find('[name="unit_3_factor"]').text())]);

          storeObject.products[o.product_id]=0;

          new_tr = $(td.builder.create_invoice_line(o,td.document_lists.invoice_content_head_description_array, 1));

          if(!e_point){
            e_point = i_c.children().last().attr("input_end_point","");
          }
          new_tr.insertBefore(e_point);
        }

        $.ajax({
          url: "query.php?complex_query&items_price&items_amount",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify(storeObject),

          success: function(data, status, XMLHttpRequest_object){
            cl(data);
            data = JSON.parse(data);
            for(var product_id in data.products){
              var price_element = i_c.find('[product_id="'+product_id+'"]').last().parent().find('[name="price"]');
              var price_base = data.products[product_id][0]?data.products[product_id][0]:0;
              var last_price = data.products[product_id][1]?data.products[product_id][1]:0;
              var remaining_amount = data.products[product_id][2]?data.products[product_id][2]:0;
              var amount_elements = i_c.find('[product_id="'+product_id+'"]').parent().find('[name="amount"]');
              amount_elements.attr("remaining_amount", remaining_amount);
              price_element.attr("price_base", price_base);
              price_element.attr("last_price", last_price);
              price_element.text(last_price);
            };
          }
        });
        
        e_point.find('[name="full_name"]').text("");
        if(e_point.get(0)!=e_point.parent().children().last().get(0)) e_point.remove();

        if(event.preventDefault)event.preventDefault();
        $("#pop_up_modal").find('.btn-primary').off("click", td.input_selected_products);

        //关闭pop_up
        td.builder.esc_display({keyCode:27});
        td.builder.line_number_refresher(document.querySelector("#i_c"))
      }
    },

    "input_selected_des": function(event){
      if(event.keyCode ==13 || event.keyCode ==32 ||event.type=="click" ){
         //获取视图中发票的id
        var id = document.querySelector("td[name='invoice_id']").getAttribute("invoice_id");

        //修改对象
        var a = $("#pop_up tr.info");
        var trading_object = [a.find('[name="people_id"]').text(), a.find('[name="full_name"]').text()];
        td.document_lists["invoice_id"+id].trading_object = trading_object;

        //在此修tab
        var tab = document.querySelector("[my_invoice_id='"+id+"']");
        tab.querySelector("a").innerHTML = tab.querySelector("a").innerHTML.replace(/^(销售给|进货从).*/,'$1'+trading_object[1]);

        //在此修td
        var des_td = $("td[name='trading_object']");cl(des_td);
        des_td.text(trading_object[1]).attr("placeholder",trading_object[1]).attr("people_id",trading_object[0]);
        des_td.on("blur", td.builder.cell_checker);

        event.preventDefault();
         //关闭pop_up
        td.builder.esc_display({keyCode:27});
        document.querySelector('#pop_up').removeEventListener("keypress",td.builder.input_selected_des);
        document.querySelector('.btn-primary').removeEventListener("click",td.builder.input_selected_des);
      }
    },

    "query_result": 0,

    "query_people": function(event){
      if (event.keyCode == 13){
        var that = this;
        var q_condition_column;
        //判断是否是拼音或者汉子
        if (that.innerHTML.charCodeAt(0)>= 123 ||
            that.innerHTML.charCodeAt(0)<= 96)
          q_condition_column = "full_name";
        else
          q_condition_column = "py_code";
        var string = "query_multiple&q_columns_name=*&q_table=people&q_condition&c_1_"+q_condition_column+"="+that.innerHTML+"&order_by=admin_defined_order";
        (function query(string){
          var ajax_object;
          if (window.XMLHttpRequest) ajax_object = new XMLHttpRequest();
          else {/*code for IE6, IE5*/ajax_object = new ActiveXObject("Microsoft.XMLHTTP");}

          ajax_object.onreadystatechange = function(){
            if (ajax_object.readyState === XMLHttpRequest.DONE && ajax_object.status === 200){
              if(Number(JSON.parse(ajax_object.response))!= 0) {
                var table_head = [
                  [{type: "a",value:["name","line_number"]},{type: "i",value:"行号"}],
                  [{type: "a",value:["name","people_id"]},{type: "i",value:"客户编号"}],
                  [{type: "a",value:["name","admin_defined_order"]},{type: "i",value:"用户排序"}],
                  [{type: "a",value:["name","full_name"]},{type: "i",value:"客户全名"}],
                  [{type: "a",value:["name","simple_name"]},{type: "i",value:"简名"}],
                  [{type: "a",value:["name","person_in_charge"]},{type: "i",value:"负责人"}],
                  [{type: "a",value:["name","tel"]},{type: "i",value:"电话"}],
                  [{type: "a",value:["name","phone"]},{type: "i",value:"手机"}],
                  [{type: "a",value:["name","Address"]},{type: "i",value:"地址"}],
                  [{type: "a",value:["name","role"]},{type: "i",value:"角色"}],
                  [{type: "a",value:["name","loyalty"]},{type: "i",value:"忠诚度"}],
                  [{type: "a",value:["name","complexity"]},{type: "i",value:"复杂度"}],
                  [{type: "a",value:["name","py_code"]},{type: "i",value:"拼音码"}],
                  [{type: "a",value:["name","user_comment"]},{type: "i",value:"备注"}]
                ];
                //that, td 都可用，思考原因
                td.query_result = JSON.parse(ajax_object.response);

                var storeArray = [];
                ls.edit.data_convert_JSON_to_array(td.query_result, storeArray, table_head, "for_input");

                var display_table = ls.create_list_table(
                  table_head,
                  storeArray,
                  [
                    ["mouseenter", td.builder.make_selection_single],
                    ["click",td.builder.input_selected_des]
                  ]
                  );
                var modal = ls.checker.status.pop_up_creator("往来单位查询结果", display_table);
                modal.querySelector('#pop_up').addEventListener("keypress",td.builder.input_selected_des);
                modal.querySelector('.btn-primary').addEventListener("click",td.builder.input_selected_des);
                ajax_object.response = 0;
              }
              else {
                ls.checker.status.pop_up_creator("查询提示", $("<p>当前查询条件无结果</p>").get(0));
              }
            }
          };

          ajax_object.open("GET", "query.php?" + string, true);
          ajax_object.send();
        }
        )(string);

        //enter key event
        event.preventDefault();
        // event.stopPropagation();
      }
    }
  }
};
//td 对象结束

// var css_modify = {
//   "drop_down_toggle_display":function(e){
//     // alert("good");
//     if (e.type=="mouseover")
//     this.querySelector("ul").style.display="block";
//     if(e.type=="mouseout")
//     this.querySelector("ul").style.display="none";
//   },

//   "add_mouser_over_out_to_element": function(selector){
//     document.querySelector(selector).addEventListener("mouseover", css_modify.drop_down_toggle_display);
//     document.querySelector(selector).addEventListener("mouseout", css_modify.drop_down_toggle_display);
//   }

// };
// css_modify.add_mouser_over_out_to_element("#invoice_create");
// css_modify.add_mouser_over_out_to_element("#basic_information_build");

function in_page_query (event){
  if(event.keyCode==13){
    var that = this;
    this.innerHTML = td.query_single_and_modify(that,"full_name","people","id="+this.innerHTML);
  
    event.preventDefault();
  }

}


//new file imported
//如何阻止用户close window？
// window.onclose = window_close_check;

function window_close_check (e) {
  alert("what");
  e.preventDefault();
}

//ls,list 是与“列表”相关的对象，该对象主要实现以下功能：
  // 查询可以列表的信息，并以列表的形式展示信息（商品信息、客户信息、价格信息、经营历程之类）
  // 要求部分列表具有筛选功能
  // 对这些信息进行增添、修改、删除
// 主要列表的对象
//   product_info
//   people_info
//   specific_price_specific_person
//   invoice_list
//     history_invoice
//     draft_invoice
// 主要方法
//   display
//   query
//   filter

//   pr_q_d
//   pe_q_d

//   edit类方法
//   saver类方法
var ls = list = {
  "create_list_table": function(table_head, table_data, trEventListener){
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

    //新建的table
    var table = document.createElement("table");
    $(table).addClass("table table-condensed table-bordered");

    var thead=document.createElement("thead"),
        th = document.createElement("tr");//th是head_tr

    thead.appendChild(th);
    table.appendChild(thead);//表头字段写入页面

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

    var tbody=document.createElement("tbody");
    table.appendChild(tbody);


    for (var i = 0,tr; i < table_data.length; i++) {//遍历每一个数组元素，创建对一个的tr，一个tr对应一个商品
      tr = tbody.appendChild(ls.create_list_line(table_data[i], th));
      tr.querySelector("td").innerHTML= 1+i;
      if(trEventListener) {
        for (var j = 0,listener; j < trEventListener.length; j++) {
          listener = trEventListener[j];
          tr.addEventListener(listener[0],listener[1]);
        };
      }
    }

    return table;
  },

  display: function(element, container){
    container.innerHTML = "";
    container.appendChild(element);
    return element;
  },

  create_list_line: function(table_data_i, tr_in_thead, tr){
    //tr_in_thead 当前视图的表格中的thead 的 tr行
    var tr = document.createElement("tr");
    tr.setAttribute("td_modify_count",0);
    for (var j = 0; j < tr_in_thead.children.length; j++) {//遍历head_tr的每一个td，也就是每一列
      var td = document.createElement("td");
      for (var k = 0; k < table_data_i.length; k++) {//遍历单个商品数组的每一个元素，每个元素数组对应一个td
        for (var l = 0; l < table_data_i[k].length; l++) {//td对应tr数组的一个元素，遍历td元素的元素，
          if(table_data_i[k][l].type == "a" && table_data_i[k][l].value[0]=="name" && table_data_i[k][l].value[1]== tr_in_thead.children[j].getAttribute("name")) 
          { 
            for (var l = 0; l < table_data_i[k].length; l++) {
              switch(table_data_i[k][l].type){
                case "a": 
                    td.setAttribute(table_data_i[k][l].value[0],table_data_i[k][l].value[1]);
                    // cl("set "+table_data_i[k][l].value[0]+" to "+table_data_i[k][l].value[1]+" success!");
                    break;
                case "e": 
                    td.addEventListener(table_data_i[k][l].value[0],table_data_i[k][l].value[1]);
                    // cl("set "+table_data_i[k][l].value[0]+" event to "+table_data_i[k][l].value[1]+" success!");
                    break;
                case "i": 
                    td.innerHTML = "";
                    td.appendChild(
                      typeof table_data_i[k][l].value=="string"||
                      typeof table_data_i[k][l].value=="number"
                      ?document.createTextNode(table_data_i[k][l].value):table_data_i[k][l].value);
                    // cl("set innerHTML to "+table_data_i[k][l].value[0]+" success!");
                    break;
              }
              // break;
            }
            break;break;
          }
        }
      }
      tr.appendChild(td);
    }
    return tr;
  },

  // 用于list查询
  //   商品列表的信息
  //   客户信息
  //   单据信息
  //   价格信息
  "query": function(queried_columns, table, q_condition, order_by){
    // q_condition 是查询条件，是一个对象
    // {
    //   doc_type: "xs"
    // }
    // 文件头声明的文件
    var condition="";
    if(q_condition){
      var j = 1;
      for (var i in q_condition) {
        condition = "&c_"+j+"_"+i+"="+q_condition[i];
        ++j;
      };
      condition = "&q_condition"+condition;
    }
    if(order_by){
      order_by = "&order_by="+order_by;
    }else{
      order_by = "";
    }
    ajax_object.open("GET", "query.php?query_multiple&q_columns_name="+queried_columns+"&q_table="+table+condition+order_by, true);
    ajax_object.send();
  },

  "pr_q_d": function(e){
    //product query and display，用于商品信息的查询event listener
    // 在展示商品信息之前检查状态，如果有修改则提示用户保存修改
    // 创建p_display函数，这个函数用来展示商品信息
    if(ls.checker.status.whether_table_modified()) {
          alert("请保存或者放弃修改！");
          return;
    }


    ui.tabManager("create",{
      html_attr:{
        tab_type: "list",
        list_type: "product_info"
      },


      eventListeners: [
        ["click", ls.pr_q_d],
      ],

      tabContent: $("<a/>",{
        href: "#",
        text: "商品信息"
      }).get(0)
    });
    
    function p_display(){
      var p_names = ls.product_info[5];
      ls.edit.data_convert_JSON_to_array(ls.product_info[1], ls.product_info[2], p_names, "product");

      var ds = document.querySelector("#display_section");
      var created_table = ls.create_list_table(ls.product_info[5],ls.product_info[2]);
      created_table.addEventListener("click", ls.checker.status.row_checker);
      ls.display(created_table, ds);

      //显示完成，将状态置0
      ls.product_info[0]=0;


      //给基础信息页面添加功能：新建商品、删除商品、保存更改、放弃更改（什么是更改？新建、删除、修改都是更改）
      //f_list是 ul元素
      var ds = $("#display_section");
      var f_container = $("<div></div>"/*,{
        class: "container"
      }*/).appendTo(ds);

      var f_list = $('<div></div>',{
        'name': 'f_list',
        class: "btn-group", 
        role:"group"
      }).appendTo(f_container);

      var f_list_1 = $('<button ></button>',{
        "name": "createNewItem",
        type: "button", 
        class: "btn btn-default"
      }).text("新建商品").on("click", function(){
        ls.edit.item_creator("product");
      });

      var f_list_2 = $('<button ></button>',{
        "name": "deleteItem",
        type: "button", 
        class: "btn btn-default"
      }).text("停用商品").on("click", function(){
        ls.checker.hidden_toggle.call($("tbody tr.info").find("[name='hidden_toggle']").get(0),{"type":"click"});
      });

      var f_list_3 = $('<button ></button>',{
        "name": "saveChange",
        type: "button", 
        class: "btn btn-default"
      }).text("保存修改").on("click", function(){
        ls.edit.items_saver("product");
      });

      var f_list_4 = $('<button ></button>',{
        "name": "abortChange",
        type: "button", 
        class: "btn btn-default"
      }).text("放弃修改").on("click",ls.edit.abortChange);

      f_list.append(f_list_1, f_list_2, f_list_3, f_list_4);
      ls.checker.status.whether_table_modified();
    }

    //检查ls.product_info[0]的值
      // -1表示没有数据，需要从服务器抓取数据
      // 0表示没有基础信息变动，无需从服务器抓取数据，直接显示商品
      // 1表示基础信息已有变动，需要更新到服务器

    if(ls.product_info[0]==0) p_display();
    else {

      // 文件头声明的文件
      ajax_object.onreadystatechange = function(){
        if (ajax_object.readyState === XMLHttpRequest.DONE && ajax_object.status === 200){
          if(Number(ajax_object.response) != 0){
            ls["product_info"][2] = [];
            ls["product_info"][1] = JSON.parse(ajax_object.response);//查询的结果数组立即作为数组存储
            ls["product_info"][0] = 0;
            p_display();
          }//内if结束
          else {
            alert("当前查询条件无结果");
            return;
          }
        }//外if 结束
      };

      ls.query("*","product_info","","admin_defined_order");
    }
  },

  "product_info": [
    -1,
    [],
    [],
    [1,[]],
    [
      "id",
      "manufacturer",
      "admin_defined_order",
      "full_name",
      "simple_name",
      "unit_1",
      "unit_2",
      "unit_2_factor",
      "unit_3",
      "unit_3_factor",
      "price_base",
      "price_for_manufacturer",
      "price_for_dealer",
      "price_for_bigger",
      "price_for_big",
      "price_for_Medium",
      "price_for_small",
      "price_for_smaller",
      "price_for_smallest",
      "py_code",
      // "size_id",
      "created_at",
      "changed_at",
      "hidden_toggle",
      "user_comment",
      "system_log"
    ],
    [
      [{type: "a",value:["name","line_number"]},{type: "i",value:"行号"}],
      [{type: "a",value:["name","product_id"]},{type: "i",value:"商品编号"}],
      [{type: "a",value:["name","manufacturer"]},{type: "i",value:"生产厂家"}],
      [{type: "a",value:["name","admin_defined_order"]},{type: "i",value:"用户排序"}],
      [{type: "a",value:["name","full_name"]},{type: "i",value:"商品全名"}],
      [{type: "a",value:["name","simple_name"]},{type: "i",value:"简名"}],
      [{type: "a",value:["name","unit_1"]},{type: "i",value:"单位1"}],
      [{type: "a",value:["name","unit_2"]},{type: "i",value:"单位2"}],
      [{type: "a",value:["name","unit_2_factor"]},{type: "i",value:"单位2系数"}],//辅助单位需要有alt 弹出提示吗？
      [{type: "a",value:["name","unit_3"]},{type: "i",value:"单位3"}],
      [{type: "a",value:["name","unit_3_factor"]},{type: "i",value:"单位3系数"}],//辅助单位需要有alt 弹出提示吗？
      [{type: "a",value:["name","price_base"]},{type: "i",value:"基准价"}],
      [{type: "a",value:["name","price_for_manufacturer"]},{type: "i",value:"厂商价"}],
      [{type: "a",value:["name","price_for_dealer"]},{type: "i",value:"经销商价"}],
      [{type: "a",value:["name","price_for_bigger"]},{type: "i",value:"特大户价"}],
      [{type: "a",value:["name","price_for_big"]},{type: "i",value:"大户价"}],
      [{type: "a",value:["name","price_for_Medium"]},{type: "i",value:"中户价"}],
      [{type: "a",value:["name","price_for_small"]},{type: "i",value:"小户价"}],
      [{type: "a",value:["name","price_for_smaller"]},{type: "i",value:"个人价"}],
      [{type: "a",value:["name","price_for_smallest"]},{type: "i",value:"零售价"}],
      [{type: "a",value:["name","py_code"]},{type: "i",value:"拼音码"}],
      [{type: "a",value:["name","created_at"]},{type: "i",value:"创建时间"}],
      [{type: "a",value:["name","changed_at"]},{type: "i",value:"上次修改时间"}],
      [{type: "a",value:["name","hidden_toggle"]},{type: "i",value:"是否停用"}],
      [{type: "a",value:["name","user_comment"]},{type: "i",value:"用户备注"}]
    ]
  ],
  //products_tag 加入,第一个元素表状态，
    // -1表示没有数据，需要从服务器抓取数据
    // 0表示没有基础信息变动，无需从服务器抓取数据，需要置0的情况：
      // 展示完成后
      // 更新过修改后
    // 1表示基础信息已有变动，需要更新到服务器;或者需要从服务器刷新数据
  // 第二个元素表示抓取的原始数据，
  // 第三个元素表示处理过，用于展示的数据
  // 第四个元素是一个包含两个元素的数组,该数组用语更新商品信息
    // 第一个元素表示更新状态，1表示需要更新（还未更新），0表示不需要更新(已经更新)
    // 第二个元素是数组，表示需要更新的商品，其格式：
      // [{},{}.....],每一个元素都是一个对象，对象格式：
      // 操作类型t：a表示添加，u表示更新（修改）,d表示删除
      // id：如果是删除或者更新，则指明id，否则id 为0
        // {
        //   t:"u",
        //   id: 0,
        //   content: {
        //     name: value,
        //     ...
        //   }
        // }
  // 第五个元素是一个数组,该数组用于描述商品的属性
  // 第六个元素是一个数组,该数组用于描述展示商品的列表的表头属性
  history_q_d: function(type){
    //type 指明是历史还是草稿
    ui.tabManager("create",{
      html_attr:{
        tab_type: "list",
        list_type: "invoice_"+type
      },

      eventListeners: [
        ["click", function(){ls.history_q_d(type);}],
      ],

      tabContent: $("<a/>",{
        href: "#",
        text: type=="craft"?"草稿单据":"经营历程"
      }).get(0)
    });
    function h_display(){
      var p_names = ls.i_history[5];
      ls.edit.data_convert_JSON_to_array(ls.i_history[1], ls.i_history[2], p_names, "history");

      var ds = document.querySelector("#display_section");
      var created_table = ls.create_list_table(ls.i_history[5], ls.i_history[2], [
        ["dblclick", td.creator_in_history_list]
      ]);
      created_table.addEventListener("click", ls.checker.status.row_checker);
      ls.display(created_table, ds);

      //显示完成，将状态置0
      // ls.i_history[0]=0;


      //给基础信息页面添加功能：查看单据、编辑单据|红冲并修改单据、删除单据、关闭页面
      //f_list是 ul元素
      var ds = $("#display_section");
      var f_container = $("<div></div>"/*,{
        class: "container"
      }*/).appendTo(ds);

      var f_list = $('<div></div>',{
        'name': 'f_list',
        class: "btn-group", 
        role:"group"
      }).appendTo(f_container);

      var f_list_1 = $('<button ></button>',{
        "name": "createNewItem",
        type: "button", 
        class: "btn btn-default"
      }).text("查看单据").on("click", function(){
        var tr_info = $(created_table).find("tr.info");
        td.creator_in_history_list.apply(tr_info);
      });

      var f_list_2 = $('<button ></button>',{
        "name": "deleteItem",
        type: "button", 
        class: "btn btn-default"
      }).text(type=="craft"?"编辑单据":"红冲并修改单据").on("click", function(){
        if(type=="craft"){
          var tr_info = $(created_table).find("tr.info");
          td.creator_in_history_list.apply(tr_info);
        }
        if(type=="history"){

        }
      });

      var f_list_3 = $('<button ></button>',{
        "name": "saveChange",
        type: "button", 
        class: "btn btn-default"
      }).text("删除单据").on("click", function(){
        ls.edit.items_saver("people");
      });

      var f_list_4 = $('<button ></button>',{
        "name": "abortChange",
        type: "button", 
        class: "btn btn-default"
      }).text("关闭页面")/*.on("click",ls.edit.abortChange)*/;

      f_list.append(f_list_1, f_list_2, f_list_3, f_list_4);
    }

    //检查ls.i_history[0]的值
      // -1表示没有数据，需要从服务器抓取数据
      // 0表示没有基础信息变动，无需从服务器抓取数据，直接显示商品
      // 1表示基础信息已有变动，需要更新到服务器

    if(ls.i_history[0]==0) h_display();
    else {

      // 文件头声明的文件
      ajax_object.onreadystatechange = function(){
        if (ajax_object.readyState === XMLHttpRequest.DONE && ajax_object.status === 200){
          if(Number(ajax_object.response) != 0){
            ls["i_history"][2] = [];
            ls["i_history"][1] = JSON.parse(ajax_object.response);//查询的结果数组立即作为数组存储
            ls["i_history"][0] = 1;
            h_display();
          }//内if结束
          else {
            ls.checker.status.pop_up_creator("单据列表查询结果",$("<p>当前条件无单据</p>").get(0));
            return;
          }
        }//外if 结束
      };
      ls.query("*","transaction_documents_description",type=="craft"?{"document_status":"草稿"}:0, "created_time");
    }
  },

  "i_history": [
    -1,
    [],
    [],
    [1,[]],
    [
      "line_number",
      "id",
      "doc_type",
      "trading_object",
      "created_time",
      "update_time",
      "store_house",
      "money_received",
      "comment",
      "document_status"
    ],
    [
      [{type: "a",value:["name","line_number"]},{type: "i",value:"行号"}],
      [{type: "a",value:["name","invoice_id"]},{type: "i",value:"单据编号"}],
      [{type: "a",value:["name","doc_type"]},{type: "i",value:"单据类型"}],
      [{type: "a",value:["name","trading_object"]},{type: "i",value:"往来单位"}],
      [{type: "a",value:["name","created_time"]},{type: "i",value:"单据创建时间"}],
      [{type: "a",value:["name","update_time"]},{type: "i",value:"最后更新时间"}],
      [{type: "a",value:["name","store_house"]},{type: "i",value:"仓库"}],
      [{type: "a",value:["name","money_received"]},{type: "i",value:"单据总额"}],
      [{type: "a",value:["name","comment"]},{type: "i",value:"用户备注"}],
      [{type: "a",value:["name","document_status"]},{type: "i",value:"单据状态"}]
    ]
  ],

  "pe_q_d": function(e){
    // people query and display，用于用户信息的查询event listener
    // 在展示客户信息之前检查状态，如果有修改则提示用户保存修改
    // 创建p_display函数，这个函数用来展示客户信息
    if(ls.checker.status.whether_table_modified()) {
          alert("请保存或者放弃修改！");
          return;
    }

    ui.tabManager("create",{
      html_attr:{
        tab_type: "list",
        list_type: "people_info"
      },

      eventListeners: [
        ["click", ls.pe_q_d],
      ],

      tabContent: $("<a/>",{
        href: "#",
        text: "客户信息"
      }).get(0)
    });
    
    function p_display(){
      var p_names = ls.people_info[5];
      ls.edit.data_convert_JSON_to_array(ls.people_info[1], ls.people_info[2], p_names, "people");

      var ds = document.querySelector("#display_section");
      var created_table = ls.create_list_table(ls.people_info[5],ls.people_info[2]);
      created_table.addEventListener("click", ls.checker.status.row_checker);
      ls.display(created_table, ds);

      //显示完成，将状态置0
      ls.people_info[0]=0;


      //给基础信息页面添加功能：新建商品、删除商品、保存更改、放弃更改（什么是更改？新建、删除、修改都是更改）
      //f_list是 ul元素
      var ds = $("#display_section");
      var f_container = $("<div></div>"/*,{
        class: "container"
      }*/).appendTo(ds);

      var f_list = $('<div></div>',{
        'name': 'f_list',
        class: "btn-group", 
        role:"group"
      }).appendTo(f_container);

      var f_list_1 = $('<button ></button>',{
        "name": "createNewItem",
        type: "button", 
        class: "btn btn-default"
      }).text("新建客户").on("click", function(){
        ls.edit.item_creator("people");}
      );

      var f_list_2 = $('<button ></button>',{
        "name": "deleteItem",
        type: "button", 
        class: "btn btn-default"
      }).text("删除客户").on("click", function(){
        ls.checker.hidden_toggle.call($("tbody tr.info").find("[name='hidden_toggle']").get(0),{"type":"click"});
      });

      var f_list_3 = $('<button ></button>',{
        "name": "saveChange",
        type: "button", 
        class: "btn btn-default"
      }).text("保存修改").on("click", function(){
        ls.edit.items_saver("people");
      });

      var f_list_4 = $('<button ></button>',{
        "name": "abortChange",
        type: "button", 
        class: "btn btn-default"
      }).text("放弃修改").on("click",ls.edit.abortChange);;

      f_list.append(f_list_1, f_list_2, f_list_3, f_list_4);
      ls.checker.status.whether_table_modified();
    }

    //检查ls.people_info[0]的值
      // -1表示没有数据，需要从服务器抓取数据
      // 0表示没有基础信息变动，无需从服务器抓取数据，直接显示商品
      // 1表示基础信息已有变动，需要更新到服务器

    if(ls.people_info[0]==0) p_display();
    else {

      // 文件头声明的文件
      ajax_object.onreadystatechange = function(){
        if (ajax_object.readyState === XMLHttpRequest.DONE && ajax_object.status === 200){
          if(Number(ajax_object.response) != 0){
            ls["people_info"][1] = JSON.parse(ajax_object.response);//查询的结果数组立即作为数组存储
            ls["people_info"][0] = 0;
            p_display();
          }//内if结束
          else {
            ls.checker.status.pop_up_creator("客户查询结果",$("<p>当前条件无客户</p>").get(0));
            return;
          }
        }//外if 结束
      };
      ls.query("*","people","","admin_defined_order");
    }
  },

  "people_info": [
    -1,
    [],
    [],
    [1,[]],
    [
      "id",
      "admin_defined_order",
      "full_name",
      "simple_name",
      "person_in_charge",
      "tel",
      "phone",
      "Address",
      "role",
      "py_code",
      // "password",
      "loyalty",
      "complexity",
      "hidden_toggle",
      "user_comment" 
    ],
    [
      [{type: "a",value:["name","line_number"]},{type: "i",value:"行号"}],
      [{type: "a",value:["name","people_id"]},{type: "i",value:"客户编号"}],
      [{type: "a",value:["name","admin_defined_order"]},{type: "i",value:"用户排序"}],
      [{type: "a",value:["name","full_name"]},{type: "i",value:"客户全名"}],
      [{type: "a",value:["name","simple_name"]},{type: "i",value:"简名"}],
      [{type: "a",value:["name","person_in_charge"]},{type: "i",value:"负责人"}],
      [{type: "a",value:["name","tel"]},{type: "i",value:"电话"}],
      [{type: "a",value:["name","phone"]},{type: "i",value:"手机"}],
      [{type: "a",value:["name","Address"]},{type: "i",value:"地址"}],
      [{type: "a",value:["name","role"]},{type: "i",value:"角色"}],
      [{type: "a",value:["name","loyalty"]},{type: "i",value:"忠诚度"}],
      [{type: "a",value:["name","complexity"]},{type: "i",value:"复杂度"}],
      [{type: "a",value:["name","py_code"]},{type: "i",value:"拼音码"}],
      [{type: "a",value:["name","hidden_toggle"]},{type: "i",value:"是否删除"}],
      [{type: "a",value:["name","user_comment"]},{type: "i",value:"备注"}]
    ]
  ],
  //people_tag 加入,第一个元素表状态，
    // -1表示没有数据，需要从服务器抓取数据
    // 0表示没有基础信息变动，无需从服务器抓取数据，需要置0的情况：
      // 展示完成后
      // 更新过修改后
    // 1表示基础信息已有变动，需要更新到服务器;或者需要从服务器刷新数据
  // 第二个元素表示抓取的原始数据
  // 第三个元素表示处理过，用于展示的数据
  // 第四个元素是一个包含两个元素的数组,该数组用于更新客户信息（到服务器
    // 第一个元素表示更新状态，1表示需要更新（还未更新），0表示不需要更新(已经更新)
    // 第二个元素是数组，表示需要更新的客户，其格式：
      // [{},{}.....],每一个元素都是一个对象，对象格式：
      // 操作类型t：a表示添加，u表示更新（修改）,d表示删除
      // id：如果是删除或者更新，则指明id，否则id 为0
        // {
        //   t:"u",
        //   id: 0,
        //   content: {
        //     name: value,
        //     ...
        //   }
        // }
  // 第五个元素是一个数组,该数组用于描述客户的属性
  // 第六个元素是一个数组,该数组用于描述展示客户的列表的表头属性

  "specific_price_specific_person": [],



  "checker": {
    //status对象开始，
    //用于标记各种状态，用于检查各种状态，用于修改各种状态
    status: {
      //normal_check, 用来进行整体的check，防止用户在保存修改前就进入其他页面
      normal_check: function(){
        // 检查单机的目标，如果用户未保存修改，则不允许用户进入其他界面

        if(document.querySelector("#i")){
            var invoice_id = document.querySelector("td[name=invoice_id]").getAttribute("invoice_id");
            td.saver_toBg(invoice_id);
            cl("单据"+invoice_id+"已保存到网页后台（未上传服务器）");
        }

        var srcE=event.target.tagName.toLowerCase();

        // console.log(srcE);
        if(srcE=="td"||
          srcE=="th"||
          srcE=="table"||
          srcE=="html"||
          event.target.parentElement.getAttribute("name")=="f_list"
          ){}
        else 
          if(ls.checker.status.whether_table_modified()) {
            alert("请保存或者放弃修改！");
            event.stopPropagation();
          }
      },

      pop_up_creator: function(modalTitle, modalBody){
        //ls.checker.status.pop_up_creator
        var modal = $("#pop_up_modal");
                  modal.modal("show");
                  modal.find(".modal-title").text(modalTitle).click();
        var p = document.querySelector('#pop_up');
        p.innerHTML="";
        p.appendChild(modalBody);
        modal.find("[data-dismiss]").first().focus();
        return $(modal).get(0);
      },
      
      "row_checker": function(e){
        $(this).find("tr.info").removeClass("info");
        if(e.target.tagName.toLowerCase()=="td"){
          $(e.target).parent().addClass("info");
        }
        // .addClass("info");
      },

      whether_td_modified : function(){
      //这个函数用来检测td 的数据是否有改动
      // 第一步检测td的值是否和placeholder一致，placeholder是原始值，检测的方法是删除空白进行检测
        // 如果不同，则检查是否是空白
          // 如果是空白，则改成初始值，然后检查td 的修改状态。检查后，把修改状态变为假
            // 如果修改是真则td 的父元素td_modify_count计数-1

        if(this.innerHTML!=this.getAttribute("placeholder")){
          if(this.innerHTML.replace(removeSpaceInBeginEnd,"")=="") {
            this.innerHTML = this.getAttribute("placeholder");
            if(this.getAttribute("td_modify_status")=="true"){
              this.parentNode.setAttribute("td_modify_count", Number(this.parentNode.getAttribute("td_modify_count"))-1);
            }
            this.setAttribute("td_modify_status",false);
          }
          else {
            if(this.getAttribute("td_modify_status")=="false"){
            this.setAttribute("td_modify_status",true);
            this.parentNode.setAttribute("td_modify_count", 1+Number(this.parentNode.getAttribute("td_modify_count")));
            }
          }
        }
        else{
          if(this.getAttribute("td_modify_status")=="true"){
            this.parentNode.setAttribute("td_modify_count", Number(this.parentNode.getAttribute("td_modify_count"))-1);
          }
          this.setAttribute("td_modify_status",false);
        }

        if(Number(this.parentNode.getAttribute("td_modify_count"))>0){
          this.parentNode.setAttribute("tr_modified","");
        }
        else{
          this.parentNode.removeAttribute("tr_modified");
        }
        
      ls.checker.status.whether_table_modified();
      },

      whether_td_modified_allow_space : function(){
      //这个函数用来检测td 的数据是否有改动
      // 第一步检测td的值是否和placeholder一致，placeholder是原始值，检测的方法是删除空白进行检测
        // 如果不同，则检查是否是空白
          // 如果是空白，则改成初始值，然后检查td 的修改状态。检查后，把修改状态变为假
            // 如果修改是真则td 的父元素td_modify_count计数-1

        if(this.innerHTML!=this.getAttribute("placeholder")){
          if(this.getAttribute("td_modify_status")=="false"){
            this.setAttribute("td_modify_status",true);
            this.parentNode.setAttribute("td_modify_count", 1+Number(this.parentNode.getAttribute("td_modify_count")));
          }
        }
        else{
          if(this.getAttribute("td_modify_status")=="true"){
            this.parentNode.setAttribute("td_modify_count", Number(this.parentNode.getAttribute("td_modify_count"))-1);
          }
          this.setAttribute("td_modify_status",false);
        }

        if(Number(this.parentNode.getAttribute("td_modify_count"))>0){
          this.parentNode.setAttribute("tr_modified","");
        }
        else{
          this.parentNode.removeAttribute("tr_modified");
        }
        
      ls.checker.status.whether_table_modified();
      },

      whether_table_modified : function(){
        var ds = document.querySelector("#display_section");
        var ds_t = ds.querySelector("table");
        if(ds_t){
          if($(ds_t).find("[tr_modified]").get(0)){
            $('[name="saveChange"]').addClass('btn-primary').removeAttr("disabled");
            $('[name="abortChange"]').addClass('btn-danger').removeAttr("disabled");
            return true;
          }
          else{
            $('[name="saveChange"]').removeClass('btn-primary').attr("disabled","");
            $('[name="abortChange"]').removeClass('btn-danger').attr("disabled","");
            return false;
          }
        }
      }//whether_table_modified函数结束

    },//status 对象结束

    list_row_number_checker: function(){
      var rows = document.querySelectorAll("tbody tr");
      for (var i = 0;i < rows.length; ++i) {
        rows[i].querySelector("td").innerHTML=1+i;
      }

    },

    admin_defined_order_checker: function(){
      var rows = document.querySelectorAll("tbody tr");
      for (var i = 0;i < rows.length; ++i) {
        var a = rows.item(i).querySelector("[name='admin_defined_order']");
        a.innerHTML=1+i;
        ls.checker.status.whether_td_modified.call(a);
      }
    },

    "word_check_when_input": function (e){
      if(e.keyCode == 13) e.preventDefault();
    },

    //用于标注基本信息是否隐藏
    hidden_toggle: function(e){
      if(e.type=="click"||e.keyCode == 32){
        var a = ls.checker.true_or_false("trueFalseToggle", this.innerHTML, "Boolean");
        this.innerHTML=ls.checker.true_or_false("toAnotherValueType", a, "√");
        ls.checker.status.whether_td_modified_allow_space.call(this);
      }
    },

    "true_or_false": function(type, inputValue, returnType){
    //type 指明toBoolean, trueFalseToggle, toAnotherValueType
      var value, valueType;
      switch(inputValue){
        case true:
        case "true":
        case "真":
        case "√":
        case 1: value = true;break;

        case false:
        case undefined:
        case "false":
        case "":
        case "假":
        case 0: value = false;break;
      }

      switch(inputValue){
        case true: valueType="Boolean";break;
        case "true": valueType="String";break;
        case "真":  valueType="Chinese";break;
        case "√":  valueType="√";break;
        case 1: valueType="Number";break;

        case false: valueType="Boolean";break;
        case undefined: valueType="Boolean";break;
        case "false":valueType="String";break;
        case "": valueType="√";break;
        case "假": valueType="Chinese";break;
        case 0: valueType="Number";break;
      }


      switch(type){
        case "toBoolean" :return Boolean(value);break;
        case "trueFalseToggle":return ls.checker.true_or_false("toAnotherValueType", value?false:true, returnType);break;
        case "toAnotherValueType": 
            switch(returnType){
              case "Boolean": return value?true:false;break;
              case "String": return value?"true":"false";break;
              case "Chinese": return value?"真":"假";break;
              case "√": return value?"√":"";break;
              case "Number": return value?1:0;break;
            };
        break;
      }
    },

    "number_check_after_input": function(){
      if(this.innerHTML!=""){
        var a = Number(this.innerHTML.replace(/ |　|&nbsp;/g,""));
        if(a=="NaN"|| a=="undefined") a = "";
        this.innerHTML= Number(a.toFixed(5));
      }
      
    }
  },



  "history_invoice": [],
  "draft_invoice": [],

  "edit": {
    data_convert_JSON_to_array: function(JSON_array, storeArray, p_names, JSON_array_content_type){
    //参数是数组，数组的元素是JSON 对象
      var switch_function = ls.edit.specific_property_specific_attribute(JSON_array_content_type);
      for (var i = 0; i < JSON_array.length; i++) {
      //外循环开始，遍历每一个item,比如商品或者用户
      // 把每一个服务器的item转化成易于展示的格式，存储到ls.**_info[2]数组中
        storeArray[i] = [];

        // ls.product_info[2][i][j]中存储的是
            // 第i个商品的
              // 第j个属性
                // 每个商品属性都由数组描述，该数组每一个元素决定了商品属性的展示方式，实际上是商品属性的html<元素>的属性
        for (var j = 0; j < p_names.length; j++) {
          // 该循环遍历每一个属性名称
          // a是第j个商品的商品属性（比如名称）的html元素的描述数组（这些属性包括html 元素属性a,事件监听器e,内部html,i）
          var a = storeArray[i][j] = []; 

          // 每一个商品属性对应的html元素都需要拥有name 属性
          switch (p_names[j][0].value[1].search(/(id)$/)!=-1){
            case true:
                property_name_in_JSON_array="id";
                break;
            default: 
                property_name_in_JSON_array = p_names[j][0].value[1];
                break;
          }

          var placeholder = JSON_array[i][property_name_in_JSON_array];//原来的值
          var placeholder = placeholder!=undefined?placeholder.toString():"";
          a.push({type: "a", value: ["name", p_names[j][0].value[1]]});
          a.push({type: "a", value: ["placeholder", placeholder]});//把原来的值存入placeholder 属性中，便于后来的状态检查
          a.push({type: "i", value: placeholder});
          if(switch_function) {
            switch_function(a, p_names[j][0].value[1] ,placeholder);
          }
        }//内循环结束
      }//外循环结束
    },

    specific_property_specific_attribute: function(JSON_array_content_type){//增强td 的功能
      //是product 还是其他？

      // 定义一些需要使用的元素属性的值
      var c_e = ["contenteditable", "true"];
      var nc_w = ["keypress", td.builder.number_check_when_input];
      var nc_a = ["blur", ls.checker.number_check_after_input];
      var text_s = ["click", td.builder.cell_checker];
      //需要包含的函数预定义
      function editable(a){
        a.push(
          {type: "a", value: c_e}, 
          {type: "a", value: ["td_modify_status", false]},
          {type: "e", value: ["keypress", ls.checker.word_check_when_input]},
          {type: "e", value: ["keydown", ls.edit.arrow_key_control]},
          {type: "e", value: text_s}
        );
      }
      function editable_allow_space(a){
        editable(a); 
        a.push(
          {type: "e", value: ["blur",ls.checker.status.whether_td_modified_allow_space]}
          );
      }
      function editable_not_allow_space(a){
        editable(a); 
        a.push(
          {type: "e", value: ["blur",ls.checker.status.whether_td_modified]}
          );
      }

      function e_num(a, placeholder){//add event listener for num tds
        a.push(
          {type: "a", value: ["td_modify_status", false]},
          {type: "e", value: ["blur",ls.checker.status.whether_td_modified_allow_space]},
          {type: "e", value: ["keydown", ls.edit.arrow_key_control]},
          {type: "a", value: c_e}, 
          {type: "e", value: nc_w},
          {type: "e", value: nc_a},
          {type: "e", value: text_s}
          );
        if(placeholder){
          a.push(
            {type: "i", value: Number(placeholder)},
            {type: "a", value: ["placeholder", Number(placeholder)]}
          );
        }
      }

      if(JSON_array_content_type=="product") return function(a, p_name, placeholder){
        switch(p_name){
          case "id" : 
          break;
          case "manufacturer" : editable_allow_space(a); break;
          case "admin_defined_order" : 
              a.push(
                {type: "a", value: ["td_modify_status", false]},
                {type: "e", value: ["blur",ls.checker.status.whether_td_modified]}
              );
              break;
          case "full_name" : 
              editable_not_allow_space(a)
              a.push(
                {type: "e", value: ["blur", ls.edit.py_code_editor]}
                );
              break;
          case "simple_name" : editable_allow_space(a); break;

          case "unit_1" : editable_allow_space(a); break;

          case "unit_2" : editable_allow_space(a); break;
          case "unit_3" :editable_allow_space(a); break;
          case "unit_2_factor" :
          case "unit_3_factor" :
          case "price_base" :
          case "price_for_manufacturer" :
          case "price_for_dealer" :
          case "price_for_bigger" :
          case "price_for_big" :
          case "price_for_Medium" :
          case "price_for_small" :
          case "price_for_smaller" :
          case "price_for_smallest" :
              e_num(a, placeholder);
              break;
          
          case "py_code" : 
              a.push({type: "a", value: ["td_modify_status", false]});
              break;

          // case "size_id" :editable(a); break;
          case "created_at" :;break;
          case "changed_at" :;break;
          case "hidden_toggle" :
              var placeholder = ls.checker.true_or_false("toAnotherValueType", placeholder==""||placeholder=="off"||placeholder==undefined?false:true, "√");
              a.push(
              {type: "a", value: ["td_modify_status", false]},
              {type: "a", value: ["placeholder", placeholder]},//把原来的值存入placeholder 属性中，便于后来的状态检查
              {type: "e", value: ["click",ls.checker.hidden_toggle]},
              {type: "e", value: ["keypress",ls.checker.hidden_toggle]},
              {type: "e", value: ["blur",ls.checker.status.whether_td_modified]},
              {type: "i", value: placeholder}
              );
              break;
          case "user_comment" : editable(a); break;
          case "system_log" : break;
          default:
            break;
        }
      };
      if(JSON_array_content_type=="people") return function(a, p_name, placeholder){
        switch(p_name){
          case "id" : 
          break;
          case "admin_defined_order" : 
              a.push(
                {type: "a", value: ["td_modify_status", false]},
                {type: "e", value: ["blur",ls.checker.status.whether_td_modified]}
              );
              break;
          case "full_name" : 
              editable(a);
              a.push({type: "e", value: ["blur", ls.edit.py_code_editor]});
              break;
          case "simple_name" : editable(a); break;

          case "person_in_charge" : editable(a); break;
          case "tel" :
          case "loyalty":
          case "complexity":
          case "phone" : editable(a);break;
          case "Address" : editable(a); break;

          case "py_code" : 
              a.push({type: "a", value: ["td_modify_status", false]});
              break;

          // case "size_id" :editable(a); break;
          case "role" :;break;
          case "password" :;break;
          case "hidden_toggle" :
              var placeholder = ls.checker.true_or_false("toAnotherValueType", placeholder==""||placeholder=="off"||placeholder==undefined?false:true, "√");
              a.push(
              {type: "a", value: ["td_modify_status", false]},
              {type: "a", value: ["placeholder", placeholder]},//把原来的值存入placeholder 属性中，便于后来的状态检查
              {type: "e", value: ["click",ls.checker.hidden_toggle]},
              {type: "e", value: ["keypress",ls.checker.hidden_toggle]},
              {type: "e", value: ["blur",ls.checker.status.whether_td_modified]},
              {type: "i",  value: placeholder}
              );
              break;
          case "user_comment" :editable(a);break;
          default:
            break;
        }
      };

      if(JSON_array_content_type=="history") {}
        // return function(a, p_name, placeholder){};
    },


    item_creator: function(type){
    // 创建客户或者商品
      var o={},
          a=[],
          tbody = $("tbody"),
          start = $("tr.info");
      
      for(var i=0; i < ls[type+"_info"][5].length;++i){
        o[ls[type+"_info"][5][i][0].value[1]]="";
      }
      ls.edit.data_convert_JSON_to_array([o],a,ls[type+"_info"][5],type);
      
      var new_tr = $(ls.create_list_line(a[0], $("thead tr").get(0)));
      new_tr.addClass("new_created");
      if(!start.get(0)) new_tr.prependTo(tbody);
      else start.after(new_tr);

      ls.checker.list_row_number_checker();

    },

    items_saver: function(type){
      var trs = $("tr[tr_modified]");

      if(trs.get(0)){
        var o_array=[];
        ls.checker.admin_defined_order_checker();
        trs = $("tr[tr_modified]");

        function Item(tr){
          var o={},
              a = $(tr).find('[name="'+type+'_id"]'),
              tds = $(tr).find('[td_modify_status="true"]'); 
              
              o.content = {};

          o.id=a.text() == ""?0:a.text();
          o.t=a.text() == ""?"a":"u";

          for (var i = 0; i < tds.length; i++) {
            var td = $(tds[i]);
            if(td.attr("name")=="hidden_toggle"){
              if(td.text()=="√")o.t="d";
              o.content[td.attr("name")]=td.text()=="√"?1:2;
            }
            else
            o.content[td.attr("name")]=td.text();
          };
          return o;
        }

        for (var i = 0; i < trs.length; i++) {
          ls[type+"_info"][3][1][i] = Item(trs[i]);
        };

        var delete_items = $("[name='hidden_toggle']");
        for (var i = 0; i < delete_items.length; i++) {
          var a = $(delete_items[i]);
          if(a.text()=="√"){
            a.parent().remove();
          }
        };

        //状态
        var table_name;
        switch(type){
          case "product":
              table_name = "product_info";break;
          case "people":
              table_name = "people";break;
          default: break;
        }
        ls[type+"_info"][3][0]=1;

        $.ajax({
          url: "update.php?table="+table_name+"&type=basic_information_build",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify(ls[type+"_info"][3][1]),

          success: function(data, status, XMLHttpRequest_object){
            cl(data);
            ls[type+"_info"][0]=1;
            $("tr.new_created").removeClass("new_created");

            var modified_td = $('[td_modify_status="true"]').attr("td_modify_status",false);
            for (var i = 0; i < modified_td.length; i++) {
              $(modified_td[i]).attr("placeholder",$(modified_td[i]).text());
            };

            $("tr[tr_modified]").removeAttr("tr_modified").attr("td_modify_count",0);

            ls.checker.list_row_number_checker();
            ls.checker.status.whether_table_modified();
            ls[type+"_info"][3][0]=0;
            ls[type+"_info"][3][1]=[];
          }
        });
      }
    },

    abortChange: function(){
      var abortChangeTable = $("[tab_type='list']li.active").attr("list_type");

      ls[abortChangeTable][0]=0;

      $("tr.new_created").remove();

      var modified_td = $('[td_modify_status="true"]').attr("td_modify_status",false);
      for (var i = 0; i < modified_td.length; i++) {
        $(modified_td[i]).text($(modified_td[i]).attr("placeholder"));
      };

      $("tr[td_modify_count]").attr("td_modify_count",0);
      $("tr[tr_modified]").removeAttr("tr_modified");
      ls.checker.list_row_number_checker();
      ls.checker.status.whether_table_modified();

      ls[abortChangeTable][3][0]=0;
      ls[abortChangeTable][3][1]=[];

    },

    py_code_editor: function(){
      var that = this;

      that.innerHTML=that.innerHTML.replace(removeSpaceInBeginEnd,"");

      var py_code = $(that).parent().find('*[name="py_code"]');
      function input_Pinyin(string){
        py_code.text(string);
        ls.checker.status.whether_td_modified.apply(py_code.get(0));
      }
      if($(this).attr("td_modify_status")=="true"){
        if(!$("script[name='Chinese_to_pinyin.js']").get(0)) {
          $.ajax({
            url: "js/Chinese_to_pinyin.js",
            type: "get",
            success: function(result){
              cl("正在加载汉字转拼音脚本");
              $("<script name='Chinese_to_pinyin.js'></script>").appendTo($("head")).text(result);
              input_Pinyin((pinyin.getCamelChars(that.innerHTML)).toLowerCase());
            }
          });
        }
        else
          input_Pinyin((pinyin.getCamelChars(that.innerHTML)).toLowerCase());
      } 
      else
        input_Pinyin(" ");
    },

    arrow_key_control: function(e){
      if(e.keyCode >= 37 && e.keyCode<=40 ){
        var original_value = $(this).text(),new_td;
        switch(e.keyCode){
          //←
          case 37: 
              var prev_editable_td = $(this).prevAll('[contenteditable="true"]')[0];
              if(prev_editable_td){
                new_td = prev_editable_td;
                $(prev_editable_td).focus().click();
              }

              break;
          //↑
          case 38:
              var this_name = $(this).attr("name");
              var prev_editable_td = $(this).parent().prev().find("td[name='"+this_name+"']")[0];
              if(prev_editable_td){
                new_td = prev_editable_td;
                $(prev_editable_td).focus().click();
              }
              break;
          //→
          case 39:
              var next_editable_td = $(this).nextAll('[contenteditable="true"]')[0];
              if(next_editable_td){
                new_td = next_editable_td;
                $(next_editable_td).focus().click();
              }

              break;
          //↓
          case 40:
              var this_name = $(this).attr("name");
              var next_editable_td = $(this).parent().next().find("td[name='"+this_name+"']")[0];
              if(next_editable_td){
                new_td = next_editable_td;
                $(next_editable_td).focus().click();
              }
              break;
          default:
              break;
        }
        if(e.shiftKey&&new_td){
          $(new_td).text(original_value);
        }
        e.preventDefault();
      }
    },
    
    "edit_event": function(){},
    "updater": function(){}, //for basic_info
    "event": function(){} //event for edit
  },

  "filter": function(){}, //for information displaying
};

$(".dropdown-menu li").addClass("btn");

//创建主页
ui.tabManager("create",{
  html_attr:{
    id: "main_page",
    tab_type: ""
  },

  eventListeners: [
    ["click",function(){
      var display_section = $('#display_section');
      display_section.html("");

    }],
  ],

  tabContent: $("<a/>",{
    href: "#",
    text: "主页"
  }).get(0)
});

document.querySelector("#checkout_product_info").addEventListener("click", ls.pr_q_d);
document.querySelector("#checkout_people_info").addEventListener("click", ls.pe_q_d);
document.addEventListener("click",ls.checker.status.normal_check, true);

document.querySelector("#creator_xs").addEventListener("click", td.creator_xs);
document.querySelector("#creator_jh").addEventListener("click", td.creator_jh);
document.querySelector("#view_craft").addEventListener("click", function(){ls.history_q_d("craft");});
document.querySelector("#view_history").addEventListener("click", function(){ls.history_q_d("history");});

document.addEventListener("keydown", td.builder.esc_display);
