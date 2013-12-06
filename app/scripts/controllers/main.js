'use strict';

angular.module('sheetApp')
	.controller('MainCtrl', function ($scope, Character) {
		$scope.user = {
			id: 1,
			fullName: 'Frank Reding'
		};

		$scope.character = Character.getById('52a20005e4b0d6f148055e45');

	});
