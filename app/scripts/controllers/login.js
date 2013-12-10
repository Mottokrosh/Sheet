'use strict';

angular.module('sheetApp')
	.controller('LoginCtrl', function ($scope, $cookieStore, user) {
		OAuth.initialize('NeqqWIumLIg8LeJjPZdSkDjXmW0');

		$scope.user = user;

		$scope.loginGoogle = function () {
			OAuth.popup('google', function(err, result) {
				$scope.googleErr = err;
				$scope.googleResult = result;

				result.get('https://www.googleapis.com/oauth2/v3/userinfo').done(function(res) {
					angular.extend(user, res);
					$scope.user = user;
					$cookieStore.put('sheetuser', user);
					$scope.$apply();
				});

				$scope.$apply();
			});
		};
	});
