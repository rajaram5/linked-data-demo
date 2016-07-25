app.service('Cache', function($http, $q) {
  var dummyFiles = [
    'http://semlab1.liacs.nl:8080/rdc-demo-dataset/hpo.owl',
    'http://semlab1.liacs.nl:8080/rdc-demo-dataset/orphadata2.0.owl',
    'http://semlab1.liacs.nl:8080/rdc-demo-dataset/rdc-ontology.nt',
    'http://semlab1.liacs.nl:8080/rdc-demo-dataset/regions.nt'
    ];
  
  return {
    // TODO actual caching
  };
});