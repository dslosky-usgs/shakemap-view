/* global L */
'use strict';

var layer = {};
layer.generateLayer = function (productID) {
    var ml = L.layerGroup();
    L.marker([51.5, -0.09]).addTo(ml)
            .bindPopup(productID)
            .openPopup();

    return ml;
};

layer.name = 'MMI Contours';

module.exports = layer;