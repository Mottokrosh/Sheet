'use strict';

angular.module('sheetApp')
	.controller('MainCtrl', function ($scope, user, Character) {
		$scope.user = user;

		// get user's characters
		$scope.characters = Character.query({
			q: { 'user.id': user.id },
			f: { 'name': 1, 'modified': 1, 'race': 1, 'level': 1 }
		}, function() {
			angular.forEach($scope.characters, function (character) {
				character.id = character._id;
				if (!character.level) {
					character.level = 'Unspecified class/level';
				}
				character.resourceUrl = '/api/v1/characters/' + character._id;
			});
		});

		$scope.deleteCharacter = function () {

		};
	});
