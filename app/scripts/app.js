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
			.when('/sheet/:characterId', {
				templateUrl: 'views/sheet.html',
				controller: 'SheetCtrl'
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
	.constant('DB_NAME', 'pathfinder_sheet')
	.run(function ($rootScope, $location, user) {
		// http://arthur.gonigberg.com/2013/06/29/angularjs-role-based-auth/
		var routesThatDontRequireAuth = ['/login', '/logout'];

		// check if current location matches route
		var routeClean = function (route) {
			return _.find(routesThatDontRequireAuth,
				function (noAuthRoute) {
					return route === noAuthRoute;
				});
		};

		$rootScope.$on('$routeChangeStart', function () {
			if (!routeClean($location.url()) && !user.id) {
				// redirect back to login
				$location.path('/login');
			}
		});
	});
