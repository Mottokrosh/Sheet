'use strict';

angular.module('sheetApp')
	.controller('SheetCtrl', function ($scope, $routeParams, user, Character) {
		$scope.user = user;

		if ( $routeParams.characterId ) {
			//$scope.character = Character.getById('52a20005e4b0d6f148055e45');
			$scope.character = Character.getById($routeParams.characterId);
		} else {
			$scope.character = new Character();
			$scope.character.user = user;
		}

		function saveOrUpdateSuccess() {}
		function saveOrUpdateError() {}

		$scope.saveCharacter = function () {
			$scope.character.saveOrUpdate(saveOrUpdateSuccess, saveOrUpdateSuccess, saveOrUpdateError, saveOrUpdateError);
		};

	});
