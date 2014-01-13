'use strict';

angular.module('sheetApp')
	.controller('SheetCtrl', function ($scope, $rootScope, $routeParams, $timeout, ngDialog, user, Character) {
		$scope.user = user;
		$scope.saveText = 'Save';

		var saveInProgress = false;

		//
		// Loading
		//

		if ( $routeParams.characterId ) {
			$scope.character = Character.getById($routeParams.characterId);
		} else {
			$scope.character = new Character();
			$scope.character.user = user;
		}

		// Watch tokenised elements since they don't inherently dirty the form
		/*$scope.character.$watch('[feats, specialAbilities, traits, gear, spells]', function (newValue, oldValue) {
			console.log(newValue, oldValue);
		}, true);*/

		//
		// Saving
		//

		function saveOrUpdateSuccess() {
			$scope.sheet.$setPristine();
			$scope.saveText = 'Saved';
			$timeout(function () {
				$scope.saveText = 'Save';
				saveInProgress = false;
			}, 2500);
		}

		function saveOrUpdateError() {
			saveInProgress = false;
		}

		$scope.saveCharacter = function () {
			$scope.saveText = 'Saving...';

			// ensure we have a character name at least
			if (!$scope.character.name) {
				$scope.character.name = 'Unnamed Character';
			}

			// update timestamp
			$scope.character.modified = new Date();

			// save character resource
			$scope.character.saveOrUpdate(saveOrUpdateSuccess, saveOrUpdateSuccess, saveOrUpdateError, saveOrUpdateError);
		};

		var autoSave = function(newVal, oldVal) {
			//console.log('Considering autosave...', newVal, oldVal, oldVal.$resolved, $scope.sheet.$valid, saveInProgress);
			if (oldVal.$resolved && $scope.sheet.$valid && !saveInProgress) {
				saveInProgress = true;
				//console.log('Autosaving...');
				$scope.saveCharacter();
			}
		};

		$scope.$watch('character', _.debounce(autoSave, 2500), true);

		//
		// Functions
		//

		$scope.scrollTo = function (id) {
			window.scrollTo(0, document.getElementById(id).offsetTop);
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

		$scope.addAcItem = function () {
			if (!$scope.character.ac) {
				$scope.character.ac = {};
			}
			if (!angular.isArray($scope.character.ac.items)) {
				$scope.character.ac.items = [];
			}
			$scope.character.ac.items.push({});
		};

		/*$scope.remove = function (array, index) {
			$modal.open({
				templateUrl: 'views/dialog/removeItem.html'
			}).result.then(function () {
				array.splice(index, 1);
			});
		};*/

		function itemDialog(mode, item, items, templateUrl) {
			if (mode !== 'edit') {
				item = {};
				items.push(item);
			}

			$scope.dialog = {
				mode: mode,
				item: item,
				items: items
			};

			ngDialog.open({
				template: templateUrl,
				controller: 'DialogCtrl',
				scope: $scope
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

		$scope.gearDialog = function (mode, gear) {
			if (!angular.isArray($scope.character.gear)) {
				$scope.character.gear = [];
			}
			itemDialog(mode, gear, $scope.character.gear, 'views/dialog/gear.html');
		};

		$scope.spellDialog = function (spellLevel, mode, spell) {
			if (!$scope.character.spells) {
				$scope.character.spells = {};
			}
			if (!$scope.character.spells[spellLevel]) {
				$scope.character.spells[spellLevel] = {};
			}
			if (!angular.isArray($scope.character.spells[spellLevel].slotted)) {
				$scope.character.spells[spellLevel].slotted = [];
			}
			itemDialog(mode, spell, $scope.character.spells[spellLevel].slotted, 'views/dialog/spell.html');
		};

		$scope.prepLeft = function (spell) {
			if (!spell.prepared) {
				spell.prepared = 0;
			}
			if (!spell.cast) {
				spell.cast = 0;
			}
			return spell.prepared - spell.cast;
		};

		//
		// Debug
		//

		$scope.debugStuff = function () {
			console.log($scope.sheet.$valid);
		};

		$scope.showCharacterResource = function () {
			console.log($scope.character);
		};

	});
