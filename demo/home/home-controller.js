app.controller('HomeCtrl', function($scope, Data, File, $timeout, $http, Cache, FDP, HttpEndpoint, $rootScope) {
  $scope.loadingData = true;
  FDP.load('http://semlab1.liacs.nl:8080/fdp');
  
  $scope.variables = {};
  
  File.read('data/questions.json').then(function(response) {
	  $scope.questions = response.templateQueries;
	  $scope.questionsVariables = response.variables;
	  console.log('Number of questions', $scope.questions.length);

	  console.log('Number of questionsVariables', $scope.questionsVariables.length);
  }, function(response) {
	  console.log("Error reading template query file", response);  
  });
    
  
  $rootScope.$on('fdp-data-loaded', function() {
    console.log('received broadcast fdp-data-loaded');
    $scope.loadingData = false;
    
    // preload the autocomplete values
    $scope.vars = {};
    angular.forEach($scope.questions, function(question, key) {
      angular.forEach(question.variables, function(variable) {
        if ($scope.vars[variable]) {
          return;
        }
        var varFileName = $scope.questionsVariables[variable].queryFileName;
        var file = 'data/query/' + varFileName;
        var promise = Data.variables(file);
        $scope.vars[variable] = promise;
        promise.then(function(vars) {
          $scope.vars[variable] = vars;
        });
      });
    });
  });
  
  $scope.questionChanged = function() {
    console.log('selected question', $scope.selectedQuestion);
    console.log('preloaded variables:', $scope.vars);
  };  
  
  $scope.process = function() {
    var question = $scope.questions[$scope.selectedQuestion];
    
    File.read('data/query/' + question.queryFileName).then(function(query) {
      var variables = {};
      question.variables.forEach(function(variable) {
        variables['#'+variable+'#'] = $scope.variables[variable];
      });
      HttpEndpoint.query(query, variables).then(function(response) {
        $scope.results = response.results;
        $scope.rows = $scope.getValues(response.results.bindings, response.head.vars);
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