app.controller('HomeCtrl', function($scope, Data, TemplateQueries, $timeout, $http, Cache) {
  $scope.selectedQuestion = null;
  $scope.variables = {};
  
  TemplateQueries.questions().then(function(result) {
	  $scope.questions = result.templateQueries;
  });

  $timeout(function() {
    // preload the autocomplete values
    $scope.vars = {};
    angular.forEach($scope.questions, function(question, key) {
      angular.forEach(question.variables, function(variable) {
        if ($scope.vars[variable]) {
          return;
        }
        
        var promise = Data.variables(variable);
        $scope.vars[variable] = promise;
        promise.then(function(vars) {
          $scope.vars[variable] = vars;
        });
      });
    });
  }, 20000);
  
  $scope.questionChanged = function() {
    console.log('selected question', $scope.selectedQuestion);
    console.log('preloaded variables:', $scope.vars);
  };  
  
  $scope.process = function() {
    TemplateQueries.questions().then(function(questions) {
      console.log('questions', questions.templateQueries);
      console.log('selected question index', $scope.selectedQuestion);
      var question = questions.templateQueries[$scope.selectedQuestion];
      console.log('selected question', question);
      console.log('chosen variables', $scope.variables);
      
      $http.get('data/query/' + question.queryFileName).then(function(response) {
        var query = response.data;
        
        question.variables.forEach(function(v) {
          query = query.replace('#'+v+'#', $scope.variables[v]);
        });
        
        Cache.query(query).then(function(results) {
          console.log('cache query results', results);
        }, function(response) {
          console.log('cache query error', response);
        });
      });
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