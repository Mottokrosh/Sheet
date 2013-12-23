'use strict';

angular.module('sheetApp')
	.directive('abilityModifier', function () {
		return {
			templateUrl: 'views/directives/abilityModifier.html',
			scope: {
				ability: '@',
				score: '=',
				tempScore: '=',
				show: '@',
				label: '@',
				nolabel: '@'
			},
			restrict: 'E',
			link: function link(scope, element, attrs) {
				var watchAbility,
					combined = false;

				if (attrs.show === 'score') {
					watchAbility = 'score';
					scope.temp = false;
				} else if (attrs.show === 'temp') {
					watchAbility = 'tempScore';
					scope.temp = true;
				} else {
					watchAbility = '[score,tempScore]';
					combined = true;
				}

				scope.$watch(watchAbility, function(value) {
					if (combined) {
						// temp score takes precedence if present
						value = value[1] ? value[1] : value[0];
					}
					var mod = Math.floor((parseInt(value, 10) - 10) / 2);
					if (mod >= 0) {
						mod = '+' + mod;
					}
					scope.modifier = mod || '';
				}, combined);
			}
		};
	});
