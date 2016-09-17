<!doctype html>
<html>
<head>
	<title>Welcome to gjp_web!</title>
	<link rel="stylesheet" href="invoice.css">
</head>
<body id="body">
		<div id="documents_tab">
			<ul>
				<li>销售 王长发</li>
				<li>进货 昌裕</li>
				<li>销售 周树平</li>
				<li>销售 黄继光</li>
				<li id="creator">创建销售单据</li>
			</ul>
		</div>
	<!-- xs_i 表示invoice_xs -->
		<table id="xs_i">
		<caption>销售单</caption>
		<!-- i_des 表示invoice_description-->
		<thead id="i_des">
			<tr>
				<td>往来单位：</td>
				<td name="trading_object" colspan="2" contenteditable></td>
				<td name="invoice_id" id="1">单据编号：</td>
				<td name="generated_id" colspan="2"></td>
			</tr>
			<tr>
				<td>仓库：</td>
				<td name="store_house" colspan="2"></td>
				<td>备注：</td>
				<td name="comment" colspan="2"></td>
			</tr>
		</thead>
		<!-- i_c表示invoice content -->
		<tbody id="i_c">
			<tr>
				<th>行号</th>
				<th>id</th>
				<th>商品编号</th>
				<th>商品全名</th>
				<th>规格</th>
				<th>单位</th>
				<th>数量</th>
				<th>单价</th>
				<th>金额</th>
				<th>备注</th>
			</tr>
			<tr class="product_item" >
				<td name="line_number">1</td> 
				<td>001</td>
				<td name="admin_defined_id" >昌裕001</td>
				<td contenteditable name="full_name" >小脆筒</td>
				<td>1*60</td>
				<td>箱</td>
				<td name="amount">8</td>
				<td name="price_base_on_unit">20</td>
				<td name="amount_multiply_by_unit">160</td>
				<td name="comment_for_item">要好吃的</td>
			</tr>
			<tr class="product_item" >
				<td name="line_number">1</td> 
				<td>001</td>
				<td name="admin_defined_id" >昌裕001</td>
				<td contenteditable name="full_name" >小脆筒</td>
				<td>1*60</td>
				<td>箱</td>
				<td name="amount">8</td>
				<td name="price_base_on_unit">20</td>
				<td name="amount_multiply_by_unit">160</td>
				<td name="comment_for_item">要好吃的</td>
			</tr>
			<tr class="product_item" >
				<td name="line_number">1</td> 
				<td>001</td>
				<td name="admin_defined_id" >昌裕001</td>
				<td contenteditable name="full_name" >小脆筒</td>
				<td>1*60</td>
				<td>箱</td>
				<td name="amount">8</td>
				<td name="price_base_on_unit">20</td>
				<td name="amount_multiply_by_unit">160</td>
				<td name="comment_for_item">要好吃的</td>
			</tr>
			<tr class="product_item" >
				<td name="line_number">1</td> 
				<td>001</td>
				<td name="admin_defined_id" >昌裕001</td>
				<td contenteditable name="full_name" >小脆筒</td>
				<td>1*60</td>
				<td>箱</td>
				<td name="amount">8</td>
				<td name="price_base_on_unit">20</td>
				<td name="amount_multiply_by_unit">160</td>
				<td name="comment_for_item">要好吃的</td>
			</tr>
			<tr class="product_item" >
				<td name="line_number">1</td> 
				<td>001</td>
				<td name="admin_defined_id" >昌裕001</td>
				<td contenteditable name="full_name" >小脆筒</td>
				<td>1*60</td>
				<td>箱</td>
				<td name="amount">8</td>
				<td name="price_base_on_unit">20</td>
				<td name="amount_multiply_by_unit">160</td>
				<td name="comment_for_item">要好吃的</td>
			</tr>
			<tr class="product_item" >
				<td name="line_number">1</td> 
				<td>001</td>
				<td name="admin_defined_id" >昌裕001</td>
				<td contenteditable name="full_name" >小脆筒</td>
				<td>1*60</td>
				<td>箱</td>
				<td name="amount">8</td>
				<td name="price_base_on_unit">20</td>
				<td name="amount_multiply_by_unit">160</td>
				<td name="comment_for_item">要好吃的</td>
			</tr>
			<tr class="product_item" >
				<td name="line_number">1</td> 
				<td>001</td>
				<td name="admin_defined_id" >昌裕001</td>
				<td contenteditable name="full_name" >小脆筒</td>
				<td>1*60</td>
				<td>箱</td>
				<td name="amount">8</td>
				<td name="price_base_on_unit">20</td>
				<td name="amount_multiply_by_unit">160</td>
				<td name="comment_for_item">要好吃的</td>
			</tr>
			<tr class="product_item" >
				<td name="line_number">1</td> 
				<td>001</td>
				<td name="admin_defined_id" >昌裕001</td>
				<td contenteditable name="full_name" >小脆筒</td>
				<td>1*60</td>
				<td>箱</td>
				<td name="amount">8</td>
				<td name="price_base_on_unit">20</td>
				<td name="amount_multiply_by_unit">160</td>
				<td name="comment_for_item">要好吃的</td>
			</tr>
			<tr class="product_item" >
				<td name="line_number">1</td> 
				<td>001</td>
				<td name="admin_defined_id" >昌裕001</td>
				<td contenteditable name="full_name" >小脆筒</td>
				<td>1*60</td>
				<td>箱</td>
				<td name="amount">8</td>
				<td name="price_base_on_unit">20</td>
				<td name="amount_multiply_by_unit">160</td>
				<td name="comment_for_item">要好吃的</td>
			</tr>
			<tr class="product_item" >
				<td name="line_number">1</td> 
				<td>001</td>
				<td name="admin_defined_id" >昌裕001</td>
				<td contenteditable name="full_name" >小脆筒</td>
				<td>1*60</td>
				<td>箱</td>
				<td name="amount">8</td>
				<td name="price_base_on_unit">20</td>
				<td name="amount_multiply_by_unit">160</td>
				<td name="comment_for_item">要好吃的</td>
			</tr>
			<tr class="product_item" >
				<td name="line_number">1</td> 
				<td>001</td>
				<td name="admin_defined_id" >昌裕001</td>
				<td contenteditable name="full_name" >小脆筒</td>
				<td>1*60</td>
				<td>箱</td>
				<td name="amount">8</td>
				<td name="price_base_on_unit">20</td>
				<td name="amount_multiply_by_unit">160</td>
				<td name="comment_for_item">要好吃的</td>
			</tr>
			<tr class="product_item" >
				<td name="line_number">1</td> 
				<td>001</td>
				<td name="admin_defined_id" >昌裕001</td>
				<td contenteditable name="full_name" >小脆筒</td>
				<td>1*60</td>
				<td>箱</td>
				<td name="amount">8</td>
				<td name="price_base_on_unit">20</td>
				<td name="amount_multiply_by_unit">160</td>
				<td name="comment_for_item">要好吃的</td>
			</tr>
			<tr class="product_item" >
				<td name="line_number">1</td> 
				<td>001</td>
				<td name="admin_defined_id" >昌裕001</td>
				<td contenteditable name="full_name" >小脆筒</td>
				<td>1*60</td>
				<td>箱</td>
				<td name="amount">8</td>
				<td name="price_base_on_unit">20</td>
				<td name="amount_multiply_by_unit">160</td>
				<td name="comment_for_item">要好吃的</td>
			</tr>
			<tr class="product_item" >
				<td name="line_number">1</td> 
				<td>001</td>
				<td name="admin_defined_id" >昌裕001</td>
				<td contenteditable name="full_name" >小脆筒</td>
				<td>1*60</td>
				<td>箱</td>
				<td name="amount">8</td>
				<td name="price_base_on_unit">20</td>
				<td name="amount_multiply_by_unit">160</td>
				<td name="comment_for_item">要好吃的</td>
			</tr>
			<tr class="product_item" >
				<td name="line_number">1</td> 
				<td>001</td>
				<td name="admin_defined_id" >昌裕001</td>
				<td contenteditable name="full_name" >小脆筒</td>
				<td>1*60</td>
				<td>箱</td>
				<td name="amount">8</td>
				<td name="price_base_on_unit">20</td>
				<td name="amount_multiply_by_unit">160</td>
				<td name="comment_for_item">要好吃的</td>
			</tr>
			<tr class="product_item" >
				<td name="line_number">1</td> 
				<td>001</td>
				<td name="admin_defined_id" >昌裕001</td>
				<td contenteditable name="full_name" >小脆筒</td>
				<td>1*60</td>
				<td>箱</td>
				<td name="amount">8</td>
				<td name="price_base_on_unit">20</td>
				<td name="amount_multiply_by_unit">160</td>
				<td name="comment_for_item">要好吃的</td>
			</tr>
			<tr class="product_item" >
				<td name="line_number">1</td> 
				<td>001</td>
				<td name="admin_defined_id" >昌裕001</td>
				<td contenteditable name="full_name" >小脆筒</td>
				<td>1*60</td>
				<td>箱</td>
				<td name="amount">8</td>
				<td name="price_base_on_unit">20</td>
				<td name="amount_multiply_by_unit">160</td>
				<td name="comment_for_item">要好吃的</td>
			</tr>
			<tr class="product_item" >
				<td name="line_number">1</td> 
				<td>001</td>
				<td name="admin_defined_id" >昌裕001</td>
				<td contenteditable name="full_name" >小脆筒</td>
				<td>1*60</td>
				<td>箱</td>
				<td name="amount">8</td>
				<td name="price_base_on_unit">20</td>
				<td name="amount_multiply_by_unit">160</td>
				<td name="comment_for_item">要好吃的</td>
			</tr>
			<tr class="product_item" >
				<td name="line_number">1</td> 
				<td>001</td>
				<td name="admin_defined_id" >昌裕001</td>
				<td contenteditable name="full_name" >小脆筒</td>
				<td>1*60</td>
				<td>箱</td>
				<td name="amount">8</td>
				<td name="price_base_on_unit">20</td>
				<td name="amount_multiply_by_unit">160</td>
				<td name="comment_for_item">要好吃的</td>
			</tr>
			<tr class="product_item" >
				<td name="line_number">1</td> 
				<td>001</td>
				<td name="admin_defined_id" >昌裕001</td>
				<td contenteditable name="full_name" >小脆筒</td>
				<td>1*60</td>
				<td>箱</td>
				<td name="amount">8</td>
				<td name="price_base_on_unit">20</td>
				<td name="amount_multiply_by_unit">160</td>
				<td name="comment_for_item">要好吃的</td>
			</tr>
		</tbody>
		<tfoot>
			<td>合计</td>
			<td colspan=3 name="money_received_chinese"></td>
			<td >数量</td>
			<td name="total_amount"></td>
			<td>金额</td>
			<td colspan=2	name="money_received"></td>
		</tfoot>
		</table>

	<div id="pop_up" class=""></div>
	<script type="text/javascript" src="index.js"></script>
	<script type="text/javascript" src="invoice.js"></script>
	<script type="text/javascript">


  </script>
</body>
</html>