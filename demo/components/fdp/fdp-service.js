app.service('FDP', function($http, HttpEndpoint, File, $q, $rootScope) {
  var cacheAndQuery = function(url, nextQueryFile) {
    return HttpEndpoint.load(url).then(function() {
      return File.read(nextQueryFile).then(function(query) {
        return HttpEndpoint.query(query, {
          '#inputUrl#': url
        }).then(function(response) {
          // return map of id->url
          var values = {};
          response.data.results.bindings.forEach(function(binding) {
            values[binding.id.value] = binding.url.value;
          });
          return values;
        }, function(response) {
          console.log('failed', response);
        });
      });
    });
  };
  
  return {
    load: function(root) {
      
      // load the FDP root and query for all catalogs
      var uberpromise = cacheAndQuery(root, 'data/query/getCatalogs.sparql').then(function(catalogs) {
        console.log(catalogs);
        
        var p = [];
        
        Object.keys(catalogs).forEach(function(cid) {
          var catalog = catalogs[cid];
          // load the catalog and query for all datasets
          p.push(cacheAndQuery(catalog, 'data/query/getDataset.sparql').then(function(datasets) {
            var p2 = [];
            
            Object.keys(datasets).forEach(function(did) {
              var dataset = datasets[did];
              // load the dataset and query for all distributions
              p2.push(cacheAndQuery(dataset, 'data/query/getDistributions.sparql').then(function(distributions) {
                var p3 = [];
                
                Object.keys(distributions).forEach(function(distId) {
                  var dist = distributions[distId];
                  p3.push(HttpEndpoint.load(dist));
                });
                
                return $q.all(p3);
              }, angular.noop));
            });
            
            return $q.all(p2);
          }, angular.noop));
        });
        return $q.all(p);
      }, angular.noop);
      
      uberpromise.then(function() {
        console.log('now done with our uberloop');
        File.read('data/query/getTurtleDistributionFiles.sparql').then(function(query) {
          HttpEndpoint.query(query).then(function(response) {
            var promises = [];
            
            // result is expected to be id,url mappings where url is the download location
            response.data.results.bindings.forEach(function(binding) {
              var url = binding.url.value;
              
              // load each file
              var promise = HttpEndpoint.load(url).then(function(response) {
                console.log('loaded', url, response);
              }, function(response) {
                console.log('failed to load', response);
              });
              
              promises.push(promise);
            });
            
            // broadcast event when all files are loaded
            $q.all(promises).then(function() {
              console.log('broadcasting fdp-data-loaded');
              $rootScope.$broadcast('fdp-data-loaded');
            });
          });
        });
      }, function() {
        console.log('failed uberloop');
      });
    }
  };
});