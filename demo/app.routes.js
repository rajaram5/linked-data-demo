app.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  }).when('/about', {
    templateUrl: 'about/about.html',
    controller: 'AboutCtrl'
  }).otherwise({
    redirectTo: '/'
  });
});