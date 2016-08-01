app.service('HttpEndpoint', function($q, $http, $timeout) {
  //var endpointBaseUrl = 'http://192.168.99.100:8890//';
  var endpointBaseUrl = 'http://localhost:8891/';
  var endpoint = endpointBaseUrl + 'sparql';
  var fooEndpoint = endpointBaseUrl + 'DAV/home/demo/';
  var username = 'dba';
  var password = 'dba';
  var getResourceName = function(url) {
    var urlParser = document.createElement('a');
    urlParser.href = url;
    var urlLocalName = url.substring(url.lastIndexOf('/') + 1);
    var name = urlParser.hostname + urlParser.port + urlLocalName;
    name = name.replace(/\./g, "_");
    console.log("resourceNamet == ", name);
    return name;
    
  }
  
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
      var name = getResourceName(resource);     
      //var name = resource.substring(resource.lastIndexOf('/') + 1);
      var cacheLocation = fooEndpoint + name;      
      $http.head(cacheLocation, {
        headers: {
          Accept: accept || 'text/turtle',
          Authorization: 'Basic ZGJhOmRiYQ=='
        }
      }).then(function success(response) {
        // stop loading the file
        deferred.resolve();
      }, function error(response) {
        if (response.status === 404) {
          $http.get(resource, {
            headers: {
              Accept: accept || 'text/turtle'
            }
          }).then(function(response) {
            var contentType = response.headers('content-type');
            $http.put(cacheLocation, response.data, {
              headers: {
                'Content-Type': contentType,
                Authorization: 'Basic ZGJhOmRiYQ=='
              }
            }).then(function(res) {
              deferred.resolve(res);
            }, function(res) {
              console.log('failed to PUT file in endpoint');
              deferred.reject(res);
            });
          }, function(response) {
            console.log('failed to retrieve', resource);
            deferred.reject(response);
          });
        } else {
          // log error
        }
      });
      
      return deferred.promise;
    }
  };
});