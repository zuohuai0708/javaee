/**
 * @file
 * @author Kent
 * @date 20130601
 */
;(function($) {
	/**
	 * 表格渲染器
	 * 
	 * 根据指定表格的表头信息生成对应的数据表格
	 * parameters：
	 * 
	 * field: the data object mapping key
	 * dict: the data contains code whith defined in __DICT__ object will be converted automatic
	 * date: specify the day field will be formated by the specify pattern default by "yyyy-MM-dd"
	 * time: specify the day field will be formated by the specify pattern default by "hh:mm:ss"
	 * datetime: specify the day field will be formated by the specify pattern default by "yyyy-MM-dd hh:mm:ss"
	 * html: if use this attribute, field will not be mapped by any object fields. can use {fieldName} to specify the object values
	 * formula: the content will be execute by javascript:eval(content) 
	 * prefix: prefix with content
	 * suffix: suffix with content
	 * header: if use this attribute, the td(th)'s content text will be use for every row. also, you can use {fieldName} to specify the object values
	 * 
	 * @param datas(array[object]) : a serial of table row data
	 * @param options(object) : config arguments @see $.fn.eyutable.defaults
	 */
	$.fn.eyutable = function(datas, options) {
		var opts = $.extend({}, $.fn.eyutable.defaults, options);
		return this.each(function() {
			var $this = $(this);
			
			$this.find('tbody').remove();
			
			var $TBODY = $('<tbody>');

			var fields = $.map($('thead tr:last th', $this), function(v) {
				var header = null;
				if ($(v).attr('header') != null) {
					$(v).children().show();
					header = $(v).html();
					$(v).children().hide();
				}
				
				return {
					field : $(v).attr('field'),
					dict : $(v).attr('dict'),
					date : $(v).attr('date'),
					time : $(v).attr('time'),
					datetime : $(v).attr('datetime'),
					html : header || $(v).attr('html'),
					formula : $(v).attr('formula'),
					zero : $(v).attr('zero'),
					prefix : $(v).attr('prefix'),
					suffix : $(v).attr('suffix'),
					render : $(v).attr('render')
				};
			});
			
			
			for (var i = 0, iLen = datas.length; i < iLen; ++i) {
				var html = '';
				var data = datas[i];

				for (var j = 0, jLen = fields.length; j < jLen; ++j) {
					var field = fields[j];
					var value = field.field ? fieldValue(field.field, data) : '';

					if (field.dict) {
						value = __DICT__[field.dict][value];
					}
					if (field.date != null) {
						value = value ? new Date(value).format('' == field.date ? opts.dateformat : field.date) : '';
					}
					if (field.time != null) {
						value = value ? new Date(value).format('' == field.date ? opts.timeformat : field.time) : '';
					}
					if (field.datetime != null) {
						value = value ? new Date(value).format(('' == field.datetime) ? opts.datetimeformat : field.datetime) : '';
					}
					if (field.html) {
						value = tempalte(field.html, data)
					}
					if (field.formula) {
						value = eval(tempalte(field.formula, data));
					}
					
					if (field.zero) {
						value = value ? value : field.zero;
					}
					if (field.prefix && value != field.zero) {
						value = field.prefix + '' + value;
					}
					if (field.suffix && value != field.zero) {
						value = value + '' + field.suffix;
					}
					
					if (field.render) {
						value = eval(field.render).call(this, data);
					}
					

					html += '<td>' + (value || '') + '</td>';
				}

				$TBODY.append('<tr>' + html + '</tr>');
			}

			$TBODY.appendTo($this);
		});
	};
	
	function fieldValue(name, obj) {
		var result = /(\w+)(\.+)(\S+)/.exec(name)
		if (result) {
			return fieldValue(result[3], obj[result[1]]);
		}
		return obj[name];
	}

	function tempalte(tpl, obj) {
		return tpl.replace(/\{(.+?)\}/gm, function(key, a, b, c, d) {
			return fieldValue(a, obj);
		});
	}
	
	$.fn.eyutable.defaults = {
		dateformat : 'yyyy-MM-dd',
		timeformat : 'hh:mm:ss',
		datetimeformat : 'yyyy-MM-dd hh:mm:ss'
	}

})(jQuery);