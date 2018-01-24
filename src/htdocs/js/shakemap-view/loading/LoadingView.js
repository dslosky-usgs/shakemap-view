'use strict';

const View = require('hazdev-webutils/src/mvc/View');

var LoadingView = function (options) {
    var _this,
            _initialize;

    _this = View(options);

    _initialize = function (/*options*/ ) {
        _this.loadingCount = 0;
        _this.el.innerHTML = '<div class="loading">Loading...</div>';
        _this.model.on('change:loading', _this.changeLoading);
    };

    _this.changeLoading = function () {
        if (_this.model.get('loading') === true) {

            // add loading class to make loading div visible
            if (_this.loadingCount === 0) {
                _this.el.classList.add('loading-content');
            }
            _this.loadingCount += 1;

        } else {
            _this.loadingCount -= 1;

            // if nothing is loading, hide the div
            if (_this.loadingCount === 0) {
                _this.el.classList.remove('loading-content');
            }

            // reset loading count if it drops below zero
            if (_this.loadingCount < 0) {
                _this.loadingCount = 0;
            }
        }
    };



    _initialize(options);
    options = null;
    return _this;
};

module.exports = LoadingView;