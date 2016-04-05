<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link href="../css/global.css" rel="stylesheet" type="text/css" />
<link href="../css/tablesorter.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="../js/md5.js"></script>
<script type="text/javascript" src="../js/jquery.js"></script>
<script type="text/javascript" src="../js/json2.js"></script>
<script type="text/javascript" src="../js/base.js"></script>
<script type="text/javascript">
String.prototype.trim = function () {return this.replace(/(^\s*)|(\s*$)/g, "");};
function textarea2list(textvalue){
	var regRN = /[\r\n]/g;
	var regR = /[\r]/g;
	var regN = /[\n]/g;
	var descrip = textvalue.replace(regRN,';');
	descrip = descrip.replace(regN,';');
	descrip = descrip.replace(regR,'');
	
	var tmp = descrip.split(';');
	//去除其中带空格的部分，例：有可能得到这样的情况，非人们所愿意的格式“;;;”
	var tmpList = new Array();
	for(var i=0;i< tmp.length;i++){
		var item = tmp[i].trim();
		if(item != ""){
			var match = false;
			for(var j=0;j<tmpList.length;j++){
				if(tmpList[j] == item){
					match = true;
					break;
				}
			}
			if(!match){
				tmpList.push(item);
			}
			else{
				alert("存在重复数据：" + tmp[i].trim());
			}
		}
	}
	return tmpList;
}

var operatorList = Array();
//查询显示运营商列表
function getOperatorList(){
	var url = "../admin/operators";
	var args = "";
	$.ajax({
		url: url,
		data: args,
		type: 'GET',
		dataType: 'json',
		async:false,
		timeout: 10000,
		error: function(){
		},
		success: function(tran){
			operatorList = tran;
			for(var i=0; i< tran.length; i++){
				$("#operator").append("<option value='"+tran[i].id+"'>"+tran[i].name+"</option>");
			}
		}
	});
}
var chargekey = "";
function changeop(opid){
	for(var i=0;i<operatorList.length;i++){
		if(operatorList[i].id == opid){
			chargekey = operatorList[i].key;
			break;
		}
	}

	$("#server").html("");
	var url = "../admin/operators/"+opid+"/api-server";
	$.ajax({
		url: url,
        data : "",
		type: 'GET',
		dataType: 'json',
		timeout: 10000,
		error: function(){
		},
		success: function(data){
			console.log(data);
			for(var i=0; i< data.length; i++){
					var id=data[i].server;
					var name=data[i].name+"-"+id;
					$("#server").append("<option value='"+id+"'>"+name+"</option>");
			}
		}
	});
}

function order(test) {
	var operator = $("#operator").val();
	var server = $("#server").val();
	var target = $("#target").val();
	var chtype = $("#chtype").val();
	var url = "";
	var prefix = "../admin/order-test/";
	if(chtype == 0){
		url = prefix+"account/"+operator+"/"+server;
	}
	else if(chtype == 1){
		url = prefix+"player/"+operator+"/"+server;
	}
	else if(chtype == 2){
		url = prefix+"target/"+operator+"/"+server;
	}
	else{
		alert('请选择充值方式');
		return false;
	}
	
	if(target == ''){
		alert('请输入充值对象');
		return false;
	}
	
	var addition = $("#addition").val();
	if(addition == ''){
		alert('请输入商品信息');
		return false;
	}
	
	target = encodeURI(target);
	var args = "content="+target+"&addition="+addition;
	$.ajax({
		url: url,
        data : args,
		type: 'GET',
		dataType: 'json',
		timeout: 10000,
		error: function(){
		},
		success: function(tran){
			if(tran.code == 0){
				$("#money").val(tran.content.money);
				charge(tran.content.serial, test);
			}
			else{
				alert('充值失败[code:'+tran.code+',content:'+tran.content+']');
			}
		}
	});



}

function charge(serial, test){
	var operator = $("#operator").val();
	var server = $("#server").val();
	var target = $("#target").val();
	var chtype = $("#chtype").val();
	var url = "";
	var prefix = test ? "../admin/pay-test/" : "../ws/pay/";
	if(chtype == 0){
		url = prefix+"account/"+operator+"/"+server;
	}
	else if(chtype == 1){
		url = prefix+"player/"+operator+"/"+server;
	}
	else if(chtype == 2){
		url = prefix+"target/"+operator+"/"+server;
	}
	else{
		alert('请选择充值方式');
		return false;
	}
	
	if(target == ''){
		alert('请输入充值对象');
		return false;
	}
	var gold = $("#gold").val();
	var money = $("#money").val();
	if(money == '' || money == 0){
		alert('请输入正确的充值金额');
		return false;
	}
	var order = $("#order").val();
	// 订单序号
	var addition = serial; 
	
	var str = target + "" +  order + "" + chargekey;
	var sign = hex_md5(str);
	alert(str + " - " + sign);
	
	target = encodeURI(target);
	var args = "content="+target+"&order="+order+"&money="+money+"&gold="+gold+"&addition="+addition+"&sign="+sign;
	$.ajax({
		url: url,
        data : args,
		type: 'GET',
		dataType: 'json',
		timeout: 10000,
		error: function(){
		},
		success: function(tran){
			if(tran.code == 0){
				alert('充值成功 - 订单序号[' + serial + '], 金额:' + $("#money").val() );
				changeOrder();
			}
			else{
				alert('充值失败[code:'+tran.code+',content:'+tran.content+']');
			}
		}
	});
}
function changeOrder(){
	$("#order").val("my9yu_"+(new Date()).getTime());
}
function onChangeGold(value) {
	var count = parseInt(value);
	$("#money").val(count*10);
}
$(document).ready(function() {
	changeOrder();
	getOperatorList();
	changeop($("#operator").val());
});
</script>
<title>运营商与服务管理</title>
</head>
<body>
<div  style="background: none repeat scroll 0 0 #FFFFFF; margin:10px; float:left; padding:10px; width:450px; height:300px; border: 1px solid #D8D8D8;">
	<table>
		<tr><td>运营商：</td><td><select id="operator" name="operator" onchange="changeop(this.value);"></select></td></tr>
		<tr><td>服务器：</td><td><select id="server" name="server"></select></td></tr>
		<tr>
			<td>
			<select id="chtype" name="chtype">
				<option value="0">账号</option>
				<option value="1">角色名</option>
				<option value="2">角色ID</option>
			</select></td>
			<td><input type="text" id="target" name="target" /></td>
		</tr>
		<tr style="visibility: hidden;"><td>金币：</td><td><input  type="text" id="gold" name="gold" value="0" onkeyup="onChangeGold(this.value);" /></td></tr>
		<tr style="visibility: hidden;"><td>金额：</td><td><input type="text" id="money" name="money" value="0" /></td></tr>
		<tr><td>订单号：</td><td><input type="text" id="order" name="order"/>&nbsp;
								<a href="javascript:;" onclick="changeOrder();return false;">更换订单号</a></td></tr>
		<tr><td>商品信息：</td><td><input type="text" id="addition" name="addition"/></td></tr>
		<tr><td></td><td><button onclick="order(false);">充值</button><button onclick="order(true);">测试</button>&nbsp;&nbsp;<button onclick="window.location='../'">返回</button></td></tr>
	</table>
</div>
</body>
</html>