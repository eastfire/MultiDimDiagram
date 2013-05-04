define(function(require,exports,module) {	
	var DataModel = require("../../core/src/entity-data-model");
	exports.EntityModel = DataModel.EntityModel.extend({
		defaults:function(){
			return {
				name:"",
				description:"",
				date:Math.floor(new Date().getTime() / (1000*60*60*24))* 1000 * 60*60*24,
				level:4,
				phase:"todo",
				user:null
			};
		}
	});
	exports.EntityCollection = DataModel.EntityCollection.extend({
		model:exports.EntityModel
	});
});
