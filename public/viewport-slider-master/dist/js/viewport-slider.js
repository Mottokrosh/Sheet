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

var viewportSliderPaginator;

(function (window, document) {
    'use strict';

    viewportSliderPaginator = {

        init: function init() {
            this.createPaginator();
        },

        createPaginator: function createPaginator() {
            this.root = document.createElement('div');
            this.root.id = 'viewport-slider-paginator';
            this.root.className = 'viewport-slider-paginator';
            this.root.innerHTML = '<ul>' +
                                  this.renderBullets() +
                                  '</ul>';
            document.body.appendChild(this.root);
            this.root.style.marginTop = -(this.root.offsetHeight / 2) + 'px';
            this.bindPagination();
        },

        renderBullets: function renderBullets() {
            var i,
                html = '',
                label;
            for (i = 0; i < viewportSlider.slides.length; i += 1) {
                label = viewportSlider.slides[i].getAttribute('data-label');
                html += '<li><a href="#" data-index="' + i + '" class="' +
                        (i === 0 ? 'active ' : '') +
                        'viewport-slider-paginator-bullet">' +
                        (label ? '<span class="label">' + label + '</span>' : '') +
                        '<span class="bullet"></span></a></li>';
            }
            return html;
        },

        bindPagination: function bindPagination() {
            var i,
                paginateFn = function (e) {
                    e.preventDefault();
                    viewportSlider.paginate(parseInt(this.getAttribute('data-index'), 10));
                };
            this.bullets = this.root.querySelectorAll('a');
            for (i = 0; i < this.bullets.length; i += 1) {
                this.bullets[i].addEventListener('click', paginateFn);
            }
        },

        activate: function activate(index) {
            var i;
            for (i = 0; i < this.bullets.length; i += 1) {
                if (i === index) {
                    this.bullets[i].classList.add('active');
                } else {
                    this.bullets[i].classList.remove('active');
                }
            }
        }

    };

}(window, document));
