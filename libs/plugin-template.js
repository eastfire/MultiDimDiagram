/**
 * The text plugin to load a module as text content
 */
define('seajs/plugin-template', ['./plugin-base'], function(require) {

  var plugin = require('./plugin-base')
  var util = plugin.util


  plugin.add({
    name: 'template',

    ext: ['.htm', '.html'],

    fetch: function(url, callback) {
		$.ajax({type:"GET",dataType:"text",url:url,success:function(resp){
			var str = jsEscape(resp)
			util.globalEval('define([], "' + str + '")')
			callback()
		}});
    }
  })


  function jsEscape(s) {
    return s.replace(/(["\\])/g, '\\$1')
        .replace(/\r/g, "\\r")
        .replace(/\n/g, "\\n")
        .replace(/\t/g, "\\t")
        .replace(/\f/g, "\\f")
  }

});

