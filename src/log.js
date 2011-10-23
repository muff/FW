(function(FW){
  if (!window.console) {
    (function() {
      var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
      "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];
      window.console = {};
      for (var i = 0; i < names.length; ++i) {
        window.console[names[i]] = function() {};
      }
    }());
  }  
  var timers = [];
  var groups = [];
  FW.extend({
    testMode: true,
    log: {
    /*   
      Wrapper function for console.log
        is toggled by $B.testMode  
      */
    print: function() {
      if (arguments.length && FW.testMode) {
        try {
          console.log(arguments, {
            from: arguments.callee.caller,
            fn: arguments.callee.caller.toString()
          });
        } catch(e) {}
      }
    },
    /*   
      Wrapper function for console.group
        is toggled by FW.testMode
    */
    group: function(group) {
      if (!FW.testMode) {
        return;
      }
      if ("console" in window) {
        if ("group" in console) {
          var check = FW.inArray(group, groups);
          if (check === -1) {
            groups.push(group);
            console.group(group);
            console.time(group);
          } else {
            groups.splice(check, 1);
            console.timeEnd(group);
            console.groupEnd(group);
          }
        }
      }
    }
  }
  });  
  
})(FW);



