var app = angular.module('demo', ['ngRoute', 'templates']);

app.run(function(Cache) {
  Cache.init().then(function() {
    console.log('cache initialised');
  }, function(error) {
    console.log('Could not load data', error);
  });
});