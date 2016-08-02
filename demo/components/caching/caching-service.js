app.service('Caching', function() {
  
  var isCachingAvailable = false;
  
  return { 
    setCachingState: function(x) {isCachingAvailable = x},
    getCachingState: function(){return isCachingAvailable;}
    };
  
});