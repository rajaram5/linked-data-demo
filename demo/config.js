//Config file
//TODO: Logic should be separated from configuration

var config_module = angular.module('demonstrator.config', []);

(function(){
   
  var config_data = {
  'GENERAL_CONFIG': {
    'END_POINT_BASE_URL': 'http://127.0.0.1:9999/blazegraph/',
    'QUESTIONS_FILE': 'data/questions.json',
    'SPARQL_QUERIES_DIR': 'data/query/'
  }};
	  
  angular.forEach(config_data,function(key,value) {
       config_module.constant(value, key);
     }
  );	   
})();