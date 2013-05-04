define(function(require,exports,module) {
	exports.CreateEntityView = Backbone.View.extend({
		events:{
			"keypress .card-property-input":"onInput"
		},
		initialize:function(){
			this.entities = this.options.entities;
			this.$el.append("<input class='card-property-input' title='按回车确定；按Esc取消' placeholder='请输入名称'/>");
			this.$(".card-property-input").focus();
		},
		onInput:function(event){
			var self = this;
			if ( event.keyCode == 13 ){
				var val = this.$(".card-property-input").val();
				var opt = {};
				opt[this.options.propertyType.get("name")] = this.options.propertyValue;
				opt["name"] = val;
				this.entities.create(opt,{
					success:function(){
						self.trigger("destroy",self.$el);
						self.remove();
					},
					error:function(){ //TODO
					},
					wait:true
				});
			} else if ( event.keyCode == 27 ){
				this.trigger("destroy",this.$el);
				this.remove();
			}
		}
	});
});