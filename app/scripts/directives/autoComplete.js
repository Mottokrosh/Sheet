'use strict';

angular.module('sheetApp')
	.directive('autoComplete', function () {
		return {
			templateUrl: 'views/directives/autoComplete.html',
			scope: {
				values: '=',
				model: '=',
			},
			restrict: 'E',
			link: function link(scope, element, attrs) {
				console.log(scope, element, attrs);
				scope.$watch('model', function (newVal, oldVal) {
					console.log(newVal, oldVal);
				});
			}
		};
	});
