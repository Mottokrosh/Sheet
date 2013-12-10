'use strict';

angular.module('sheetApp')
	.controller('MainCtrl', function ($scope, user, Character) {
		$scope.user = user;

		$scope.character = Character.getById('52a20005e4b0d6f148055e45');

	});
