<?php
	header('Content-Type: text/plain');
?>
--在database外
drop database gjp_web;
create database gjp_web;
grant all on gjp_web.* to Chigogo with grant option;

use gjp_web;

create table people (
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
admin_defined_order mediumint(8) unsigned,
full_name VARCHAR(127) NOT NULL,
simple_name VARCHAR(8),
person_in_charge VARCHAR(8),
tel varchar(26),
phone varchar(13),
Address VARCHAR(127),
role ENUM('manufacturer','dealer','bigger','big','Medium','small','smaller','smallest'),
py_code varchar(64),
password varchar(32),
loyalty INT,
complexity INT,
user_comment varchar(127)
);

/*标签，价格系数*/
create table people_tag (
id SMALLINT Unsigned NOT NULL PRIMARY KEY AUTO_INCREMENT,  /* 最多有65535个tag */
tag_name VARCHAR(12) NOT NULL,

price_factor decimal(6,4),

tag_category enum('role', 'non_category'),
tag_describe VARCHAR(127)
);

/*单位的标签*/
create table people_and_their_tags(
tag_id SMALLINT Unsigned NOT NULL,
people_id INT NOT NULL,
FOREIGN KEY tag_id(tag_id)
REFERENCES people_tag(id)
ON UPDATE CASCADE
ON DELETE CASCADE,
FOREIGN KEY user_id(people_id)
REFERENCES people(id)
ON UPDATE CASCADE
ON DELETE CASCADE
);

/*商品信息*/
create table product_info(
id MEDIUMINT Unsigned NOT NULL PRIMARY KEY AUTO_INCREMENT,
admin_defined_order mediumint(8) unsigned,

full_name varchar(127) not null,
py_code varchar(63),
manufacturer varchar(127),
simple_name varchar(8),

unit_1 varchar(2) not null,

unit_2 varchar(2),
unit_2_factor tinyint,
unit_3 varchar(2),
unit_3_factor tinyint,

/* price strategy*/
price_base decimal(8,4),
/* product level factor*/
price_for_manufacturer decimal(7,4),
price_for_dealer decimal(7,4),
price_for_bigger decimal(7,4),
price_for_big decimal(7,4),
price_for_Medium decimal(7,4),
price_for_small decimal(7,4),
price_for_smaller decimal(7,4),
price_for_smallest decimal(7,4),

size_id INT Unsigned,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

user_comment varchar(127),
system_log varchar(10240),
hidden_toggle ENUM('on','off') default 'off'
);

create table product_size (
id INT Unsigned NOT NULL PRIMARY KEY AUTO_INCREMENT,

unit_1_volume_length smallint,
unit_1_volume_width smallint,
unit_1_volume_height smallint, /* in mm*/
unit_1_weight MEDIUMINT, /* in g*/
);

create table product_tag (
id SMALLINT Unsigned NOT NULL PRIMARY KEY AUTO_INCREMENT,  /* 最多有65535个tag */
tag_name VARCHAR(12) NOT NULL,
tag_bases_on ENUM('flavor','price','color','composition','form','admin_define','manufacturer_product_series'),
tag_describe VARCHAR(127)
);

create table product_and_their_tags(
tag_id SMALLINT Unsigned NOT NULL,
product_id MEDIUMINT Unsigned NOT NULL,
FOREIGN KEY tag_id(tag_id)
REFERENCES product_tag(id)
ON UPDATE CASCADE
ON DELETE CASCADE,
FOREIGN KEY product_id(product_id)
REFERENCES product_info(id)
ON UPDATE CASCADE
ON DELETE CASCADE
);

create table store_house(
id tinyint not null primary key auto_increment,
name varchar(127),
address varchar(127)
);

create table transaction_documents_description(
id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
doc_type enum('xs','jh','db','dd'),/*销售，进货，调拨，用户订单*/
trading_object INT NOT NULL,
foreign key trading_object(trading_object)
references people(id),
/* 系统维护人员!!! */
created_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
update_time TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
store_house tinyint not null,
money_received Decimal(12,2),
comment varchar(63),
document_status enum("完成","草稿","管理员反冲","管理员编辑","管理员取消", "用户编辑", "用户取消") not null default "管理员编辑"
);

/*
0，成功
1，管理员反冲
2，管理员编辑
3，用户提交（关）
4，用户编辑
5，用户开
6，管理员取消
7，用户取消
*/


create table transaction_documents_content(
transaction_document_id INT UNSIGNED NOT NULL,
foreign key trans_id(transaction_document_id)
references transaction_documents_description(id),

product_id MEDIUMINT Unsigned NOT NULL,
FOREIGN KEY product_id(product_id)
REFERENCES product_info(id)
ON UPDATE CASCADE,

amount decimal(9,4) not null,

unit enum("unit_1","unit_2","unit_3")not null,

price decimal(9,5),

item_income decimal(10,2), 

comment varchar(63)
);

/*
此中的价格都为管理员定义
可以按照每月，每季度，每年的方式，删除旧纪录
*/
create table specific_price_specific_person(
transaction_document_id INT UNSIGNED NOT NULL,
foreign key trans_id(transaction_document_id)
references transaction_documents_description(id),

product_id MEDIUMINT Unsigned NOT NULL,
FOREIGN KEY product_id(product_id)
REFERENCES product_info(id)
ON UPDATE CASCADE,

people_id INT NOT NULL,
FOREIGN KEY user_id(people_id)
REFERENCES people(id)
ON UPDATE CASCADE
ON DELETE CASCADE,

price_base_on_unit_1 decimal(9,5)
);

create table user_login_invoice_keeping(
session_id int primary key auto_increment,
validation_code char(8),
people_id INT NOT NULL,
foreign key people_id(people_id)
references people(id),

transaction_document_id INT UNSIGNED NOT NULL,
foreign key trans_id(transaction_document_id)
references transaction_documents_description(id),

time_when_session_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

create table user_login_log(
id INT Unsigned NOT NULL primary key auto_increment,
validation_code char(8),
people_id INT NOT NULL,
foreign key people_id(people_id)
references people(id),

client_info varchar(1024),

when_login TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
last_operation_or_die TIMESTAMP NULL /*最后一次操作时间距离上次操作时间不应超过30分钟*/
);
<?php
	$user_agent = $_SERVER['HTTP_USER_AGENT'];
	if(!strpos($user_agent, "Windows NT"))
	echo <<<Mac
-- 载入数据：

-- 在Mac下，跨盘操作，需要移除Local 关键字
-- 需要mysql 客户端输入参数 --local-infile
LOAD DATA LOCAL INFILE '/Users/Chigogo/Documents/Study_Material/LearningCS/建站/gjp_web/单位信息sublime utf-8.txt' INTO TABLE people;
Mac;


	if(strpos($user_agent, "Windows NT"))
	echo <<<Win
-- 在Windows下，跨盘操作，需要移除Local 关键字

LOAD DATA INFILE "D:/公司文档/广德冷饮文档/张钱志 处理/管家婆web版本 开发/单位信息ANSI-utf8 - 去首行.txt" 
INTO TABLE people (id, full_name, @v1, @v2, @tel, @phone, @Address, @v3, py_code, @v3 ,@v3)
    set 
    tel=nullif(@tel,''),
    phone=nullif(@phone,''),
    Address=nullif(@Address,'')
    ;

load data infile "D:/公司文档/广德冷饮文档/张钱志 处理/管家婆web版本 开发/商品信息utf8 - 去首行.txt" 
into table product_info (id, @admin_defined_order, full_name, manufacturer, unit_1, py_code);
Win;
?>