(function(){"use strict";var app = angular.module('demo', ['ngRoute', 'templates']);
app.config(["$routeProvider", function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  }).when('/about', {
    templateUrl: 'about/about.html',
    controller: 'AboutCtrl'
  }).otherwise({
    redirectTo: '/'
  });
}]);
app.controller('AboutCtrl', ["$scope", function($scope) {
  
}]);
app.controller('HomeCtrl', ["$scope", "Data", "TemplateQueries", function($scope, Data, TemplateQueries) {
  $scope.selectedQuestion = null;
  $scope.questions = null;
  $scope.variables = null;
  TemplateQueries.questions().then(
		  function(result) {
			  $scope.questions = result.templateQueries;
			  $scope.variables = result.variables;
			  }		  
  ); 
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
}]);
app.service('Data', ["$http", "$q", function($http, $q) {
  // hardcoded for now
  var endpoint = 'http://dev-vm.fair-dtls.vm.surfsara.nl:8891/sparql';
  
  var q = 'PREFIX dct: <http://purl.org/dc/terms/>\n' +
  'PREFIX dummy: <http://rdf.biosemantics.org/ontologies/dummy/>\n' +
  '  PREFIX rdcMeta: <http://rdf.biosemantics.org/ontologies/rd-connect/>\n' +
  '  PREFIX iao: <http://purl.obolibrary.org/obo/>\n' +
  '  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n' +
  '\n' +
  '  SELECT (COUNT( DISTINCT ?sampleURI) as ?numberOfSamples)  ?phenotypeURI ?phenotype ?diseaseURI ?disease ?biobank ?biobankURI  {\n' +
  '        \n' +
  '   VALUES(?phenotypeInput) {(<#phenotype#>)}\n' +   
  '    {\n' +
  '      ?phenotypeURI  rdfs:subClassOf* ?phenotypeInput.\n' +
  '    } \n' +
  '    {    \n' +
  '      ?donorURI dummy:hasDisease ?diseaseURI;\n' +
  '                 rdcMeta:59e1324d_567b_42e1_bc88_203004e660da ?phenotypeURI.\n' +
  '    }   \n' +
  '    {    \n' +
  '      ?sampleURI rdcMeta:e297332a_00a9_4ed0_b661_00dbd35aff95 ?donorURI;\n' +
  '                 rdfs:seeAlso ?biobankDatasetURI.\n' +
  '    }    \n' +
  '    {    \n' +
  '      ?biobankDatasetURI dct:title ?biobank;\n' +
  '                        rdfs:seeAlso ?biobankURI.    \n' +
  '      ?diseaseURI rdfs:label ?disease.  \n' +
  '      ?phenotypeURI rdfs:label ?phenotype.\n' +
  '    }\n' +
  '  }  group by ?phenotypeURI ?phenotype ?diseaseURI ?disease ?biobank ?biobankURI';
  
  var v = 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n' +
    'PREFIX hpo: <http://purl.obolibrary.org/obo/>\n' +
    '\n' +
    'SELECT DISTINCT ?url ?value {\n' + 
    '\n' +
    '    VALUES ?url {hpo:HP_0000154 hpo:HP_0002072 hpo:HP_0000470 hpo:HP_0001250 hpo:HP_0000316\n' + 
    'hpo:HP_0000463 hpo:HP_0000152 hpo:HP_0000271 \n' +
    '                    hpo:HP_0000118\n' +
    '                }  \n' +
    '    {\n' +
    '        ?url rdfs:label ?value.\n' +
    '    }\n' +
    '}';
  
  return {
    variables: function(variable) {
      var deferred = $q.defer();
      
      $http.jsonp(endpoint, {
        params: {
          query: v,
          format: 'json',
          callback: 'JSON_CALLBACK'
        }
      }).then(function(response) {
        var variables = [];
        response.data.results.bindings.forEach(function(binding) {
          variables.push({
            uri: binding.url.value,
            label: binding.value.value
          });
        });
        deferred.resolve(variables);
      }, function(response) {
        deferred.reject(response);
      });
      
      return deferred.promise;
    },
    query: function(question, variables) {
      var deferred = $q.defer();
      
      var myquery = q;
      
      for (var key in variables) {
        var value = variables[key];
        myquery = myquery.replace('#'+key+'#', value);
      };
      
      $http.jsonp(endpoint, {
        params: {
          query: myquery,
          format: 'json',
          callback: 'JSON_CALLBACK' // as per https://docs.angularjs.org/api/ng/service/$http#jsonp
        }
      }).then(function(response) {
        console.log('succes, response', response.data);
        deferred.resolve(response.data);
      }, function(response) {
        console.log('error at query', question, 'variables', variables, 'response:', response);
        deferred.reject(response);
      });
      
      return deferred.promise;
    }
  };
}]);
angular.module('templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('about/about.html','<h1>About</h1>');
$templateCache.put('home/home.html','<!-- Page Content -->\n<div class="container">\n\t<div class="row">\n    \t<div class="col-lg-12">\n        \t<div class="page-header text-center">\n              <h1>FAIR Data Demonstrator</h1>\n            </div>\n\t\t\t<div class="panel panel-info" id="step1">\n\t\t\t\t<div class="panel-heading">\n\t\t\t    \t<h3 class="panel-title">Step 1 <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span> Select query:</h3>\n\t\t\t    </div>\n\t\t\t\t<questions></questions>\n\t\t\t</div>\n\t\t\t <div class="panel panel-info" id="step2">\n             \t<div class="panel-heading">\n                \t<h3 class="panel-title">Step 2 <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span> By which value?</h3>\n              \t</div>\n              \t<div class="panel-body"> \n              \t\t<variables ng-if="selectedQuestion"></variables>\n              \t</div>              \t\n             </div>\n\t\t\t\t\t\t\t\n\t\t\t<results ng-if="results"></results>\n\t\t</div>\n\t</div>\n</div>\n<!-- /.container -->');
$templateCache.put('components/questions/questions.html','<div class="panel-body">\n\t<select ng-attr-size="{{questions.length}}"\n     \tng-model="selectedQuestion"\n        ng-change="questionChanged()"\n        ng-options="key as option.text for (key, option) in questions"\n        class="form-control" \n        id="template">        \n        \t<!-- workaround for angular\'s empty model selection -->\n        \t<option value="" ng-if="false"></option>\n    </select>\n</div>');
$templateCache.put('components/results/results.html','<table>\n    <thead>\n        <tr>\n            <th ng-repeat="var in getHeaders(results.head.vars)">\n                {{var}}\n            </th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr ng-repeat="result in rows">\n            <td ng-repeat="value in result track by $index">\n                <a ng-if="value.uri" ng-href="{{value.uri}}">{{value.label}}</a>\n                <span ng-if="!value.uri">{{value.label}}</span>\n            </td>\n        </tr>\n    </tbody>\n</table>');
$templateCache.put('components/variables/variables.html','<div ng-repeat="variable in questions[selectedQuestion].variables">\n\t<div  class="row" id="{{variable}}">\n\t\t<div class="col-md-4"><button type="button" class="btn btn-voilet btn-lg btn-block">{{variable}}</button></div>\n\t    <div class="col-md-4"><button type="button" class="btn btn-default btn-lg btn-block"><i>type</i></button></div>  \n\t    <div class="col-md-4">\n\t        <input class="form-control" type="text" list="mylist" ng-model="variables[variable]" placeholder="Type your {{variable}} here">\n\t        <datalist id="mylist">\n\t    \t    <option ng-repeat="option in vars[variable]" ng-value="option.uri">{{option.label}}</option>\n\t    \t</datalist> \n\t    </div>\n\t</div>\n\t<p></p>\n</div>\n\n<!-- Process button section  -->\n\n<div class="panel-footer panel-info">\n\t<div class="row">\n       <div class="col-md-4"></div>\n            <div class="col-md-4">\n                <button type="button" ng-click="process()" class="btn btn-red btn-lg btn-block has-spinner" id="process" data-btn-text="Loading...">\n                \tProcess <span class="glyphicon glyphicon-forward" aria-hidden="true"></span>\n            \t</button>\n        \t</div>\n    \t<div class="col-md-4"></div>\n\t</div>                \n</div>');}]);
app.directive('questions', function() {
  return {
    restrict: 'E',
    templateUrl: 'components/questions/questions.html'
  };
});
app.service('TemplateQueries', ["$http", "$q", function($http, $q) {
	console.log("TemplateQueries method");
	var deferred = $q.defer();
	return {
		questions : function () {
			
			$http.get('data/questions.json').then(function(response) { 
				deferred.resolve(response.data);	
				console.log('Number of questions', response.data.templateQueries.length);
				console.log('Questions ', response.data.templateQueries);
				console.log('Query variables ', response.data.variables);
			}), 
			function error(response) {
	          console.log('Fail to load template questions', response.data);
	          deferred.reject(response.data);
		      };
			return deferred.promise;
		}
	}
}]);
app.directive('results', function() {
  return {
    restrict: 'E',
    templateUrl: 'components/results/results.html'
  };
});
app.directive('variables', function() {
  return {
    restrict: 'E',
    templateUrl: 'components/variables/variables.html'
  }
});})();