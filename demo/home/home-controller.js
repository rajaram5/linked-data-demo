app.controller('HomeCtrl', function($scope, $http, Data, TemplateQueries) {
  var self = $scope;
  $scope.selectedQuestion = null;
  $scope.questions = null;
  TemplateQueries.questions().then(
		  function(result) {$scope.questions = result}
		  );    
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
    
    Data.query(1, ['var1', 'var2']).then(function(results) {
      $scope.results = results;
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
          var displayName = result[v];
          
          if (resource !== undefined) {
            values.push({
              uri: resource,
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