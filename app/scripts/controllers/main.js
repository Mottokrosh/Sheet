'use strict';

angular.module('sheetApp')
	.controller('MainCtrl', function ($scope, Character) {
		$scope.user = {
			id: 1,
			fullName: 'Frank Reding'
		};

		$scope.character = Character.query({ '_id': {
			'$oid': '52a20005e4b0d6f148055e45'
		}});

		/*angular.extend($scope.character, {
			name: 'Grey Drosil',
			alignment: 'Neutral Evil',
			level: 'Summoner (Shadow Caller/Synthesist) 7'
		});*/

		$scope.$watch('character', function (a, b) {
			console.log(a, b);
		});

		//$scope.character.$save();

	});
