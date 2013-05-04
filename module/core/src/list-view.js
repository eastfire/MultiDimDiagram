define(function(require,exports,module) {
	var BasicUIView = require("../../core/src/basic-ui-view").BasicUIView;
	var DataModel = require("../../core/src/app-data-model");
	exports.ListView = BasicUIView.extend({
		events:{
			"sortreceive .card-list":"onSortReceive",
			"click .delete-list-button":"onClickDelete",
			"click .add-card-button":"onClickCreateCard",
			"sortupdate .card-list":"onSortCards"
		},
		initClass:function(){
			this.CardView = this.options.adapter || require("./card-view").CardView;
			this.HeadAdapter = this.options.headAdapter || require("./basic-list-head-adapter").BasicListHeadAdapter;
			this.CreateEntityView = this.options.creater || require("./create-entity-view").CreateEntityView;
		},
		initData:function(){
			this.entities = this.options.entities;
			this.propertyType = this.options.propertyType;			
		},
		/*initDataConnection:function(){
			this.model.cards.localStorage = new Store("cards"+this.model.get("id"));//XXX
		},*/
		initDataEvents:function(){
			this.model.cards.on("reset",this.onResetCards,this);
			this.model.cards.on("add",this.onAddCard,this);
			this.model.cards.on("remove",this.onRemoveCard,this);
			this.model.on("destroy",this.remove,this);
		},
		fetchData:function(){
			var self = this;
			this.addFetchQueue(function(){
				self.model.cards.fetch({
					success:function(collection){
						self.fetchNext();
					},
					error:function(){
						alert("fetch cards:"+self.model.get("id")+" fail");
					}
				});
			});
			BasicUIView.prototype.fetchData.call(this);
		},
		initDisplayLayor:function(){
			this.$el.addClass("card-list-view ui-corner-all ui-state-default");
			this.$el.append("<div class='list-head'></div><div class='card-list'></div><div class='list-operation'></div><button class='add-card-button ui-button'>add card</button>");
			var head = $("<div>").appendTo(this.$(".list-head"));
			var v = new this.HeadAdapter({el:head, model:this.model, propertyType:this.propertyType, entities: this.entities});
			v.render();
			this.$(".card-list").sortable({
				connectWith: ".card-list",
				placeholder: "card-placeholder ui-corner-all ui-state-highlight",
				forcePlaceholderSize: true
			});
			this.$(".list-operation").append("<span class='delete-list-button ui-icon ui-icon-close'/><span class='create-list-button ui-icon ui-icon-plus'/>");
		},
		onResetCards:function(collection,options){
			this.$(".card-list").empty();
			collection.each(function(m,i){
				this.$(".card-list").append("<div class='card-view'></div>");
			},this);
			collection.each(function(m,i){
				this.onAddCard(m,collection,{at:i})
			},this);
		},
		onAddCard:function(model,collection,options){
			var savedIndex = this.model.get("orderByCard")[model.get("entityId")];
			if ( !this.$(".card-view[id="+model.get("entityId")+"]").length ){
				var el;
				if ( savedIndex != undefined ) {
					el = this.$(".card-list").find(".card-view:nth-child("+(savedIndex+1)+")");
				} else {
					var index = ( options.at != undefined )? options.at : (collection.length-1);
					if ( index == 0 ) {
						el = $("<div class='card-view'></div>").prependTo(this.$(".card-list"));
					} else {
						el = $("<div class='card-view'></div>");
						this.$(".card-list").find(".card-view:nth-child("+index+")").after(el);
					}
				}

				var v = new this.CardView({el: el, model:model, entities:this.entities, propertyType:this.propertyType});
				v.render();
				el.attr("id",model.get("entityId"));
			}
			if ( savedIndex == undefined ) this.onSortCards();
		},
		onRemoveCard:function(model,collection,options){
			this.onSortCards();
		},
		onSortReceive:function(event,ui){
			var self = this;
			var entity = $(ui.item).data("view").entity;
			var card = $(ui.item).data("view").model;
			var index = $(ui.item).index();
			var opt = {};
			opt[this.propertyType.get("name")] = this.model.get("propertyValue");
			entity.save(opt,{
				success:function(){
					var c = card.toJSON();
					card.destroy({wait:true});
					self.model.cards.create(c,{at:index});
				},
				error:function(){
					self.$(".card-list").sortable("cancel");
				},
				wait:true
			});	
		},
		onClickDelete:function(event){
			event.stopPropagation();
			var opt = {};
			opt[this.propertyType.get("name")] = null;
			this.model.cards.each(function(card){
				this.entities.get(card.get("entityId")).set(opt,{
					success:function(){
					},
					error:function(){
					}
				})
			},this);
			this.model.destroy({wait:true});
		},

		remove:function(){
			this.model.cards.off("reset",this.onResetCards,this);
			this.model.cards.off("add",this.onAddCard,this);
			this.model.cards.off("remove",this.onRemoveCard,this);
			BasicUIView.prototype.remove.call(this);
		},
		
		onClickCreate:function(event){
			event.stopPropagation();
			this.$el.parent().data("view").model.lists.create({propertyValue:""},{wait:true,at:(this.$el.index()+1)});
		},

		onClickCreateCard:function(event){
			event.stopPropagation();
			$(event.currentTarget).hide();
			var el = $("<div>");
			this.$el.append(el);
			var v = new this.CreateEntityView({el:el, entities:this.entities, propertyType:this.propertyType, propertyValue:this.model.get("propertyValue")});
			v.on("destroy",function(){
				$(event.currentTarget).css({"display":""});
			});
			v.render();
		},
		onSortCards:function(event){
			var newCardByOrder = [];
			var newOrderByCard = {};
			this.$(".card-view").each(function(i,el){
				var v = $(el).data("view");
				if ( v ){
					var id = v.model.get("entityId");
					newCardByOrder.push(id);
					newOrderByCard[id] = i;
				}
			})
			
			this.model.save({cardByOrder:newCardByOrder, orderByCard:newOrderByCard},{wait:true});
		},
		onCardOrderChanged:function(model){

		}
	});
});