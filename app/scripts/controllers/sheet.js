'use strict';

angular.module('sheetApp')
	.controller('SheetCtrl', function ($scope, $rootScope, $routeParams, $timeout, $http, $location, ngDialog, user, Character) {
		$scope.user = user;
		$scope.saveText = '';

		var saveInProgress = false;

		//
		// Loading
		//

		if (!user.id) {
			$location.path('/login');
		}

		if ( $routeParams.characterId ) {
			$scope.character = Character.getById($routeParams.characterId);
		} else {
			$scope.character = new Character();
			$scope.character.user = user;
			$scope.character.spells = [];
			for(var l = 0; l <= 9; l++) {
				$scope.character.spells[l] = {};
			}
			$scope.character.$resolved = true; // for autoSave
		}

		// Watch tokenised elements since they don't inherently dirty the form
		/*$scope.character.$watch('[feats, specialAbilities, traits, gear, spells]', function (newValue, oldValue) {
			console.log(newValue, oldValue);
		}, true);*/

		$http.get('data/spell_names.json').success(function (names) {
			$scope.spellNames = names;
		});

		$http.get('data/spells.json').success(function (spells) {
			$scope.spellData = spells;
		});

		$scope.spellSchools = ['Abjuration', 'Conjuration', 'Divination', 'Enchantment', 'Evocation', 'Illusion', 'Necromancy', 'Transmutation', 'Universal'];

		//
		// Saving
		//

		function saveOrUpdateSuccess() {
			$scope.sheet.$setPristine();
			$scope.saveText = 'All Changes Saved';
			$timeout(function () {
				$scope.saveText = '';
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

		$scope.scrollTo = function (id, evt) {
			evt.preventDefault();
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

		//
		// Dialogs
		//

		function itemDialog(mode, item, items, templateUrl, spellLevel) {
			if (mode === 'add') {
				item = {};
				items.push(item);
			}

			$scope.dialog = {
				mode: mode,
				item: item,
				items: items
			};

			if (spellLevel !== undefined) {
				$scope.dialog.spellData = $scope.spellData;
				if (spellLevel !== 'sp') {
					$scope.dialog.item.level = spellLevel;
				}
			}

			if (spellLevel === 'sp') {
				$scope.dialog.spellLike = true;
			}

			ngDialog.open({
				template: templateUrl,
				controller: 'DialogCtrl',
				scope: $scope
			});
		}

		$scope.confirmRemoveDialog = function (item, items) {
			itemDialog('remove', item, items, 'views/dialog/removeItem.html');
		};

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
				$scope.character.spells = [];
			}
			if (!$scope.character.spells[spellLevel]) {
				$scope.character.spells[spellLevel] = {};
			}
			if (!angular.isArray($scope.character.spells[spellLevel].slotted)) {
				$scope.character.spells[spellLevel].slotted = [];
			}
			itemDialog(mode, spell, $scope.character.spells[spellLevel].slotted, 'views/dialog/spell.html', spellLevel);
		};

		$scope.spellLikeDialog = function (mode, spell) {
			if (!$scope.character.spellLikes) {
				$scope.character.spellLikes = [];
			}
			itemDialog(mode, spell, $scope.character.spellLikes, 'views/dialog/spell.html', 'sp');
		};

		//
		// Counters & Values
		//

		$scope.prepLeft = function (spell) {
			if (!spell.prepared) {
				spell.prepared = 0;
			}
			if (!spell.cast) {
				spell.cast = 0;
			}
			return spell.prepared - spell.cast;
		};

		$scope.modifier = function (stat) {
			var tempStatKey = 'temp' + stat.charAt(0).toUpperCase() + stat.slice(1),
				statValue,
				modifier;

			if ($scope.character && $scope.character.$resolved && $scope.character.abilities) {
				statValue = $scope.character.abilities[tempStatKey] ? $scope.character.abilities[tempStatKey] : $scope.character.abilities[stat];
				if (statValue) {
					modifier = Math.floor((parseInt(statValue, 10) - 10) / 2);

					if (modifier >= 0) {
						modifier = '+' + modifier;
					}
				}
			}

			return modifier;
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
