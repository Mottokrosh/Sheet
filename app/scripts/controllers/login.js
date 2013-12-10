'use strict';

angular.module('sheetApp')
	.controller('LoginCtrl', function ($scope) {
		OAuth.initialize('NeqqWIumLIg8LeJjPZdSkDjXmW0');

		$scope.loginGoogle = function () {
			OAuth.popup('google', function(err, result) {
				// handle error with err
				// use result.access_token in your API request
				$scope.googleErr = err;
				$scope.googleResult = result;

				result.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json').done(function(res) {
					console.log(res);
				});

				$scope.$apply();
			});
		};
	});
