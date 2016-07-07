app.controller('HomeCtrl', function($scope) {
  $scope.selectedQuestion = null;
  $scope.questions = {
    1: {name: 'The first question', variables: ['phenotype']},
    2: {name: 'Question #2', variables: ['phenotype', 'disease']}
  };
  
  $scope.questionChanged = function() {
    console.log('selected question', $scope.selectedQuestion);
  };
  
  $scope.variables = [];
  
  $scope.process = function() {
    console.log('process', $scope.variables);
    $scope.results = [];
  };
});