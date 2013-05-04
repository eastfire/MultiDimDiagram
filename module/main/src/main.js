define(function(require,exports,module) {
	var BoardView = require("../../core/src/board-view").BoardView;
	var PerspectiveView = require("../../core/src/perspective-view").PerspectiveView;
	var ListView = require("../../core/src/list-view").ListView;
	var CardView = require("../../core/src/card-view").CardView;

	var PropertyTypeCollection = require("../../core/src/setting-data-model").PropertyTypeCollection;

	var pts = new PropertyTypeCollection([
			{
				name:"name",
				dataType:"string",
				axisable:false
			},{
				name:"description",
				dataType:"primitive",
				axisable:false
			},{
				name:"phase",
				dataType:"primitive",
				label:"阶段",
				axisable:true
			},{
				name:"date",
				dataType:"date",
				label:"日期",
				axisable:true
			},{
				name:"user",
				dataType:"object",
				axisable:false
			},{
				name:"level",
				dataType:"enum",
				label:"优先级",
				dataRange:[{label:"S",value:1},{label:"A",value:2},{label:"B",value:3},{label:"C",value:4},{label:"D",value:5},{label:"E",value:6},{label:"F",value:7}],
				axisable:true
			}
			]);

	exports.CardView = CardView.extend({
		template : _.template(require("template!../layout/card-view.html")),
		initDisplayLayor:function(){
			if ( !this.entity )	{
				return this;
			}
			var self = this;
			this.$el.addClass("ui-corner-all ui-state-default");
			this.$el.html(this.template(_.extend(this.model.toJSON(),
				this.entity.toJSON() ) ));
			this.$(".card-date").viewEditExchangable({
				data:this.entity.get("date"),
				viewClass:"card-date-view",
				editClass:"card-date-edit",
				emptyNote:"请设置时间",
				viewTitle:"单击设置时间",
				editTitle:"按回车确定；按Esc取消",
				editType:"date",
				onEdit:function(data){
					self.entity.save({date:data},{wait:true});
				},
				showLink:false
			});
		},
		render:function(){
			this.$(".card-name").html(this.entity.get("name"));
			this.$(".card-level").html(_.filter(pts.get("level").get("dataRange"),function(o){
				return o.value == this.entity.get("level");
			},this)[0].label);
			this.$(".card-phase").html(this.entity.get("phase"));
			if ( this.$(".card-date").data("ui-viewEditExchangable") ){
				this.$(".card-date").viewEditExchangable("option","data",this.entity.get("date"));
			}
			return this;
		},
	});

	exports.ListView = ListView.extend({
		initClass:function(){
			ListView.prototype.initClass.call(this);
			this.CardView = exports.CardView;
		},
		initDataConnection:function(){
			this.model.cards.localStorage = new Store("cards"+this.model.get("id"));//XXX
		},
	});

	exports.PerspectiveView = PerspectiveView.extend({
		initClass:function(){
			PerspectiveView.prototype.initClass.call(this);
			this.ListView = exports.ListView;
		},
		initDataConnection:function(){
			this.model.lists.localStorage = new Store("lists"+this.model.get("id"));//XXX
		},
	});

	exports.AppView = BoardView.extend({
		initClass:function(){
			BoardView.prototype.initClass.call(this);
			this.PerspectiveView = exports.PerspectiveView;
		},
		initData:function(){
			this.options.propertyTypes = pts;
			BoardView.prototype.initData.call(this);
		},
		initDataConnection:function(){
			this.model.localStorage = new Store("board");
			this.perspectives.localStorage = new Store("perspectives"+this.model.get("id"));//XXX 
			this.navigation.localStorage = new Store("navigation"+this.model.get("id"));//XXX 
		},
		initDisplayLayor:function(){
			require.async("../css/board-view.css");
			BoardView.prototype.initDisplayLayor.call(this);
		},
	});
});