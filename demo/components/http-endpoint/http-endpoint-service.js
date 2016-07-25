app.service('HttpEndpoint', function($q, $http, $timeout) {
  var endpointBaseUrl = 'http://localhost:8891/';
  var endpoint = endpointBaseUrl + 'sparql';
  var fooEndpoint = endpointBaseUrl + 'DAV/home/demo/';
  var username = 'dba';
  var password = 'dba';
  
  return {
    /**
     * params is expected in the following format:
     *  { 'param_name': 'uri'}
     */
    query: function(q, params) {
      if (params) {
        Object.keys(params).forEach(function(key) {
          q = q.replace(key, params[key]);
        });
      }
      
      return $http.jsonp(endpoint, {
        params: {
          query: q,
          format: 'json',
          callback: 'JSON_CALLBACK'
        }
      });
    },
    load: function(resource, accept) {
      var deferred = $q.defer();
      
      $http.get(resource, {
        headers: {
          Accept: accept || 'text/turtle'
        }
      }).then(function(response) {
        var name = resource.substring(resource.lastIndexOf('/') + 1);
        var contentType = response.headers('content-type');
        
//        console.log('caching file with name and content type of', name, contentType);
        $timeout(function(){
          $http.put(fooEndpoint + name, response.data, {
            headers: {
              'Content-Type': contentType,
              //'Authorization': 'Basic '+ base64.encode(username + ':' + password)
              Authorization: 'Basic ZGJhOmRiYQ=='
            }
          }).then(function(res) {
  //          console.log('successfully PUT file in endpoint');
            deferred.resolve(res);
          }, function(res) {
            console.log('failed to PUT file in endpoint');
            deferred.reject(res);
          });
        }, 1000/*ms*/);
      }, function(response) {
        console.log('failed to retrieve', resource);
        deferred.reject(response);
      });
      
      return deferred.promise;
    }
  };
});