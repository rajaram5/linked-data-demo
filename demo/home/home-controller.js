app.controller('HomeCtrl', function($scope) {
  $scope.selectedQuestion = null;
  $scope.questions = [
    {value: 1, name: 'The first question'},
    {value: 2, name: 'Question #2'}
  ];
  
  $scope.questionChanged = function() {
    console.log('selected question', $scope.selectedQuestion);
  };
  
  $scope.process = function() {
    console.log('processing query');
    $scope.results = [];
  };
});