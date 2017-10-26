app.controller('CacheCtrl', function($scope, $rootScope, $http, FDP, Caching, Log, HttpEndpoint, File) {    
  $scope.isCachingStarted = false;
  $scope.fairDataPoints = [];
  $scope.searchEngineUrl=null;
  
  // populate the list with data from the db
  var populateCacheList = function() {
    File.read('data/query/listCachedFdps.sparql').then(function(query) {
      HttpEndpoint.query(query).then(function(response) {
        response.data.results.bindings.forEach(function(binding) {
          $scope.fairDataPoints.push({
            url: binding.fdp.value,
            name: binding.name.value
          });
        });
        return $scope.fairDataPoints;
      }).then(function(fdps) {
        // if no data was cached, add a default FDP
        if (fdps.length == 0) {
          $scope.fairDataPoints = [{
            name: "RD connect FDP",
            url:"http://localhost:8084/fairdatapoint/fdp"
          }];
        }
      });
    });
  };

  console.log('calling init function');
  populateCacheList();
  console.log('init function finished');

  $scope.addFdp = function () {
    $scope.fairDataPoints.push({ 
      url: "", name:""
    });
  };
  
  $scope.removeFdp = function(fdp) { 
    var index = $scope.fairDataPoints.indexOf(fdp);
    $scope.fairDataPoints.splice(index, 1);     
  };
  
  $scope.cache = function() {
    Log.reset();
    Log.setLogElementId('log-panel');
    $scope.isCachingStarted = true;
    Log.appendToLog("Caching started");
    $scope.log = Log.get();
    FDP.load($scope.fairDataPoints); 
    $rootScope.$on('fdp-data-loaded', function() {            
      $scope.loadingData = false;
      Caching.setCachingState(true);
      Log.appendToLog("Caching is done");
    });
  };
  
  $scope.cacheSearch = function(url) {
    Log.reset();
    Log.setLogElementId('log-panel');
    $scope.isCachingStarted = true;
    Log.appendToLog("Caching started");
    $scope.log = Log.get();
    $http.get(url)
    .then(function(response) {
        var fdps = response.data;
        console.log(fdps);
        FDP.load(fdps);
    });
    $rootScope.$on('fdp-data-loaded', function() {            
      $scope.loadingData = false;
      Caching.setCachingState(true);
      Log.appendToLog("Caching is done");
    });
  };
  
});