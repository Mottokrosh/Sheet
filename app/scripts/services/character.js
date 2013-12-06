'use strict';

angular.module('sheetApp')
	.factory('Character', function ($mongolabResource) {
		return $mongolabResource('characters');
	});
