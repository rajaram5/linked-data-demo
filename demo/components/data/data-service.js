app.service('Data', function($http, $q, File, HttpEndpoint) {
  
  return {    
    variables: function(file) {      
      var deferred = $q.defer();
      File.read(file).then(function(query) {
        HttpEndpoint.query(query).then(function(response) {            
          var variables = [];            
          response.data.results.bindings.forEach(function(binding) {            	
            var url;            	
            var label;
            if ('url' in binding && 'value' in binding) {            		
              url = binding.url.value;
              label= binding.value.value;            	
            } else if ('url' in binding){            		
              url = binding.url.value;            		
              label= binding.url.value;            	
            } else if ('value' in binding) {            	
              url = binding.value.value;
        		  label= binding.value.value;             	
            }            	
            variables.push({uri: url, label: label});            
          });            
          deferred.resolve(variables);          
        }, function(response) {            
          deferred.reject(response);          
      }); 
    }), function(response) {
        console.log("File to read query file ", response);
      };
      return deferred.promise;
    }
  };
});