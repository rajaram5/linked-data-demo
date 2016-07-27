app.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  }).when('/about', {
    templateUrl: 'about/about.html',
    controller: 'AboutCtrl'
  }).when('/stats', {
    templateUrl: 'stats/stats.html',
    controller: 'StatsCtrl'
  }).otherwise({
    redirectTo: '/'
  });
});