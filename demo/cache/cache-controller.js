app.controller('CacheCtrl', function($scope, $rootScope, FDP, Caching) {    
  $scope.loadingData = false;
  
  var fairDataPoints=[
                         {name:"rdconnect", url:"http://semlab1.liacs.nl:8080/fdp"},
                         {name:"dtl", url:"http://145.100.59.120:8082/fdp"}
                         ];
  
  
  $scope.cache = function() {
    $scope.loadingData = true;
    FDP.load(fairDataPoints); 
    $rootScope.$on('fdp-data-loaded', function() {
      console.log('Caching is done');
      $scope.loadingData = false;
      Caching.setCachingState(true);
    });
  }  
  
});