define(function(require,exports,module) {	
	//entity data
	exports.EntityModel = Backbone.Model.extend({
	});
	exports.EntityCollection = Backbone.Collection.extend({
		model:exports.BaseEntityModel
	});
});
