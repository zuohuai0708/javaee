<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link href="../css/global.css" rel="stylesheet" type="text/css" />
<link href="../css/tablesorter.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="../js/jquery.js"></script>
<script type="text/javascript" src="../js/json2.js"></script>
<script type="text/javascript" src="../js/jquery.artDialog.js?skin=opera"></script>
<script type="text/javascript" src="../js/base.js"></script>
<script type="text/javascript" src="../js/table.js"></script>
<script type="text/javascript">
	$(function() {
		query();
	})

	function query() {
		$.ajax({
			url : '../admin/gameInstance/api-gameInstance',
			data : {
				type : 'ALL'
			},
			success : function(data) {
				$('#table').eyutable(data);
			}
		})
	}

	//删除游戏实例
	function del(address) {
		art.dialog({
			content : '确定要删除吗？',
			ok : function() {
				$.ajax({
					url : '../admin/gameInstance/' + address + '/api-gameInstance',
					type : 'DELETE',
					data : {
						address : address
					},
					success : function(data) {
						query();
					}
				});
			},
			cancelVal : '关闭',
			cancel : true
		//为true等价于function(){}
		});
	}
</script>
</head>
<body>
	<table id="table" class="tablesorter">
		<thead>
			<tr>
				<th field="address" width="200px">地址</th>
				<th field="alias" width="200px">名称</th>
				<th field="statu" width="200px">状态</th>
				<th header="" width="200px">
					<input type="button" class="btn btn-danger" onclick="del('{address}')" value="删除" />
				</th>
			</tr>
		</thead>
		<tbody></tbody>
	</table>
</body>
</html>