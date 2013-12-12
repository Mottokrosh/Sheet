'use strict';

angular.module('sheetApp')
	.controller('MainCtrl', function ($scope, user) {
		$scope.user = user;
		console.log('thing');
	});
