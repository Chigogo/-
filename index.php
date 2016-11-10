<!doctype html>
<html>
<head>
	<meta charset="utf-8">
	<title>Welcome to gjp_web!</title>
	<meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">

	<link rel="stylesheet" href="index.php.css">

	<!-- Bootstrap 此CDN未必值得信任-->
  <link rel="stylesheet" href="//cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" > <!-- integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous" -->
	<link href="//cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" rel="stylesheet">

</head>
<body id="body">
		<div>
			<ul id="web_function" class="nav nav-tabs">
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
		</div>
		<div id="documents_tab">
			<ul>

			</ul>
		</div>
	<section id="display_section">
		
	</section>
	<div id="pop_up" class=""></div>
	<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
  <script src="//cdn.bootcss.com/jquery/1.12.4/jquery.min.js"></script>
  <!-- Include all compiled plugins (below), or include individual files as needed -->
  <script src="//cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
  <!-- 管家婆的js -->
	<script type="text/javascript" src="gjp.js"></script>


  </script>
</body>
</html>