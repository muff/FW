/* 
  What:     core.js
  Author:   Eivind Ingebrigtsen (t98) 
  Purpose:  Framework core functionality   
*/
var FW = (function (window, undefined) {
  "use strict";
  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var ArrayProto = Array.prototype,
    ObjProto = Object.prototype,
    FuncProto = Function.prototype,
    breaker = {},
    nativeForEach = ArrayProto.forEach,
    nativeMap = ArrayProto.map,
    nativeReduce = ArrayProto.reduce,
    nativeReduceRight = ArrayProto.reduceRight,
    nativeFilter = ArrayProto.filter,
    nativeEvery = ArrayProto.every,
    nativeSome = ArrayProto.some,
    nativeIndexOf = ArrayProto.indexOf,
    nativeLastIndexOf = ArrayProto.lastIndexOf,
    nativeIsArray = Array.isArray,
    nativeKeys = Object.keys,
    nativeBind = FuncProto.bind,
    slice = [].slice,
    push = [].push,
    idCounter = 0;
    
  var uniqueId = function (prefix) {
      var id = idCounter++;
      return prefix ? prefix + id : id;
    };
  var isNode = function () {
      return typeof require === 'function' && typeof module !== 'undefined';
    };
  var isWindow = function (obj) {
      return obj && typeof obj === "object" && "setInterval" in obj;
    };
  var isElement = function (obj) {
      return !!(obj && obj.nodeType == 1);
    };
  var isArguments = function (obj) {
      return !!(obj && hasOwnProperty.call(obj, 'callee'));
    };
  var isFunction = function (obj) {
      return !!(obj && obj.constructor && obj.call && obj.apply);
    };
  var isString = function (obj) {
      return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
    };
  var isNumber = function (obj) {
      return !!(obj === 0 || (obj && obj.toExponential && obj.toFixed));
    };
  var isNaN = function (obj) {
      return obj !== obj;
    };
  var isBoolean = function (obj) {
      return obj === true || obj === false;
    };
  var isArray = function (obj) {
      return typeof obj.push === 'function' || obj.length === 0 || obj.length > 0;
    };
  var isDate = function (obj) {
      return !!(obj && obj.getTimezoneOffset && obj.setUTCFullYear);
    };
  var isRegExp = function (obj) {
      return !!(obj && obj.test && obj.exec && (obj.ignoreCase || obj.ignoreCase === false));
    };
  var isNull = function (obj) {
      return obj === null;
    };
  var isUndefined = function (obj) {
      return obj === void 0;
    };
  var isEmpty = function (obj) {
      if (FW.is.array(obj) || FW.is.string(obj)) {
        return obj.length === 0;
      }
      for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          return false;
        }
      }
      return true;
    };
  var isObject = function (obj) {
      if (FW.is.array(obj)) {
        return false;
      }
      if (obj instanceof Object) {
        return true;
      }
      if (!obj || toString.call(obj) !== "[object Object]" || obj.nodeType || obj.setInterval) {
        return false;
      }
      if (obj.constructor && !hasOwnProperty.call(obj, "constructor") && !hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
        return false;
      }
      var key;
      for (key in obj) {}
      return key === undefined || hasOwnProperty.call(obj, key);
    };
  var inArray = function (elem, array) {
      if (!array) {
        return false;
      }
      if (array && array.indexOf) {
        return array.indexOf(elem);
      }
      for (var i = 0, length = array.length;
      i < length;
      i++) {
        if (array[i] === elem) {
          return i;
        }
      }
      return -1;
    };
  var extend = function () {
      var target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false,
        options, name, src, copy;
      if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        i = 2;
      }
      if (typeof target !== "object" && typeof target !== 'function') {
        target = {};
      }
      if (length === i) {
        target = this;
        --i;
      }
      for (; i < length; i++) {
        if ((options = arguments[i]) !== null) {
          for (name in options) {
            src = target[name];
            copy = options[name];
            if (target === copy) {
              continue;
            }
            if (deep && copy && (FW.is.object(copy) || FW.is.array(copy))) {
              var clone = src && (FW.is.object(src) || FW.is.array(src)) ? src : FW.is.array(copy) ? [] : {};
              target[name] = FW.extend(deep, clone, copy);
            } else if (copy !== undefined) {
              target[name] = copy;
            }
          }
        }
      }
      return target;
    };
  var clone = function (obj) {
      // Handle the 3 simple types, and null or undefined
      if (null === obj || "object" !== typeof obj) {
        return obj;
      }
      var copy;
      // Handle Date
      if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
      }
      // Handle Array
      if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; ++i) {
          copy[i] = FW.clone(obj[i]);
        }
        return copy;
      }
      // Handle Object
      if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
          if (obj.hasOwnProperty(attr)) {
            copy[attr] = FW.clone(obj[attr]);
          }
        }
        return copy;
      }
      throw new Error("Unable to copy obj! Its type isn't supported.");
    };
  var each = function (obj, iterator, context) {
      if (obj == null) return;
      if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
      } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
          if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
        }
      } else {
        for (var key in obj) {
          if (hasOwnProperty.call(obj, key)) {
            if (iterator.call(context, obj[key], key, obj) === breaker) return;
          }
        }
      }
    };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  var map = function (obj, iterator, context) {
      var results = [];
      if (obj == null) return results;
      if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
      each(obj, function (value, index, list) {
        results[results.length] = iterator.call(context, value, index, list);
      });
      return results;
    };

  // Convenience version of a common use case of `map`: fetching a property.
  var pluck = function (obj, key) {
      return FW.map(obj, function (value) {
        return value[key];
      });
    };

  // Return the maximum element or (element-based computation).
  var max = function (obj, iterator, context) {
      if (!iterator && FW.is.array(obj)) return Math.max.apply(Math, obj);
      if (!iterator && FW.is.empty(obj)) return -Infinity;
      var result = {
        computed: -Infinity
      };
      each(obj, function (value, index, list) {
        var computed = iterator ? iterator.call(context, value, index, list) : value;
        computed >= result.computed && (result = {
          value: value,
          computed: computed
        });
      });
      return result.value;
    };
  // Return the minimum element (or element-based computation).
  var min = function (obj, iterator, context) {
      if (!iterator && FW.is.array(obj)) return Math.min.apply(Math, obj);
      if (!iterator && FW.is.empty(obj)) return Infinity;
      var result = {
        computed: Infinity
      };
      each(obj, function (value, index, list) {
        var computed = iterator ? iterator.call(context, value, index, list) : value;
        computed < result.computed && (result = {
          value: value,
          computed: computed
        });
      });
      return result.value;
    };

  var memoize = function (func, hasher) {
      var memo = {};
      hasher || (hasher = function (value) {
        return value;
      });
      return function () {
        var key = hasher.apply(this, arguments);
        return hasOwnProperty.call(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
      };
    };

  var delay = function (func, wait) {
      var args = slice.call(arguments, 2);
      return setTimeout(function () {
        return func.apply(func, args);
      }, wait);
    };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  var filter = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };


// **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  var reduce = function(obj, iterator, memo, context) {
    var initial = memo !== void 0;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError("Reduce of empty array with no initial value");
    return memo;
  };


  var flatten = function(array) {
    return reduce(array, function(memo, value) {
      if (isArray(value)) return memo.concat(flatten(value));
      memo[memo.length] = value;
      return memo;
    }, []);
  };


// Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  var range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  return {
    "clone"     : clone,
    "delay"     : delay,
    "each"      : each,
    "extend"    : extend,
    "flatten"   : flatten,
    "filter"    : filter,
    "inArray"   : inArray,
    "uniqueId"  : uniqueId,
    "range"     : range,
    "map"       : map,
    "pluck"     : pluck,
    "memoize"   : memoize,
    "is"        : {
      "node": isNode,
      "window": isWindow,
      "array": isArray,
      "object": isObject,
      "string": isString,
      "empty": isEmpty,
      "undefined": isUndefined,
      "null": isNull,
      "regExp": isRegExp,
      "date": isDate,
      "naN": isNaN,
      "boolean": isBoolean,
      "number": isNumber,
      "arguments": isArguments,
      "element": isElement,
      "function": isFunction
    }
  };
})();

if (FW.is.node()) {
  module.exports = FW;
}