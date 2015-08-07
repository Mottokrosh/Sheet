angular.module('sheetApp')
	.controller('MainCtrl', function ($scope, user, Character) {
		'use strict';
		$scope.user = user;

		$scope.filterActive = function (c) {
			return c.status !== 'archived' && c.status !== 'deleted';
		};

		// get user's characters
		$scope.characters = Character.query({
			q: { 'user.id': user.id, 'status': { '@$ne': 'deleted' } },
			f: { 'user': 1, 'name': 1, 'modified': 1, 'race': 1, 'level': 1, 'status': 1 }
		}, function() {
			angular.forEach($scope.characters, function (character) {
				character.id = character._id;
				if (!character.level) {
					character.level = 'Unspecified class/level';
				}
				character.resourceUrl = '/api/v1/characters/' + character._id;
			});
		});

		$scope.archiveCharacter = function (c) {
			c.status = 'archived';
			c.saveOrUpdate();
		};

		$scope.restoreCharacter = function (c) {
			c.status = 'active';
			c.saveOrUpdate();
		};

		$scope.deleteCharacter = function (c, evt) {
			var $el = evt.target;

			if($el.innerHTML === 'Delete') {
				$el.innerHTML = 'Confirm?';
			} else {
				c.status = 'deleted';
				c.saveOrUpdate();
			}
		};
	});
