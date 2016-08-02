app.service('Log', function($filter) {
  
  var log = [];  
  return { 
    appendToLog: function(msg) {   
      console.log(msg);
      var date = $filter('date')(new Date(), 'dd/MM/yyyy');
      var time = $filter('date')(new Date(), 'HH:mm:ss');
      log.push({ 
        time:time, date:date, message:msg
      });     
    },
    get: function(){return log;},
    reset: function(){log = [];}
    };
  
});