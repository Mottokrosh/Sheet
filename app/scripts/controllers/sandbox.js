'use strict';

angular.module('sheetApp')
	.controller('SandboxCtrl', function ($scope) {
		$scope.thing = 'Stuff';
		$scope.test = '';
		$scope.values = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
	});
