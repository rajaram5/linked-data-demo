app.controller('StatsCtrl', function($scope, Statistics) {    
  $scope.stats = Statistics.get();
});