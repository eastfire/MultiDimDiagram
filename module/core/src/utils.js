define(function(require,exports,module){
	exports.getObjectClass = function (obj) {
		if (obj && obj.constructor && obj.constructor.toString) {
			var arr = obj.constructor.toString().match(
				/function\s*(\w+)/);

			if (arr && arr.length == 2) {
				return arr[1];
			}
		}
		return undefined;
	}

//TODO	exports.language = 
	
	exports.language = "zh-CN";
});