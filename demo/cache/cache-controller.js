app.controller('CacheCtrl', function($scope, $rootScope, FDP, Caching, Log) {    
  $scope.isCachingStarted = false;
  $scope.log = null;
  $scope.fairDataPoints=[{name: "RD connect FDP", url:"http://semlab1.liacs.nl:8080/fdp"}];
  
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
    $scope.isCachingStarted = true;
    var logMsg = "Caching started";    
    Log.appendToLog(logMsg);
    $scope.log = Log.get();
    FDP.load($scope.fairDataPoints); 
    $rootScope.$on('fdp-data-loaded', function() {            
      $scope.loadingData = false;
      Caching.setCachingState(true);
      logMsg = "Caching is done"; 
      Log.appendToLog(logMsg);
      $scope.log = Log.get();
    });
  };
  
});