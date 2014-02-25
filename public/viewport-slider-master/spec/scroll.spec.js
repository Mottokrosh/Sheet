/*global viewportSlider, describe, it, expect, spyOn,
         afterEach, beforeEach, fireEvent*/

describe('Scroll TestCase', function () {
    'use strict';

    beforeEach(function () {
        this.el = document.createElement('div');
        this.el.innerHTML = '<section class="slide">1</section>' +
                            '<section class="slide">2</section>';
        document.body.appendChild(this.el);
        viewportSlider.init(this.el, '.slide');
    });

    afterEach(function () {
        var paginators = document.querySelectorAll('.viewport-slider-paginator'),
            i;
        for (i = 0; i < paginators.length; i += 1) {
            document.body.removeChild(paginators[i]);
        }
        document.body.removeChild(this.el);
        viewportSlider.currentSlide = 0;
    });

    it('should call the scroll method on mousewheel', function () {
        spyOn(viewportSlider, 'scroll');
        fireEvent(window, 'mousewheel');
        expect(viewportSlider.scroll).toHaveBeenCalled();
    });

    it('should call the scroll method on DOMMouseScroll', function () {
        spyOn(viewportSlider, 'scroll');
        fireEvent(window, 'DOMMouseScroll');
        expect(viewportSlider.scroll).toHaveBeenCalled();
    });

    it('should paginate bottom when user scrolls down', function () {
        spyOn(viewportSlider, 'paginate');
        fireEvent(window, 'mousewheel', {detail: 1});
        expect(viewportSlider.paginate).toHaveBeenCalledWith(1);
    });

    it('should paginate bottom when user scrolls up', function () {
        spyOn(viewportSlider, 'paginate');
        fireEvent(window, 'mousewheel', {wheelDelta: 120});
        expect(viewportSlider.paginate).toHaveBeenCalledWith(-1);
    });

    it('should use window.event when e is undefined', function () {
        window.event = {
            detail: -1
        };
        var res = viewportSlider.getWheelDirection();
        expect(res).toBe(1);
    });

});
