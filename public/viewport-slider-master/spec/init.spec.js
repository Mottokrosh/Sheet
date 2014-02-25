/*global viewportSlider, describe, it, expect, spyOn,
         afterEach, beforeEach, fireEvent, viewportSliderPaginator*/

describe('Initialization TestCase', function () {
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

    it('should hide the document scroll', function () {
        expect(document.body.style.overflowY).toBe('hidden');
    });

    it('should collect slide elements', function () {
        expect(viewportSlider.slides.length).toBe(2);
    });

    it('should add viewport-slider-container class to the root element', function () {
        expect(this.el.className).toContain('viewport-slider-container');
    });

    it('should call the setUpSlides method', function () {
        spyOn(viewportSlider, 'setUpSlides').andCallThrough();
        viewportSlider.init(this.el, '.slide');
        expect(viewportSlider.setUpSlides).toHaveBeenCalled();
    });

    it('should add viewport-slide class to slide elements', function () {
        var slides = document.querySelectorAll('.slide'),
            i;
        for (i = 0; i < slides.length; i += 1) {
            expect(slides[i].className).toContain('viewport-slide');
        }
    });

    it('should call the bindScroll method', function () {
        spyOn(viewportSlider, 'bindScroll').andCallThrough();
        viewportSlider.init(this.el, '.slide');
        expect(viewportSlider.bindScroll).toHaveBeenCalled();
    });

    it('should have a default set of options', function () {
        var defaultOptions = {
                animationHalt: 1500,
                paginator: true
            };
        expect(viewportSlider.options).toEqual(defaultOptions);
    });

    it('should accept custom options values', function () {
        var options = {
                animationHalt: 1000
            };
        viewportSlider.init(this.el, '.slide', options);
        expect(viewportSlider.options).toEqual(options);
    });

    it('should call the paginator init', function () {
        spyOn(viewportSliderPaginator, 'init');
        viewportSlider.init(this.el, '.slide');
        expect(viewportSliderPaginator.init).toHaveBeenCalled();
    });

    it('should not call the paginator init when paginator option is set to false', function () {
        spyOn(viewportSliderPaginator, 'init');
        viewportSlider.init(this.el, '.slide', {paginator: false});
        expect(viewportSliderPaginator.init).not.toHaveBeenCalled();
    });

    it('should not call the paginator init when slides length is 1 or less', function () {
        this.el.innerHTML = '<section class="slide">only 1 slide</section>';
        spyOn(viewportSliderPaginator, 'init');
        viewportSlider.init(this.el, '.slide', {paginator: false});
        expect(viewportSliderPaginator.init).not.toHaveBeenCalled();
    });
});
