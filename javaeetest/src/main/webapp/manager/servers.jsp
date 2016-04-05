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

<script type="text/javascript">
$(document).ready(function() {
	init();	
});	
var addUrl="../admin/operators/";
function init()
{	
	$.ajax({
		url:addUrl,
		data:"",
		type : "GET",
		dataType: 'json',
		async: false,
		timeout: 10000,
		error: function(jqXHR){
			alert('获取运营商列表失败[Status:' + jqXHR.status + ']' + (jqXHR.status == 403 ? "[没有权限]" : ""));
		},
		success:function(json) {
			var ar=[];
			for(var i in json)
			{
				ar.push({text:json[i].nick,value:json[i].id});
			}
			var html=autoCreateSelect(ar);
			$('#ops,#add_ops').html(html);
			
		}
	});
	
 	search();
}

var selecctedPage,
	oid;

function search(page)
{
	if(selecctedPage!=null && selecctedPage==page) return; 
  
	page=page || 1;
	selecctedPage=page;
	$("#table tbody").html("");
  	var op=$('#ops').val();
 	$.ajax({
		dataType: 'json',
		type : "GET",
		url : "../admin/"+op+"/"+page+"/server-list",
		//contentType : "application/json",
		cache:false,
		timeout:60000,
		success : function(json) {
			oid=json.oid;
 			showList(json.data);			
			//分页
			var html=createPageDom(json,'pageSearch');
			$("#testPage").html(html);			
		},
		error : function(error){
			alert("查询失败");
		}
	}); 
}
	
function pageSearch(num)
{
	search(num);
}
 
	 
				
function showList(json)
{	
 
	console.log(json);
	var html="";
	for(var i in json)
	{
  
		html+="<tr>";
		html+='<td>'+json[i].name+'</td>'; 
		html+='<td>'+json[i].address+'</td>'; 
		html+='<td>'+json[i].server+'</td>';
  		html+='<td>'+getDate(json[i].createTime)+'</td>';
 		
		html+='<td><input type="button" value="删除" onclick="removeData(\''+json[i].server+'\');" /></td>'; 
 		html+="</tr>";
 	}
	$("#table tbody").html(html);
}

function removeData(address) {
	if(oid==null)
	{
		alert("获取运营商出错!");
		return;
	}
	var address=encodeURIComponent(address);//.replace(":","%3a");
	console.log(address)
	art.dialog({
		content: '确定要删除吗？',
		ok: function () {
			$.ajax({
				dataType: 'json',
				type : "DELETE",
				url : "../admin/operators/"+oid+"/"+ address+"/api-server-delete",
				success : function() {
					search();
				}
			});
		},
		cancelVal: '关闭',
		cancel: true //为true等价于function(){}
	});
}

function addServer()
{
	if(oid==null)
	{
		alert("没有选择运营商");
		return;
	}
	$("#add_ops").val(oid);	
	$("#add_name").val("");
	$("#add_server").val("");
	$("#add_address").val("");
	
	showWinodw("showAlert2",function(a){
		var name=$("#add_name").val(),
			address=$("#add_address").val(),
			server=$("#add_server").val(),
			oid=$("#add_ops").val();
		if(name=='' || server=='' || address=='' || oid=='')
		{
			alert("请填写完整信息!");
			return;
		}
		var obj={
			name:name,
			server:server,
			address:address
		};
		$.ajax({
				dataType: 'json',
				type : "POST",
				url : "../admin/operators/"+oid+"/"+address+"/api-server",
				contentType : "application/json",
				data : JSON.stringify(obj),
				success : function() {
					search();
					a.close();
				},
				error : function(e)
				{	
					alert(JSON.stringify(e));
					alert("添加失败，服务器标识不能重复");
				}
		});	
		
	});
}

</script>
<style>
.xxx tr,.xxx td {
	background-color:#fff;
}
</style>
</head>
<body>
<div class="mainbox">

  <div class="contant" style="width:99%;">
		
		
		
 
	<div class="line" style="width:100%"></div> 
  <div class="tablebox01">
  <tr class="xxx">				
	<p>
	<a href="../index.html">返回</a>
	<span>选择运营商<select id="ops" onchange="search();"> </select></span>
	<a href="javascript:" onclick="search();">查询</a> 
	<a href="javascript:" onclick="addServer();">添加服务器</a>
	<font color="red">添加和修改功能只用于测试,数据会在同步管理后台后丢失</font>
	</p>
 	<table id="table" class="tablesorter">
		<thead>
			<tr>
				<th style="width:180px;">服务器</th>
				<th style="width:180px;">域名</th>				
				<th style="width:50px;">标识</th>
  				<th style="width:180px;">创建时间</th>
				<th style="width:180px;">操作</th>
  			</tr>
		</thead>
		<tbody> </tbody>
	</table>
	
  </div>
    </div>
    <div class="kongge_box" ></div>
</div>
<div id="testPage"></div>


<div id="showAlert2" style="display:none;max-height:550px;overflow:auto;  overFlow-x:hidden; ">	
	<table id="table2">
		<tr><td>运营商</td><td><select id="add_ops"> </select></td></tr>
		<tr><td>服务器标识</td><td><input type="text"  id="add_server" /></td></tr>
		<tr><td>服务器名称</td><td><input type="text"  id="add_name" /></td></tr>
		<tr><td>域名</td><td><input type="text"  id="add_address" />(* 域名+端口)</td></tr>
	</table>
</div>

</body>
</html>