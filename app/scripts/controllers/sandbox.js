'use strict';

angular.module('sheetApp')
	.controller('SandboxCtrl', function ($scope, $http) {
		$scope.thing = 'Stuff';
		$scope.test = '';
		//$scope.values = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
		$http.get('data/spell_names.json').success(function (names) {
			$scope.values = names;
		});
	});
