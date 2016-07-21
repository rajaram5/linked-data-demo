app.service('TemplateQueries', function($http, $q) {
  var cachedQuestions = undefined;
  
	return {
		questions : function () {
		  var deferred = $q.defer();
		  
		  if (cachedQuestions) {
		    deferred.resolve(cachedQuestions);
		  } else {
  			$http.get('data/questions.json').then(function(response) {
  			  cachedQuestions = response.data;
  			  
  				deferred.resolve(response.data);	
  				console.log('Number of questions', response.data.templateQueries.length);
  				console.log('Questions ', response.data.templateQueries);
  				console.log('Query variables ', response.data.variables);
  			}), function error(response) {
          console.log('Fail to load template questions', response.data);
          deferred.reject(response.data);
        };
		  }
			return deferred.promise;
		}
	};
});