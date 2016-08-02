app.controller('CacheCtrl', function($scope, $rootScope, FDP, Caching) {    
  $scope.loadingData = false;
  
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
    $scope.loadingData = true;
    FDP.load($scope.fairDataPoints); 
    $rootScope.$on('fdp-data-loaded', function() {
      console.log('Caching is done');
      $scope.loadingData = false;
      Caching.setCachingState(true);
    });
  }  
  
});