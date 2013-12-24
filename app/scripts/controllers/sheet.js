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

		function itemDialog(mode, item, items, templateUrl) {
			$modal.open({
				templateUrl: templateUrl,
				controller: 'DialogCtrl',
				resolve: {
					items: function () {
						return items;
					},
					item: function () {
						return item;
					},
					mode: function () {
						return mode;
					}
				}
			}).result.then(function (item) {
				if (mode !== 'edit') {
					items.push(item);
				}
			});
		}

		$scope.featDialog = function (mode, feat) {
			if (!angular.isArray($scope.character.feats)) {
				$scope.character.feats = [];
			}
			itemDialog(mode, feat, $scope.character.feats, 'views/dialog/feat.html');
		};

		$scope.saDialog = function (mode, sa) {
			if (!angular.isArray($scope.character.specialAbilities)) {
				$scope.character.specialAbilities = [];
			}
			itemDialog(mode, sa, $scope.character.specialAbilities, 'views/dialog/specialAbility.html');
		};

		$scope.traitDialog = function (mode, trait) {
			if (!angular.isArray($scope.character.traits)) {
				$scope.character.traits = [];
			}
			itemDialog(mode, trait, $scope.character.traits, 'views/dialog/trait.html');
		};

		$scope.showCharacterResource = function () {
			console.log($scope.character);
			$modal.open({
				templateUrl: 'views/dialog.html'
			});
		};

	});
