'use strict';

angular.module('sheetApp')
	.directive('autoComplete', function ($timeout, $filter) {
		return {
			templateUrl: 'views/directives/autoComplete.html',
			scope: {
				values: '=',
				model: '=',
			},
			restrict: 'E',
			link: function link(scope) {
				scope.showSuggestions = false;
				scope.fromSelect = false;

				scope.$watch('model', function (newVal) {
					if (newVal && !scope.fromSelect) {
						scope.showSuggestions = true;
						scope.suggestions = $filter('filter')(scope.values, scope.model).slice(0, 25);
					} else if (scope.fromSelect) {
						scope.fromSelect = false;
					}
				});

				scope.select = function (value, event) {
					if (!event) {
						scope.model = value;
						scope.showSuggestions = false;
						scope.fromSelect = true;
					} else if (event.keyCode === 13 || event.keyCode === 32) {
						scope.model = value;
						scope.showSuggestions = false;
						scope.fromSelect = true;
					}
				};
			}
		};
	});
