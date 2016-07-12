app.service('TemplateQueries', function($http, $q) {
	console.log("TemplateQueries method");
	var deferred = $q.defer();
	return {
		questions : function () {
			
			$http.get('data/questions.json').then(function(response) { 
				deferred.resolve(response.data);		      	  
				console.log('List of questions', response.data);		        
			}), 
			function error(response) {
	          console.log('Fail to load template questions', response.data);
	          deferred.reject(response.data);
		      };
			return deferred.promise;
		}
	}
});