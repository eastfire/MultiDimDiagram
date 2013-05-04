define(function(require,exports,module){
	var AgendaCollection = require("../module/main/src/data-model").EntityCollection;
	var AppView = require("../module/main/src/main").AppView;
	var PerspectiveSelector = require("../module/core/src/perspective-selector").PerspectiveSelector;
	var datas = new AgendaCollection();

	datas.localStorage = new Store("entities");//XXX For test

	datas.fetch({
		success:function(collection){
			window.app = new AppView({el:"#main", appid:123,entities:datas});
			$("#main").before("<div id='selector'></div>");
			var v = new PerspectiveSelector({el:"#selector", propertyTypes:app.propertyTypes, navigation:window.app.navigation});
			v.render();
		},
		error:function(){
		}
	});
	
});
