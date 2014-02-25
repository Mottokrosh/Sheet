/*global viewportSlider, describe, it, expect, spyOn,
         afterEach, beforeEach, fireEvent, Hammer*/

describe('Swipe TestCase', function () {
    'use strict';

    it('should return false when hammer is not available', function () {
        var oldHammer = window.Hammer;
        window.Hammer = undefined;
        expect(viewportSlider.bindSwipe()).toBe(false);
        window.Hammer = oldHammer;
    });

    it('should paginate to previous item when swiping down', function () {
        spyOn(viewportSlider, 'paginate');
        fireEvent(viewportSlider.root, 'swipedown');
        expect(viewportSlider.paginate).toHaveBeenCalledWith(-1);
    });

    it('should paginate to previous item when swiping up', function () {
        spyOn(viewportSlider, 'paginate');
        fireEvent(viewportSlider.root, 'swipeup');
        expect(viewportSlider.paginate).toHaveBeenCalledWith(1);
    });
});
