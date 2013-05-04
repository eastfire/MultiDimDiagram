define(function(require,exports,module) {
	var BasicUIView = require("../../core/src/basic-ui-view").BasicUIView;
	exports.CardView = BasicUIView.extend({
		initDisplayLayor:function(){
			this.$el.addClass("card-view ui-corner-all  ui-state-default");
		},
		initData:function(){
			this.entities = this.options.entities;
		
			this.entity = this.entities.get(this.model.get("entityId"));
			if ( !this.entity )	{
				this.model.destroy();
				return;
			}
		},
		initDataEvents:function(){
			this.model.on("change",this.render,this);
			this.model.on("destroy",this.remove,this);
			this.entity.on("change",this.render,this);
			this.entity.on("destroy",this.remove,this);
			//this.entity.on("change:"+this.options.propertyType.get("name"),this.checkRemove,this);
		},
		render:function(){
			if ( !this.entity )	{
				return this;
			}
			this.$el.empty();			
			
			//this.$el.append("<label class='card-name'>"+this.entity.get("name")+"</lable><div></div>");
			for ( var key in this.entity.attributes){
				this.$el.append("<label>"+key+"="+this.entity.attributes[key]+"</lable><div></div>");
			}
			return this;
		},
		remove:function(){
			this.model.off("change",this.render,this);
			this.model.off("destroy",this.remove,this);
			this.entity.off("change",this.render,this);
			BasicUIView.prototype.remove.call(this);
		},
		checkRemove:function(){
			/*if ( this.$el.parents(".card-list-view").length && this.$el.parents(".card-list-view").data("view").model.get("propertyValue") != this.entity.get(this.options.propertyType.get("name")) ) {
				this.remove();
			}*/
		}
	});
});