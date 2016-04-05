//全局变量
(function(){
	$.ajaxSetup({cache:false});
 	if(window.console==null || window.console==undefined)
	{
		var console={};
		console.log=function(){};
		window.console=console;
	}
})();
var baseUrl="../ws/security/";
var Country=[
	"群雄","魏国","蜀国","吴国"
];
var Profession=[
	"猛将","射手","军师"
];

var JobType=[
	"","团长","副团长","精英","普通成员"
];
 
var currency_type=[
	"铜币","金币","礼券","内币","玉石","捐献"
];

var HeroQuality=[
	"白","绿","蓝","紫","黄","橙","红"
];

	

function getkeyWordContent(fn)
{
	$.ajax({
		dataType: 'json',
		type : "GET",
		url : "../ws/local/keyWord",
 		cache:false,
		success : function(json) {				
			fn(json);			
		}
	});
}

function round(numberRound,roundDigit){  
	var roundDigit=roundDigit || 2;
    var digit=digit=Math.pow(10,roundDigit);
    return Math.round(numberRound*digit)/digit;  
}
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}
function isNum(num)
{
	return /^\-?[0-9]+$/.test(num);
}
 
function autoBuildPath(o)
{
	var path="";
	for(var i in o)
		path+=o[i]+"/";
	return path;
}
function errorHTML(value)
{
	return createDom(value,"")
}
function createDom(name,value)
{
	return '<div class="list"> <ul class="last"> <li class="first">'+name+'</li> <li>'+value+'</li> </ul> </div>';
}

var _showPageListNum=10;//显示分页数
/*分页*/
function createPageDom(pageInfo,fn)
{
	
	var pageSize = getPageSize(pageInfo.count,pageInfo.limit);
	
	//创建 options
	var options="";
	for(var i=1;i<pageSize+1;i++)
	{
		var selected='';
		if(pageInfo.page==i)
			selected='selected ';
		options+='<option value='+i+' '+selected+'>'+i+'</option>';
	}
	
	//创建 pageNum
	var pageNumList="";
	var showPageNum=_showPageListNum-pageInfo.page;
	var o=getPageSegment(pageSize+1,pageInfo.page+0);
	
 	
 	for(var i=o.start;i<o.end;i++)
	{
		var selected='';
		if(pageInfo.page==i)
			selected=' class="current" ';
		pageNumList+= '<a onclick="'+fn+'('+i+');return false;" '+selected+'>'+i+'</a> ';
	}
	
	
	var pagePre=pageInfo.page-1<1?1:pageInfo.page-1;
	var pageNext=pageInfo.page+1>pageSize?pageSize:pageInfo.page+1;
	//pageInfo
	var pageInfo=' <b>共'+pageInfo.count+'条 '+pageInfo.limit+'条/页 '+pageInfo.page+'/'+pageSize+"</b>";
 	var html='<table  border="0" align="center" class="pageDiv"  ><tr><td>'+
	'<div class="pagination">'+pageInfo+
	
	' <a class="disabled" onclick="'+fn+'(1);return false;">首页</a> <a  onclick="'+fn+'('+pagePre+');return false;" >上一页</a>  '+

	pageNumList+
	'<a onclick="'+fn+'('+pageNext+');return false;">下一页</a> '+
	'<a onclick="'+fn+'('+pageSize+');return false;">尾页</a> '+
	 
	'<input type="text" size="6" onkeydown="if (event.keyCode==13){ '+fn+'(this.value); return false;}" />	 '+
	 
	'<select  onchange="'+fn+'(this.value);return false;">'+options+'</select></div></td></tr></table>';
	 
	return html;
}

//分段处理
function getPageSegment(pageSize,page)
{	
	//当前段
	var curPageSegment=getPageSize(page,_showPageListNum*30);
	var end=curPageSegment*_showPageListNum+1;//循环加1	
 	
	if(end>pageSize)
		end=pageSize;
	
	var start=(curPageSegment-1)*_showPageListNum;
	if(start<1)
		start=1;
	var o={start:start,end:end};
	console.log(o,curPageSegment);
	return o;	
 }

function getPageSize(count,limit)
{
	return Math.ceil(count/limit);
}
function ids2PlayerID(sid,type,target,fn)
{
	var o={};
	o["ids"]=target;
	$.ajax({
		dataType: 'json',
		type : "GET",
		url : "../ws/account/misAccount/"+sid+"/id2player",
		timeout:60000,
		data:o,
		cache:false,
  		success : function(json) {
			for( var i in json)
			{
				if(json[i]==null)
				{
 					alert(target+" : id2player出错!");
					return;
				}
			}
			fn(json);
  		},		
		error:function(error){
			alert("id2player错误!");
		}
	});
}
/*转换玩家账号*/
function user2PlayerID(sid,type,target,fn)
{
	var names="names";
	var flag='';
	switch(parseInt(type))
	{
		case 0:flag="/account2id/";
			target=target+"."+sid;
		break;
		case 1:flag="/player2id/";break;
		case 2:
			names="ids";
			fn([parseInt(target)]);
			return;
 	}
	var o={};
	o[names]=[encodeURIComponent(target)];
	
 	$.ajax({
		dataType: 'json',
		type : "GET",
		url : "../ws/account/misAccount/"+sid+flag,
		timeout:60000,
		data:o,
		cache:false,
  		success : function(json) {
			for( var i in json)
			{
				if(json[i]==null)
				{
 					alert(target+" : 转换玩家playerID出错!");
					return;
				}
			}
			fn(json);
  		},		
		error:function(error){
			alert("转换玩家playerID错误!");
		}
	});
}

function users2PlayerID(sid,type,targets,fn)
{
	var names="names";
	var flag='';
	
	switch(parseInt(type))
	{
		case 0:flag="/account2id/";
			for(var i in targets)
			{
				targets[i]=encodeURIComponent(targets[i]+"."+sid);
			}
		break;
		case 1:flag="/player2id/";break;
		case 2:
			names="ids";
		
		for(var i in targets)
		{
			targets[i]=parseInt(targets[i]);
		}
		fn(targets);
		return;
	}
	var o={};
	o[names]=targets;
  	$.ajax({
		dataType: 'json',
		type : "GET",
		url : "../ws/account/misAccount/"+sid+flag,
		timeout:60000,
		data:o,
		cache:false,
  		success : function(json) {	
			for( var i=0;i<json.length;i++)
			{
				if(json[i]==null)
				{
					alert(targets[i]+" : 转换玩家playerID出错!");
					return;
				}
			}
			fn(json);
  		},		
		error:function(error){
			alert("转换玩家playerID错误!");
		}
	});
}
function textarea2list(textvalue){
	var regRN = /[\r\n]/g;
	var regR = /[\r]/g;
	var regN = /[\n]/g;
	var descrip = textvalue.replace(regRN,';');
	descrip = descrip.replace(regN,';');
	descrip = descrip.replace(regR,'');
	descrip = descrip.replace("<br/>",'');
	
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
		}
	}
	return tmpList;
}
String.prototype.getLength=function(){return this.replace(/[^\x00-\xff]/gi,'xxx').length;};
String.prototype.trim = function () {return this.replace(/(^\s*)|(\s*$)/g, "");};
String.prototype.replaceJSTag=function(){return this.replace(/\'/g,'\\\'').replace(/\"/g,'\\\"');}
function check_input_length(inid,l){
	var cv = document.getElementById(inid).value.trim();
	var cl=cv.getLength();
	ml=l*3;
	if(cl<=ml){
		document.getElementById(inid+"_num").innerHTML = Math.ceil(cl/3);
		return true;
	}
	var nv='';
	for(var i=0;i<cv.length;i++){
		var cvc=cv.substring(i,i+1);
		var cvcl=cvc.getLength();
		var nvl=nv.getLength();
		if(nvl>=ml||(cvcl>1&&(nvl+cvcl)>ml)){
			break;
		}
		nv+=cvc;
	}
	document.getElementById(inid).value = nv;
	document.getElementById(inid+"_num").innerHTML= Math.ceil(nv.getLength()/3);
	return true;
}


//日期工具
/*
alert(new Date().format("yyyy-MM-dd")); 
alert(new Date("january 12 2008 11:12:30").format("yyyy-MM-dd hh:mm:ss")); 
*/

//时间截 to string
function getDate(nS,format) {
	format=format|| "yyyy-MM-dd hh:mm:ss";
    return new Date(parseInt(nS) ).format(format);    
}   
//string to 时间截
function getTime(date)
{
	var   d   =   new   Date(Date.parse(date.replace(/-/g,   "/"))); 
	return d.getTime();
}
Date.prototype.format = function(format) //author: meizz 
{ 
  var o = { 
    "M+" : this.getMonth()+1, //month 
    "d+" : this.getDate(),    //day 
    "h+" : this.getHours(),   //hour 
    "m+" : this.getMinutes(), //minute 
    "s+" : this.getSeconds(), //second 
    "q+" : Math.floor((this.getMonth()+3)/3),  //quarter 
    "S" : this.getMilliseconds() //millisecond 
  } 
  if(/(y+)/.test(format)) format=format.replace(RegExp.$1, 
    (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  for(var k in o)if(new RegExp("("+ k +")").test(format)) 
    format = format.replace(RegExp.$1, 
      RegExp.$1.length==1 ? o[k] : 
        ("00"+ o[k]).substr((""+ o[k]).length)); 
  return format; 
} 

//缓存ajax请求数据
var cache_ajax_data={};

function cache_ajax(url,key,fn)
{
	$.getJSON(url, function(json) {
		cache_ajax_data[key]=json;
		if(fn!=null)
			fn(json);
	});
}
function getCurrUserName(fn)
{
	
	$.getJSON("../ws/security/account/getUserName", function(json) {
		fn(json);
 	});
}
var event_data={};
function registerFn(key,fn)
{
	event_data[key]=fn;
}
/*
	表单或 obj 序列化
*/
function objectFormatFormValue(obj)
{
	var value="";
	for(var i in obj)
	{
		value+=i+"="+encodeURIComponent(obj[i])+"&";
	}
	return value;
}


// 附件处理

var attachment_json=[
	{text:"选择",value:""},
	{text:"经验",value:"EXP"},
	{text:"流通货币",value:"CURRENCY"},
	{text:"道具",value:"ITEM"},
	{text:"装备",value:"EQUIP"},
	{text:"宝物",value:"TREASURE"},
	{text:"英雄",value:"HERO"},
	{text:"体力值",value:"ACTION_POINT"},
	{text:"主将技能",value:"SKILL"},
	{text:"骑宠模型",value:"RIDING"},
	{text:"日常任务次数",value:"DAILY"},
	{text:"称号奖励",value:"TITLE"},
];

var CurrencyType=[
	{text:"铜币",value:0},
	{text:"金币",value:1},
	{text:"礼券",value:2},
	{text:"内币",value:3},
	{text:"玉石",value:4},
	{text:"捐献",value:5}
];
var ActionPointType =[
	{text:"单人体力",value:0},
	{text:"组队体力",value:1}
];

function formatAttachmentDate(o)
{
	for(var i in o)
	{
		switch(o[i].type)
		{
			case "select":
				var selected=$('#'+o[i].name+' option:selected');
				var text=selected.text();
				var value=selected.val();
				o[i].text=text;
				o[i].value=value;
 			break;
			default:
				var value=$('#'+o[i].name).val();
				o[i].value=value;
 			break;
		}		
 	}
	return o;
}
function autoCreateXX(data)
{
	var html="";
	for(var i in data)
	{
		html+='<option value="'+data[i].value+'" >'+data[i].text+'</option>';
	}
	return html;
}
function formatPostAttachment(obj)
{
	var new_ar=[];
 	for(var i in obj)
	{
		var o={}; 		
		
		for(var k in obj[i])
		{
			var tobj=obj[i][k];
			o[tobj.name]=tobj.value;
		}		
		
		new_ar.push(o);
	}
	return new_ar;
}

function formatShowAttachment(obj)
{
	var new_ar=[];
	var attachment_fields=['type','code','amount'];
	for(var i in obj)
	{
		var o={}; 		
		
		for(var k in obj[i])
		{
			var tobj=obj[i][k];
			var key =tobj.name;
			for(var j in attachment_fields)
			{
				if(attachment_fields[j]==key)
				{
					switch(tobj.type)
					{
						case "select":	o[key]=tobj.text;break;
						default:		o[key]=tobj.value;break;
					}
				
					break;
				}
			} 
		}		
		
		new_ar.push(o);
	}
	return new_ar;
}

// 附件处理 end

function autoGetDomValue(ar)
{
	var o={};
	for(var i in ar)
	{
		o[ar[i]]=$('#'+ar[i]).val();
	}
	return o;
}


function showWinodw(id,fn)
{
	var o=art.dialog({
	    title: '操作',
	    content:  document.getElementById(id),
	    //icon: 'succeed', 
		fixed: true,
	    ok: function(){
			fn(o);
			return false;
	    }
	});
	return o;
}

function testFormValue(ar)
{
	for(var i in ar)
	{
		var value=$('#'+ar[i]).val();
		if(value=='')
		{
			return false;
		}
	}
	return true;
}

function getOperators(fn)
{
	$.ajax({
		url:"../ws/session/operator",
		data:"",
		type : "GET",
		dataType: 'json',
		async: false,
		timeout: 10000,
		error: function(jqXHR){
			alert('获取运营商列表失败[Status:' + jqXHR.status + ']' + (jqXHR.status == 403 ? "[没有权限]" : ""));
		},
		success:function(json) {
			fn(json);
		}
	});
}



function getOperatorServerList(fn)
{
	$.getJSON("../ws/servers/", function(json) {
		var ar=[];
		for(var i in json)
		{
			ar.push({text:json[i].name,value:json[i].address});
		}
		var html=autoCreateSelect(ar);
		fn(html);
	});
}

function getOperatorServerList2(fn)
{
	$.getJSON("../ws/servers/", function(json) {
		var ar=[];
		for(var i in json)
		{
			for(var j in json[i].serverIds)
			{
				ar.push({text:json[i].name+"-"+json[i].serverIds[j],value:json[i].serverIds[j]});
			}			
		}
		var html=autoCreateSelect(ar);
		fn(html);
	});
}

function getOperatorServerList3(fn,names,tpl)
{
	$.getJSON("../ws/servers/", function(json) {
		var ar=[];
		for(var i in json)
		{
			for(var j in json[i].serverIds)
			{
				ar.push({text:json[i].name+"-"+json[i].serverIds[j],value:json[i].serverIds[j]});
			}			
		}
		var html=autoCreateCheckbox(ar,names,tpl);
		fn(html);
	});
}
function getOperatorServerList5(fn,names,tpl)
{
	$.getJSON("../ws/servers/", function(json) {
		var ar=[];
		var list={};
		for(var i in json)
		{
			ar.push({text:json[i].name,value:json[i].address});
			list[json[i].address]=json[i].name;
		}
		var html=autoCreateCheckbox(ar,names,tpl);
		fn(html,list,ar);
	});
}
function getOperatorServerList4(operatorId,fn)
{
	$.getJSON("../ws/operators/"+operatorId+"/servers", function(json) {
		console.log(json)
		var ar=[];
		for(var i in json)
		{
			for(var j in json[i].serverIds)
			{
				ar.push({text:json[i].name+"-"+json[i].serverIds[j],value:json[i].serverIds[j]});
			}			
		}
		var html=autoCreateSelect(ar);
		fn(html);
	});
}

/*
	自动生成checkbox
*/
function autoCreateCheckbox(ar,names,tpl)
{
	var html="";
	tpl=tpl || '<label>{text} <input value="{value}" type="checkbox" name="{names}" /> </label>';
	for(var i in ar)
	{
		var selected="";
		tempTpl=tpl;
		if(ar[i].selected==true)
			selected="selected";
		tempTpl=tempTpl.replace("{value}",ar[i].value)
					.replace("{names}",names)
					.replace("{text}",ar[i].text);
		//var checkbox=ar[i].text+' <input value="'+ar[i].value+'" '+selected+' type="checkbox" name="'+names+'" />';
		html+=tempTpl;
	}
	return html;
}

/*
	自动生成Select
*/
function autoCreateSelect(ar)
{
	var html="";
	for(var i in ar)
	{
		var selected="";
		if(ar[i].selected==true)
			selected="selected";
		var option='<option value="'+ar[i].value+'" '+selected+'>'+ar[i].text+'</option>';
		html+=option;
	}
	return html;
}
/*
	自动生成table head
*/
function autoCreateTableHead(fields,css)
{

	var css=css==null?"":" class='"+css+"' ";
	var tr="<tr "+css+">";
	
	//for td
	for(var key in fields)
	{
		var field=fields[key];
		if(field.hidden==true)
				continue;
		switch(field.type)
		{
			case "checkbox":
			break;
			default:
				var style=field.style==null?"":" style='"+field.style+"' ";		
				tr+="<th "+style+" >"+field.text + "</th>";	
			break;
		}
			
	}
	tr+="</tr>";		
	$("#tablesorter > thead:last").append(tr);
}

/*
	自动生成table
*/
function autoCreateTable(data,fields)
{
	//for tr
	for(var i=0;i<data.length;i++)
	{
		var tr="<tr>";
		
		//for td
		for(var key in fields)
		{
			var field=fields[key];
			var style=field.style==null?"":" style='"+field.style+"' ";
			var css=field.css==null?"":" class='"+field.css+"' ";
			if(field.hidden==true)
				continue;
			switch(field.type)
			{
				case "checkbox":
				break;
				case "boolean":
					if(data[i][field.index]==true)
						tr+="<td>是</td>";
					else
						tr+="<td>否</td>";
				break;
				case "edit":
					tr+="<td><input type='button' value='修改' onclick='edit(\"" + i + "\")' "+css+" "+style+"  /></td>";
				break;
				case "delete":
					tr+="<td><input type='button' value='删除' onclick='remove(\"" + data[i][field.index] + "\")' "+css+" "+style+" /></td>";
				break;
				case "bnt":
					tr+="<td><input type='button' value='"+field.text+"' onclick='"+field.fn+"(\"" + data[i][field.index]+ "\")' "+css+" "+style+"  /></td>";
				break;
				default:
					tr+="<td>"+data[i][field.index] + "</td>";
				break;
			}			
		}
		tr+="</tr>";		
		$("#tablesorter > tbody:last").append(tr);
	}
}

/*
	自动生成提交表单控件
*/
function autoCreateFormComponent(fields)
{
	var html="";
	for(var i in fields)
	{
		if(fields[i].noPost==true)
			continue;
		html+="<tr>"
		switch(fields[i].type)
		{
			case "bnt":
			case "edit":
			case "delete":
			break;			
			case "date":
			break;
			case "select":
			break;
			case "custom" :
				var t=fields[i].fn();
				html+='<td><div>'+fields[i].text+'：</div></td><td><div id="'+fields[i].index+'">'+t+'</div></td>';				
			break;
			case "boolean":
				html+='<td>'+fields[i].text+'：</td><td>是 <input name="'+fields[i].index+'" type="radio" value="true" /> 否<input  name="'+fields[i].index+'" type="radio" value="false" /></td>';
			break;
			case "checkbox":
				html+='<td><div>'+fields[i].text+'：</div></td><td><div class="checkbox_css">';
		
				//console.log(cache_ajax_data[fields[i].cache_ajax_key])
				
				var o=cache_ajax_data[fields[i].cache_ajax_key];
				var index=0;
				for(var key in o)
				{
					var value=o[key][fields[i].postValue];
					var name =o[key][fields[i].name];
					var checkbox='<label>'+name+':<input type="checkbox" id="'+(fields[i].index+index)+'" value="'+value+'" name="'+fields[i].index+'"  /></label>';
					html+=checkbox;
					index++;
				}
				html+="</div></td>";
			break;
			
			default:
				html+='<td><label>'+fields[i].text+'：</td><td><input id="'+fields[i].index+'" name="'+fields[i].index+'" type="text" /></label></td>';
			break;
		}
		html+="</tr>"
	}
	return html;
}

/*
	自动获取表单值
*/
function autoGetFormValue(fields)
{ 
	var o={};
	for(var key in fields)
	{
		
		var field=fields[key];
		switch(field.type)
		{
			case "bnt":
			case "edit":
			case "delete":
			break;			
			case "date":
			break;
			case "select":
			break;
			case "custom" :
			break;
			case "boolean":
				var value=$("input[name='"+field.index+"']:checked").val();
				o[field.index]=value;
			break;
			case "checkbox": 				
				o[field.index]=[];
				$("input[name='"+field.index+"']:checked").each(function(){
					o[field.index].push($(this).val());   
 				});
				//console.log($("input[name='"+field.index+"']:checked"))
			break;
			default:
				o[field.index]=$("#"+field.index).val();
			break;
		}
		
	}
	return o;
}

/*
	自动设置表单控件值
*/
function autoSetFormComponentValue(data,fields)
{
	clearFormComponentValue(fields);
	for(var i in fields)
	{
		switch(fields[i].type)
		{
			case "bnt":
			case "edit":
			case "delete":
			break;			
			case "date":
			break;
			case "select":
			break;
			case "custom" :
				fields[i].fn(fields[i].index,data[fields[i].index]);
			break;
			case "boolean":
				var checked="false";
				if(data[fields[i].index]==true)
					checked="true";
				$("input[name='"+fields[i].index+"'][value='"+checked+"']").attr("checked",true);
			break;
			case "checkbox": 				
				var o=cache_ajax_data[fields[i].cache_ajax_key];
				var index=0;
				for(var key in o)
				{
					
					var value=o[key][fields[i].postValue];
					var checked=false;
					for(var j in data[fields[i].index])
					{
						if(data[fields[i].index][j]==value)
						{
							checked=true;
							break;
						}
					}				
						
					$("#"+fields[i].index+index).attr("checked",checked);
					index++;
				}
			break;
			default:
				if(data[fields[i].index]!=null)
					$("#"+fields[i].index).val(data[fields[i].index]);
			break;
		}
	}
}

/*
	清空表单控件值
*/
function clearFormComponentValue(fields)
{
	for(var i in fields)
	{
		switch(fields[i].type)
		{
			case "bnt":
			case "edit":
			case "delete":
			break;	
			case "checkbox":
				$("input[name='"+fields[i].index+"']").attr("checked",false);
				/* var o=cache_ajax_data[fields[i].cache_ajax_key];
				var index=0;
				for(var key in o)
				{
					var checked=false;				
					$("#"+fields[i].index+index).attr("checked",checked);
					index++;
				} */
			break;
			default:
				$("#"+fields[i].index).val("");
			break;
		}
	}
}