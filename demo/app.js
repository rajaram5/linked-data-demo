var app = angular.module('demo', ['ngRoute', 'templates']);

app.run(function(Cache) {
  Cache.init().then(function() {
    console.log('cache initialised');
//    Cache.load();
  }, function(error) {
    console.log('Could not load data', error);
  });
});