/*global console, viewportSliderPaginator, Hammer*/

var viewportSlider;

(function (window, document) {
    'use strict';

    function extend(b, a) {
        var prop;
        if (b === undefined) {
            return a;
        }
        for (prop in a) {
            if (a.hasOwnProperty(prop) && b.hasOwnProperty(prop) === false) {
                b[prop] = a[prop];
            }
        }
        return b;
    }

    function isTouchDevice() {
        return window.ontouchstart !== undefined // works on most browsers
            || window.onmsgesturechange !== undefined; // works on ie10
    }

    viewportSlider = {

        defaults: {
            animationHalt: 1500,
            paginator: true
        },

        init: function init(root, selector, options) {
            document.body.style.overflowY = 'hidden';
            this.options = extend(options, this.defaults);
            this.slides = document.querySelectorAll(selector);
            this.root = root;
            this.root.classList.add('viewport-slider-container');
            this.setUpSlides()
                .bindScroll()
                .bindKeyboard();
            if (this.options.paginator && this.slides.length > 1) {
                viewportSliderPaginator.init();
            }
            if (isTouchDevice()) {
                this.bindSwipe();
            }
            return this;
        },

        setUpSlides: function setUpSlides() {
            var i;
            this.lastScrolled = 0;
            this.currentSlide = 0;
            for (i = 0; i < this.slides.length; i += 1) {
                this.slides[i].classList.add('viewport-slide');
            }
            return this;
        },

        bindScroll: function bindScroll() {
            var self = this,
                onMouseWheel = function (e) {
                    self.scroll(e);
                };

            window.addEventListener('mousewheel', onMouseWheel);
            window.addEventListener('DOMMouseScroll', onMouseWheel);
            return this;
        },

        bindKeyboard: function bindKeyboard() {
            var self = this;
            document.body.addEventListener('keydown', function (e) {
                var keyCode = e.keyCode || e.which;
                switch (keyCode) {
                // home
                case 36:
                    self.paginate(0);
                    break;
                // pgup, arrup
                case 33:
                case 38:
                    self.paginate(self.currentSlide - 1);
                    break;
                // pgdown, arrdown
                case 34:
                case 40:
                    self.paginate(self.currentSlide + 1);
                    break;
                // end
                case 35:
                    self.paginate(self.slides.length - 1);
                    break;
                }
            });
            return this;
        },

        bindSwipe: function bindSwipe() {
            if (Hammer === undefined) {
                return false;
            }
            var self = this;
            return new Hammer(this.root, {
                prevent_default: true
            }).on('swipedown', function () {
                self.paginate(self.currentSlide - 1);
            }).on('swipeup', function () {
                self.paginate(self.currentSlide + 1);
            });
        },

        getWheelDirection: function getWheelDirection(e) {
            if (!e) {
                e = window.event;
            }
            return (e.detail < 0 || e.wheelDelta > 0) ? 1 : -1;
        },

        scroll: function scroll(e) {
            var delta = 0;
            e.preventDefault();
            e.stopPropagation();
            delta = this.getWheelDirection(e);
            if (delta > 0) {
                this.paginate(this.currentSlide - 1);
            } else {
                this.paginate(this.currentSlide + 1);
            }
        },

        paginate: function paginate(index, callback) {
            if (index < 0 || index > (this.slides.length - 1) || index === this.currentSlide) {
                return;
            }
            var scrollTime = new Date().getTime(),
                self = this;
            if (scrollTime - this.lastScrolled < this.options.animationHalt) {
                return false;
            }
            this.applyTransform(index * 100);
            this.lastScrolled = scrollTime;
            if (typeof callback === 'function') {
                callback();
            }
            if (this.options.paginator) {
                viewportSliderPaginator.activate(index);
            }
            setTimeout(function () {
                self.currentSlide = index;
            }, this.options.animationHalt - 1);
        },

        applyTransform: function applyTransform(pos) {
            this.root.style['-webkit-transform'] = 'translate3d(0px, -' + pos + '%, 0px)';
            this.root.style['-moz-transform'] = 'translate3d(0px, -' + pos + '%, 0px)';
            this.root.style['-ms-transform'] = 'translate3d(0px, -' + pos + '%, 0px)';
            this.root.style.transform = 'translate3d(0px, -' + pos + '%, 0px)';
        }

    };

}(window, document));
