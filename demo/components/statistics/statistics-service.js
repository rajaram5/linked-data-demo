app.service('Statistics', function() {
  var numberOfFairDataPoints = 0;
  var numberOfCatalogs = 0;
  var numberOfDatasets = 0;
  var numberOfDistributions = 0;
  var numberOfDistributionTurtleFiles = 0;
  
  
  return { 
    setFairDataPointsCount: function(x) {numberOfFairDataPoints = x},
    setCatalogsCount: function(x) {numberOfCatalogs = x},
    setDataSetsCount: function(x) {numberOfDatasets = x},
    setDistributionsCount: function(x) {numberOfDistributions = x},
    setTurtleFilesCount: function(x) {numberOfDistributionTurtleFiles = x},
    get:function() {
      var stats = {"FairDataPoints":numberOfFairDataPoints, "Catalogs":numberOfCatalogs,
          "Datasets":numberOfDatasets, "Distributions":numberOfDistributions, 
          "TurtleFilesDistributions":numberOfDistributionTurtleFiles};
      return stats;
    }
    
  };
});