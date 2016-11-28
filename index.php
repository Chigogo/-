<!doctype html>
<html>
<head>
	<meta charset="utf-8">
	<title>Welcome to gjp_web!</title>
	<meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">


	<!-- Bootstrap 此CDN未必值得信任-->
  <link rel="stylesheet" href="//cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" > <!-- integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous" -->
	<link href="//cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" rel="stylesheet">
	
	<link rel="stylesheet" href="index.php.css">
</head>
<body id="body">
	<nav class="navbar navbar-default navbar-static-top container-fluid row">
		<ul id="web_function" class="nav nav-tabs container">
			<li id="invoice_create" class="btn dropdown">
				<a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
    新建单据 <span class="caret"></span>
  			</a>
				<ul class="dropdown-menu">
					<li id="creator_xs">创建销售单据</li>
					<li id="creator_jh">创建进货单据</li>
					<li id="viewer_craft">查看草稿</li>
				</ul>
			</li>
			<!-- 
	 --><li id="basic_information_build" class="btn dropdown">
				<a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
    基础信息维护 <span class="caret"></span>
  			</a>
	 <ul class="dropdown-menu">
					<li id="checkout_people_info">单位信息</li>
					<li id="checkout_product_info">商品信息</li>
					<li id="checkout_specific_price">价格跟踪</li>
				</ul>
				</li><!-- 
	  --><!-- 
			 --><li class="btn"><a href="#" role="button" aria-haspopup="true" aria-expanded="false">
    经营历程
  			</a></li>
		</ul>
	</nav>
		<div id="documents_tab" class="container-fluid">
			<ul class="nav nav-pills">

			</ul>
		</div>
	<section id="display_section" class="container">
		
	</section>
	<div id="pop_up_modal" class="modal fade" tabindex="-1" role="dialog">
	  <div class="modal-dialog" role="document">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        <h4 class="modal-title">Modal title</h4>
	      </div>
	      <div class="modal-body">
	        <div id="pop_up" ></div>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
	        <button type="button" class="btn btn-primary">确定</button>
	      </div>
	    </div><!-- /.modal-content -->
	  </div><!-- /.modal-dialog -->
	</div><!-- /.modal -->


	<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
  <script src="//cdn.bootcss.com/jquery/1.12.4/jquery.js"></script>
  <!-- Include all compiled plugins (below), or include individual files as needed -->
  <script src="//cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.js"></script>
  <!-- 管家婆的js -->
	<script type="text/javascript" src="gjp.js"></script>


  </script>
</body>
</html>