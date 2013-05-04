define(function(require,exports,module) {	
	exports.BasicUIView = Backbone.View.extend({
		initialize: function() {
			this.$el.data("view",this);
			this.initClass();
			this.initGlobalConnection();
			this.initData();
			this.initDataConnection();
			this.initDisplayLayor();
			this.initDataEvents();
			this.fetchData();			
		},
		initClass:function() {
		},
		initGlobalConnection:function(){
		},
		initData:function(){
		},
		initDataEvents:function(){
		},
		initDataConnection:function(){
		},
		initDisplayLayor:function(){
		},
		addFetchQueue:function(func){
			$.queue(this.$el,"__fetch_data__",func);
		},
		fetchNext:function(){
			$.dequeue(this.$el,"__fetch_data__");
		},
		fetchData:function(){
			this.fetchNext();
		},
		show: function(){
			this.$el.show();
		},
		hide: function(){
			this.$el.hide();
		},
	});
});