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
  
  $scope.varoptions = [
    {value: 1, name: 'First option'},
    {value: 2, name: 'Second option'},
    {value: 3, name: 'Option #3'},
    {value: 4, name: 'Number four option'}
  ];
  
  $scope.process = function() {
    console.log('process', 'sparql query here');
    $scope.results = [];
  };
});