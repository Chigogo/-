function a(){
	alert(hehe);
}

function b(){
	var hehe="110";
	a();
}

b();//undefined,原因是lexical scope


var a = "blue";

function b(){
	alert(a);
	var a = "red";
}

b();//undefined,原因是var会使得声明提前，但不会赋值

var a = "blue";

function b(){
	alert(a);
	a = "red";
}

b();//alert是blue，原因是a为外部变量，然后a 变成"red"

//不同的事件添加方式
var a = document.createElement("p");
a.appendChild( document.createTextNode("Hi there and greetings!"));
document.getElementById("body").appendChild(a);

a.onclick = function(){
	alert("a");
}

var b = document.createElement("p");
b.appendChild( document.createTextNode("b"));
document.getElementById("body").appendChild(b);
b.addEventListener("click", function(){alert("b1");});
b.addEventListener("click", function(){alert("b2");});


      function toChinese(num){
        var num_S = num.toString();
        var int_decimal_toString_array = num_S.split(".");
        if (int_decimal_toString_array[0].length>12) return("Number too large");

        var width_4_digtsToString_array=[];
        // var a = int_decimal_toString_array[0].length%4;
        var b = Math.ceil(int_decimal_toString_array[0].length/4);

        for (var i = 1; i <= b; i++) {
          if(i<b)
            width_4_digtsToString_array.push(int_decimal_toString_array[0].slice(-4*i,int_decimal_toString_array[0].length-(i-1)*4));
          if(i=b)
            width_4_digtsToString_array.push(int_decimal_toString_array[0].slice(0,int_decimal_toString_array[0].length-(i-1)*4));
        };

        var chinese_array = [];

        function(num_toString){
          var a＝[];
          for (var i = 0; i < num_toString.length; i++) {
            //给数组添加了一个元素，这个元素是一个汉字字符串
            switch(Number(num_toString[i])){
              case 0: a.push("零");break;
              case 1: a.push("壹");break;
              case 2: a.push("貳");break;
              case 3: a.push("叁");break;
              case 4: a.push("肆");break;
              case 5: a.push("伍");break;
              case 6: a.push("陆");break;
              case 7: a.push("柒");break;
              case 8: a.push("捌");break;
              case 9: a.push("玖");break;
            }
            //给数组的元素字符串再添加一个汉字
            switch(num_toString.length-i){
              case 2: 
              if (num_toString.length==2&& a[i]=="壹") a[i]="拾";
              else a[i]+="拾";break;

              case 3: a[i]+="佰";break;
              case 4: a[i]+="仟";break;
            }
          };

            if(a[0][0]=="零"){
              if(a[1][0]=="零"){
                if(a[2][0]=="零"){
                  if(a[3][0]=="零")
                    a=["零"];
                  else
                    a=a[3];a.unshift("零");
                }
                else
                  a=a.splice(0,2);
                  a.unshift("零");
              };
              else
                a=a.splice(0,1);
                a.unshift("零");
            }
            else



          return a;
        }

        for (var i = 0; i < width_4_digtsToString_array.length; i++) {
          chinese_array.push([""]);
          // if (i+1 = width_4_digtsToString_array.length) break;
          // chinese_array.push(["零"]);
        };



      }
