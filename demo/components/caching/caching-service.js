app.service('Caching', function($cookies) {
  
  var isCachingAvailable = false;
  
  return { 
    setCachingState: function(x) {
      $cookies.put('cachestate', true);
    },
    getCachingState: function() {
      return $cookies.get('cachestate') || false;
    }
  };
});