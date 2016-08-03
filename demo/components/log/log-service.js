app.service('Log', function($filter, $timeout) {
  var log = [];
  var logElementId = undefined;
  
  return {
    setLogElementId: function(id) {
      logElementId = id;
    },
    appendToLog: function(msg) {   
      console.log(msg);
      var date = $filter('date')(new Date(), 'dd/MM/yyyy');
      var time = $filter('date')(new Date(), 'HH:mm:ss');
      log.push({ 
        time:time, date:date, message:msg
      });
      
      if (logElementId) {
        var elem = document.getElementById(logElementId);
        if (elem) {
          elem.scrollTop = elem.scrollHeight;
        }
      }
    },
    get: function() {return log;},
    reset: function() {log = [];}
    };
  
});