define(function(require,exports,module) {	
	//app data
	exports.NavigationModel = Backbone.Model.extend({
		defaults:function(){
			return {
				currentPerspective:""
			};
		}
	});
});