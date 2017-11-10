app.controller('CacheCtrl', function($scope, $rootScope, $http, $cookies, File, FDP, HttpEndpoint,
		Caching, Log) {    
	$scope.isCachingStarted = false;
	$scope.fairDataPoints = [];
	$scope.fdp = {'url':"", 'name':"", "state":true};
	$scope.searchEngineUrl = null;
	$scope.oneAtATime = true;

  // populate the fdps list
	$scope.updateFdpList = function() {
	  FDP.getFdps().then(function (fdps) {
	    console.log("List of fdps", fdps);
      $scope.fairDataPoints = fdps;	
      // Update cookies to indicate which fdp's should be used in the queries
      var fdpsToUse = [];
      fdps.forEach(function(fdp) {
        if(fdp.state){
          fdpsToUse.push(fdp.url);
        }        
      });
      $cookies.putObject("fdpsToUse", fdpsToUse);
      console.log("fdpsToUse == ", $cookies.getObject("fdpsToUse"));
	  });
  };
  
  console.log('calling init updateFdpList function');
  $scope.updateFdpList();
  console.log('init function finished');
  
	$scope.setFdpState = function(fdp) { 
		$cookies.putObject(btoa(fdp.url), fdp);   
	};

	$scope.cache = function() {
		Log.reset();
		Log.setLogElementId('log-panel');
		$scope.isCachingStarted = true;
		Log.appendToLog("Caching started");
		$scope.log = Log.get();
		FDP.load([$scope.fdp]); 
		$rootScope.$on('fdp-data-loaded', function() {            
			$scope.loadingData = false;
			Caching.setCachingState(true);
			Log.appendToLog("Caching is done");
	    $scope.updateFdpList();
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