'use strict';

angular.module('sheetApp')
	.controller('SandboxCtrl', function ($scope, $http, user) {
		$scope.thing = 'Stuff';
		$scope.user = user;

	});
