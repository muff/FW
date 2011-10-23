if (typeof require === 'function' && typeof module !== 'undefined') {
    buster = require('buster');
    FW = require('../src/core.js');
}
(function (F) {
    "use strict";
    var assert = buster.assert;
    
    buster.testCase("Cookie", {
      "should be able to set and read cookies": function(){
        if(!FW.is.node()){
          FW.cookie('hello', 'world');
          assert.equals(FW.cookie('hello'), 'world');
        }else{
          assert(true);
        }
      },
      "should be able to remove cookies": function(){
        if(!FW.is.node()){
          FW.cookie('hello', null);
          assert.isFalse(FW.cookie('hello'));
        }else{
          assert(true);
        }
        
      }
    });
})(FW);