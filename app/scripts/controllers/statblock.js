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
	});
