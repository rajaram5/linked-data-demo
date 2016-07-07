app.controller('HomeCtrl', function($scope) {
  $scope.questionChanged = function(id) {
    console.log('selected question', id);
    $scope.selectedQuestion = id;
  };
  
  $scope.process = function() {
    console.log('processing query');
    $scope.results = [];
  };
});