'use strict';

angular.module('sheetApp')
	.controller('MainCtrl', function ($scope, user, Character) {
		$scope.user = user;

		// get user's characters
		$scope.characters = Character.query({ user: { id: user.id } }, function() {
			angular.forEach($scope.characters, function (character) {
				character.id = character._id.$oid;
				if (!character.level) {
					character.level = 'Unspecified class/level';
				}
			});
		});
	});
