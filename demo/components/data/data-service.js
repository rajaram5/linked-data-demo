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
  '   VALUES(?phenotypeInput) {(<#phenotype#>)}\n' +   
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
  
  var v = 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n' +
    'PREFIX hpo: <http://purl.obolibrary.org/obo/>\n' +
    '\n' +
    'SELECT DISTINCT ?url ?value {\n' + 
    '\n' +
    '    VALUES ?url {hpo:HP_0000154 hpo:HP_0002072 hpo:HP_0000470 hpo:HP_0001250 hpo:HP_0000316\n' + 
    'hpo:HP_0000463 hpo:HP_0000152 hpo:HP_0000271 \n' +
    '                    hpo:HP_0000118\n' +
    '                }  \n' +
    '    {\n' +
    '        ?url rdfs:label ?value.\n' +
    '    }\n' +
    '}';
  
  return {
    variables: function(variable) {
      var deferred = $q.defer();
      
      $http.jsonp(endpoint, {
        params: {
          query: v,
          format: 'json',
          callback: 'JSON_CALLBACK'
        }
      }).then(function(response) {
        var variables = [];
        response.data.results.bindings.forEach(function(binding) {
          variables.push({
            uri: binding.url.value,
            label: binding.value.value
          });
        });
        deferred.resolve(variables);
      }, function(response) {
        deferred.reject(response);
      });
      
      return deferred.promise;
    },
    query: function(question, variables) {
      var deferred = $q.defer();
      
      var myquery = q;
      
      for (var key in variables) {
        var value = variables[key];
        myquery = myquery.replace('#'+key+'#', value);
      };
      
      $http.jsonp(endpoint, {
        params: {
          query: myquery,
          format: 'json',
          callback: 'JSON_CALLBACK' // as per https://docs.angularjs.org/api/ng/service/$http#jsonp
        }
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