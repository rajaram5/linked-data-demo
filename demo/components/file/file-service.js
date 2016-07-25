app.service('File', function($q, $http) {
  return { 
    read: function(fileName) {
      var deferred = $q.defer();
      $http.get(fileName).then(function(response) {
        var query = response.data;
//        console.log("Query :" + query);
        deferred.resolve(query);
      }, function(response) {          
        console.log('failed to get query', response);       
        deferred.reject(response.data);
      });
      return deferred.promise;
    }
  };
});