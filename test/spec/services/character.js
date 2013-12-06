'use strict';

describe('Service: Character', function () {

	// load the service's module
	beforeEach(module('sheetApp'));

	// instantiate service
	var Character;
	beforeEach(inject(function (_Character_) {
		Character = _Character_;
	}));

	it('should do something', function () {
		expect(!!Character).toBe(true);
	});

});
