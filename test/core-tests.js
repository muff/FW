if (typeof require === 'function' && typeof module !== 'undefined') {
    buster = require('buster');
    FW = require('../src/core.js');
}

(function (F) {
    "use strict";
    var assert = buster.assert;

    buster.testCase("Framework tests", {
        "Framework should be an object": function () {
            assert.isObject(F);
    }});
   
    buster.testCase("Each", {
        "should iterate over an object": function () {
          var n = 0,
              o = {a:0,b:0,c:0},
              e = {a:0,b:1,c:2},
              l = 3;
          FW.each(o, function(value,iterator,obj){
            o[iterator] = n;
            n++;
          });
          assert.equals(n,l);
          assert.equals(o,e);
    }});
    
    buster.testCase("Map", {
      "should map an object":function(){
        var a = {a: 1, b: 2, c: 3};
        a = FW.map(a, function(num){ return num * 3; });
        assert.equals(a, [3,6,9]);
        
      },
      "should be able to pluck values from an object": function(){
        var a = [{a:1}, {a:2}, {a:3}];
        var b = FW.pluck(a, 'a');
        assert.equals(b, [1,2,3]);        
      }
    });
    
    buster.testCase("Memoize", {
    "Should be able to cache results of computations": function(){
      var fib = function(n) {
        return n < 2 ? n : fib(n - 1) + fib(n - 2);
      };
      var fastfib = FW.memoize(fib);
      var timein = new Date().getTime();
      fastfib(22);
      var timer1out = new Date().getTime();
      fastfib(22);
      var timer2out = new Date().getTime();
      assert( (timer1out-timein) > (timer2out-timer1out) );
    }
    });
    
    buster.testCase("Delay", {
      "should be able to delay execution of a function": function(){
        var store = {called: false};
        var fn = function(){
          store.called = true;
        };
        FW.delay(fn, 0);
        assert.isFalse(store.called);
        setTimeout(function(){
          assert(store.called);          
        },0)
      }
      
    });
    
    buster.testCase('UniqueID', {
      "should give a uniqueId when called": function(){
        var a = FW.uniqueId('a');
        var b = FW.uniqueId('a');
        assert( a !== b );
      }
    });
    
    buster.testCase("Range", {
      "should provide a range": function(){
        var a  = FW.range(2);
        assert.equals(a, [0,1]);
      },
      "should provide a range between two numbers": function(){
        var a  = FW.range(1,5);
        assert.equals(a, [1,2,3,4]);
      },
      "should provide a range with steps": function(){
        var a  = FW.range(0,101,10);
        assert.equals(a, [0,10,20,30,40,50,60,70,80,90,100]);
      }
    });
    
    buster.testCase("Flatten", {
      "should flatten arrays into single array": function(){
        var arr = [[0,1,2,3],[[[[4,5,6],[[[[7,8,9]]]]]]]];
        arr = FW.flatten(arr);
        assert.equals(arr, [0,1,2,3,4,5,6,7,8,9]);
      }
    });
    buster.testCase("Filter", {
      "should filter away items from objects": function(){
        var sums = [0,100,200,300,400,500];
        var res  = FW.filter(sums, function(num){ return num > 200; });
        assert.equals(res, [300,400,500]);
        
      }
    })
   
    buster.testCase("Extend", {
        "Framework should be able to extend itself": function () {
            assert.isFunction(F.extend);
            F.extend({
                newFunctionality: true
            });
            assert.isTrue(F.newFunctionality);
        },
        "should be able to extend other objects": function () {
            var a = {
                a: 1
            },
                b = {
                    b: 2
                },
                c = {
                    c: 3
                },
                extected = {
                    a: 1,
                    b: 2,
                    c: 3
                };
            a = F.extend(a, b, c);
            assert.equals(a, extected);
        }
    });
    
    buster.testCase("Clone", {
      "should be able to clone an object": function(){
        var a = {a: 1, b:2 };
        var b = FW.clone(a);
        assert.equals(a, b);
        a.a = 2;
        assert.isFalse(buster.assertions.deepEqual(a, b));        
      }
    });

    buster.testCase("inArray", {
        "inArray finds items in array": function () {
            var arr = [0, 1, 2, 3],
                index = F.inArray(0, arr);
            assert.isNumber(index);
            assert.equals(index, 0);
        },
        "report with -1 that an item doesn't exist": function () {
            var arr = [0, 1, 2, 3],
                index = F.inArray(4, arr);
            assert.isNumber(index);
            assert.equals(index, -1);

        }
    });


    buster.testCase("Type Checkers", {
        "isWindow": function () {
            if (F.is.node) {
                assert.isTrue(true);
            } else {
                assert.isTrue(F.is.window(window));
                assert.isFalse(F.is.window({}));
            }
        },
        "isArray": function () {
            assert.isTrue(F.is.array([0, 1, 2, 3]));
            assert.isFalse(F.is.array({}));
        },
        "isString": function () {
            assert.isTrue(F.is.string(""));
            assert.isFalse(F.is.string(1));
        },
        "isEmpty": function () {
            assert.isTrue(F.is.empty({}));
            assert.isFalse(F.is.empty(F));
        },
        "isUndefined": function () {
            assert.isTrue(F.is.undefined(F.hahahahaha));
        },
        "isNull": function () {
            assert.isFalse(F.is.null(0));
            assert.isFalse(F.is.null(undefined));
            assert.isFalse(F.is.null(false));
            assert.isTrue(F.is.null(null));
        },
        "isRegExp": function () {
            assert.isTrue(F.is.regExp(/^(.*?)$/gi));
            assert.isFalse(F.is.regExp("/^(.*?)$/gi"));
        },
        "isDate": function () {
            assert.isFalse(F.is.date("01-04-2010"));
            assert.isTrue(F.is.date(new Date()));
        },
        "isNan": function () {
            assert.isTrue(F.is.naN(NaN));
        },
        "isBoolean": function () {
            assert.isTrue(F.is.boolean(true));
            assert.isTrue(F.is.boolean(false));
            assert.isFalse(F.is.boolean(0));
        },
        "isNumber": function () {
            assert.isTrue(F.is.number(12));
            assert.isFalse(F.is.number(NaN));
            assert.isFalse(F.is.number("12"));
        },
        "isArguments": function () {
            (function (arg) {
                assert.isTrue(F.is.arguments(arguments));
            })("string");
        },
        "isElement": function () {
            if (F.is.node) {
                assert.isTrue(true);
            } else {
                assert.isTrue(F.is.element(document.body));
                assert.isFalse(F.is.element(document));
            }
        },
        "isFunction": function () {
            var a = {},
                b = function () {};
            assert.isTrue(F.is.
            function (b));
            assert.isFalse(F.is.
            function (a));
        }
    });

})(FW);