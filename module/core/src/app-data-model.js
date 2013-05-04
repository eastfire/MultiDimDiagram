define(function(require,exports,module) {	
	//app data
	exports.BoardModel = Backbone.Model.extend({
		defaults:function(){
			return {
				//some meta data
				name:"",
				description:"",
				creater:0,
				createTime:0,

				perspectives:null
			};
		},
		initialize:function(){
			this.perspectives = this.get("perspectives") || new exports.PerspectiveCollection();
		}
	});
	//app data 视角
	exports.PerspectiveModel = Backbone.Model.extend({
		defaults:function(){
			return {
				axisProperty:"",
				sortable:true,//lists sortable
				compressed:true,//按比例（时间、距离等）稀疏的或不按比例压缩的
				creatable:true,//can create list or not

				list:null,
				listByOrder:[],
				orderByList:{}
			};
		},
		initialize:function(){
			this.lists = this.get("lists") || new exports.ListCollection();
		}
	});
	exports.PerspectiveCollection = Backbone.Collection.extend({
		model:exports.PerspectiveModel
	});

	//app data 一个坐标值上的列表
	exports.ListModel = Backbone.Model.extend({
		defaults:function(){
			return {
				propertyValue:null,
				sortable:true,//cards sortable
				creatable:true,//can create card in list or not
				cardByOrder:[],
				orderByCard:{}
			};
		},
		initialize:function(){
			this.cards = this.get("lists") || new exports.CardCollection();
		}
	});
	exports.ListCollection = Backbone.Collection.extend({
		model:exports.ListModel
	})

	//app data 
	exports.CardModel = Backbone.Model.extend({
		idAttribute:"entityId",
		defaults:function(){
			return {
				entityId:0,
				archived:false
			};
		},
	});
	exports.CardCollection = Backbone.Collection.extend({
		model:exports.CardModel
	})
});