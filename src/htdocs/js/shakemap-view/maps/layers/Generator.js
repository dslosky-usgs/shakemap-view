'use strict';
const events = require('shakemap-view/maps/layers/events'),
        View = require('hazdev-webutils/src/mvc/View');

var layersIn = [require('shakemap-view/maps/layers/epicenter'),
    require('shakemap-view/maps/layers/cont_pga')];

var Generator = function (options) {
    var _this,
            _initialize;

    _this = View(options);

    _initialize = function (/*options*/) {
        _this.layerCount = 0;
        _this.layers = {};
        _this.layersIn = layersIn;
        window.addEventListener('layerFinished', _this.addLayer);
    };


    _this.generateLayers = function (event) {
        _this.layerCount = 0;
        _this.layers = {};
        if (event) {
            for (var rawLayer of _this.layersIn) {
                rawLayer.generateLayer(event);
            }
        }
    };

    _this.addLayer = function (e) {
        var layer = e.detail;
        if (layer.layer) {
            _this.layers[layer.name] = layer.layer;
        }

        _this.layerCount += 1;

        // set the model if all the layers are ready
        if (_this.layerCount === _this.layersIn.length) {
            events.layersFinishedEvent(_this.layers);
        }
    };

    _initialize(options);
    options = null;
    return _this;
};


module.exports = Generator;