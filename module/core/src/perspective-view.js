define(function(require,exports,module) {
	var BasicUIView = require("../../core/src/basic-ui-view").BasicUIView;
	var DataModel = require("../../core/src/app-data-model");
	exports.PerspectiveView = BasicUIView.extend({
		events:{
			"click .create-list-button":"onClickCreate",
			"click .list-list:empty":"onClickCreateWhenEmpty",
			"sortupdate .list-list":"onSortLists"
		},
		initClass:function(){
			this.ListCollection = DataModel.ListCollection;
			this.ListView = require("./list-view").ListView;
		},
		initData:function(){
			this.entities = this.options.entities;
		},
		/*initDataConnection:function(){
			this.model.lists.localStorage = new Store("lists"+this.model.get("id"));//XXX
		},*/
		initDataEvents:function(){
			this.model.lists.on("reset",this.onResetLists,this);
			this.model.lists.on("add",this.onAddList,this);
			this.model.lists.on("remove",this.onRemoveList,this);

			this.model.on("change:newListByOrder",this.onListOrderChanged,this);
			this.model.on("destroy",this.remove,this);
		},
		initDisplayLayor:function(){
			this.$el.addClass("perspective-view");
			this.$el.append("<div class='list-list'></div>");
			this.$(".list-list").sortable({
				placeholder: "ui-state-highlight ui-corner-all list-placeholder",
				forcePlaceholderSize: true
			});
		},
		fetchData:function(){
			var self = this;
			this.addFetchQueue(function(){
				self.model.lists.fetch({
					success:function(collection){
						self.fetchNext();
					},
					error:function(){
						alert("fetch list:"+self.model.get("axisProperty")+" fail");
					}
				});
			});
			this.addFetchQueue(function(){
				if ( self.entities.length ){
					self.onResetEntities(self.entities);
				}
				self.entities.on("reset",self.onResetEntities,self);
				self.entities.on("add",self.onAddEntity,self);
				self.entities.on("remove",self.onRemoveEntity,self);
			});
			BasicUIView.prototype.fetchData.call(this);
		},
		onResetEntities:function(collection,options){
			var funcs = [];
			var self = this;
			collection.each(function(entity){
				funcs.push(function(){
					self.onAddEntity(entity,collection);
				});
			},this);
			this.$el.queue("__reset_entities__", funcs);
			this.$el.dequeue("__reset_entities__");			
		},
		
		onAddEntity:function(model,collection,options){
			var lists = this.model.lists;
			var self = this;
			var key = model.get(this.model.get("axisProperty"));

			if ( key != undefined && key != null ){
				var found = false;
				var list = null;
				for ( var i = 0; i < lists.length ; i++ ){
					var l = lists.at(i);
					if ( key == l.get("propertyValue") ){ //TODO compare func needed for special dataType
						list = l;
						break;
					}
				}
				if ( !list ){
					lists.create({
						propertyValue:key
					},
					{
						success:function(list,collection){
							list.cards.create({entityId:model.get("id")});
							self.$el.dequeue("__reset_entities__");
						},
						error:function(){
							self.$el.dequeue("__reset_entities__");
						},
						wait:true
					});					
				} else {
					if ( !list.cards.get(model.get("id")) )
						list.cards.create({entityId:model.get("id")},{wait:true});
					this.$el.dequeue("__reset_entities__");
				}
			}

			model.on("change:"+this.model.get("axisProperty"),this.onEntityChangeList,this);
		},
		
		onEntityChangeList:function(model){
			var key = model.get(this.model.get("axisProperty"));
			var prevKey = model.previous(this.model.get("axisProperty"));
			var lists = this.model.lists;
			var self = this;

			var cardModel = null;
			for ( var i = 0; i < lists.length ; i++ ){
				var l = lists.at(i);
				if ( prevKey == l.get("propertyValue") ){ //TODO compare func needed for special dataType
					cardModel = l.cards.get(model.get("id"));
					break;
				}
			}
			var c = cardModel ? cardModel.toJSON() : {entityId:model.get("id")};
			if ( key != undefined && key != null ){
				var found = false;
				var list = null;
				for ( var i = 0; i < lists.length ; i++ ){
					var l = lists.at(i);
					if ( key == l.get("propertyValue") ){ //TODO compare func needed for special dataType
						list = l;
						break;
					}
				}
				if ( !list ){
					lists.create({
						propertyValue:key
					},
					{
						success:function(list,collection){
							list.cards.create(c,{wait:true});
							if ( cardModel )
								cardModel.destroy({wait:true});
						},
						error:function(){
						},
						wait:true
					});					
				} else {
					var cardView = this.$(".card-list-view[id="+list.get("id")+"] .card-view[id="+model.get("id")+"]");
					if ( !cardView.length ) {
						list.cards.create(c,{wait:true});
						if ( cardModel )
							cardModel.destroy({wait:true});
					}
				}
			}
		},
		
		onRemoveEntity:function(model,collection,options){//TODO
		},

		onResetLists:function(collection,options){
			this.$(".list-list").empty();
			collection.each(function(m,i){
				this.$(".list-list").append("<div class='card-list-view'></div>");
			},this);			
			collection.each(function(m,i){
				this.onAddList(m,collection,{at:i})
			},this);
		},
		
		onAddList:function(model,collection,options){
			var savedIndex = this.model.get("orderByList")[model.get("id")];
			var el;
			if ( savedIndex != undefined ) {
				el = this.$(".list-list").find(".card-list-view:nth-child("+(savedIndex+1)+")");
			} else {
				var index = ( options.at != undefined )? options.at : (collection.length-1);
				if ( index == 0 ) {
					el = $("<div>").prependTo(this.$(".list-list"));
				} else {
					el = $("<div>");
					this.$(".list-list").find(".card-list-view:nth-child("+index+")").after(el);
				}
			}

			var v = new this.ListView({el: el, model:model, entities:this.entities, propertyType:this.options.propertyType});
			v.render();
			el.attr("id",model.get("id"));

			if ( savedIndex == undefined ) this.onSortLists();
		},
		
		onRemoveList:function(model,collection,options){
			this.onSortLists();
		},

		remove:function(){
			this.model.lists.off("reset",this.onResetLists,this);
			this.model.lists.off("add",this.onAddList,this);
			this.model.lists.off("remove",this.onRemoveList,this);
			BasicUIView.prototype.remove.call(this);
		},

		onClickCreate:function(event){
			event.stopPropagation();
			this.model.lists.create({propertyValue:""},{wait:true,at:($(event.currentTarget).parents(".card-list-view").index()+1)});
		},
		onClickCreateWhenEmpty:function(event){
			event.stopPropagation();
			this.model.lists.create({propertyValue:""},{wait:true,at:0});
		},
		onSortLists:function(event){
			var newListByOrder = [];
			var newOrderByList = {};
			this.$(".card-list-view").each(function(i,el){
				var id = $(el).data("view").model.get("id");
				newListByOrder.push(id);
				newOrderByList[id] = i;
			})
			
			this.model.save({listByOrder:newListByOrder, orderByList:newOrderByList},{wait:true});
		},
		onListOrderChanged:function(model){

		}
	});
});