app.service('FDP', function($http, HttpEndpoint, File, Statistics, Log, $q, $rootScope) {   
  /**
   * Caches the content of the url using {@link HttpEndpoint#load}, reads the query
   * file using {@link File}, and executes the query using {@link HttpEndpoint#query}.
   * @param {string} url - to cache and query
   * @param {string} queryFile - sparql query file location
   * @return {promise} Result of the sparql query
   */
  var cacheAndQuery = function(url, urlExt, graphUri, queryFile) {
    return HttpEndpoint.load((url + urlExt), graphUri).then(function() {
      Log.appendToLog("Loading content of <" + url + ">");
      return File.read(queryFile).then(function(query) {
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
    /**
     * Loads all levels of metadata for the given FAIR Data Point. When all loading
     * is finished, an event named 'fdp-data-loaded' is fired.
     * @param {string} root - the root of a FAIR Data Point
     */

    load: function(fairDataPoints) {
      Statistics.setFairDataPointsCount(Object.keys(fairDataPoints).length);
      var catalogsCount = 0;
      var datasetsCount = 0;
      var distributionsCount = 0;
      angular.forEach(fairDataPoints,function(fdp, index){
        var logMsg = "Loading data from '" + fdp.name + "'";
        Log.appendToLog(logMsg);
      // load the FDP root and query for all catalogs
      var uberpromise = cacheAndQuery(fdp.url, ".ttl", fdp.url, 'data/query/getCatalogs.sparql').then(function(catalogs) {
        console.log("catalogs for ",fdp.name, " FDP ",catalogs);
        catalogsCount = catalogsCount + Object.keys(catalogs).length;
        Statistics.setCatalogsCount(catalogsCount);
        var p = [];
        Object.keys(catalogs).forEach(function(cid) {
          var catalog = catalogs[cid];
          // load the catalog and query for all datasets
          p.push(cacheAndQuery(catalog, ".ttl", fdp.url,  'data/query/getDataset.sparql').then(function(datasets) {
            var p2 = [];            
            Object.keys(datasets).forEach(function(did) {
              var dataset = datasets[did];
              datasetsCount = datasetsCount + 1;
              Statistics.setDataSetsCount(datasetsCount);
              // load the dataset and query for all distributions
              p2.push(cacheAndQuery(dataset, ".ttl", fdp.url, 'data/query/getDistributions.sparql').then(function(distributions) {
                var p3 = [];
                Object.keys(distributions).forEach(function(distId) {
                  var dist = distributions[distId];
                  distributionsCount = distributionsCount + 1;
                  Statistics.setDistributionsCount(distributionsCount);
                  Log.appendToLog("Loading content of <" + dist + ">");
                  p3.push(HttpEndpoint.load(dist + ".ttl"), fdp.url);
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
            var turtleFilesCount = 0;
            // result is expected to be id,url mappings where url is the download location            
            response.data.results.bindings.forEach(function(binding) {
              var url = binding.url.value;
              var distributionUri = binding.distributionUri.value;
              turtleFilesCount = turtleFilesCount + 1;
              Statistics.setTurtleFilesCount(turtleFilesCount);
              // load each file. Note: Due to implicitome server failure we skip the data hosted in implicitome server.
              if(url != 'http://implicitome.cloud.tilaa.nl/goNlSvR5/rdf.ttl') {
                Log.appendToLog("Loading content of <" + url + ">");
                var promise = HttpEndpoint.load(url, distributionUri).then(function(response) {
                  console.log('loaded', url, response);
                }, function(response) {
                  console.log('failed to load', response);
                });                
                promises.push(promise);                
              }              
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
    })
  }
  };
});