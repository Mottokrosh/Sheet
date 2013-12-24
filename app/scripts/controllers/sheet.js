'use strict';

angular.module('sheetApp')
	.controller('SheetCtrl', function ($scope, $routeParams, $modal, user, Character) {
		$scope.user = user;

		if ( $routeParams.characterId ) {
			$scope.character = Character.getById($routeParams.characterId);
		} else {
			$scope.character = new Character();
			$scope.character.user = user;
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

		$scope.addMelee = function () {
			if (!angular.isArray($scope.character.melee)) {
				$scope.character.melee = [];
			}
			$scope.character.melee.push({});
		};

		$scope.addRanged = function () {
			if (!angular.isArray($scope.character.ranged)) {
				$scope.character.ranged = [];
			}
			$scope.character.ranged.push({});
		};

		$scope.remove = function (array, index) {
			$modal.open({
				templateUrl: 'views/dialog/confirmation.html'
			}).result.then(function () {
				array.splice(index, 1);
			});
		};

		$scope.featDialog = function (mode, feat) {
			$modal.open({
				templateUrl: 'views/dialog/feat.html',
				controller: 'DialogCtrl',
				resolve: {
					items: function () {
						return $scope.character.feats;
					},
					item: function () {
						return feat;
					},
					mode: function () {
						return mode;
					}
				}
			}).result.then(function (feat) {
				if (mode !== 'edit') {
					if (!angular.isArray($scope.character.feats)) {
						$scope.character.feats = [];
					}
					$scope.character.feats.push(feat);
				}
			});
		};

		$scope.showCharacterResource = function () {
			console.log($scope.character);
			$modal.open({
				templateUrl: 'views/dialog.html'
			});
		};

	});
