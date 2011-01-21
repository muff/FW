(function(){
// Anonymous function that gets called at the end
  var FW = {
		utils: {
			// Type and data checks a mix of jquery, underscore ++
			// Pure Ripoffs and then some mods
		  isElement : function(obj) { return !!(obj && obj.nodeType == 1); },
		  isArguments : function(obj) { return !!(obj && hasOwnProperty.call(obj, 'callee')); },
		  isFunction : function(obj) { return !!(obj && obj.constructor && obj.call && obj.apply); },
		  isString : function(obj) { return !!(obj === '' || (obj && obj.charCodeAt && obj.substr)); },
		  isNumber : function(obj) { return !!(obj === 0 || (obj && obj.toExponential && obj.toFixed));},
		  isNaN : function(obj) {  return obj !== obj;},
		  isBoolean : function(obj) { return obj === true || obj === false;},
		  isArray : function(obj) { return obj instanceof Array || obj.length === 0 || obj.length > 0;},
		  isDate : function(obj) { return !!(obj && obj.getTimezoneOffset && obj.setUTCFullYear); },
		  isRegExp : function(obj) {return !!(obj && obj.test && obj.exec && (obj.ignoreCase || obj.ignoreCase === false));},
		  isNull : function(obj) { return obj === null; },
		  isUndefined : function(obj) { return obj === void 0;},
		  isEmpty : function(obj) { 
				if (FW.utils.isArray(obj) || FW.utils.isString(obj)) { return obj.length === 0; }
			  for (var key in obj) {if (hasOwnProperty.call(obj, key)){ return false;}}
			  return true;
	  	},
		  isObject : function(obj) {
				if(obj instanceof Object ){ return true ; } 
		    if (!obj || toString.call(obj) !== "[object Object]" || obj.nodeType || obj.setInterval) {return false;}
		    if (obj.constructor && !hasOwnProperty.call(obj, "constructor") && !hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) { return false; }
		    var key;
		    for (key in obj) {}
		    return key === undefined || hasOwnProperty.call(obj, key);
		  },
			inArray: function( elem, array ) {
				if ( array.indexOf ) {
					return array.indexOf( elem );
				}
				for ( var i = 0, length = array.length; i < length; i++ ) {
					if ( array[ i ] === elem ) {
						return i;
					}
				}
				return -1;
			}
		}
	};  
	_FW = FW;
  window.FW = FW;

  /*   
    Extending function borrowed from jQuery, to extend objects with information.  
  */
  FW.extend = function(){
    var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options, name, src, copy;
    if ( typeof target === "boolean" ) {
      deep = target;
      target = arguments[1] || {};
      i = 2;
    }
    if ( typeof target !== "object" && typeof target !== 'function' ) {
      target = {};
    }
    if ( length === i ) {
      target = this;
      --i;
    }
    for ( ; i < length; i++ ) {
      if ( (options = arguments[ i ]) !== null ) {
        for ( name in options ) {
          src = target[ name ];
          copy = options[ name ];
          if ( target === copy ) {
            continue;
          }
          if ( deep && copy && ( FW.utils.isObject(copy) || FW.utils.isArray(copy) ) ) {
            var clone = src && ( FW.utils.isObject(src) || FW.utils.isArray(src) ) ? src : FW.utils.isArray(copy) ? [] : {};
            target[ name ] = FW.extend( deep, clone, copy );
          } else if ( copy !== undefined ) {
            target[ name ] = copy;
          }
        }
      }
    }
    return target;
  };
  /*   
    Cloning of objects and arrays for duplication of data  
  */
  FW.clone = function(obj){
    if (null === obj || "object" !== typeof obj) {return obj;}
    var copy;
    if (FW.utils.isDate(obj)) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    if (FW.utils.isArray(obj)) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; ++i) {
            copy[i] = FW.clone(obj[i]);
        }
        return copy;
    }
    if (FW.utils.isObject(obj)) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {copy[attr] = FW.clone(obj[attr]);}
        }
        return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
  };

})();