'use strict';

describe('Directive: abilityModifier', function () {

	// load the directive's module
	beforeEach(module('sheetApp'));

	var scope;

	beforeEach(inject(function ($rootScope) {
		scope = $rootScope.$new();
	}));

	/*it('should make hidden element visible', inject(function ($compile) {
		element = angular.element('<ability-modifier></ability-modifier>');
		element = $compile(element)(scope);
		expect(element.text()).toBe('this is the abilityModifier directive');
	}));*/
});
