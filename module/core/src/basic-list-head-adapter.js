define(function(require,exports,module) {
	require("jquery.ui.view-edit-exchangable");
	require("linker");
	exports.BasicListHeadAdapter = Backbone.View.extend({
		initialize:function(){
			this.entities = this.options.entities;
			this.propertyType = this.options.propertyType;
			this.model.on("change",this.render,this);
			this.model.on("destroy",this.remove,this);
			this.$el.addClass("ui-corner-all ui-state-default");
			
			var self = this;
			var opt = {
				data:this.model.get("propertyValue"),
				viewClass:"phase-list-head-view",
				editClass:"phase-list-head-edit",
				emptyNote:"请输入列表名",
				viewTitle:"单击编辑列表名",
				editTitle:"按回车确定；按Esc取消",
				onBlur:"apply",
				startWith:this.model.get("propertyValue")?"view":"edit",
				onEdit:function(data){
					self.model.save({propertyValue:data},{wait:true});
					for ( var i = 0; i < self.model.cards.length; i++ ) {
						self.entities.get(self.model.cards.at(i).get("entityId")).save(self.propertyType.get("name"),data)
					}
				},
				showLink:true,
				validate:function(data){
					return data;
				},
				invalidClass:"ui-state-error",
			};
			if ( this.propertyType.get("dataType") == "string" ){
				opt.editType = "input";
			} else if ( this.propertyType.get("dataType") == "enum" ){
				opt.editType = "select";
				opt.selects = this.propertyType.get("dataRange");
			} else if ( this.propertyType.get("dataType") == "date" ){
				opt.editType = "date";
			} else if ( this.propertyType.get("dataType") == "time" ){
				//TODO
			} else if ( this.propertyType.get("dataType") == "date_and_time" ){
				//TODO
			}
			this.$el.viewEditExchangable(opt);
		},
		render:function(){			
			this.$el.viewEditExchangable("option","data",this.model.get("propertyValue"));
			return this;
		},		
	});
});