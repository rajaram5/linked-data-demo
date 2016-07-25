app.service('FDP', function($http, HttpEndpoint, File, $q) {
  return {
    load: function(root) {
      
      var foo = function(url, nextQueryFile) {
        var deferred = $q.defer();
        
        HttpEndpoint.load(url).then(function() {
          File.read(nextQueryFile).then(function(response) {
            HttpEndpoint.query(response, {
              '#inputUrl#': url
            }).then(function(res) {
              // return map of id->url
              var values = {};
              res.data.results.bindings.forEach(function(binding) {
                values[binding.id.value] = binding.url.value;
              });
              // return to deferred
              deferred.resolve(values);
            }, function(res) {
              console.log('failed', res);
            })
          });
        });
        
        return deferred.promise;
      };
      
      foo(root, 'data/query/getCatalogs.sparql').then(function(catalogs) {
        Object.keys(catalogs).forEach(function(cid) {
          var catalog = catalogs[cid];
          foo(catalog, 'data/query/getDataset.sparql').then(function(datasets) {
            Object.keys(datasets).forEach(function(did) {
              var dataset = datasets[did];
              foo(dataset, 'data/query/getDistributions.sparql').then(function(distributions) {
                // done?
              });
            });
          });
        });
      });
      File.read('data/query/getTurtleDistributionFiles.sparql').then(function(query) {
        HttpEndpoint.query(query).then(function(response) {
          console.log('all ttl dist?');
          response.data.results.bindings.forEach(function(binding) {
            var url = binding.url.value;
            HttpEndpoint.load(url).then(function(response) {
              console.log('loaded', url, response);
            }, function(response) {
              console.log('failed to load', response);
            });
          });
        });
      });
    }
  };
});