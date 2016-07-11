app.service('Data', function($http, $q) {
  // hardcoded for now
  var endpoint = 'http://dev-vm.fair-dtls.vm.surfsara.nl:8891/sparql';
  
  var q = 'PREFIX dct: <http://purl.org/dc/terms/>\n' +
  'PREFIX dummy: <http://rdf.biosemantics.org/ontologies/dummy/>\n' +
  '  PREFIX rdcMeta: <http://rdf.biosemantics.org/ontologies/rd-connect/>\n' +
  '  PREFIX iao: <http://purl.obolibrary.org/obo/>\n' +
  '  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n' +
  '\n' +
  '  SELECT (COUNT( DISTINCT ?sampleURI) as ?numberOfSamples)  ?phenotypeURI ?phenotype ?diseaseURI ?disease ?biobank ?biobankURI  {\n' +
  '        \n' +
  '   VALUES(?phenotypeInput) {(<http://purl.obolibrary.org/obo/HP_0000463>)}\n' +   
  '    {\n' +
  '      ?phenotypeURI  rdfs:subClassOf* ?phenotypeInput.\n' +
  '    } \n' +
  '    {    \n' +
  '      ?donorURI dummy:hasDisease ?diseaseURI;\n' +
  '                 rdcMeta:59e1324d_567b_42e1_bc88_203004e660da ?phenotypeURI.\n' +
  '    }   \n' +
  '    {    \n' +
  '      ?sampleURI rdcMeta:e297332a_00a9_4ed0_b661_00dbd35aff95 ?donorURI;\n' +
  '                 rdfs:seeAlso ?biobankDatasetURI.\n' +
  '    }    \n' +
  '    {    \n' +
  '      ?biobankDatasetURI dct:title ?biobank;\n' +
  '                        rdfs:seeAlso ?biobankURI.    \n' +
  '      ?diseaseURI rdfs:label ?disease.  \n' +
  '      ?phenotypeURI rdfs:label ?phenotype.\n' +
  '    }\n' +
  '  }  group by ?phenotypeURI ?phenotype ?diseaseURI ?disease ?biobank ?biobankURI';
  
  return {
    query: function(question, variables) {
      var deferred = $q.defer();
      
      $http.jsonp(endpoint, {
        params: {
          query: q,
          format: 'json',
          callback: 'JSON_CALLBACK' // as per https://docs.angularjs.org/api/ng/service/$http#jsonp
        },
        responseType: 'text'
      }).then(function(response) {
        console.log('succes, response', response.data);
        deferred.resolve(response.data);
      }, function(response) {
        console.log('error at query', question, 'variables', variables, 'response:', response);
        deferred.reject(response);
      });
      
      return deferred.promise;
    }
  };
});