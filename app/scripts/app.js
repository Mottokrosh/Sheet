'use strict';

angular.module('sheetApp', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ngRoute',
	'ngTouch',
	'ngAnimate',
	'ngDialog',
	'chieffancypants.loadingBar',
	'angularFileUpload'
])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl'
			})
			.when('/sheet/:characterId?', {
				templateUrl: 'views/sheet.html',
				controller: 'SheetCtrl'
			})
			.when('/statblock/:characterId', {
				templateUrl: 'views/statblock.html',
				controller: 'StatBlockCtrl'
			})
			.when('/login', {
				templateUrl: 'views/login.html',
				controller: 'LoginCtrl'
			})
			.when('/sandbox', {
				templateUrl: 'views/sandbox.html',
				controller: 'SandboxCtrl'
			})
			.when('/upload', {
				templateUrl: 'views/upload.html',
				controller: 'UploadCtrl',
			})
			.otherwise({
				redirectTo: '/'
			});
	})
	.config(function ($httpProvider) {
		var inci = function ($q, $location) {
			return {
				'responseError': function (rejection) {
					// treat all errors as 401 for now
					$location.path('/login');
					return $q.reject(rejection);
				}
			};
		};

		inci.$inject = ['$q', '$location'];

		$httpProvider.interceptors.push(inci);
	})
	.factory('user', function ($cookieStore) {
		return $cookieStore.get('sheetuser') || {};
	})
	.factory('googleIdentityClient', function () {
		const cid =
			'218170156589-45aa1e3r7dq3dnvf7hslg54vafktqct2.apps.googleusercontent.com';
		window.google.accounts.id.initialize({
			client_id: cid,
			callback: function (data) {
				const info = JSON.parse(
					window.atob(data.credential.split(".")[1])
				);
				console.log(info);
				if (!info) {
					return;
				}
				console.log(info);
				const validIssuers = [
					'accounts.google.com',
					'https://accounts.google.com',
				];
				const hasExpired = Date.now() > info.exp * 1000;
				const invalidClient = info.aud !== cid;
				const invalidIssuer = !validIssuers.includes(info.iss);
				if (hasExpired || invalidClient || invalidIssuer) {
					return;
				}
				const user = {
					provider: 'google',
					id: info.sub,
					displayName: info.name,
					name: {
						givenName: info.given_name,
						familyName: info.family_name, // No family_name key observed, but possibly not always present
					},
					emails: [{ value: info.email }],
					email: info.email,
					avatar: info.picture,
					token: data.credential,
				};
				document.cookie =
					'sheetuser=' +
					JSON.stringify(user) +
					';max-age=2592000;path=/';
				location.href =
					location.hostname === 'localhost'
						? '/pathfinder_dev'
						: '/pathfinder';
			},
		});
		return {
			renderLoginButton: function (parent, config) {
				window.google.accounts.id.renderButton(parent, config);
			},
		};
	})
	.value('cache', {})
	.filter('range', function() {
		return function (input, total) {
			total = parseInt(total);
			for (var i = 0; i < total; i++) {
				input.push(i);
			}
			return input;
		};
	})
	.filter('ordinal', function () {
		return function (number) {
			var suffix = 'th';
			if (number === 1) {
				suffix = 'st';
			} else if (number === 2) {
				suffix = 'nd';
			}
			return number + suffix;
		};
	})
	.filter('expandGender', function () {
		return function (abbr) {
			var map = {
				'F': 'Female',
				'M': 'Male'
			};
			return map[abbr];
		};
	})
	.filter('expandSize', function () {
		return function (abbr) {
			var map = {
				'T': 'Tiny',
				'S': 'Small',
				'M': 'Medium',
				'L': 'Large',
				'H': 'Huge'
			};
			return map[abbr];
		};
	})
	.filter('orDash', function () {
		return function (value) {
			return value || '&mdash;';
		};
	})
	.filter('skillName', function () {
		return function (name) {
			return name.replace(/(\d)$/, '').replace(/([a-z])([A-Z])/g, '$1 $2');
		};
	})
	.run(function ($rootScope, $location, user, cache) {
		// http://arthur.gonigberg.com/2013/06/29/angularjs-role-based-auth/
		var routesThatDontRequireAuth = ['/login', '/logout', '/statblock', '/sandbox'];

		// check if current location matches route
		var routeClean = function (route) {
			return _.find(routesThatDontRequireAuth,
				function (noAuthRoute) {
					return route.match(noAuthRoute);
				});
		};

		$rootScope.$on('$routeChangeStart', function () {
			if (!routeClean($location.url()) && !user.id) {
				cache.redirect = $location.url();
				// redirect to login
				$location.path('/login');
			}
		});

		$rootScope.$on('$routeChangeSuccess', function(ev, data) {
			if (data.$$route && data.$$route.controller) {
				$rootScope.controllerName = data.$$route.controller;
			}
		});
	});
