'use strict';

var layers = [require('shakemap-view/maps/layers/epicenter')];

var generate = function (productID) {
    var leafLayers = {};
    for (var rawLayer of layers) {
        leafLayers[rawLayer.name] = rawLayer.generateLayer(productID);
    }

    return leafLayers;
};

module.exports = generate;