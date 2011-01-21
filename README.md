#FW
##A ripoff javascript framework.
FW is a object for storage 

##Extend
	FW.extend({ ajax: {} });
Adds or modifies FW.ajax
  FW.extend({}, {enable: true})
Extends first object, with the next, returns a merged object with the latest values for all keys

##Clone
	var AW = FW.clone(FW)
Returns AW a clone of FW, not linked to it.

##Utils
	FW.utils.isElement(obj) 
	FW.utils.isArguments(obj)
	FW.utils.isFunction(obj) 
	FW.utils.isString(obj) 
	FW.utils.isNumber(obj) 
	FW.utils.isNaN(obj) 
	FW.utils.isBoolean(obj)
	FW.utils.isArray(obj) 
	FW.utils.isDate(obj)
	FW.utils.isRegExp(obj)
	FW.utils.isNull(obj)
	FW.utils.isUndefined(obj)
	FW.utils.isEmpty(obj)
	FW.utils.isObject(obj)
	FW.utils.inArray(what, where)
 