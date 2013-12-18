'use strict';

angular.module('sheetApp')
	.controller('SheetCtrl', function ($scope, $routeParams, $modal, user, Character) {
		$scope.user = user;

		if ( $routeParams.characterId ) {
			//$scope.character = Character.getById('52a20005e4b0d6f148055e45');
			$scope.character = Character.getById($routeParams.characterId);
		} else {
			$scope.character = new Character();
			$scope.character.user = user;
			console.log($scope.character);
		}

		function saveOrUpdateSuccess() {
			$scope.unsavedChanges = false;
		}

		function saveOrUpdateError() {}

		$scope.saveCharacter = function () {
			// ensure we have a character name at least
			if (!$scope.character.name) {
				$scope.character.name = 'Unnamed Character';
			}

			// update timestamp
			$scope.character.modified = new Date();

			// save character resource
			$scope.character.saveOrUpdate(saveOrUpdateSuccess, saveOrUpdateSuccess, saveOrUpdateError, saveOrUpdateError);
		};

		$scope.showCharacterResource = function () {
			console.log($scope.character);
			$modal.open({
				templateUrl: 'views/dialog.html'
			});
		};

	});
