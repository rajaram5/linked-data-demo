app.controller('CacheCtrl', function($scope, $rootScope, $http, $cookies, File, FDP, HttpEndpoint,
		Caching, Log) {    
	$scope.isCachingStarted = false;
	$scope.fairDataPoints = [];
	$scope.searchEngineUrl = null;
	$scope.oneAtATime = true;

  // populate the list with data from the db
  var populateCacheList = function() {
    File.read('data/query/listCachedFdps.sparql').then(function(query) {
      HttpEndpoint.query(query).then(function(response) {
        response.data.results.bindings.forEach(function(binding) {
        	var fdpFromCookies = $cookies.getObject(btoa(binding.fdp.value));
        	var state = true;
        	if (fdpFromCookies != null) {
        		state = fdpFromCookies.state;
        	}
          $scope.fairDataPoints.push({
            url: binding.fdp.value,
            name: binding.name.value,
            state: state 
          });
        });
        return $scope.fairDataPoints;
      }).then(function(fdps) {
        // if no data was cached, add a default FDP
        if (fdps.length == 0) {
          $scope.fairDataPoints = [{
            name: "RD connect FDP",
            url:"http://localhost:8084/fairdatapoint/fdp",
            state:true
          }];
        }
      });
    });
  };

  console.log('calling init function');
  populateCacheList();
  console.log('init function finished');

	$scope.addFdp = function () {
		$scope.fairDataPoints.push({ 
			url: "", name:""
		});
	};

	$scope.setFdpState = function(fdp) { 
		$cookies.putObject(btoa(fdp.url), fdp);   
	};

	$scope.cache = function() {
		Log.reset();
		Log.setLogElementId('log-panel');
		$scope.isCachingStarted = true;
		Log.appendToLog("Caching started");
		$scope.log = Log.get();
		FDP.load($scope.fairDataPoints); 
		$rootScope.$on('fdp-data-loaded', function() {            
			$scope.loadingData = false;
			Caching.setCachingState(true);
			Log.appendToLog("Caching is done");
		});
	};

	$scope.cacheSearch = function(url) {
		Log.reset();
		Log.setLogElementId('log-panel');
		$scope.isCachingStarted = true;
		Log.appendToLog("Caching started");
		$scope.log = Log.get();
		$http.get(url)
		.then(function(response) {
			var fdps = response.data;
			console.log(fdps);
			FDP.load(fdps);
		});
		$rootScope.$on('fdp-data-loaded', function() {            
			$scope.loadingData = false;
			Caching.setCachingState(true);
			Log.appendToLog("Caching is done");
		});
	};
});