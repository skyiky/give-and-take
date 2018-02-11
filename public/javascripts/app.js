var app = angular.module('app', ['ngRoute', 'ngResource', 'ui.bootstrap', "isteven-multi-select"]);

app.run(['$rootScope', '$http', '$window', '$location',
	function($rootScope, $http, $window, $location) {
	}]);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider)	 {
	$routeProvider.when('/', {
		templateUrl: 'main.html',
		controller: 'mainController'
	})
	.otherwise({redirectTo: '/'})
}]);