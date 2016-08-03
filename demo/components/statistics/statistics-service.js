app.service('Statistics', function($cookies) {
  var numberOfFairDataPoints = 0;
  var numberOfCatalogs = 0;
  var numberOfDatasets = 0;
  var numberOfDistributions = 0;
  var numberOfDistributionTurtleFiles = 0;
  
  return { 
    setFairDataPointsCount: function(x) {
      $cookies.put('numberOfFairDataPoints', x);
    },
    setCatalogsCount: function(x) {
      $cookies.put('numberOfCatalogs', x);
    },
    setDataSetsCount: function(x) {
      $cookies.put('numberOfDatasets', x);
    },
    setDistributionsCount: function(x) {
      $cookies.put('numberOfDistributions', x);
    },
    setTurtleFilesCount: function(x) {
      $cookies.put('numberOfDistributionTurtleFiles', x);
    },
    get:function() {
      var stats = {
        "FairDataPoints": $cookies.get('numberOfFairDataPoints') || 0,
        "Catalogs": $cookies.get('numberOfCatalogs') || 0,
        "Datasets": $cookies.get('numberOfDatasets') || 0,
        "Distributions": $cookies.get('numberOfDistributions') || 0, 
        "TurtleFilesDistributions": $cookies.get('numberOfDistributionTurtleFiles') || 0
      };
      return stats;
    }
  };
});