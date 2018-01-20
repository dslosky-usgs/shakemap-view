const MapView = require('shakemap-view/maps/MapView'),
        View = require('hazdev-webutils/src/mvc/View'),
		Util = require('hazdev-webutils/src/util/Util'),
		Xhr = require('hazdev-webutils/src/util/Xhr');

var App = function (options) {
    var _this,
        _initialize;

    options = Util.extend({}, {}, options);
    _this = View(options);

    _initialize = function (options) {
        _this.el.classList.add('sm-view-app');

        _this.el.innerHTML =
                '<div class="loading-content">Loading...</div>' +
                '<div class="map-view" style="height:100%;width:100%;position:relative;"></div>';

        _this.mapView = MapView({
            el: _this.el.querySelector('.map-view'),
            model: _this.model
        });
        
    };

    _initialize(options);
    options = null;
    return _this;
};

module.exports = App;