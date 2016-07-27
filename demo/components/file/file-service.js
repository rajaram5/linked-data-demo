app.service('File', function($q, $http) {
  var cache = {};
  
  return { 
    read: function(fileName) {
      var deferred = $q.defer();
      
      if (cache[fileName]) {
        deferred.resolve(cache[fileName]);
      } else {
        $http.get(fileName).then(function(response) {
          var query = response.data;
          deferred.resolve(query);
          cache[fileName] = query;
        }, function(response) {          
          console.log('failed to get query', response);       
          deferred.reject(response.data);
        });
      }
      
      return deferred.promise;
    }
  };
});