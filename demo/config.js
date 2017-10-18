//Config file
//TODO: Logic should be separated from configuration

var config_module = angular.module('demonstrator.config', []);

(function(){
   
  var config_data = {
  'GENERAL_CONFIG': {
    'END_POINT_BASE_URL': 'http://localhost:8079/blazegraph/'
  }};
	  
  angular.forEach(config_data,function(key,value) {
       config_module.constant(value, key);
     }
  );
	   
})();





