/* global L */
'use strict';

var layer = {};
layer.generateLayer = function (event) {
    var ml = L.layerGroup();
    L.marker([51.5, -0.09]).addTo(ml)
            .bindPopup(event.id)
            .openPopup();

    return ml;
};

layer.name = 'Epicenter';

module.exports = layer;