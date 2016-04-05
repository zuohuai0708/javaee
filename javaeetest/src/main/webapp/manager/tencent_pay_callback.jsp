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
var opid, appid, time;
//查询显示运营商列表
function init(){
	var url = "../tencent/helper/oid";
	var args = "";
	$.ajax({
		url: url,
		data: args,
		type: 'GET',
		dataType: 'json',
		async:false,
		timeout: 1000,
		error: function(e){
			alert("ERR - " + JSON.stringify(e));
		},
		success: function(tran){
			opid = tran;
		}
	});
	var url = "../tencent/helper/appid";
	var args = "";
	$.ajax({
		url: url,
		data: args,
		type: 'GET',
		dataType: 'json',
		async:false,
		timeout: 1000,
		error: function(e){
			alert("ERR - " + JSON.stringify(e));
		},
		success: function(tran){
			appid = tran;
			$("#appid").val(appid);
		}
	});
	var url = "../tencent/helper/time";
	var args = "";
	$.ajax({
		url: url,
		data: args,
		type: 'GET',
		dataType: 'json',
		async:false,
		timeout: 1000,
		error: function(e){
			alert("ERR - " + JSON.stringify(e));
		},
		success: function(tran){
			time = tran;
			$("#ts").val(time);
		}
	});
	
	var url = "../admin/operators/"+opid+"/api-server";
	var inner = "";
	$.ajax({
		url: url,
        data : "",
		type: 'GET',
		dataType: 'json',
		async:false,
		timeout: 10000,
		error: function(e){
			alert("ERR - " + JSON.stringify(e));
		},
		success: function(data){
			console.log(data);
			for(var i=0; i< data.length; i++){
					var id=data[i].server;
					var name=data[i].name+"-"+id;
					inner += "<option value='"+id+"'>"+name+"</option>";
			}
			$("#zoneid").html(inner);
		}
	});
}

function sig(test) {
	var version = $("#version").val();
	var appid = $("#appid").val();
	var zoneid = $("#zoneid").val();
	var ts = $("#ts").val();
	var openid = $("#openid").val();
	var payitem = $("#payitem").val();
	var token = $("#token").val();
	var billno = $("#billno").val();
	var providetype = $("#providetype").val();
	var amt = $("#amt").val();
	var payamt_coins = $("#payamt_coins").val();
	var pubacct_payamt_coins = $("#pubacct_payamt_coins").val();
	
	var param = {
		version:version,
		appid:appid,
		zoneid:zoneid,
		ts:ts,
		openid:openid,
		payitem:payitem,
		token:token,
		billno:billno,
		providetype:providetype,
		amt:amt,
		payamt_coins:payamt_coins,
		pubacct_payamt_coins:pubacct_payamt_coins
	}
	console.log("sig: ", param);
	var arg = _buildQureyString(param);
	console.log(arg);
	var method = "post";
	var url = "/tencent/callback/pay_callback"
	$.ajax({
		url: "../tencent/helper/sig",
        data : "method="+method+"&url="+url+"&params="+JSON.stringify(param),
		type: 'POST',
		dataType: 'json',
		async:false,
		timeout: 10000,
		success: function(tran){
			$("#sig").val(tran[0]);
		},
		error: function(e){
			alert("ERR - " + JSON.stringify(e));
		}
	});

}

function pay(){
	var version = $("#version").val();
	var appid = $("#appid").val();
	var zoneid = $("#zoneid").val();
	var ts = $("#ts").val();
	var openid = $("#openid").val();
	var payitem = $("#payitem").val();
	var token = $("#token").val();
	var billno = $("#billno").val();
	var providetype = $("#providetype").val();
	var amt = $("#amt").val();
	var payamt_coins = $("#payamt_coins").val();
	var pubacct_payamt_coins = $("#pubacct_payamt_coins").val();
	var sig = $("#sig").val();
	var param = {
		version:version,
		appid:appid,
		zoneid:zoneid,
		ts:ts,
		openid:openid,
		payitem:payitem,
		token:token,
		billno:billno,
		providetype:providetype,
		amt:amt,
		payamt_coins:payamt_coins,
		pubacct_payamt_coins:pubacct_payamt_coins,
		sig:sig
	}
	console.log("pay: ", param);
	var arg = _buildQureyString(param);
	console.log(arg);

	$.ajax({
		url: "../tencent/callback/pay_callback",
        data : arg,
		type: 'POST',
		dataType: 'json',
		timeout: 60000,
		error: function(e){
			alert("ERR - " + JSON.stringify(e));
		},
		success: function(tran){
			alert(JSON.stringify(tran));
		}
	});
}

function _buildQureyString(param) {
	var arg = "";
	for(var key in param) {
		if(arg != "") {
			arg +='&';
		}
		arg +=key+'='+encodeURIComponent(param[key]);
	}
	return arg
}

$(document).ready(function() {
	init();
});
</script>
<title>腾讯支付回调</title>
</head>
<body>
<div  style="background: none repeat scroll 0 0 #FFFFFF; margin:10px; float:left; padding:10px; width:400px; height:400px; border: 1px solid #D8D8D8;">
	<table>
		<tr><td>协议版本 version：</td><td><input type="text" id="version" name="version" readonly="readonly" value="v3"></input></td></tr>
		<tr><td>应用标识 appid：</td><td><input type="text" id="appid" name="appid" readonly="readonly"></input></td></tr>
		<tr><td>游戏分区 zoneid：</td><td><select id="zoneid" name="zoneid"></select></td></tr>
		<tr><td>系统时间 ts:</td><td><input type="text" id="ts" name="ts" /></td></tr>
		<tr><td>玩家标识 openid:</td><td><input type="text" id="openid" name="openid" value="0000000000000000000000000E111111"/></td></tr>
		<tr><td>发货道具 payitem:</td><td><input type="text" id="payitem" name="payitem" value="50005*4*1"/></td></tr>
		<tr><td>发货令牌 token:</td><td><input type="text" id="token" name="token" /></td></tr>
		<tr><td>发货订单 billno:</td><td><input type="text" id="billno" name="billno" /></td></tr>
		<tr><td>发货类型 providetype:</td><td><input type="text" id="providetype" name="providetype" value="0" /></td></tr>
		<tr><td>扣费金额 amt:</td><td><input type="text" id="amt" name="amt" value="4" /></td></tr>
		<tr><td>扣费代币 payamt_coins:</td><td><input type="text" id="payamt_coins" name="payamt_coins" value="" /></td></tr>
		<tr><td>扣费礼券 pubacct_payamt_coins:</td><td><input type="text" id="pubacct_payamt_coins" name="pubacct_payamt_coins" value="" /></td></tr>
		<tr><td>签名 sig:</td><td><input type="text" id="sig" name="sig" value="" /></td></tr>
		<tr><td></td><td><button onclick="sig();">签名</button><button onclick="pay();">测试</button>&nbsp;&nbsp;<button onclick="window.location='../'">返回</button></td></tr>
	</table>
</div>
</body>
</html>