'use strict';

angular.module('sheetApp')
	.controller('StatBlockCtrl', function ($scope, $routeParams, $location, Character) {

		if ( $routeParams.characterId ) {
			$scope.character = Character.getById($routeParams.characterId);
		} else {
			$location.path('');
		}

		$scope.filterSkills = function (items) {
			var result = {};
			angular.forEach(items, function(value, key) {
				if (value.total) {
					result[key] = value;
				}
			});
			return result;
		};

		$scope.filterMoney = function (items) {
			var result = {};
			angular.forEach(items, function(value, key) {
				if (value && key !== 'gems' && key !== 'other') {
					result[key] = value;
				}
			});
			return result;
		};

		$scope.extractSenses = function (items) {
			var result = [];
			angular.forEach(items, function(sa) {
				if (sa.name.match(/darkvision/i) || sa.name.match(/low-?light vision/i) || sa.name.match(/true seeing/i)) {
					result.push(sa);
				}
			});
			return result;
		};

		// Comments

		$scope.saveComment = function () {
			if (!$scope.character.comments) {
				$scope.character.comments = [];
			}
			$scope.comment.modified = new Date();
			$scope.character.comments.push($scope.comment);

			// unset current comment (except author)
			$scope.comment = { author: $scope.comment.author };

			// now save character
			$scope.character.modified = new Date();
			$scope.character.saveOrUpdate();
		};

		$scope.deleteComment = function (c) {
			if (c.deleteButtonText === 'Delete') {
				c.deleteButtonText = 'Confirm?';
			} else {
				var index = $scope.character.comments.indexOf(c);
				if (index > -1) {
					$scope.character.comments.splice(index, 1);

					// save character
					$scope.character.modified = new Date();
					$scope.character.saveOrUpdate();
				}
			}
		};
	});
