# ViewportSlider

ViewportSlider is a pure JavaScript implementation of Apple's product page showcase (ie. http://www.apple.com/iphone-5c/).

[![Build Status](https://travis-ci.org/daviferreira/viewport-slider.png?branch=master)](https://travis-ci.org/daviferreira/viewport-slider)

# Basic usage

First, you need to attach ViewportSlider stylesheet to your page:

```html
<link rel="stylesheet" href="css/viewport-slider.css">
```

The next step is to reference the slider script and initialize the ViewportSlider object:

```html
<script src="js/viewport-slider.js"></script>
<script>viewportSlider.init(document.getElementById('container'), '.slide');</script>
```

The above code will transform all the elements with the .slide class into full viewport slides and add a navigation behavior to them (either by using the mousewheel/trackpad and keyboard or by clicking on the navigation bullets). The initialization receives two parameters: the root element for the slides and the slides' class name.

## Touch Support

To enable swipe pagination, ViewportSlider uses the awesome [Hammer Library](http://eightmedia.github.io/hammer.js/). You need to reference it manually. The lib directory includes the latest version:

```html
<script src="js/hammer.min.js"></script>
<script src="js/viewport-slider.js"></script>
<script>viewportSlider.init(document.getElementById('container'), '.slide');</script>
```

## Development

ViewportSlider development tasks are managed by Grunt. To install all the necessary packages, just invoke:

```bash
npm install
```

These are the available grunt tasks:

* __js__: runs jslint and jasmine tests and creates minified and concatenated versions of the script;
* __css__: runs compass and csslint
* __test__: runs jasmine tests, jslint and csslint
* __watch__: watch for modifications on script/scss files

The source files are located inside the __src__ directory. ViewportSlider stylesheet was created using sass/compass, make sure you have the compass gem installed on your system.

## License

"THE BEER-WARE LICENSE" (Revision 42):

As long as you retain this notice you can do whatever you want with this stuff. If we meet some day, and you think this stuff is worth it, you can buy me a beer in return.


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/daviferreira/viewport-slider/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

