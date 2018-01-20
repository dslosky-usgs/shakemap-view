/* global L */
'use strict';

const Model = require('hazdev-webutils/src/mvc/Model'),
	View = require('hazdev-webutils/src/mvc/View'),
	Util = require('hazdev-webutils/src/util/Util'),
	Xhr = require('hazdev-webutils/src/util/Xhr');


var MapView = function (options) {
    var _this,
        _initialize;

    _this = View(options);

    _initialize = function (/*options*/ ) {
        _this.el.innerHTML = '<div class="map" style="height:200px;width:200px"></div>'
        
        let mapEl = _this.el.querySelector('.map');

        _this.map = L.map(mapEl).setView([51.505, -0.09], 13);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + 'pk.eyJ1IjoiZHNsb3NreSIsImEiOiJjaXR1aHJnY3EwMDFoMnRxZWVtcm9laWJmIn0.1C3GE0kHPGOpbVV9kTxBlQ', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery � <a href="http://mapbox.com">Mapbox</a>',
            id: 'mapbox.streets'
        }).addTo(_this.map);

        L.marker([51.5, -0.09]).addTo(_this.map)
            .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
            .openPopup();
    };


    _initialize(options);
    options = null;
    return _this;
};


module.exports = MapView;