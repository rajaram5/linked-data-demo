app.service('Log', function($filter) {
  
  var log = "";  
  return { 
    appendToLog: function(x) {   
      console.log(x);
      var date = $filter('date')(new Date(), 'dd/MM/yyyy');
      var time = $filter('date')(new Date(), 'HH:mm:ss');
      log =  log + "[" + date + "  " + time +"]\t" + x + "\n";        
    },
    get: function(){return log;},
    reset: function(){log = "";}
    };
  
});