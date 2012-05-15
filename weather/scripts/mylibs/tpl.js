(function(root) {

	root.tpl = function(template, data, model) {
		var i, item, result, _len;
		if (!_.isArray(data)) data = [data];
		result = '';
		for (i = 0, _len = data.length; i < _len; i++) {
			item = data[i];
			result += template.call(item, i, item, model);
		}
		return result;
	};

})(this);
