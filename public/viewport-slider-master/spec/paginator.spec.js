/*global viewportSlider, describe, it, expect, spyOn,
         afterEach, beforeEach, fireEvent, jasmine,
         console, viewportSliderPaginator*/

describe('Paginate TestCase', function () {
    'use strict';

    beforeEach(function () {
        this.el = document.createElement('div');
        this.el.innerHTML = '<section class="slide">1</section>' +
                            '<section class="slide">2</section>';
        document.body.appendChild(this.el);
        viewportSlider.init(this.el, '.slide', {paginator: false});
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

    it('should create the paginator elements', function () {
        viewportSliderPaginator.init();
        expect(document.getElementById('viewport-slider-paginator')).toBeTruthy();
        expect(document.querySelectorAll('.viewport-slider-paginator-bullet').length).toBe(2);
    });

    it('should bind the paginate method to paginator bullets', function () {
        spyOn(viewportSlider, 'paginate');
        fireEvent(viewportSliderPaginator.bullets[0], 'click');
        expect(viewportSlider.paginate).toHaveBeenCalledWith(0);
    });

    it('should add a label to the bullet if the slide has the data-label attribute', function () {
        this.el.innerHTML = '<section class="slide" data-label="First slide">1</section>' +
                            '<section class="slide">2</section>';
        viewportSlider.init(this.el, '.slide');
        expect(viewportSliderPaginator.bullets[0].querySelector('.label').innerHTML).toBe('First slide');
        expect(viewportSliderPaginator.bullets[1].querySelector('.label')).toBeFalsy();
    });

});
