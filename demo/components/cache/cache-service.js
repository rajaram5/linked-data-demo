app.service('Cache', function($q) {
  var dummyFiles = ['http://semlab1.liacs.nl:8080/rdc-demo-dataset/RING_14_dummy-Biobank.ttl',
    'http://semlab1.liacs.nl:8080/rdc-demo-dataset/RING_14_dummy-Person.ttl',
    'http://semlab1.liacs.nl:8080/rdc-demo-dataset/hpo_subset_2016_07_19.ttl',
    'http://semlab1.liacs.nl:8080/rdc-demo-dataset/orphadata2.0_subset_2016_07_19.ttl',
//    'http://semlab1.liacs.nl:8080/rdc-demo-dataset/rdc-ontology.ttl',
//    'http://semlab1.liacs.nl:8080/rdc-demo-dataset/regions.ttl'
    ];
  
  var cachestore = undefined;
  
  return {
    init: function() {
      var deferred = $q.defer();
      var self = this;
      
      rdfstore.create(function(error, store) {
        if (error) {
          console.log('failed to initialise store', error);
          deferred.reject(error);
        } else {
          cachestore = store;
          deferred.resolve();
          
          // for testing purpose
          self.load(dummyFiles);
        }
      });
      
      return deferred.promise;
    },
    load: function(files) {
      var resources = Array.isArray(files) ? files : [files];
      var self = this;
      
      var resource = resources.shift();
      
      cachestore.load('remote', resource, function(error, num) {
        console.log('load succes', resource, error, num);
        if (resources.length > 0) {
          self.load(resources);
        } else {
          cachestore.registeredGraphs(function(graphs) {
            console.log('registed graphs', graphs);
          });
        }
      });
    },
    query: function(q) {
      var deferred = $q.defer();
      console.log(q);
      cachestore.execute(q, function(error, results) {
        console.log(error, results);
        if (error) {
          deferred.reject(error);
        } else {
          deferred.resolve(results);
        }
      });
      return deferred.promise;
    }
  };
});