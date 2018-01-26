/* global L */
'use strict';
const Xhr = require('util/Xhr');
const events = require('shakemap-view/maps/layers/events');

var layer = {id: 'download/cont_pga.json'};
layer.name = 'PGA Contours';
layer.generateLayer = function (event) {
    layer.layer = null;
    var product = null;
    var contents = event.shakemap[0].contents;

    for (let p in contents) {
        if (p === layer.id) {
            product = contents[p];
            break;
        }
    }

    if (product) {
        Xhr.ajax({
            url: product.url,
            success: function (json) {
                layer['layer'] = L.geoJson(json);
                events.layerFinishedEvent(layer);
            },
            error: function () {
                events.layerFinishedEvent(layer);
            },
            done: function () {
            }
        });
    } else {
        events.layerFinishedEvent(layer);
    }
};



module.exports = layer;