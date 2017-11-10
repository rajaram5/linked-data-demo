app.controller('HomeCtrl', function($scope, $cookies, Data, File, $timeout, $http, $q, Caching, FDP,
		HttpEndpoint, $rootScope, GENERAL_CONFIG) {
	$scope.isCachingAvailable = Caching.getCachingState();  
	$scope.variables = {};
	$scope.isResultAvailable = false;

	File.read(GENERAL_CONFIG.QUESTIONS_FILE).then(function(response) {
		$scope.questions = response.templateQueries;
		$scope.questionsVariables = response.variables;
		console.log('Number of questions', $scope.questions.length);
		console.log('Number of questionsVariables', $scope.questionsVariables.length);
	}, function(response) {
		console.log("Error reading template query file", response);  
	});
	/*return promise from then
	 * This function load data option's value for the questions form. In the current implementation
	 * ,we get the data option values from ontologies or RDF blob files, this function make
	 * use of the questions.json file to get the location information(URL) about these files. 
	 * This function does two things operations, it stores the files in the triple store and also
	 * checks if given list of file exits in the triple store.
	 */
	$scope.cacheDataOptions = function(){
		console.log("Loading data options");
		var promises = [];
		File.read(GENERAL_CONFIG.QUESTIONS_FILE).then(function(response) {
			var questionsVariables = response.variables;
			angular.forEach( $scope.questionsVariables, function(variable) {
				var deffered  = $q.defer();  
				if(variable.fileUrl != undefined) {
					File.read(GENERAL_CONFIG.SPARQL_QUERIES_DIR + 'checkGraph.sparql').then(
							function(query) { 
								var variables = {};
								variables ["#url#"] = variable.fileUrl;
								HttpEndpoint.query(query, variables).then(function(response) {
									console.log(response);  
									if (response.data.results.bindings.length == 0) {
										console.log("Loading content of ", variable.fileUrl); 
										deffered.resolve(HttpEndpoint.load(variable.fileUrl,
												variable.fileUrl));
									} else {
										console.log("Content of ", variable.fileUrl,
												" is available");
									}           	
								}, function(res) {
									console.log('Something went wrong loading ontology');
									deffered.reject();
								}
								);            
							});          
				} 
				promises.push(deffered.promise);
			});
			console.log('Number of questionsVariables', questionsVariables.length);
		}, function(response) {
			console.log("Error reading template query file", response);  
		});
		return $q.all(promises);
	};

	$scope.getVariableValues = function(){
		if($scope.isCachingAvailable) {
			// preload the autocomplete values
			$scope.vars = {};
			angular.forEach($scope.questions, function(question, key) {
				angular.forEach(question.variables, function(variable) {
					if ($scope.vars[variable]) {
						return;
					}
					// Variable JSON config is not defined it is a free text input
					if($scope.questionsVariables[variable] != undefined) {
						var varFileName = $scope.questionsVariables[variable].queryFileName;
						var file = GENERAL_CONFIG.SPARQL_QUERIES_DIR + varFileName;
						var promise = Data.variables(file);
						$scope.vars[variable] = promise;
						promise.then(function(vars) {
							$scope.vars[variable] = vars;
						});            
					}
				});
			});
		}

	};


	$scope.questionChanged = function() {
		console.log('selected question', $scope.selectedQuestion);
		$scope.getVariableValues();
		console.log('preloaded variables:', $scope.vars);
		$scope.isResultAvailable = false;
		$scope.isEmptyRows = false;
	};  

	$scope.process = function() {
		$scope.isResultAvailable = false;
		var question = $scope.questions[$scope.selectedQuestion];

		File.read('data/query/' + question.queryFileName).then(function(query) {
			var variables = {};
			question.variables.forEach(function(variable) {
				variables['#'+variable+'#'] = $scope.variables[variable];
			});
			// Add variables['#' + FDP_Variable + '#'] here. Make use of getfdpList function
			var fdpUris = "";
			$cookies.getObject("fdpsToUse").forEach(function(fdp){			  
			  fdpUris = fdpUris.concat(" <", fdp, ">");			  
			});
			variables['#fdp#'] = fdpUris;
			HttpEndpoint.query(query, variables).then(function(response) {
				console.log(response);        
				$scope.results = response.data;        
				$scope.isResultAvailable = true;
				$scope.rows = $scope.getValues(response.data.results.bindings,
						response.data.head.vars);
			}).then(function() {
				// Manually added timeout. (This is a work around) 
				$timeout(function(){
					console.log('trying to enable pagination');
					jQuery('#footest').simplePagination({
						perPage: 10,
						previousButtonText: 'Prev',
						nextButtonText: 'Next',
						previousButtonClass: "btn btn-primary btn-xs",        
						nextButtonClass: "btn btn-primary btn-xs"
					});
				}, 100);
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