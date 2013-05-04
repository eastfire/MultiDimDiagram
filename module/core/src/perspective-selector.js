define(function(require,exports,module) {
	exports.PerspectiveSelector = Backbone.View.extend({
		events:{
			"click .select-perspective-button":"onSelectProspective"
		},
		initialize:function(){
			this.propertyTypes = this.options.propertyTypes;
			this.navigation = this.options.navigation;
			this.$el.addClass("perspective-selector");
			this.$el.append("<form><div class='selector'></div></form>");
			this.navigation.on("change:currentPerspective",this.onCurrentPerspectiveChanged,this);
		},
		render:function(){
			this.$(".selector").empty();

			for ( var i=0; i < this.propertyTypes.length; i++){
				var t = this.propertyTypes.at(i)
				if ( t.get("axisable") ){
					name = t.get("name");
					this.$(".selector").append("<input type='radio' id='"+name+"' name='perspective' class='select-perspective-button' "+(this.navigation.get("currentPerspective")==name?"checked":"")+"/><label for='"+name+"'>"+t.get("label")+"</label>");
				}
				
			}
			this.$(".selector").buttonset();
		},
		onSelectProspective:function(event){
			this.navigation.save({"currentPerspective":$(event.currentTarget).attr("id")},{wait:true});
		},
		onCurrentPerspectiveChanged:function(model){
			this.$("input").prop("checked",false);
			this.$("input[id="+model.get("currentPerspective")+"]").prop("checked",true);
		}
	});
});