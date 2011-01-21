/* A silly plugin */
FW.extend({
	ask: function(opt){
		FW.time('ask');
		var options = { 
			text : 'Default text',
			doThis: function(){ return 'do'; },
			dont: function(){ return 'dont'; }
		};
		if(FW.utils.isString(opt)){
			options.text = opt;
		}else if(FW.utils.isObject(opt)){
			FW.extend(options, opt);
		};		
		var res = confirm(options.text);
		FW.time('ask');
		if(res){
			return options.doThis();
		}
		return options.dont();
	}
});