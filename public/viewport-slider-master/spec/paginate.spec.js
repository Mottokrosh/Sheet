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

    it('should do nothing when index is less than 0', function () {
        spyOn(viewportSlider, 'applyTransform');
        viewportSlider.paginate(-1);
        expect(viewportSlider.applyTransform).not.toHaveBeenCalled();
    });

    it('should do nothing when index is greater than slides length', function () {
        spyOn(viewportSlider, 'applyTransform');
        viewportSlider.paginate(viewportSlider.slides.length);
        expect(viewportSlider.applyTransform).not.toHaveBeenCalled();
    });

    it('should do nothing when index is the same as currentSlide', function () {
        spyOn(viewportSlider, 'applyTransform');
        viewportSlider.paginate(0);
        expect(viewportSlider.applyTransform).not.toHaveBeenCalled();
    });

    it('should set the css transform on the root element', function () {
        spyOn(viewportSlider, 'applyTransform').andCallThrough();
        viewportSlider.paginate(1);
        expect(viewportSlider.applyTransform).toHaveBeenCalledWith(100);
        expect(this.el.style['-webkit-transform']).toBe('translate3d(0px, -100%, 0px)');
        expect(this.el.style['-moz-transform']).toBe('translate3d(0px, -100%, 0px)');
        expect(this.el.style['-ms-transform']).toBe('translate3d(0px, -100%, 0px)');
        expect(this.el.style.transform).toBe('translate3d(0px, -100%, 0px)');
    });

    it('should update the current slide after paginating', function () {
        jasmine.Clock.useMock();
        expect(viewportSlider.currentSlide).toBe(0);
        viewportSlider.paginate(1);
        jasmine.Clock.tick(viewportSlider.options.animationHalt);
        expect(viewportSlider.currentSlide).toBe(1);
    });

    it('should do nothing when scrollTime is less than animationHalt', function () {
        var res = viewportSlider.paginate(1);
        expect(res).toBe(undefined);
        res = viewportSlider.paginate(1);
        expect(res).toBe(false);
    });

    it('should execute the callback when it is present', function () {
        var callback = jasmine.createSpy();
        viewportSlider.paginate(1, callback);
        expect(callback).toHaveBeenCalled();
    });

    it('should activate the paginator bullet', function () {
        var links = document.querySelectorAll('.viewport-slider-paginator-bullet'),
            i;
        viewportSlider.paginate(1);
        for (i = 0; i < links.length; i += 1) {
            if (i === 1) {
                expect(links[i].className).toContain('active');
            } else {
                expect(links[i].className).not.toContain('active');
            }
        }
    });

    it('should not call paginator activate when paginator option is false', function () {
        spyOn(viewportSliderPaginator, 'activate');
        viewportSlider.init(this.el, '.slide', {paginator: false});
        viewportSlider.paginate(1);
        expect(viewportSliderPaginator.activate).not.toHaveBeenCalled();
    });

    describe('Keyboard Navigation', function () {
        it('should paginate to the first slide when the user presses the home key', function () {
            spyOn(viewportSlider, 'paginate');
            fireEvent(document.body, 'keydown', {keyCode: 36});
            expect(viewportSlider.paginate).toHaveBeenCalledWith(0);
        });

        it('should paginate up when user presses the page up key', function () {
            spyOn(viewportSlider, 'paginate');
            fireEvent(document.body, 'keydown', {keyCode: 33});
            expect(viewportSlider.paginate).toHaveBeenCalledWith(-1);
        });

        it('should paginate up when user presses the arrow up key', function () {
            spyOn(viewportSlider, 'paginate');
            fireEvent(document.body, 'keydown', {keyCode: 38});
            expect(viewportSlider.paginate).toHaveBeenCalledWith(-1);
        });

        it('should paginate down when user presses the page down key', function () {
            spyOn(viewportSlider, 'paginate');
            fireEvent(document.body, 'keydown', {keyCode: 34});
            expect(viewportSlider.paginate).toHaveBeenCalledWith(1);
        });

        it('should paginate down when user presses the arrow down key', function () {
            spyOn(viewportSlider, 'paginate');
            fireEvent(document.body, 'keydown', {keyCode: 40});
            expect(viewportSlider.paginate).toHaveBeenCalledWith(1);
        });

        it('should paginate to the last slide when user presses the end key', function () {
            spyOn(viewportSlider, 'paginate');
            this.el.innerHTML = '<section class="slide">1</section>' +
                                '<section class="slide">2</section>' +
                                '<section class="slide">3</section>' +
                                '<section class="slide">4</section>' +
                                '<section class="slide">5</section>' +
                                '<section class="slide">6</section>';
            viewportSlider.init(this.el, '.slide');

            fireEvent(document.body, 'keydown', {which: 35});
            expect(viewportSlider.paginate).toHaveBeenCalledWith(5);
        });

    });
});
