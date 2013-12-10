'use strict';

angular.module('sheetApp', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ngRoute',
	'mongolabResource'
])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl'
			})
			.when('/login', {
				templateUrl: 'views/login.html',
				controller: 'LoginCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
	})
	.factory('user', function ($cookieStore) {
		return $cookieStore.get('sheetuser') || {};
	})
	.constant('API_KEY', '4fd0a186e4b00ba3dc958235')
	.constant('DB_NAME', 'pathfinder_sheet');
