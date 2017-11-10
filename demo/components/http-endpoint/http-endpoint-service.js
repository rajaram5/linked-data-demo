app.service('HttpEndpoint', function($q, $http, $timeout, GENERAL_CONFIG) {
  var endpointBaseUrl = GENERAL_CONFIG.END_POINT_BASE_URL;
  var endpoint = endpointBaseUrl + 'namespace/kb/sparql';
  
  return {            
    /**
     * params is expected in the following format: { 'param_name':'uri'}
     */
    
    query : function(q, params) {              
      if (params) {                
        Object.keys(params).forEach(function(key) {                  
          q = q.replace(key, params[key]);                
        });              
      }      
      return $http.get(endpoint, {
        params : {                  
          query : q,                  
          format : 'json',                  
          callback : 'JSON_CALLBACK'                
        }              
      });
            
    },
            
    load : function(resource, graphUri) {
      var deferred = $q.defer();              
      var cacheLocation = endpoint;              
      var contextUri = resource; 
      
      if (graphUri) {                
        contextUri = graphUri;              
      }             
      // setting headers              
      var config = {headers :{'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8;'}};
      
      // setting urlenconded form to post              
      var data = $.param({'uri' : resource, 'context-uri' : contextUri});
      
      $http.post(cacheLocation, data, config).then(function(res) {                        
        deferred.resolve(res);                        
        console.log('Caching : url ==>  ' + cacheLocation);                      
      },                      
      function(res) {                        
        data = $.param({'uri' : (resource + ".ttl"), 'context-uri' : contextUri});                        
        $http.post(cacheLocation, data, config).then(function(res) {                                  
          console.log('First attempt to load data failed. Trying differently:');                                  
          console.log('Caching now from : ' + resource + ".ttl");                                  
          deferred.resolve(res);                                
        },                                
        function(res) {                                  
          console.log('failed to PUT file in endpoint');                                  
          deferred.reject(res);                                
        });                      
      });              
      return deferred.promise;            
    }          
  };        
});
