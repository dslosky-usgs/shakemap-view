'use strict';

const View = require('hazdev-webutils/src/mvc/View');

var EventView = function (options) {
    var _this,
            _initialize;

    _this = View(options);

    _initialize = function (/*options*/ ) {
        _this.el.innerHTML = '<div>EVENT LIST</div>';
    };


    _initialize(options);
    options = null;
    return _this;
};


module.exports = EventView;