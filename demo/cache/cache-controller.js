app.controller('CacheCtrl', function($scope, $rootScope, $http, FDP, Caching, Log) {    
  $scope.isCachingStarted = false;
  $scope.fairDataPoints=[{name: "RD connect FDP", url:"http://localhost:8084/fairdatapoint/fdp"}];

  $scope.searchEngineUrl = null;
  $scope.oneAtATime = true;
  
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