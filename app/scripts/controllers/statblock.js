'use strict';

angular.module('sheetApp')
	.controller('StatBlockCtrl', function ($scope, $routeParams, $location, Character) {

		if ( $routeParams.characterId ) {
			$scope.character = Character.getById($routeParams.characterId);
		} else {
			$location.path('');
		}

	});
