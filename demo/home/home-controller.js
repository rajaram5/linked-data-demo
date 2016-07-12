app.controller('HomeCtrl', function($scope, Data) {
  $scope.selectedQuestion = null;
  $scope.questions = {
    1: {name: 'The first question', variables: ['phenotype']},
    2: {name: 'Question #2', variables: ['phenotype', 'disease']}
  };
  
  // preload the autocomplete values
  $scope.vars = {};
  angular.forEach($scope.questions, function(question, key) {
    angular.forEach(question.variables, function(variable) {
      if ($scope.vars[variable]) {
        return;
      }
      
      Data.variables(variable).then(function(vars) {
        $scope.vars[variable] = vars;
      });
    });
  });
  
  $scope.questionChanged = function() {
    console.log('selected question', $scope.selectedQuestion);
    console.log('preloaded variables:', $scope.vars);
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
    
    Data.query($scope.selectedQuestion, $scope.variables).then(function(results) {
      console.log('got results', results);
      $scope.results = results;
      $scope.rows = $scope.getValues(results.results.bindings, results.head.vars);
    }, function(response) {
      console.log('could not answer question due to an error', response);
    });
  };
  
  $scope.getHeaders = function(vars) {
    var headers = [];
    vars.forEach(function(v) {
      if (v.indexOf('URI') === -1) {
        headers.push(v);
      }
    });
    return headers;
  };
  
  $scope.getValues = function(results, vars) {
    var rows = [];
    results.forEach(function(result){
      var values = [];
      vars.forEach(function(v) {
        if (v.indexOf('URI') === -1 && result[v] !== undefined) {
          var resource = result[v + 'URI'];
          var displayName = result[v].value;
          
          if (resource !== undefined) {
            values.push({
              uri: resource.value,
              label: displayName
            });
          } else {
            values.push({
              label: displayName
            });
          }
        }
      });
      rows.push(values);
    });
    return rows;
  };
});