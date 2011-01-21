FW.extend({
	testMode: true,
	    /*   
    Wrapper function for console.log
      is toggled by FW.testMode  
    */
    log: function(){
      if(arguments.length && FW.testMode){
      try {
          console.log(arguments);
        } catch(e) {}
      }
   },

  /*   
    Wrapper function for console.time
      is toggled by FW.testMode
  */
   time: function(timer){
    if(!FW.testMode){
      return;
    }
		try{
      if(!FW.timers){ FW.timers = []; }
      var check = FW.utils.inArray(timer, FW.timers);
      if(check === -1){
        FW.timers.push(timer);
        console.time(timer);
      }else{
        FW.timers.splice(check, 1);
        console.timeEnd(timer);
      }    
    } catch(e){}
   }
});
