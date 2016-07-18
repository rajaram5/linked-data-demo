app.service('Cache', function($q) {
  var dummyFiles = ['http://semlab1.liacs.nl:8080/rdc-demo-dataset/RING_14_dummy-Biobank.ttl',
    'http://semlab1.liacs.nl:8080/rdc-demo-dataset/RING_14_dummy-Person.ttl'];
  
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
      
      cachestore.execute('LOAD <' + resource + '> INTO GRAPH <demo>', function(error) {
        if (error) {
          console.log('could not load file', resource, error);
        } else {
          console.log('loaded', resource);
        }
        if (resources.length > 0) {
          console.log('continuing with the rest of the resources');
          self.load(resources);
        }
      });
    }
  };
});