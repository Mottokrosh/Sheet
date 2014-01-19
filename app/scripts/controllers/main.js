'use strict';

angular.module('sheetApp')
	.controller('MainCtrl', function ($scope, user, Character, DB_NAME, API_KEY) {
		$scope.user = user;

		// get user's characters
		$scope.characters = Character.query({
			q: { 'user.id': user.id },
			f: { 'name': 1, 'modified': 1, 'race': 1, 'level': 1 }
		}, function() {
			angular.forEach($scope.characters, function (character) {
				character.id = character._id.$oid;
				if (!character.level) {
					character.level = 'Unspecified class/level';
				}
				character.resourceUrl = 'https://api.mongolab.com/api/1/databases/' + DB_NAME + '/collections/characters/' + character.id + '?apiKey=' + API_KEY;
			});
		});

		$scope.deleteCharacter = function () {

		};
	});
