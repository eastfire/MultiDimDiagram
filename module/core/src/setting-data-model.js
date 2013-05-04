define(function(require,exports,module) {	

	//setting data
	exports.PropertyTypeModel = Backbone.Model.extend({
		idAttribute:"name",
		defaults:function(){
			return {
				name:"",
				dataType:"primitive",//primitive, array, object, date, enum,...
				unqiue:false,//time may be unqiue
				axisable:true//such as description can't be axisable
			};
		},
	});
	exports.PropertyTypeCollection = Backbone.Collection.extend({
		model:exports.PropertyTypeModel
	});
});
