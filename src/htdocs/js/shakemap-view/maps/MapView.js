/* global L */
'use strict';

const View = require('hazdev-webutils/src/mvc/View');
var  Generator = require('shakemap-view/maps/layers/Generator');


var MapView = function (options) {
    var _this,
            _initialize;

    _this = View(options);

    _initialize = function (/*options*/ ) {
        _this.el.innerHTML = '<div class="map" style="height:100%;width:100%"></div>';
        _this.defaultLayers = _this.model.get('defaultLayers');
        let mapEl = _this.el.querySelector('.map');

        _this.map = L.map(mapEl, {
            scrollWheelZoom: false
        }).setView([51.505, -0.09], 13);

        _this.baseLayer = _this.genBaseLayer();
        _this.layersControl = L.control.layers({'Basemap': _this.baseLayer}).addTo(_this.map);

        _this.model.on('change:event', _this.renderEventLayers);
        _this.model.on('change:layers', _this.addMapLayers);
        window.addEventListener('layersFinished', _this.addMapLayers);
    };

    _this.genBaseLayer = function () {
        var baselayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + 'pk.eyJ1IjoiZHNsb3NreSIsImEiOiJjaXR1aHJnY3EwMDFoMnRxZWVtcm9laWJmIn0.1C3GE0kHPGOpbVV9kTxBlQ', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery � <a href="http://mapbox.com">Mapbox</a>',
            id: 'mapbox.streets'
        }).addTo(_this.map);

        return baselayer;
    };

    _this.renderEventLayers = function (options) {
        // clear map
        _this.clearMapLayers();
        
        // generate new layers
        _this.baseLayer = _this.genBaseLayer();
        var event = _this.model.get('event');
        var g = Generator(options);
        g.generateLayers(event);

        _this.layersControl = L.control.layers({'Basemap': _this.baseLayer}).addTo(_this.map);
    };

    _this.addMapLayers = function (e) {
        // clear map
        _this.clearMapLayers();

        // collect layers
        _this.baseLayer = _this.genBaseLayer();
        var layers = e.detail;

        _this.layersControl = L.control.layers({'Basemap': _this.baseLayer}, layers).addTo(_this.map);

        var layerArr = [];
        for (var layer in layers) {
            if (_this.defaultLayers.indexOf(layer) > -1) {
                layers[layer].addTo(_this.map);
            }
            layerArr.push(layers[layer]);
        }

        var group = L.featureGroup(layerArr);
        _this.map.fitBounds(group.getBounds().pad(0.5));

    };

    _this.clearMapLayers = function () {
        _this.map.eachLayer(function (layer) {
            _this.map.removeLayer(layer);
        });

        _this.layersControl.removeFrom(_this.map);
    };

    _initialize(options);
    options = null;
    return _this;
};


module.exports = MapView;