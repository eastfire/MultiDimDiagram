define(function(require,exports,module) {
	var BasicUIView = require("./basic-ui-view").BasicUIView;

	exports.BoardView = BasicUIView.extend({
		initClass:function() {
			var DataModel = require("./app-data-model");
			this.BoardModel = DataModel.BoardModel;
			this.PropertyTypeCollection = DataModel.PropertyTypeCollection;
			this.PerspectiveCollection = DataModel.PerspectiveCollection;
			this.NavigationModel = require("./navigation-data-model").NavigationModel;
			this.PerspectiveView = require("./perspective-view").PerspectiveView;
		},
		initData:function(){
			this.entities = this.options.entities;
			if (this.options.propertyTypes){
				this.propertyTypes = this.options.propertyTypes;
			} else {
				this.propertyTypes = new PropertyTypeCollection();
			}

			this.model = new this.BoardModel({id:this.options.appid});			

			this.perspectives = new this.PerspectiveCollection();			

			this.navigation = new this.NavigationModel({id:this.options.appid});			
		},

/*		initDataConnection:function(){
			this.perspectives.localStorage = new Store("perspectives"+this.model.get("id"));//XXX 
			this.navigation.localStorage = new Store("navigation"+this.model.get("id"));//XXX 
		},*/
		initDataEvents:function(){
			this.perspectives.on("reset",this.onResetPerspectives,this);
			this.perspectives.on("add",this.onAddPerspective,this);
			this.perspectives.on("remove",this.onRemovePerspective,this);

			this.model.on("destroy",this.remove,this);
			this.navigation.on("change:currentPerspective",this.onCurrentPerspectiveChange,this);
		},

		fetchData:function(){
			var self = this;
			
			this.addFetchQueue(function(){
				if ( !self.options.propertyTypes ){
					self.propertyTypes.fetch({
						success:function(){
							self.fetchNext();
						},
						error:function(){
							//warning
						}
					});
				} else {
					self.fetchNext();
				}
			});
			this.addFetchQueue(function(){
				self.navigation.fetch({
					success:function(){
						self.fetchNext();
					},
					error:function(){
						self.fetchNext();
					}
				});
				self.fetchNext();
			});
			this.addFetchQueue(function(){
				self.model.fetch({
					success:function(){
						
					},
					error:function(){
						//warning
					}
				});
				self.fetchNext();
			});
			this.addFetchQueue(function(){
				self.perspectives.fetch({
					success:function(collection){
						var count = 0;
						var fetched = 0;
						for ( var i=0; i < self.propertyTypes.length; i++){
							var t = self.propertyTypes.at(i)
							if ( t.get("axisable") ){
								var name = t.get("name");
								if ( !collection.filter(function(p){
										return p.get("axisProperty") == name;
									}).length ){
									count ++;
									collection.create({
										axisProperty:name,
									},{success:function(){										
											fetched++;
										},
										error:function(){
											alert("create prespective fail");
										},
										wait:true
									});
								}
							}
						}
						var handle = setInterval(function(){
							if ( fetched == count )	{
								clearInterval(handle);
								self.fetchNext();
							}
						},100);
					},
					error:function(){
						alert("fetch prespectives fail");
					}
				});
			});			
			BasicUIView.prototype.fetchData.call(this);
		},
		initDisplayLayor:function(){
			this.$el.addClass("board-view").append("<div class='perspective-list'></div>");
		},

		onResetPerspectives:function(collection,options){
			collection.each(function(m,i){
				this.onAddPerspective(m,collection,{at:i})
			},this);
			if ( !this.navigation.get("currentPerspective") && collection.length )
				this.navigation.save({"currentPerspective": collection.at(0).get("axisProperty")},{wait:true});
		},
		
		onAddPerspective:function(model,collection,options){
			var v = new this.PerspectiveView({model:model, entities:this.entities, propertyType:this.propertyTypes.get(model.get("axisProperty"))});
			this.$(".perspective-list").append(v.render().el);
			v.$el.attr("id",model.get("axisProperty") );			
			if ( model.get("axisProperty") == this.navigation.get("currentPerspective") ){
				this.$(".perspective-view").hide();			
				v.show();
			} else v.hide();
			if ( !this.navigation.get("currentPerspective") && collection.length )
				this.navigation.save({"currentPerspective": collection.at(0).get("axisProperty")},{wait:true});
		},
		
		onRemovePerspective:function(model,collection,options){//TODO
		},

		onCurrentPerspectiveChange:function(model){
			this.$(".perspective-view").hide();
			this.$(".perspective-view[id="+model.get("currentPerspective")+"]").show();
		}
	});
});