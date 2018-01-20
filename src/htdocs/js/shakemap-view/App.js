const MapView = require('shakemap-view/maps/MapView'),
        View = require('hazdev-webutils/src/mvc/View'),
		Util = require('hazdev-webutils/src/util/Util'),
		Xhr = require('hazdev-webutils/src/util/Xhr');

var App = function (options) {
    var _this,
        _initialize;

    options = Util.extend({}, {
        headerUrl: 'HeaderInputData.json'
    }, options);
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

    _this.destroy = Util.compose(_this.destroy, function () {
        _this.headerInputView.off();
    });

    _this.loadData = function () {
        _this.el.classList.add('loading');

        Xhr.ajax({
            url: _this.headerUrl,
            success: function (json) {
                _this.model.set({
                    header: json.header
                });
            },
            error: function () {
                _this.model.set({
                    header: 'Error loading header'
                });
            },
            done: function () {
                _this.el.classList.remove('loading');
            }
        });
    };

    _this.onHeaderInputViewOtherButtonClick = function (e) {
        console.log('other button clicked');
        console.log(e);
    };

    _initialize(options);
    options = null;
    return _this;
};

module.exports = App;