app.service('Data', function($http, $q, Cache) {
  // hardcoded for now
  var endpoint = 'http://dev-vm.fair-dtls.vm.surfsara.nl:8891/sparql';
  
  return {
    variables: function(variable) {
      var deferred = $q.defer();
      
      $http.get('data/questions.json').then(function(response) {
        var file = response.data.variables[variable].queryFileName;
//        console.log('resolved '+file+' for '+variable);
        $http.get('data/query/' + file).then(function(response) {
          $http.jsonp(endpoint, {
            params: {
              query: response.data,
              format: 'json',
              callback: 'JSON_CALLBACK'
            }
          }).then(function(response) {
            var variables = [];
            response.data.results.bindings.forEach(function(binding) {
              variables.push({
                uri: binding.url.value,
                label: binding.value.value
              });
            });
            deferred.resolve(variables);
          }, function(response) {
            deferred.reject(response);
          });
        }, function(response) {
          console.log('failed to get query', response);
          deferred.reject(response.data);
        });
      }, function(response) {
        console.log('failed to gather variables data', response);
        deferred.reject(response.data);
      });
      
      return deferred.promise;
    }
  };
});